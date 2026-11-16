"""Epi-GRN and Epi-Direct.

Both models share one set-to-set backbone that follows the STATE transition
model: a set of control cells and a perturbation go in, a set of perturbed
cells comes out, and training matches the predicted and observed sets with
the energy distance.  They differ only in how public epigenomic evidence
reaches the backbone:

* :class:`GRNPrior`    – evidence is first turned into a typed candidate
  gene network; relational message passing produces one vector per gene.
* :class:`DirectPrior` – each gene's accessible cis-elements are encoded
  directly as a small set of tokens and pooled; no gene-gene structure.

The gene vectors are used twice: at the perturbed gene (what was hit) and
at every output gene (where the effect may land).  All prior paths are
zero-initialised, so each model starts as the prior-free backbone.
"""

from __future__ import annotations

import math

import torch
from torch import Tensor, nn
from torch.nn import functional as F


def mlp(sizes: list[int], dropout: float = 0.0) -> nn.Sequential:
    layers: list[nn.Module] = []
    for i, (a, b) in enumerate(zip(sizes[:-1], sizes[1:], strict=True)):
        layers.append(nn.Linear(a, b))
        if i < len(sizes) - 2:
            layers += [nn.GELU(), nn.Dropout(dropout)]
    return nn.Sequential(*layers)


class GRNPrior(nn.Module):
    """Relational message passing over the epigenome-derived candidate network."""

    def __init__(
        self, node_features: Tensor, node_masks: Tensor, relation: Tensor, source: Tensor, target: Tensor,
        symmetric: list[bool], dim: int, layers: int = 2,
    ) -> None:
        super().__init__()
        n = node_features.shape[0]
        adjacency = []
        for r, is_symmetric in enumerate(symmetric):
            dense = torch.zeros(n, n)
            keep = relation == r
            dense[target[keep], source[keep]] = 1.0  # row = receiver, column = sender
            if is_symmetric:
                adjacency.append(torch.maximum(dense, dense.T))
            else:
                adjacency += [dense, dense.T.clone()]  # regulator -> target and target -> regulator
        stacked = torch.stack(adjacency)
        stacked = stacked / stacked.sum(dim=2, keepdim=True).clamp_min(1.0)  # mean over senders
        self.register_buffer("adjacency", stacked, persistent=False)
        self.register_buffer("features", torch.cat((node_features, node_masks), dim=1), persistent=False)
        self.embed = nn.Embedding(n, dim)
        self.feature = nn.Linear(self.features.shape[1], dim)
        self.messages = nn.ModuleList(
            nn.ModuleList(nn.Linear(dim, dim, bias=False) for _ in range(len(adjacency))) for _ in range(layers)
        )
        self.norms = nn.ModuleList(nn.LayerNorm(dim) for _ in range(layers))
        nn.init.normal_(self.embed.weight, std=0.02)

    def forward(self) -> Tensor:
        h = self.embed.weight + self.feature(self.features)
        for messages, norm in zip(self.messages, self.norms, strict=True):
            incoming = sum(a @ w(h) for a, w in zip(self.adjacency, messages, strict=True))
            h = norm(h + F.gelu(incoming))
        return h


class DirectPrior(nn.Module):
    """Encode each gene's cis-element tokens directly; genes never exchange information."""

    def __init__(self, tokens: Tensor, mask: Tensor, dim: int, heads: int = 4) -> None:
        super().__init__()
        empty = ~mask.any(dim=1)
        mask = mask.clone()
        mask[empty, 0] = True  # keep attention defined; these genes get the `absent` vector instead
        self.register_buffer("tokens", tokens, persistent=False)
        self.register_buffer("padding", ~mask, persistent=False)
        self.register_buffer("empty", empty, persistent=False)
        self.token = mlp([tokens.shape[2], dim, dim])
        self.mix = nn.TransformerEncoderLayer(dim, heads, 2 * dim, dropout=0.0, activation="gelu",
                                              batch_first=True, norm_first=True)
        self.query = nn.Parameter(torch.randn(1, 1, dim) * 0.02)
        self.pool = nn.MultiheadAttention(dim, heads, batch_first=True)
        self.absent = nn.Parameter(torch.zeros(dim))
        self.norm = nn.LayerNorm(dim)

    def forward(self) -> Tensor:
        h = self.mix(self.token(self.tokens), src_key_padding_mask=self.padding)
        query = self.query.expand(h.shape[0], -1, -1)
        pooled = self.pool(query, h, h, key_padding_mask=self.padding, need_weights=False)[0][:, 0]
        pooled = torch.where(self.empty[:, None], self.absent.to(pooled.dtype), pooled)
        return self.norm(pooled)

    def attention(self) -> Tensor:
        """Pooling weights over each gene's elements, for inspection."""
        h = self.mix(self.token(self.tokens), src_key_padding_mask=self.padding)
        query = self.query.expand(h.shape[0], -1, -1)
        return self.pool(query, h, h, key_padding_mask=self.padding, need_weights=True)[1][:, 0]


