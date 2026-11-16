"""Train Epi-GRN, Epi-Direct or the prior-free backbone on one held-out-context split.

The sampling mirrors cell-load as used by ``state tx train``: every batch
holds ``batch_size`` sets of ``cell_set_len`` cells; a set contains cells
of one perturbation in one context and is paired with random control cells
of the same context; control cells are also used as targets (identity).
"""

from __future__ import annotations

import json
import time
from pathlib import Path

import numpy as np
import torch

from .data import Benchmark, load_prior
from .model import EpiDuo, energy_distance
from .prep import CONTEXTS


class SetSampler:
    """Draw (control set, perturbed set, perturbation) batches entirely on the device."""

    def __init__(self, bench: Benchmark, groups, set_len: int, device, seed: int) -> None:
        self.set_len, self.device = set_len, device
        self.generator = torch.Generator(device=device).manual_seed(seed)
        self.cells = [torch.from_numpy(rows).to(device) for _, _, rows in groups]
        self.context = torch.tensor([c for c, _, _ in groups], device=device)
        self.pert = torch.tensor([p for _, p, _ in groups], device=device)
        sizes = torch.tensor([len(rows) for _, _, rows in groups], dtype=torch.float, device=device)
        self.weights = torch.ceil(sizes / set_len)  # one draw per full set, as an epoch over cells would give
        self.controls = [torch.from_numpy(rows).to(device) for rows in bench.controls()]

    def pick(self, pool: torch.Tensor) -> torch.Tensor:
        if len(pool) >= self.set_len:
            return pool[torch.randperm(len(pool), generator=self.generator, device=self.device)[: self.set_len]]
        return pool[torch.randint(len(pool), (self.set_len,), generator=self.generator, device=self.device)]

    def batch(self, x: torch.Tensor, batch_size: int, groups: torch.Tensor | None = None):
        if groups is None:
            groups = torch.multinomial(self.weights, batch_size, replacement=True, generator=self.generator)
        target = torch.stack([self.pick(self.cells[g]) for g in groups.tolist()])
        control = torch.stack([self.pick(self.controls[c]) for c in self.context[groups].tolist()])
        return x[control], x[target], self.pert[groups]


def build_model(args: dict, bench: Benchmark) -> EpiDuo:
    prior = pert_node = gene_node = support = None
    if args["model"] != "none":
        prior, pert_node, gene_node, support = load_prior(
            args["model"], Path(args["prior"]), bench, args["prior_dim"], args["shuffled_prior"]
        )
    return EpiDuo(
        len(bench.genes), len(bench.perts), prior=prior, prior_dim=args["prior_dim"], pert_node=pert_node,
        gene_node=gene_node, support=support, hidden=args["hidden_dim"], layers=args["layers"], heads=args["heads"],
    )


@torch.no_grad()
def validation_loss(model, sampler: SetSampler, x, batch_size: int) -> float:
    """Energy distance on held-out validation perturbations, with a fixed sampling seed."""
    model.eval()
    sampler.generator.manual_seed(1234)
    order = torch.arange(len(sampler.cells), device=sampler.device)
    losses = []
    for start in range(0, len(order), batch_size):
        control, target, pert = sampler.batch(x, batch_size, order[start: start + batch_size])
        losses.append(energy_distance(model(control, pert), target).item() * len(pert))
    model.train()
    return float(np.sum(losses) / len(order))


def train(args) -> None:
    config = {k: (str(v) if isinstance(v, Path) else v) for k, v in vars(args).items() if k != "command"}
    output = Path(args.output)
    if output.exists():
        raise FileExistsError(output)
    if config["model"] != "none" and not config["prior"]:
        raise ValueError("--prior is required for the grn and direct models")
    torch.manual_seed(args.seed)
    np.random.seed(args.seed)
    device = torch.device(args.device)
    bench = Benchmark(args.benchmark, args.split)
    x = torch.from_numpy(bench.x).to(device)
    held = CONTEXTS.index(args.split)
    train_sampler = SetSampler(bench, bench.groups(bench.train_mask), args.cell_set_len, device, args.seed)
    val_mask = np.isin(bench.pert, bench.val) & (bench.context == held)
    val_sampler = SetSampler(bench, bench.groups(val_mask), args.cell_set_len, device, 1234)
    model = build_model(config, bench).to(device)
    n_params = sum(p.numel() for p in model.parameters())
    optimizer = torch.optim.AdamW(model.parameters(), lr=args.lr, weight_decay=args.weight_decay)

    output.mkdir(parents=True, mode=0o700)
    config.update(parameters=n_params, perts=len(bench.perts), genes=len(bench.genes),
                  train_groups=len(train_sampler.cells), val_groups=len(val_sampler.cells))
    (output / "config.json").write_text(json.dumps(config, indent=1), encoding="utf-8")
    print(json.dumps(config), flush=True)
    history, best, started, running = [], float("inf"), time.time(), 0.0
    model.train()
    for step in range(1, args.max_steps + 1):
        control, target, pert = train_sampler.batch(x, args.batch_size)
        loss = energy_distance(model(control, pert), target)
        optimizer.zero_grad(set_to_none=True)
        loss.backward()
        torch.nn.utils.clip_grad_norm_(model.parameters(), 10.0)
        optimizer.step()
        running += loss.item()
        if step % args.val_freq == 0 or step == args.max_steps:
            n = args.val_freq if step % args.val_freq == 0 else args.max_steps % args.val_freq
            val = validation_loss(model, val_sampler, x, args.batch_size)
            history.append({"step": step, "train_loss": running / n, "val_loss": val,
                            "minutes": (time.time() - started) / 60})
            running = 0.0
            print(json.dumps(history[-1]), flush=True)
            if val < best:
                best = val
                torch.save(model.state_dict(), output / "best.pt")
            (output / "history.json").write_text(json.dumps(history, indent=1), encoding="utf-8")
    torch.save(model.state_dict(), output / "final.pt")
    print("TRAIN_DONE", flush=True)
