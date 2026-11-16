"""Shape, initialisation and loss checks for the two models."""

import unittest

import torch

from epiduo.model import DirectPrior, EpiDuo, GRNPrior, energy_distance


def toy_grn(n_nodes: int = 12, dim: int = 16) -> GRNPrior:
    torch.manual_seed(0)
    relation = torch.tensor([0, 0, 1, 2, 3])
    source = torch.tensor([0, 0, 1, 2, 4])
    target = torch.tensor([3, 5, 6, 7, 8])
    return GRNPrior(torch.rand(n_nodes, 4), torch.ones(n_nodes, 4), relation, source, target,
                    [False, False, True, True], dim)


class ModelTest(unittest.TestCase):
    def test_energy_distance_is_zero_only_for_matching_sets(self):
        torch.manual_seed(0)
        a = torch.randn(3, 32, 20)
        self.assertLess(abs(energy_distance(a, a).item()), 1e-3)
        self.assertGreater(energy_distance(a, a + 1.0).item(), 0.5)
        # invariant to the order of cells inside a set
        self.assertAlmostEqual(energy_distance(a, a[:, torch.randperm(32)] + 0.3).item(),
                               energy_distance(a, a + 0.3).item(), places=4)

    def test_prior_models_start_as_the_backbone(self):
        prior = toy_grn()
        pert_node = torch.tensor([-1, 0, 1, 2])
        gene_node = torch.arange(3, 11)
        support = torch.zeros(6, 4, 8)
        support[0, 1, 0] = 1
        torch.manual_seed(1)
        plain = EpiDuo(8, 4, hidden=32, layers=1, heads=4)
        torch.manual_seed(1)
        with_prior = EpiDuo(8, 4, prior=prior, prior_dim=16, pert_node=pert_node, gene_node=gene_node,
                            support=support, hidden=32, layers=1, heads=4)
        with_prior.load_state_dict(plain.state_dict(), strict=False)
        control = torch.rand(2, 5, 8)
        pert = torch.tensor([1, 3])
        plain.eval()
        with_prior.eval()
        self.assertTrue(torch.allclose(plain(control, pert), with_prior(control, pert), atol=1e-5))

    def test_gradients_reach_the_prior(self):
        prior = toy_grn()
        model = EpiDuo(8, 4, prior=prior, prior_dim=16, pert_node=torch.tensor([-1, 0, 1, 2]),
                       gene_node=torch.arange(3, 11), support=torch.ones(6, 4, 8), hidden=32, layers=1, heads=4)
        optimizer = torch.optim.SGD(model.parameters(), lr=0.1)
        control, target = torch.rand(2, 6, 8), torch.rand(2, 6, 8) + 0.5
        for _ in range(2):  # the first step moves the zero-initialised gates
            loss = energy_distance(model(control, torch.tensor([1, 2])), target)
            optimizer.zero_grad()
            loss.backward()
            optimizer.step()
        self.assertGreater(prior.embed.weight.grad.abs().sum().item(), 0)
        self.assertEqual(prior.adjacency.shape, (6, 12, 12))
        self.assertAlmostEqual(prior.adjacency[0, 3].sum().item(), 1.0, places=6)

    def test_direct_prior_handles_genes_without_elements(self):
        torch.manual_seed(0)
        tokens = torch.rand(5, 4, 9)
        mask = torch.tensor([[1, 1, 0, 0], [1, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]], dtype=torch.bool)
        prior = DirectPrior(tokens, mask, 16)
        out = prior()
        self.assertEqual(out.shape, (5, 16))
        self.assertTrue(torch.isfinite(out).all())
        self.assertTrue(torch.allclose(out[2], out[4]))  # both fall back to the shared `absent` vector
        # padded slots must not influence the encoding
        changed = tokens.clone()
        changed[0, 2:] = 7.0
        other = DirectPrior(changed, mask, 16)
        other.load_state_dict(prior.state_dict())
        self.assertTrue(torch.allclose(out[0], other()[0], atol=1e-5))
        weights = prior.attention()
        self.assertAlmostEqual(weights[0, :2].sum().item(), 1.0, places=5)


if __name__ == "__main__":
    unittest.main()