class EpiDuo(nn.Module):
    """Set-to-set perturbation model with an optional epigenomic prior."""

    def __init__(
        self, n_genes: int, n_perts: int, *, prior: nn.Module | None = None, prior_dim: int = 128,
        pert_node: Tensor | None = None, gene_node: Tensor | None = None, support: Tensor | None = None,
        hidden: int = 512, layers: int = 4, heads: int = 8, dropout: float = 0.0,
    ) -> None:
        super().__init__()
        self.n_genes, self.hidden, self.prior_dim = n_genes, hidden, prior_dim
        self.basal = mlp([n_genes, hidden, hidden, hidden], dropout)
        self.pert = nn.Embedding(n_perts, hidden)
        layer = nn.TransformerEncoderLayer(hidden, heads, 4 * hidden, dropout=dropout, activation="gelu",
                                           batch_first=True, norm_first=True)
        self.backbone = nn.TransformerEncoder(layer, layers, enable_nested_tensor=False)
        self.norm = nn.LayerNorm(hidden)
        self.out = mlp([hidden, hidden, n_genes], dropout)
        self.prior = prior
        if prior is not None:
            if pert_node is None or gene_node is None:
                raise ValueError("A prior needs the node index of every perturbation and output gene")
            self.register_buffer("pert_node", pert_node, persistent=False)
            self.register_buffer("gene_node", gene_node, persistent=False)
            self.pert_prior = mlp([prior_dim, hidden, hidden])
            self.gene_query = nn.Linear(hidden, prior_dim)
            self.gene_key = nn.Linear(prior_dim, prior_dim)
            for module in (self.pert_prior[-1], self.gene_query):
                nn.init.zeros_(module.weight)
                nn.init.zeros_(module.bias)
        self.use_support = prior is not None and support is not None
        if self.use_support:
            # support[c, p, g] = 1 if relation channel c links perturbed gene p to output gene g
            self.register_buffer("support", support, persistent=False)
            self.edge_query = nn.Linear(hidden, prior_dim)
            self.edge_key = nn.Linear(prior_dim, prior_dim)
            self.edge_weight = nn.Parameter(torch.ones(support.shape[0]))
            nn.init.zeros_(self.edge_query.weight)
            nn.init.zeros_(self.edge_query.bias)

    def forward(self, control: Tensor, pert: Tensor) -> Tensor:
        """control: [batch, set, genes] log-expression; pert: [batch] perturbation index."""
        tokens = self.basal(control) + self.pert(pert)[:, None, :]
        nodes = None
        if self.prior is not None:
            nodes = self.prior()
            node = self.pert_node[pert]
            hit = self.pert_prior(nodes[node.clamp_min(0)]) * (node >= 0)[:, None]
            tokens = tokens + hit[:, None, :]
        h = self.norm(self.backbone(tokens))
        delta = self.out(h)
        if nodes is not None:
            genes = nodes[self.gene_node]
            scale = math.sqrt(self.prior_dim)
            delta = delta + self.gene_query(h) @ self.gene_key(genes).T / scale
            if self.use_support:
                edges = torch.einsum("c,cbg->bg", self.edge_weight, self.support[:, pert])
                delta = delta + (self.edge_query(h) @ self.edge_key(genes).T / scale) * edges[:, None, :]
        return control + delta


def energy_distance(predicted: Tensor, observed: Tensor) -> Tensor:
    """Mean energy distance between predicted and observed cell sets ([batch, set, genes])."""

    def mean_distance(a: Tensor, b: Tensor) -> Tensor:
        squared = (a.pow(2).sum(-1)[:, :, None] + b.pow(2).sum(-1)[:, None, :] - 2 * a @ b.transpose(1, 2))
        return squared.clamp_min(1e-8).sqrt().mean(dim=(1, 2))

    predicted, observed = predicted.float(), observed.float()
    return (2 * mean_distance(predicted, observed) - mean_distance(predicted, predicted)
            - mean_distance(observed, observed)).mean()
