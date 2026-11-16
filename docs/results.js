window.EPIDUO = {
 "benchmark": {
  "cells": {
   "k562": 291337,
   "rpe1": 206543
  },
  "controls": {
   "k562": 10691,
   "rpe1": 11485
  },
  "hvg": 2000,
  "eligible": 1875,
  "splits": {
   "k562": {
    "test": 913,
    "val": 100,
    "fewshot_train": 862,
    "paper_test_total": 969
   },
   "rpe1": {
    "test": 899,
    "val": 100,
    "fewshot_train": 876,
    "paper_test_total": 1061
   }
  }
 },
 "prior": {
  "nodes": 3592,
  "factors": 25,
  "factor_symbols": [
   "CBX1",
   "DNMT1",
   "E2F6",
   "EHMT2",
   "EWSR1",
   "HNRNPH1",
   "HNRNPL",
   "KDM1A",
   "MCM3",
   "MIER1",
   "NCOA4",
   "NFRKB",
   "PCBP1",
   "PCBP2",
   "SETDB1",
   "SFPQ",
   "SIN3A",
   "SMARCB1",
   "SP1",
   "SRSF7",
   "TARDBP",
   "THAP1",
   "THRAP3",
   "UBTF",
   "USF2"
  ],
  "atac": 172732,
  "loops": 30315,
  "edges": {
   "tf_promoter": 25557,
   "tf_distal": 2901,
   "promoter_contact": 212,
   "shared_element": 235
  },
  "shuffled_kept": {
   "tf_promoter": 16435,
   "tf_distal": 828,
   "promoter_contact": 1,
   "shared_element": 2
  },
  "tokens_with_any": 3565
 },
 "example": {
  "gene": "GABPA",
  "features": [
   "accessibility",
   "signed_distance",
   "abs_distance",
   "is_promoter",
   "is_loop_linked",
   "methylation",
   "methylation_observed",
   "chip_CBX1",
   "chip_DNMT1",
   "chip_E2F6",
   "chip_EHMT2",
   "chip_EWSR1",
   "chip_HNRNPH1",
   "chip_HNRNPL",
   "chip_KDM1A",
   "chip_MCM3",
   "chip_MIER1",
   "chip_NCOA4",
   "chip_NFRKB",
   "chip_PCBP1",
   "chip_PCBP2",
   "chip_SETDB1",
   "chip_SFPQ",
   "chip_SIN3A",
   "chip_SMARCB1",
   "chip_SP1",
   "chip_SRSF7",
   "chip_TARDBP",
   "chip_THAP1",
   "chip_THRAP3",
   "chip_UBTF",
   "chip_USF2"
  ],
  "tokens": [
   [
    0.5934000015258789,
    0.31279999017715454,
    0.31279999017715454,
    1.0,
    0.0,
    0.006399999838322401,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0
   ],
   [
    0.5166000127792358,
    0.31279999017715454,
    0.31279999017715454,
    1.0,
    0.0,
    0.006399999838322401,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0
   ],
   [
    0.5054000020027161,
    0.31279999017715454,
    0.31279999017715454,
    1.0,
    0.0,
    0.006399999838322401,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0
   ],
   [
    0.40209999680519104,
    0.31279999017715454,
    0.31279999017715454,
    1.0,
    0.0,
    0.006399999838322401,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0
   ],
   [
    0.3271999955177307,
    0.31279999017715454,
    0.31279999017715454,
    1.0,
    0.0,
    0.006399999838322401,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0
   ],
   [
    0.32170000672340393,
    0.31279999017715454,
    0.31279999017715454,
    1.0,
    0.0,
    0.006399999838322401,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    1.0,
    1.0,
    0.0
   ],
   [
    0.3009999990463257,
    0.48669999837875366,
    0.48669999837875366,
    1.0,
    0.0,
    0.00430000014603138,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0
   ],
   [
    0.4447000026702881,
    1.0019999742507935,
    1.0019999742507935,
    0.0,
    1.0,
    0.005499999970197678,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0
   ],
   [
    0.6559000015258789,
    1.0019999742507935,
    1.0019999742507935,
    0.0,
    1.0,
    0.005499999970197678,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0
   ],
   [
    0.35019999742507935,
    1.0019999742507935,
    1.0019999742507935,
    0.0,
    1.0,
    0.005499999970197678,
    1.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    1.0,
    0.0,
    0.0,
    1.0,
    1.0
   ],
   [
    0.5638999938964844,
    -0.6504999995231628,
    0.6504999995231628,
    0.0,
    0.0,
    0.7333999872207642,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ],
   [
    0.42750000953674316,
    -0.6504999995231628,
    0.6504999995231628,
    0.0,
    0.0,
    0.7333999872207642,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ],
   [
    0.4771000146865845,
    -0.676800012588501,
    0.676800012588501,
    0.0,
    0.0,
    0.30550000071525574,
    1.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0.0
   ]
  ],
  "trained_attention": [
   0.07716235518455505,
   0.07719872146844864,
   0.0772041529417038,
   0.07725638151168823,
   0.07729652523994446,
   0.07729953527450562,
   0.07635680586099625,
   0.07626070082187653,
   0.07620950043201447,
   0.07628532499074936,
   0.07713595777750015,
   0.07717688381671906,
   0.0771571546792984
  ],
  "node_features": {
   "promoter_accessibility": 0.5934000015258789,
   "promoter_methylation": 0.006399999838322401,
   "linked_elements": 0.5,
   "loop_partners": 0.0
  },
  "subgraph": {
   "nodes": [
    "GABPA",
    "CBX1",
    "E2F6",
    "NFRKB",
    "PCBP1",
    "HES4",
    "ISG15",
    "MIB2",
    "ENO1",
    "PLOD1",
    "DHRS3",
    "CLSTN1",
    "PLEKHM2"
   ],
   "is_factor": [
    false,
    true,
    true,
    true,
    true,
    false,
    false,
    false,
    false,
    false,
    false,
    false,
    false
   ],
   "edges": [
    {
     "relation": "tf_promoter",
     "source": 1,
     "target": 5
    },
    {
     "relation": "tf_promoter",
     "source": 1,
     "target": 6
    },
    {
     "relation": "tf_promoter",
     "source": 1,
     "target": 8
    },
    {
     "relation": "tf_promoter",
     "source": 1,
     "target": 2
    },
    {
     "relation": "tf_promoter",
     "source": 1,
     "target": 3
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 5
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 6
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 7
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 8
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 11
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 9
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 10
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 12
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 1
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 0
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 3
    },
    {
     "relation": "tf_promoter",
     "source": 2,
     "target": 4
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 5
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 6
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 7
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 8
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 9
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 10
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 0
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 2
    },
    {
     "relation": "tf_promoter",
     "source": 3,
     "target": 4
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 5
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 6
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 7
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 8
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 11
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 9
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 10
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 12
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 1
    },
    {
     "relation": "tf_promoter",
     "source": 4,
     "target": 0
    },
    {
     "relation": "tf_distal",
     "source": 1,
     "target": 0
    },
    {
     "relation": "shared_element",
     "source": 5,
     "target": 6
    }
   ]
  },
  "note": "Derived from public ENCODE K562 tracks (ATAC ENCSR868FGK, WGBS ENCSR765JPC, Hi-C ENCSR545YBD, TF ChIP-seq) and GENCODE v44; distances are log-scaled as in the model input."
 },
 "results": {
  "k562": {
   "caption": "留出 K562 · seed 42 · 相对 STATE 的配对比较",
   "arms": [
    "state",
    "backbone",
    "epi_grn",
    "epi_grn_shuffled",
    "epi_direct",
    "epi_direct_shuffled",
    "perturb_mean",
    "context_mean"
   ],
   "labels": {
    "state": "STATE",
    "backbone": "骨架（无先验）",
    "epi_grn": "Epi-GRN",
    "epi_grn_shuffled": "Epi-GRN 打乱",
    "epi_direct": "Epi-Direct",
    "epi_direct_shuffled": "Epi-Direct 打乱",
    "perturb_mean": "perturb_mean",
    "context_mean": "context_mean"
   },
   "rows": [
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "pearson_delta",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.0644414934939833,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.24515690856498557,
       "gain": 0.18071541507100228,
       "rel_gain": 2.804333128745303,
       "rel_lo": 2.6033544781676343,
       "rel_hi": 3.0025490560022714,
       "p": 1.053848555800511e-104,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.25641719274943786,
       "gain": 0.19197569925545455,
       "rel_gain": 2.9790696777283525,
       "rel_lo": 2.7806968102981617,
       "rel_hi": 3.187391395315876,
       "p": 1.729216271533501e-111,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.2627905151833039,
       "gain": 0.19834902168932056,
       "rel_gain": 3.077970589055944,
       "rel_lo": 2.8690403716109687,
       "rel_hi": 3.276220720602479,
       "p": 5.797920263328054e-112,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.24738453742323763,
       "gain": 0.18294304392925434,
       "rel_gain": 2.8389013663430247,
       "rel_lo": 2.643988197664265,
       "rel_hi": 3.0316168502644016,
       "p": 1.1460899131225518e-106,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.24730366519856958,
       "gain": 0.1828621717045863,
       "rel_gain": 2.837646395046067,
       "rel_lo": 2.6418364374853662,
       "rel_hi": 3.037976944938247,
       "p": 3.7251181290439895e-107,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.22386937207642582,
       "gain": 0.1594278785824425,
       "rel_gain": 2.4739941602583713,
       "rel_lo": 2.278989345621913,
       "rel_hi": 2.6537328571224554,
       "p": 9.253889794667292e-96,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.2710403780736486,
       "gain": 0.20659888457966533,
       "rel_gain": 3.2059915650302986,
       "rel_lo": 3.0075684454470557,
       "rel_hi": 3.402172555297857,
       "p": 3.275120281476981e-114,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mse",
     "higher": false,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.039068656195228486,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.004979969155508005,
       "gain": 0.03408868703972048,
       "rel_gain": 0.8725328782586534,
       "rel_lo": 0.8677494402031236,
       "rel_hi": 0.8769923485845237,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.004914220927185241,
       "gain": 0.034154435268043244,
       "rel_gain": 0.8742157676827026,
       "rel_lo": 0.8695229379126463,
       "rel_hi": 0.8788567205455282,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.004937311911879991,
       "gain": 0.0341313442833485,
       "rel_gain": 0.8736247316209717,
       "rel_lo": 0.869277597579697,
       "rel_hi": 0.8782696820233579,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.0049079850805425545,
       "gain": 0.03416067111468593,
       "rel_gain": 0.8743753802020461,
       "rel_lo": 0.8698089943810238,
       "rel_hi": 0.8789558702308355,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.004877715704282736,
       "gain": 0.03419094049094575,
       "rel_gain": 0.8751501541310126,
       "rel_lo": 0.8705456240213976,
       "rel_hi": 0.8800855607985222,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.01618262218680694,
       "gain": 0.02288603400842155,
       "rel_gain": 0.5857901509091745,
       "rel_lo": 0.5682529307035984,
       "rel_hi": 0.6032877701855544,
       "p": 5.399421582335853e-147,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.0042665631163239,
       "gain": 0.03480209307890459,
       "rel_gain": 0.8907931950614422,
       "rel_lo": 0.8851616568005105,
       "rel_hi": 0.8962172194502275,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mae",
     "higher": false,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.14477898639107586,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.048571809218443625,
       "gain": 0.09620717717263223,
       "rel_gain": 0.6645106418465878,
       "rel_lo": 0.6595612744982144,
       "rel_hi": 0.6696543284427264,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.04848933234394641,
       "gain": 0.09628965404712946,
       "rel_gain": 0.6650803161933501,
       "rel_lo": 0.660322868253385,
       "rel_hi": 0.6698361986701371,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.04862327265949983,
       "gain": 0.09615571373157603,
       "rel_gain": 0.6641551797568258,
       "rel_lo": 0.6595850989740919,
       "rel_hi": 0.6689984660710265,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.04835744601187805,
       "gain": 0.09642154037919781,
       "rel_gain": 0.6659912656022104,
       "rel_lo": 0.6612693583650112,
       "rel_hi": 0.6705496323242548,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.04810427900032433,
       "gain": 0.09667470739075153,
       "rel_gain": 0.6677399103321152,
       "rel_lo": 0.6627409752043212,
       "rel_hi": 0.6725070976179491,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.07997339847829164,
       "gain": 0.06480558791278422,
       "rel_gain": 0.44761736166415667,
       "rel_lo": 0.43640406943693,
       "rel_hi": 0.4582690576738552,
       "p": 7.016577045712123e-151,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.04094084173436853,
       "gain": 0.10383814465670733,
       "rel_gain": 0.7172183425585019,
       "rel_lo": 0.7119858988071109,
       "rel_hi": 0.7228158805452789,
       "p": 5.134104900550497e-151,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mse_delta",
     "higher": false,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.005053105106146808,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.0049454265292341185,
       "gain": 0.00010767857691269013,
       "rel_gain": 0.021309387921043917,
       "rel_lo": -0.0151236046152054,
       "rel_hi": 0.05701267127049587,
       "p": 6.514829291963686e-06,
       "verdict": "tie"
      },
      "epi_grn": {
       "mean": 0.004885305086880625,
       "gain": 0.0001678000192661838,
       "rel_gain": 0.03320730832653072,
       "rel_lo": -0.005437177439798325,
       "rel_hi": 0.07301797612345372,
       "p": 9.49331144936062e-06,
       "verdict": "tie"
      },
      "epi_grn_shuffled": {
       "mean": 0.004895590150092299,
       "gain": 0.00015751495605450928,
       "rel_gain": 0.031171913654220552,
       "rel_lo": -0.009537507241022555,
       "rel_hi": 0.07262751582211613,
       "p": 3.846859877477739e-06,
       "verdict": "tie"
      },
      "epi_direct": {
       "mean": 0.004858506383205512,
       "gain": 0.00019459872294129622,
       "rel_gain": 0.03851072139872535,
       "rel_lo": 0.0020515090084065445,
       "rel_hi": 0.07624957434353187,
       "p": 0.00012610524338275083,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.004839222190563994,
       "gain": 0.00021388291558281387,
       "rel_gain": 0.04232702686564698,
       "rel_lo": 0.006865354662115565,
       "rel_hi": 0.08021657172031442,
       "p": 0.0002425898377628126,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.01616314729101352,
       "gain": -0.011110042184866711,
       "rel_gain": -2.198656460035235,
       "rel_lo": -2.315559944440942,
       "rel_hi": -2.0841806907247182,
       "p": 7.76035204126952e-145,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.004266563122061786,
       "gain": 0.0007865419840850222,
       "rel_gain": 0.15565517984738528,
       "rel_lo": 0.1341009686197367,
       "rel_hi": 0.17997648704499666,
       "p": 3.3254929506410905e-43,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mae_delta",
     "higher": false,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.045717030032236955,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.048284817707336225,
       "gain": -0.0025677876750992657,
       "rel_gain": -0.05616698357895544,
       "rel_lo": -0.07380731378580864,
       "rel_hi": -0.03731758410754715,
       "p": 8.853298695535203e-19,
       "verdict": "worse"
      },
      "epi_grn": {
       "mean": 0.04826819087783648,
       "gain": -0.0025511608455995216,
       "rel_gain": -0.055803293516674055,
       "rel_lo": -0.07642054364812652,
       "rel_hi": -0.03775463324568698,
       "p": 2.7367743975149215e-19,
       "verdict": "worse"
      },
      "epi_grn_shuffled": {
       "mean": 0.04831064368015704,
       "gain": -0.0025936136479200824,
       "rel_gain": -0.05673189282180446,
       "rel_lo": -0.07533088559493538,
       "rel_hi": -0.037711157866499326,
       "p": 1.4837198510896698e-19,
       "verdict": "worse"
      },
      "epi_direct": {
       "mean": 0.04802154155339952,
       "gain": -0.002304511521162561,
       "rel_gain": -0.050408163424823425,
       "rel_lo": -0.06782462880723279,
       "rel_hi": -0.032046249262522,
       "p": 1.6244325333203057e-18,
       "verdict": "worse"
      },
      "epi_direct_shuffled": {
       "mean": 0.04784236819792421,
       "gain": -0.0021253381656872483,
       "rel_gain": -0.046488981549951625,
       "rel_lo": -0.06456837759959731,
       "rel_hi": -0.02757505750620554,
       "p": 2.143501581578944e-17,
       "verdict": "worse"
      },
      "perturb_mean": {
       "mean": 0.07994466282729251,
       "gain": -0.03422763279505556,
       "rel_gain": -0.7486845223961454,
       "rel_lo": -0.7757328919963649,
       "rel_hi": -0.7211318007626976,
       "p": 3.0192519586620315e-148,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.04094084172212771,
       "gain": 0.0047761883101092506,
       "rel_gain": 0.10447284757433639,
       "rel_lo": 0.09216727123160101,
       "rel_hi": 0.11685944664632254,
       "p": 2.6132933458894395e-53,
       "verdict": "better"
      }
     }
    },
    {
     "family": "discrimination",
     "family_label": "区分",
     "metric": "discrimination_score_l1",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.5368289847631089,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6300090334453416,
       "gain": 0.09318004868223266,
       "rel_gain": 0.17357492111449796,
       "rel_lo": 0.14737515754753244,
       "rel_hi": 0.20106992652251254,
       "p": 9.089327305626984e-45,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.6437559458185226,
       "gain": 0.10692696105541355,
       "rel_gain": 0.1991825406048038,
       "rel_lo": 0.17549443108580423,
       "rel_hi": 0.22261186992160614,
       "p": 8.660649214674094e-58,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.653238064275423,
       "gain": 0.11640907951231393,
       "rel_gain": 0.2168457419706627,
       "rel_lo": 0.19213413217008876,
       "rel_hi": 0.24110415120987563,
       "p": 6.641199088486782e-59,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.631031144392366,
       "gain": 0.09420215962925685,
       "rel_gain": 0.17547889980423884,
       "rel_lo": 0.15048917950139,
       "rel_hi": 0.20065639218385464,
       "p": 2.22709294425345e-49,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.6291896651626919,
       "gain": 0.092360680399583,
       "rel_gain": 0.1720486095592245,
       "rel_lo": 0.14855994851212562,
       "rel_hi": 0.19599823680846692,
       "p": 1.991051744737354e-52,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.7129271841923104,
       "gain": 0.17609819942920144,
       "rel_gain": 0.32803407496133946,
       "rel_lo": 0.29260213773006416,
       "rel_hi": 0.36419866408631374,
       "p": 2.067294069906184e-51,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.5015277679472245,
       "gain": -0.03530121681588447,
       "rel_gain": -0.06575877573276363,
       "rel_lo": -0.08312453629626981,
       "rel_hi": -0.048619783053695784,
       "p": 1.6873900431988753e-11,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "discrimination",
     "family_label": "区分",
     "metric": "discrimination_score_l2",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.5419191452657188,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6488545039462841,
       "gain": 0.10693535868056514,
       "rel_gain": 0.1973271467058644,
       "rel_lo": 0.17034685772601596,
       "rel_hi": 0.22478980667527068,
       "p": 1.0077140194517567e-50,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.6638310685738072,
       "gain": 0.12191192330808848,
       "rel_gain": 0.22496330748438773,
       "rel_lo": 0.20085388962802753,
       "rel_hi": 0.25052404438964243,
       "p": 1.2824732368829387e-64,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.6751606645640612,
       "gain": 0.13324151929834244,
       "rel_gain": 0.24586973990928152,
       "rel_lo": 0.21899100562950632,
       "rel_hi": 0.271223604079455,
       "p": 2.2616029236277104e-66,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.6488149151419978,
       "gain": 0.10689576987627898,
       "rel_gain": 0.19725409373360459,
       "rel_lo": 0.1710210481109166,
       "rel_hi": 0.22273956394016742,
       "p": 5.601193761391596e-56,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.6471101972362215,
       "gain": 0.10519105197050274,
       "rel_gain": 0.19410838847356923,
       "rel_lo": 0.1678813199122479,
       "rel_hi": 0.2185028236080641,
       "p": 5.557092164942178e-57,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.7746557273603025,
       "gain": 0.23273658209458364,
       "rel_gain": 0.4294673552831688,
       "rel_lo": 0.3894949825890417,
       "rel_hi": 0.4711404786519291,
       "p": 3.0683146819497585e-66,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.5066575172541206,
       "gain": -0.03526162801159832,
       "rel_gain": -0.06506806101915538,
       "rel_lo": -0.08329660392228048,
       "rel_hi": -0.04824888704903627,
       "p": 5.6544258548956654e-12,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "discrimination",
     "family_label": "区分",
     "metric": "discrimination_score_cosine",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.5916066936270423,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6994525948061887,
       "gain": 0.10784590117914652,
       "rel_gain": 0.1822932403248537,
       "rel_lo": 0.14259882995873424,
       "rel_hi": 0.2218402295470906,
       "p": 7.012833783095655e-20,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.7141448398392934,
       "gain": 0.12253814621225116,
       "rel_gain": 0.20712772105567323,
       "rel_lo": 0.16625531030427154,
       "rel_hi": 0.24626413123929064,
       "p": 1.4034250752882612e-25,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.7127796259217892,
       "gain": 0.12117293229474706,
       "rel_gain": 0.2048200833426274,
       "rel_lo": 0.1640969694511756,
       "rel_hi": 0.24471519532794614,
       "p": 2.2882825718329114e-25,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.7116435472048505,
       "gain": 0.12003685357780818,
       "rel_gain": 0.2028997556499609,
       "rel_lo": 0.16433574303703777,
       "rel_hi": 0.24410148130874282,
       "p": 4.885055594514326e-25,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.7129619743536528,
       "gain": 0.1213552807266105,
       "rel_gain": 0.20512830911800786,
       "rel_lo": 0.1631898326050148,
       "rel_hi": 0.24344234454369404,
       "p": 2.4763170307856564e-25,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.7108085833326334,
       "gain": 0.11920188970559127,
       "rel_gain": 0.20148840604690305,
       "rel_lo": 0.16120720072189718,
       "rel_hi": 0.2423416540774012,
       "p": 4.787684050866405e-19,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.5009999172234092,
       "gain": -0.09060677640363304,
       "rel_gain": -0.15315373774447674,
       "rel_lo": -0.18815652597106328,
       "rel_hi": -0.11709466789686603,
       "p": 1.5497893777296368e-17,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_N",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.06428929751632655,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.09658643142266983,
       "gain": 0.03229713390634327,
       "rel_gain": 0.5023718589885241,
       "rel_lo": 0.4446093818896196,
       "rel_hi": 0.5627524925329868,
       "p": 2.3247492829224895e-56,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.09796345408379155,
       "gain": 0.03367415656746499,
       "rel_gain": 0.5237910176093197,
       "rel_lo": 0.47150534252527043,
       "rel_hi": 0.583074473095967,
       "p": 1.6618755342288765e-63,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.10010608585215719,
       "gain": 0.03581678833583064,
       "rel_gain": 0.5571189874447581,
       "rel_lo": 0.5004728772396994,
       "rel_hi": 0.6148852367173469,
       "p": 5.919151418655348e-64,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.0956669378175173,
       "gain": 0.031377640301190765,
       "rel_gain": 0.48806942233615597,
       "rel_lo": 0.4294969398274785,
       "rel_hi": 0.5435992809896267,
       "p": 2.2780710542671336e-55,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.09583011613590468,
       "gain": 0.03154081861957813,
       "rel_gain": 0.49060761025687366,
       "rel_lo": 0.435020557041675,
       "rel_hi": 0.550291149193882,
       "p": 2.082051392012696e-55,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.11906124442015456,
       "gain": 0.054771946903828014,
       "rel_gain": 0.851960575396215,
       "rel_lo": 0.7563556810589935,
       "rel_hi": 0.963417397763438,
       "p": 1.6923318330359948e-76,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.09784001800481851,
       "gain": 0.03355072048849194,
       "rel_gain": 0.521871007844993,
       "rel_lo": 0.4654887977335899,
       "rel_hi": 0.5758046321048843,
       "p": 6.182667494189489e-63,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_50",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.02412786572086677,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07250651381694008,
       "gain": 0.04837864809607331,
       "rel_gain": 2.0050943857099415,
       "rel_lo": 1.758762576364852,
       "rel_hi": 2.2760812128426395,
       "p": 1.726429809848626e-51,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07102174071683565,
       "gain": 0.046893874995968886,
       "rel_gain": 1.9435566965798028,
       "rel_lo": 1.7083324153455257,
       "rel_hi": 2.195497094567244,
       "p": 1.9890130870656735e-54,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07480370626269303,
       "gain": 0.050675840541826264,
       "rel_gain": 2.10030348842665,
       "rel_lo": 1.8369667290294007,
       "rel_hi": 2.355594393350681,
       "p": 7.056036962210359e-57,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07197652728985883,
       "gain": 0.04784866156899206,
       "rel_gain": 1.9831286414865352,
       "rel_lo": 1.725475733083622,
       "rel_hi": 2.2469328096913177,
       "p": 4.882468790709693e-50,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07162972400075661,
       "gain": 0.04750185827988985,
       "rel_gain": 1.9687550829996656,
       "rel_lo": 1.7200764506416872,
       "rel_hi": 2.2400822496102255,
       "p": 4.778692199349606e-50,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.06568368167270006,
       "gain": 0.04155581595183327,
       "rel_gain": 1.7223162807928796,
       "rel_lo": 1.4294467298238898,
       "rel_hi": 2.0098442048426057,
       "p": 2.1496072174717522e-42,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.07100974476171336,
       "gain": 0.046881879040846584,
       "rel_gain": 1.9430595139752127,
       "rel_lo": 1.7252249954759116,
       "rel_hi": 2.173863039515944,
       "p": 1.0909041551707124e-59,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_100",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.032117470361672104,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07331573804402065,
       "gain": 0.04119826768234856,
       "rel_gain": 1.2827370032078609,
       "rel_lo": 1.125382591507707,
       "rel_hi": 1.4537732870635847,
       "p": 1.2086515520517837e-54,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07266619472407514,
       "gain": 0.04054872436240303,
       "rel_gain": 1.2625130156823465,
       "rel_lo": 1.1057621337302255,
       "rel_hi": 1.42438088382215,
       "p": 1.4627107724852071e-59,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07459944928991301,
       "gain": 0.0424819789282409,
       "rel_gain": 1.322706254566594,
       "rel_lo": 1.164196151771723,
       "rel_hi": 1.485833004999114,
       "p": 3.0326688995119246e-61,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07325765332666145,
       "gain": 0.041140182964989336,
       "rel_gain": 1.2809284947324067,
       "rel_lo": 1.1262495660152467,
       "rel_hi": 1.441607022377345,
       "p": 3.477022938832996e-55,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07280549434975365,
       "gain": 0.04068802398808154,
       "rel_gain": 1.2668502073761463,
       "rel_lo": 1.110293312796487,
       "rel_hi": 1.4308769385913702,
       "p": 3.7128496311612936e-55,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.07175188058417911,
       "gain": 0.039634410222506994,
       "rel_gain": 1.2340452026945854,
       "rel_lo": 1.0282739732451764,
       "rel_hi": 1.4746103653636746,
       "p": 4.499839516644321e-46,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.07288100699532908,
       "gain": 0.04076353663365696,
       "rel_gain": 1.2692013466385192,
       "rel_lo": 1.1393439298045853,
       "rel_hi": 1.4191489963287574,
       "p": 5.144811738510033e-62,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_200",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.03897849067690579,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07730860101279184,
       "gain": 0.03833011033588606,
       "rel_gain": 0.983365688877125,
       "rel_lo": 0.8640655707001372,
       "rel_hi": 1.101609458205309,
       "p": 2.5769924879504174e-57,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07741056133543538,
       "gain": 0.03843207065852958,
       "rel_gain": 0.9859814987987731,
       "rel_lo": 0.8714624418791208,
       "rel_hi": 1.1024247241136127,
       "p": 4.6647018558561793e-63,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07937504361413925,
       "gain": 0.04039655293723347,
       "rel_gain": 1.0363806354659046,
       "rel_lo": 0.9229625332910252,
       "rel_hi": 1.1623761017215541,
       "p": 3.7771425330758863e-63,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07708296476743601,
       "gain": 0.038104474090530215,
       "rel_gain": 0.9775769515135838,
       "rel_lo": 0.8597328538872598,
       "rel_hi": 1.0984733600379304,
       "p": 1.1414446671072408e-56,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.0767091321682991,
       "gain": 0.037730641491393296,
       "rel_gain": 0.9679862107577236,
       "rel_lo": 0.8548057474903675,
       "rel_hi": 1.0891603159925436,
       "p": 1.8953427764414166e-56,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.08308557979745951,
       "gain": 0.044107089120553715,
       "rel_gain": 1.1315750906354756,
       "rel_lo": 0.9661953264856877,
       "rel_hi": 1.310305459881663,
       "p": 7.742088513198685e-59,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.07789448431488019,
       "gain": 0.03891599363797441,
       "rel_gain": 0.9983966275285151,
       "rel_lo": 0.8946850054762225,
       "rel_hi": 1.11323073761715,
       "p": 1.5005225853726045e-64,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_500",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.05104802886603199,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.08738814754159041,
       "gain": 0.03634011867555841,
       "rel_gain": 0.7118809380657515,
       "rel_lo": 0.6262346656164047,
       "rel_hi": 0.79686921290764,
       "p": 3.06506873275918e-59,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.08864808124217645,
       "gain": 0.03760005237614446,
       "rel_gain": 0.7365622769650957,
       "rel_lo": 0.6556402264735863,
       "rel_hi": 0.8127493712381896,
       "p": 3.2067054248749533e-65,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.09077941267647043,
       "gain": 0.039731383810438434,
       "rel_gain": 0.7783137702477716,
       "rel_lo": 0.6962036392957485,
       "rel_hi": 0.8615549243206575,
       "p": 2.8451895689417277e-65,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.08673750912567205,
       "gain": 0.03568948025964004,
       "rel_gain": 0.6991353251523542,
       "rel_lo": 0.6218043312391196,
       "rel_hi": 0.7799699971796762,
       "p": 1.4205384151941541e-58,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.08681047648635092,
       "gain": 0.03576244762031892,
       "rel_gain": 0.7005647116007588,
       "rel_lo": 0.6214407507612535,
       "rel_hi": 0.7822097014787626,
       "p": 1.0478566480921301e-57,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.10334123524131603,
       "gain": 0.05229320637528403,
       "rel_gain": 1.0243922740390197,
       "rel_lo": 0.8960426853141854,
       "rel_hi": 1.1650964453811374,
       "p": 1.0721322154843036e-69,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.0888495879034885,
       "gain": 0.0378015590374565,
       "rel_gain": 0.7405096705430313,
       "rel_lo": 0.6632011255991365,
       "rel_hi": 0.8168919736809259,
       "p": 2.2357991468551335e-65,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_N",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.07993274450751511,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.08244841113437862,
       "gain": 0.002515666626863514,
       "rel_gain": 0.03147229139150847,
       "rel_lo": 0.018182647260197332,
       "rel_hi": 0.046259438785989274,
       "p": 4.136104718399091e-09,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.08411270970132664,
       "gain": 0.004179965193811532,
       "rel_gain": 0.052293527759684766,
       "rel_lo": 0.03811441420110936,
       "rel_hi": 0.06665167779985685,
       "p": 2.3419648177561716e-19,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.0844608274841995,
       "gain": 0.004528082976684386,
       "rel_gain": 0.05664866137880034,
       "rel_lo": 0.04379669697135203,
       "rel_hi": 0.07101590614734794,
       "p": 6.16102782574482e-21,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.08196008299354314,
       "gain": 0.00202733848602802,
       "rel_gain": 0.025363053633638385,
       "rel_lo": 0.009183218542555927,
       "rel_hi": 0.04169302354067583,
       "p": 7.307869276761345e-06,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.08320434755316287,
       "gain": 0.0032716030456477504,
       "rel_gain": 0.04092944719720165,
       "rel_lo": 0.02418436913384899,
       "rel_hi": 0.05749713961415213,
       "p": 1.0880225097560741e-11,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.09401246941236464,
       "gain": 0.01407972490484953,
       "rel_gain": 0.17614464499621657,
       "rel_lo": 0.15861523137477748,
       "rel_hi": 0.1950805124292463,
       "p": 4.998526304860228e-104,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.07665208183251945,
       "gain": -0.0032806626749956533,
       "rel_gain": -0.04104278784881723,
       "rel_lo": -0.05500454220061007,
       "rel_hi": -0.025687006463878913,
       "p": 1.257551066608242e-07,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_50",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.02351687742706363,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07180722891566266,
       "gain": 0.04829035148859903,
       "rel_gain": 2.0534338216614447,
       "rel_lo": 1.7865801507324919,
       "rel_hi": 2.3216339232788545,
       "p": 3.478881683674998e-55,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07038335158817087,
       "gain": 0.04686647416110724,
       "rel_gain": 1.9928867812685236,
       "rel_lo": 1.7366775340841731,
       "rel_hi": 2.241631382843593,
       "p": 3.552124752051317e-58,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07437020810514787,
       "gain": 0.050853330678084244,
       "rel_gain": 2.1624184943687017,
       "rel_lo": 1.895835803200948,
       "rel_hi": 2.4107248708612077,
       "p": 1.4856141264072357e-62,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07147864184008763,
       "gain": 0.04796176441302401,
       "rel_gain": 2.039461427724617,
       "rel_lo": 1.783643830976374,
       "rel_hi": 2.3209353035820124,
       "p": 8.270244231379277e-54,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07136911281489594,
       "gain": 0.04785223538783233,
       "rel_gain": 2.034803963079008,
       "rel_lo": 1.7730311626725381,
       "rel_hi": 2.3058324159539327,
       "p": 9.440367518353633e-55,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.04970427163198249,
       "gain": 0.026187394204918845,
       "rel_gain": 1.1135574561774915,
       "rel_lo": 0.950535608434245,
       "rel_hi": 1.2784317046320604,
       "p": 1.312521289068195e-42,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.0724644030668127,
       "gain": 0.04894752563974908,
       "rel_gain": 2.0813786095351,
       "rel_lo": 1.8475632991785924,
       "rel_hi": 2.3017656025065625,
       "p": 2.642318578450055e-72,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_100",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.03124179682159505,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07187294633077766,
       "gain": 0.04063114950918261,
       "rel_gain": 1.3005381777880785,
       "rel_lo": 1.1391850669302772,
       "rel_hi": 1.469166646952545,
       "p": 5.472735960617642e-62,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07112814895947425,
       "gain": 0.039886352137879215,
       "rel_gain": 1.2766984039249896,
       "rel_lo": 1.1253766078489815,
       "rel_hi": 1.4443639651436915,
       "p": 1.6871565424420493e-68,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07296823658269441,
       "gain": 0.04172643976109936,
       "rel_gain": 1.335596668763209,
       "rel_lo": 1.1694605979860335,
       "rel_hi": 1.4966099501579362,
       "p": 1.3919067275908634e-70,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07181818181818181,
       "gain": 0.040576384996586765,
       "rel_gain": 1.2987852532393218,
       "rel_lo": 1.146649229659709,
       "rel_hi": 1.4632026954054664,
       "p": 8.070650110571549e-66,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07146768893756845,
       "gain": 0.04022589211597341,
       "rel_gain": 1.2875665361272801,
       "rel_lo": 1.1292411172917007,
       "rel_hi": 1.4389746192976167,
       "p": 3.252764698391196e-65,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.05312157721796277,
       "gain": 0.021879780396367707,
       "rel_gain": 0.7003368122938403,
       "rel_lo": 0.6017086153993039,
       "rel_hi": 0.8051341287464006,
       "p": 1.0015716834167899e-47,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.07263964950711937,
       "gain": 0.04139785268552434,
       "rel_gain": 1.3250791214706699,
       "rel_lo": 1.1915820699736406,
       "rel_hi": 1.46780181187626,
       "p": 1.3437014937965405e-80,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_200",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.03766166241005835,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.0747261774370208,
       "gain": 0.037064515026962466,
       "rel_gain": 0.9841444231379335,
       "rel_lo": 0.8656124721784269,
       "rel_hi": 1.1018487232616925,
       "p": 9.82715178371421e-74,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07474808324205916,
       "gain": 0.037086420832000803,
       "rel_gain": 0.9847260704587508,
       "rel_lo": 0.8753427455893269,
       "rel_hi": 1.105101732449365,
       "p": 1.7936575579682022e-82,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07647316538882803,
       "gain": 0.038811502978769695,
       "rel_gain": 1.0305307969731112,
       "rel_lo": 0.9198927173569669,
       "rel_hi": 1.153200331626699,
       "p": 1.6659906799638568e-82,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07443044906900328,
       "gain": 0.03676878665894494,
       "rel_gain": 0.9762921843069002,
       "rel_lo": 0.8646182680279146,
       "rel_hi": 1.0912900907740095,
       "p": 1.2958947875301387e-78,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07435925520262868,
       "gain": 0.03669759279257035,
       "rel_gain": 0.9744018305142441,
       "rel_lo": 0.856807307114257,
       "rel_hi": 1.0865651247370007,
       "p": 1.1509710814130482e-77,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.06212486308871851,
       "gain": 0.024463200678660167,
       "rel_gain": 0.6495518018377954,
       "rel_lo": 0.5721031125364696,
       "rel_hi": 0.7238696248999524,
       "p": 8.18610005961716e-68,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.07867469879518071,
       "gain": 0.04101303638512238,
       "rel_gain": 1.0889863527152477,
       "rel_lo": 0.987512158159377,
       "rel_hi": 1.1960045758905844,
       "p": 1.4987155772391542e-97,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_500",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.05181791708720821,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.08498100282344305,
       "gain": 0.033163085736234825,
       "rel_gain": 0.6399926434793242,
       "rel_lo": 0.5696334336280973,
       "rel_hi": 0.7086257306661313,
       "p": 3.01101023621744e-90,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.08653477302117636,
       "gain": 0.03471685593396815,
       "rel_gain": 0.669977835572599,
       "rel_lo": 0.6042967831634002,
       "rel_hi": 0.7387080396335579,
       "p": 4.5821671166136155e-95,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.0882030984000254,
       "gain": 0.03638518131281718,
       "rel_gain": 0.7021737529816542,
       "rel_lo": 0.6357848936978577,
       "rel_hi": 0.774694225727174,
       "p": 3.308072339360056e-97,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.08394674190957357,
       "gain": 0.03212882482236535,
       "rel_gain": 0.6200331203643977,
       "rel_lo": 0.5532500053828884,
       "rel_hi": 0.6885825385099739,
       "p": 1.5291035840294493e-89,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.08470215223352323,
       "gain": 0.03288423514631502,
       "rel_gain": 0.6346112888129352,
       "rel_lo": 0.572295982475434,
       "rel_hi": 0.7025859035984457,
       "p": 4.135947724747284e-92,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.08034830230010954,
       "gain": 0.02853038521290132,
       "rel_gain": 0.5505891941755479,
       "rel_lo": 0.4951794196585066,
       "rel_hi": 0.6096437007092437,
       "p": 2.964894955645384e-88,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.08778532311062433,
       "gain": 0.03596740602341611,
       "rel_gain": 0.6941113816459257,
       "rel_lo": 0.6336362555182398,
       "rel_hi": 0.7578137891444588,
       "p": 1.2202496569665659e-108,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_spearman_sig",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.5700395025453604,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.5409410872655565,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_grn": {
       "mean": 0.5509166694408778,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_grn_shuffled": {
       "mean": 0.5695394285693682,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_direct": {
       "mean": 0.5462733414877563,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_direct_shuffled": {
       "mean": 0.5516884734231822,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "perturb_mean": {
       "mean": 0.5441708067041688,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "context_mean": {
       "mean": 0.27144857902741343,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_direction_match",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.5554831432677211,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.7065643876707559,
       "gain": 0.1510812444030349,
       "rel_gain": 0.2719816905950999,
       "rel_lo": 0.2317110213559948,
       "rel_hi": 0.31089155881020264,
       "p": 2.5448621636305616e-58,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.7175838095890051,
       "gain": 0.1621006663212841,
       "rel_gain": 0.2918192357155974,
       "rel_lo": 0.25633063070250384,
       "rel_hi": 0.32734109962990526,
       "p": 6.270307665916005e-67,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.7211586653316174,
       "gain": 0.16567552206389646,
       "rel_gain": 0.29825481487931915,
       "rel_lo": 0.2610899289745731,
       "rel_hi": 0.33460848970993207,
       "p": 4.1763839561668614e-66,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.7065987639007547,
       "gain": 0.1511156206330337,
       "rel_gain": 0.27204357587535627,
       "rel_lo": 0.23111290036029708,
       "rel_hi": 0.3104533667928541,
       "p": 2.2315891387489295e-58,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.7089189084800163,
       "gain": 0.1534357652122952,
       "rel_gain": 0.2762203805315928,
       "rel_lo": 0.23909962643661983,
       "rel_hi": 0.31303957245966657,
       "p": 6.175343652679159e-62,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.7199791780310365,
       "gain": 0.16449603476331542,
       "rel_gain": 0.296131460975828,
       "rel_lo": 0.2613434475547923,
       "rel_hi": 0.3314195129522862,
       "p": 1.1908647769017804e-61,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.6968279766513061,
       "gain": 0.14134483338358506,
       "rel_gain": 0.25445386614632587,
       "rel_lo": 0.2126298763676249,
       "rel_hi": 0.2924387807941625,
       "p": 2.7503275444079214e-51,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_spearman_lfc_sig",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.08766873113166235,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.4247367901221225,
       "gain": 0.3370680589904601,
       "rel_gain": 3.844792261042831,
       "rel_lo": 3.418920333632611,
       "rel_hi": 4.2701177317353425,
       "p": 6.760292832320354e-72,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.43615538121762487,
       "gain": 0.3484866500859626,
       "rel_gain": 3.975039282393623,
       "rel_lo": 3.4869906795255714,
       "rel_hi": 4.437180356884016,
       "p": 7.082814209298837e-71,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.4430978713454682,
       "gain": 0.3554291402138059,
       "rel_gain": 4.0542293201439925,
       "rel_lo": 3.6080871183198213,
       "rel_hi": 4.510172906088009,
       "p": 9.951023063660658e-72,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.43032288649061456,
       "gain": 0.34265415535895216,
       "rel_gain": 3.908510490979372,
       "rel_lo": 3.4911197341713547,
       "rel_hi": 4.335202288972117,
       "p": 6.702566757870879e-73,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.4264042782549047,
       "gain": 0.3387355471232423,
       "rel_gain": 3.863812590312544,
       "rel_lo": 3.447126703415478,
       "rel_hi": 4.304785430679849,
       "p": 4.351502600475142e-72,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.41753026787072656,
       "gain": 0.32986153673906415,
       "rel_gain": 3.7625905209426684,
       "rel_lo": 3.3757955446596077,
       "rel_hi": 4.183800030003433,
       "p": 2.3363322157620825e-66,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.45214783772934114,
       "gain": 0.3644791065976787,
       "rel_gain": 4.157458444907774,
       "rel_lo": 3.7379948638839777,
       "rel_hi": 4.603472982294639,
       "p": 3.1761755545409464e-72,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_sig_genes_recall",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.4961808073198642,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.48859623725892387,
       "gain": -0.007584570060940353,
       "rel_gain": -0.015285899714478357,
       "rel_lo": -0.06211294128806723,
       "rel_hi": 0.028831865071178246,
       "p": 0.01562518082079293,
       "verdict": "tie"
      },
      "epi_grn": {
       "mean": 0.4880869742693774,
       "gain": -0.008093833050486844,
       "rel_gain": -0.01631226547073824,
       "rel_lo": -0.06204412090647106,
       "rel_hi": 0.028866807447569413,
       "p": 0.027506009902270815,
       "verdict": "tie"
      },
      "epi_grn_shuffled": {
       "mean": 0.5125494278009944,
       "gain": 0.01636862048113021,
       "rel_gain": 0.03298922537843778,
       "rel_lo": -0.011594323931335053,
       "rel_hi": 0.08000751196341006,
       "p": 0.7187713284919295,
       "verdict": "tie"
      },
      "epi_direct": {
       "mean": 0.47457217252015077,
       "gain": -0.021608634799713457,
       "rel_gain": -0.04354992067595915,
       "rel_lo": -0.09080224390856394,
       "rel_hi": 0.00238184476104201,
       "p": 0.0005944108612935668,
       "verdict": "tie"
      },
      "epi_direct_shuffled": {
       "mean": 0.4566687209894063,
       "gain": -0.039512086330457934,
       "rel_gain": -0.07963243589344714,
       "rel_lo": -0.12909493971215846,
       "rel_hi": -0.031655769634526515,
       "p": 8.78371128386059e-07,
       "verdict": "worse"
      },
      "perturb_mean": {
       "mean": 0.6339105304131414,
       "gain": 0.13772972309327725,
       "rel_gain": 0.2775797069564793,
       "rel_lo": 0.22819862775526958,
       "rel_hi": 0.3293950767109687,
       "p": 6.592036716102146e-21,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.6206302160465434,
       "gain": 0.12444940872667927,
       "rel_gain": 0.2508146362994098,
       "rel_lo": 0.1950708619229733,
       "rel_hi": 0.30355545375420795,
       "p": 5.0401212397994174e-14,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "pr_auc",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.09275322708827606,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.09405727369169613,
       "gain": 0.0013040466034200822,
       "rel_gain": 0.014059312482777354,
       "rel_lo": 0.0017282608442088143,
       "rel_hi": 0.02761724461475273,
       "p": 0.07644579814684947,
       "verdict": "tie"
      },
      "epi_grn": {
       "mean": 0.09544703006686096,
       "gain": 0.0026938029785849213,
       "rel_gain": 0.02904268738834442,
       "rel_lo": 0.017312974762705036,
       "rel_hi": 0.04104627176583095,
       "p": 5.257046400641614e-07,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.0957755792055159,
       "gain": 0.0030223521172398557,
       "rel_gain": 0.03258487291621014,
       "rel_lo": 0.01979051269622882,
       "rel_hi": 0.046351559929186166,
       "p": 3.3458402574400866e-07,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.09371271278932378,
       "gain": 0.0009594857010477352,
       "rel_gain": 0.010344499390135112,
       "rel_lo": -0.004297343786516066,
       "rel_hi": 0.024085195670368036,
       "p": 0.019195736976531368,
       "verdict": "tie"
      },
      "epi_direct_shuffled": {
       "mean": 0.09591047873423171,
       "gain": 0.0031572516459556633,
       "rel_gain": 0.03403926467109129,
       "rel_lo": 0.02040584293296057,
       "rel_hi": 0.046841263673001454,
       "p": 5.519007753138567e-10,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.10299675528675897,
       "gain": 0.010243528198482931,
       "rel_gain": 0.11043851001252879,
       "rel_lo": 0.0986091174442324,
       "rel_hi": 0.12287691772731137,
       "p": 8.585786830440578e-75,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.08040623566775026,
       "gain": -0.01234699142052578,
       "rel_gain": -0.1331165697208009,
       "rel_lo": -0.14761651355069016,
       "rel_hi": -0.11845589107626414,
       "p": 2.3881663648369146e-80,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "roc_auc",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.43748588261891064,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.4693199568654517,
       "gain": 0.03183407424654115,
       "rel_gain": 0.07276594631116698,
       "rel_lo": 0.04645877112174962,
       "rel_hi": 0.10073532813891194,
       "p": 4.384227287419584e-09,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.4729229570597718,
       "gain": 0.03543707444086122,
       "rel_gain": 0.08100164107862215,
       "rel_lo": 0.053683573510934016,
       "rel_hi": 0.10944509308388307,
       "p": 3.497806146103505e-16,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.4728678386454496,
       "gain": 0.035381956026539076,
       "rel_gain": 0.0808756520661489,
       "rel_lo": 0.05289860015767435,
       "rel_hi": 0.10919302249494457,
       "p": 3.0380897704720504e-14,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.471175492324694,
       "gain": 0.033689609705783455,
       "rel_gain": 0.07700730707950666,
       "rel_lo": 0.049620200340763476,
       "rel_hi": 0.10355526105830562,
       "p": 6.301213465143614e-10,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.4886154850335963,
       "gain": 0.05112960241468576,
       "rel_gain": 0.11687143390458664,
       "rel_lo": 0.08989872289977502,
       "rel_hi": 0.14366463188865705,
       "p": 9.70666364890264e-20,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.5496586688189463,
       "gain": 0.11217278620003573,
       "rel_gain": 0.25640321358151863,
       "rel_lo": 0.22980342335557533,
       "rel_hi": 0.28399231269057307,
       "p": 1.4472738160517217e-77,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.3800000417404794,
       "gain": -0.05748584087843116,
       "rel_gain": -0.13140044779114957,
       "rel_lo": -0.1534426843981419,
       "rel_hi": -0.10711797479399256,
       "p": 3.1846180586849434e-40,
       "verdict": "worse"
      }
     }
    }
   ]
  },
  "rpe1": {
   "caption": "留出 RPE1 · seed 42 · 相对 STATE 的配对比较",
   "arms": [
    "state",
    "backbone",
    "epi_grn",
    "epi_grn_shuffled",
    "epi_direct",
    "epi_direct_shuffled",
    "perturb_mean",
    "context_mean"
   ],
   "labels": {
    "state": "STATE",
    "backbone": "骨架（无先验）",
    "epi_grn": "Epi-GRN",
    "epi_grn_shuffled": "Epi-GRN 打乱",
    "epi_direct": "Epi-Direct",
    "epi_direct_shuffled": "Epi-Direct 打乱",
    "perturb_mean": "perturb_mean",
    "context_mean": "context_mean"
   },
   "rows": [
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "pearson_delta",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.3313878749062005,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.4385574054438103,
       "gain": 0.10716953053760982,
       "rel_gain": 0.32339605233880153,
       "rel_lo": 0.2589185184122083,
       "rel_hi": 0.38924111886989254,
       "p": 1.7293567132123202e-18,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.45547965562259324,
       "gain": 0.12409178071639276,
       "rel_gain": 0.3744608361169431,
       "rel_lo": 0.3180257212199149,
       "rel_hi": 0.436620351919815,
       "p": 1.554962782066925e-37,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.45239268092672186,
       "gain": 0.1210048060205214,
       "rel_gain": 0.36514554449154746,
       "rel_lo": 0.306360186324207,
       "rel_hi": 0.4239743002750678,
       "p": 3.309461959603349e-36,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.47885388188484695,
       "gain": 0.14746600697864648,
       "rel_gain": 0.4449951798036872,
       "rel_lo": 0.38637587999239087,
       "rel_hi": 0.509005459598132,
       "p": 3.40017582868585e-49,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.4664802162966403,
       "gain": 0.13509234139043988,
       "rel_gain": 0.40765625908515163,
       "rel_lo": 0.34721895472159886,
       "rel_hi": 0.4737860474151878,
       "p": 3.3121176323071313e-40,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.17280296900718048,
       "gain": -0.15858490589902,
       "rel_gain": -0.47854770167408067,
       "rel_lo": -0.5505998518295622,
       "rel_hi": -0.404678289925939,
       "p": 1.4859227509771107e-32,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.5504136156808488,
       "gain": 0.2190257407746483,
       "rel_gain": 0.6609346851831669,
       "rel_lo": 0.5918968372786128,
       "rel_hi": 0.7345748898914092,
       "p": 9.13956774811087e-115,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mse",
     "higher": false,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.0395080659795424,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.013997625641085028,
       "gain": 0.025510440338457376,
       "rel_gain": 0.6457020789543808,
       "rel_lo": 0.6290467290827241,
       "rel_hi": 0.662486679542118,
       "p": 2.1676859051672488e-148,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.012768666016754256,
       "gain": 0.02673939996278815,
       "rel_gain": 0.6768086288160505,
       "rel_lo": 0.662417803101265,
       "rel_hi": 0.6926116204372819,
       "p": 1.0059092342224383e-148,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.012691146153355799,
       "gain": 0.026816919826186603,
       "rel_gain": 0.6787707563329631,
       "rel_lo": 0.6642710396482141,
       "rel_hi": 0.6930987880897626,
       "p": 1.0194382884871002e-148,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.013328552279503265,
       "gain": 0.02617951370003914,
       "rel_gain": 0.6626371868872323,
       "rel_lo": 0.6469063468839671,
       "rel_hi": 0.6780514992514081,
       "p": 1.0059092342224383e-148,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.013482596820403715,
       "gain": 0.026025469159138687,
       "rel_gain": 0.6587381212893308,
       "rel_lo": 0.642978764138723,
       "rel_hi": 0.674964768182321,
       "p": 1.0611253565556878e-148,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.021408103261136752,
       "gain": 0.01809996271840565,
       "rel_gain": 0.45813335251029397,
       "rel_lo": 0.4316799702654016,
       "rel_hi": 0.4839502093205236,
       "p": 6.807489315358165e-112,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.012767698372340243,
       "gain": 0.02674036760720216,
       "rel_gain": 0.6768331211416054,
       "rel_lo": 0.658654300877873,
       "rel_hi": 0.6950657060760548,
       "p": 2.5020311448237785e-148,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mae",
     "higher": false,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.14785793090489868,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07890242605663844,
       "gain": 0.06895550484826024,
       "rel_gain": 0.4663632476543446,
       "rel_lo": 0.456966900691338,
       "rel_hi": 0.4760750453732503,
       "p": 9.925594637485512e-149,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07615646992181246,
       "gain": 0.07170146098308622,
       "rel_gain": 0.484934832675321,
       "rel_lo": 0.4760932493495376,
       "rel_hi": 0.49343730899922594,
       "p": 9.859510673439284e-149,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.07570853844715968,
       "gain": 0.072149392457739,
       "rel_gain": 0.4879643047632328,
       "rel_lo": 0.4795277060461924,
       "rel_hi": 0.4969572194313225,
       "p": 9.859510673439284e-149,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.0780021537642292,
       "gain": 0.06985577714066948,
       "rel_gain": 0.4724520133154054,
       "rel_lo": 0.4642991757834653,
       "rel_hi": 0.48066659024732766,
       "p": 9.859510673439284e-149,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07816151035607723,
       "gain": 0.06969642054882146,
       "rel_gain": 0.47137424500853975,
       "rel_lo": 0.4624159370707257,
       "rel_hi": 0.48068023839625573,
       "p": 9.8924975552046e-149,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.09304436316943672,
       "gain": 0.054813567735461956,
       "rel_gain": 0.3707178059370904,
       "rel_lo": 0.3558805527653267,
       "rel_hi": 0.38539940251432775,
       "p": 1.5546154673549703e-139,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.06941164208905516,
       "gain": 0.07844628881584352,
       "rel_gain": 0.5305517826182736,
       "rel_lo": 0.5197861411848497,
       "rel_hi": 0.5407246550218612,
       "p": 9.859510673439284e-149,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mse_delta",
     "higher": false,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.01695460183685801,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.01389147875920141,
       "gain": 0.0030631230776565974,
       "rel_gain": 0.18066617589317854,
       "rel_lo": 0.13853329244915008,
       "rel_hi": 0.22037414455414545,
       "p": 5.957393728677995e-13,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.012613275718100336,
       "gain": 0.0043413261187576725,
       "rel_gain": 0.25605591688505247,
       "rel_lo": 0.22177998401486246,
       "rel_hi": 0.2899114481930541,
       "p": 2.1871960350488954e-33,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.012541586547821669,
       "gain": 0.004413015289036339,
       "rel_gain": 0.2602842184971151,
       "rel_lo": 0.2250056545802174,
       "rel_hi": 0.29516203600004004,
       "p": 2.2186012861969093e-35,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.013204867096521473,
       "gain": 0.0037497347403365345,
       "rel_gain": 0.22116324384480074,
       "rel_lo": 0.1820062097463845,
       "rel_hi": 0.25674801834118083,
       "p": 1.3158844028470487e-22,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.013312200802503707,
       "gain": 0.0036424010343543015,
       "rel_gain": 0.21483259054990014,
       "rel_lo": 0.17920636470046342,
       "rel_hi": 0.2544899385370281,
       "p": 3.1880360505438514e-20,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.02147757324666713,
       "gain": -0.004522971409809122,
       "rel_gain": -0.2667695445360756,
       "rel_lo": -0.3194260285956686,
       "rel_hi": -0.21441478883256315,
       "p": 2.606371845392282e-36,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.012767698364829575,
       "gain": 0.0041869034720284325,
       "rel_gain": 0.2469479090288292,
       "rel_lo": 0.20998782026316004,
       "rel_hi": 0.28389810258923254,
       "p": 9.556393185127014e-29,
       "verdict": "better"
      }
     }
    },
    {
     "family": "expression",
     "family_label": "表达",
     "metric": "mae_delta",
     "higher": false,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.08438362986537254,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07839690520116299,
       "gain": 0.005986724664209549,
       "rel_gain": 0.07094651739633503,
       "rel_lo": 0.05077504765954943,
       "rel_hi": 0.09064143869473289,
       "p": 5.758536369372398e-07,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.07548589875985837,
       "gain": 0.008897731105514178,
       "rel_gain": 0.10544380609971164,
       "rel_lo": 0.08766130671250241,
       "rel_hi": 0.12277882550729483,
       "p": 1.911873755628667e-18,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.0749992325703082,
       "gain": 0.009384397295064337,
       "rel_gain": 0.1112111118001964,
       "rel_lo": 0.09312045138874933,
       "rel_hi": 0.13032197045651944,
       "p": 1.3332319717090854e-20,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.07741378756184068,
       "gain": 0.006969842303531851,
       "rel_gain": 0.08259709039124873,
       "rel_lo": 0.06261293125062017,
       "rel_hi": 0.10239652162913211,
       "p": 1.853738663976621e-11,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.07738854334761158,
       "gain": 0.006995086517760963,
       "rel_gain": 0.0828962504803488,
       "rel_lo": 0.0631225988381783,
       "rel_hi": 0.10298457048184399,
       "p": 2.0208843540406517e-10,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.09322417102488911,
       "gain": -0.00884054115951658,
       "rel_gain": -0.10476606865124158,
       "rel_lo": -0.1268672147838472,
       "rel_hi": -0.08269276223273955,
       "p": 6.156156014147334e-34,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.06941164208076753,
       "gain": 0.014971987784605005,
       "rel_gain": 0.1774276338727267,
       "rel_lo": 0.1579096560553015,
       "rel_hi": 0.19602393211926356,
       "p": 3.7791266243691175e-54,
       "verdict": "better"
      }
     }
    },
    {
     "family": "discrimination",
     "family_label": "区分",
     "metric": "discrimination_score_l1",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.6245278092949649,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6129650916046875,
       "gain": -0.011562717690277544,
       "rel_gain": -0.01851433598021968,
       "rel_lo": -0.05026117200006341,
       "rel_hi": 0.010522809582679529,
       "p": 0.7455175404811478,
       "verdict": "tie"
      },
      "epi_grn": {
       "mean": 0.6516473006096256,
       "gain": 0.027119491314660585,
       "rel_gain": 0.04342399315296468,
       "rel_lo": 0.01526466882221483,
       "rel_hi": 0.06804375089154102,
       "p": 9.111794110700519e-07,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.6439363475175112,
       "gain": 0.019408538222546127,
       "rel_gain": 0.03107714009478073,
       "rel_lo": 0.004432494492257465,
       "rel_hi": 0.05662826105907154,
       "p": 1.1592117286675442e-05,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.6383486286208505,
       "gain": 0.01382081932588552,
       "rel_gain": 0.02213003027277195,
       "rel_lo": -0.005293921274943336,
       "rel_hi": 0.05051436966065964,
       "p": 0.003088099868780005,
       "verdict": "tie"
      },
      "epi_direct_shuffled": {
       "mean": 0.6273847718574959,
       "gain": 0.0028569625625308576,
       "rel_gain": 0.004574596230960649,
       "rel_lo": -0.02356590667744441,
       "rel_hi": 0.03267398919055998,
       "p": 0.11631224080931722,
       "verdict": "tie"
      },
      "perturb_mean": {
       "mean": 0.53237375355883,
       "gain": -0.09215405573613496,
       "rel_gain": -0.14755796998082202,
       "rel_lo": -0.18331421473063575,
       "rel_hi": -0.11299153630355191,
       "p": 2.3306376911183475e-08,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.5011847300362162,
       "gain": -0.12334307925874875,
       "rel_gain": -0.19749813766978908,
       "rel_lo": -0.23086733076569513,
       "rel_hi": -0.16090528069674928,
       "p": 1.9505356870920358e-21,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "discrimination",
     "family_label": "区分",
     "metric": "discrimination_score_l2",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.6260645557231431,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6342840456767561,
       "gain": 0.008219489953613032,
       "rel_gain": 0.013128821746056228,
       "rel_lo": -0.01681454625226785,
       "rel_hi": 0.04280607566217247,
       "p": 0.038477228327671344,
       "verdict": "tie"
      },
      "epi_grn": {
       "mean": 0.6813651554501913,
       "gain": 0.0553005997270481,
       "rel_gain": 0.08833050716818253,
       "rel_lo": 0.06316607574122603,
       "rel_hi": 0.11378541105880396,
       "p": 2.295332103471635e-13,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.6719949616493915,
       "gain": 0.04593040592624855,
       "rel_gain": 0.07336368990446376,
       "rel_lo": 0.04690826426027597,
       "rel_hi": 0.09980409537022764,
       "p": 1.812048502737981e-11,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.6599323683093684,
       "gain": 0.03386781258622546,
       "rel_gain": 0.05409635839726792,
       "rel_lo": 0.026900892514812664,
       "rel_hi": 0.08223211709414881,
       "p": 3.9805514429576624e-07,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.6507057031604762,
       "gain": 0.02464114743733304,
       "rel_gain": 0.039358796488440394,
       "rel_lo": 0.012398119710822043,
       "rel_hi": 0.06621087342337534,
       "p": 5.927889825402592e-05,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.5442965301948401,
       "gain": -0.08176802552830299,
       "rel_gain": -0.13060638041368736,
       "rel_lo": -0.16958799255315365,
       "rel_hi": -0.09367546730541954,
       "p": 5.706387421887523e-07,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.5035071721019895,
       "gain": -0.12255738362115366,
       "rel_gain": -0.1957583806666588,
       "rel_lo": -0.2294475044764084,
       "rel_hi": -0.16243399026850547,
       "p": 6.667765845043008e-22,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "discrimination",
     "family_label": "区分",
     "metric": "discrimination_score_cosine",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.566575641455529,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6200598613463729,
       "gain": 0.05348421989084398,
       "rel_gain": 0.09439908103610559,
       "rel_lo": 0.05973783977969326,
       "rel_hi": 0.12940067524628363,
       "p": 1.1398751570660513e-17,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.6344250996967339,
       "gain": 0.06784945824120485,
       "rel_gain": 0.11975357441576566,
       "rel_lo": 0.0869428180831479,
       "rel_hi": 0.1541962669275639,
       "p": 1.9234199284045674e-26,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.6300202548623424,
       "gain": 0.06344461340681341,
       "rel_gain": 0.11197906998582684,
       "rel_lo": 0.07889675196055096,
       "rel_hi": 0.14485637913375424,
       "p": 3.6086182635003997e-25,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.6132830818076196,
       "gain": 0.04670744035209064,
       "rel_gain": 0.08243813700161826,
       "rel_lo": 0.050146208727973145,
       "rel_hi": 0.11551363049702233,
       "p": 3.2399992712923265e-19,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.6127275269394619,
       "gain": 0.046151885483932835,
       "rel_gain": 0.08145758854964,
       "rel_lo": 0.047811018394564836,
       "rel_hi": 0.11483980371560162,
       "p": 2.4741468993330777e-18,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.7565877795251429,
       "gain": 0.1900121380696139,
       "rel_gain": 0.3353694090721479,
       "rel_lo": 0.29455347919992486,
       "rel_hi": 0.37551118458551624,
       "p": 1.8338724307152296e-51,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.5014680753921363,
       "gain": -0.06510756606339264,
       "rel_gain": -0.11491416379308463,
       "rel_lo": -0.1437838906153433,
       "rel_hi": -0.08742381094851139,
       "p": 2.1151222190326273e-21,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_N",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.20345144053495592,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.24179867014157405,
       "gain": 0.0383472296066181,
       "rel_gain": 0.1884834509197269,
       "rel_lo": 0.16000428627799593,
       "rel_hi": 0.21805682861206874,
       "p": 5.654574314052505e-36,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.25329301036572754,
       "gain": 0.04984156983077161,
       "rel_gain": 0.24498017659505392,
       "rel_lo": 0.2175759399448157,
       "rel_hi": 0.2719781140131122,
       "p": 9.692978942131925e-62,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.25466503426606235,
       "gain": 0.051213593731106455,
       "rel_gain": 0.25172391798477933,
       "rel_lo": 0.22446349579468144,
       "rel_hi": 0.2778333591714222,
       "p": 1.96751302026395e-63,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.2628100350622882,
       "gain": 0.05935859452733229,
       "rel_gain": 0.2917580449234205,
       "rel_lo": 0.2621349189664274,
       "rel_hi": 0.3206795165782268,
       "p": 9.834247309060182e-73,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.25528862193265345,
       "gain": 0.051837181397697545,
       "rel_gain": 0.254788962228022,
       "rel_lo": 0.22560941411889637,
       "rel_hi": 0.2846462853042171,
       "p": 2.131865401314025e-59,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.17330568309503583,
       "gain": -0.03014575743992009,
       "rel_gain": -0.14817175715568653,
       "rel_lo": -0.18300380377654388,
       "rel_hi": -0.11316801289295939,
       "p": 1.5230633068781606e-26,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.3007234042912446,
       "gain": 0.09727196375628873,
       "rel_gain": 0.47810899495487225,
       "rel_lo": 0.4425487078618152,
       "rel_hi": 0.5153104277833624,
       "p": 2.287469174500829e-107,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_50",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.022692052555879815,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07456495097499816,
       "gain": 0.05187289841911834,
       "rel_gain": 2.2859500387362437,
       "rel_lo": 2.091991068249257,
       "rel_hi": 2.5037322767564016,
       "p": 1.2473631163680014e-86,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.08575228925086513,
       "gain": 0.06306023669498532,
       "rel_gain": 2.7789569295107936,
       "rel_lo": 2.571186800255458,
       "rel_hi": 2.991009617825791,
       "p": 3.419594043459545e-94,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.08527215338984362,
       "gain": 0.06258010083396379,
       "rel_gain": 2.757798162147674,
       "rel_lo": 2.5460916922942936,
       "rel_hi": 2.9786983460298604,
       "p": 2.1967663480462017e-92,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.0891439877205086,
       "gain": 0.0664519351646288,
       "rel_gain": 2.928423288329209,
       "rel_lo": 2.719344887830254,
       "rel_hi": 3.148183212645782,
       "p": 1.289217830758054e-98,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.0870451256851413,
       "gain": 0.06435307312926149,
       "rel_gain": 2.8359300231122875,
       "rel_lo": 2.622787609215699,
       "rel_hi": 3.0567798594196325,
       "p": 6.132630293564859e-98,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.04600200365515959,
       "gain": 0.023309951099279788,
       "rel_gain": 1.0272297334883382,
       "rel_lo": 0.8217632406213095,
       "rel_hi": 1.2625250613140024,
       "p": 6.02632740436689e-36,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.13896001511760706,
       "gain": 0.11626796256172725,
       "rel_gain": 5.123730534089595,
       "rel_lo": 4.8225591338644485,
       "rel_hi": 5.433549740220389,
       "p": 4.3065677552292794e-110,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_100",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.0294731101664141,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.11023262631820738,
       "gain": 0.08075951615179328,
       "rel_gain": 2.7401083800047092,
       "rel_lo": 2.5348015618478588,
       "rel_hi": 2.9456656945648145,
       "p": 1.5824395872551286e-101,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.12851004613926975,
       "gain": 0.09903693597285568,
       "rel_gain": 3.360247202065312,
       "rel_lo": 3.138310795284408,
       "rel_hi": 3.5881535488062957,
       "p": 9.779247627615777e-106,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.13044024209036287,
       "gain": 0.10096713192394877,
       "rel_gain": 3.425737268780179,
       "rel_lo": 3.191934857380868,
       "rel_hi": 3.661765313800148,
       "p": 1.987668031937151e-105,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.1357990777060937,
       "gain": 0.1063259675396796,
       "rel_gain": 3.6075584469820456,
       "rel_lo": 3.37951416594269,
       "rel_hi": 3.8396112346995968,
       "p": 3.9101588254210655e-108,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.1298877842352593,
       "gain": 0.10041467406884519,
       "rel_gain": 3.406992797905397,
       "rel_lo": 3.173131158936945,
       "rel_hi": 3.626905826266669,
       "p": 7.501290290211987e-108,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.05298119283020926,
       "gain": 0.023508082663795157,
       "rel_gain": 0.7976111964791435,
       "rel_lo": 0.6443043996733477,
       "rel_hi": 0.9701659777985792,
       "p": 1.0981930176378848e-43,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.25668544838055196,
       "gain": 0.22721233821413786,
       "rel_gain": 7.709140193594372,
       "rel_lo": 7.3236956228196926,
       "rel_hi": 8.125189750615842,
       "p": 3.048086071323098e-113,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_200",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.08927272089415514,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.16093471949285648,
       "gain": 0.07166199859870132,
       "rel_gain": 0.8027312025547679,
       "rel_lo": 0.7283952317894548,
       "rel_hi": 0.8809939992447008,
       "p": 2.1818471212413413e-72,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.18167494184488556,
       "gain": 0.09240222095073038,
       "rel_gain": 1.0350555021201346,
       "rel_lo": 0.9566790367847797,
       "rel_hi": 1.1154634458149495,
       "p": 5.330192823403888e-97,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.18485422245861452,
       "gain": 0.09558150156445938,
       "rel_gain": 1.0706686276290844,
       "rel_lo": 0.9887720799187832,
       "rel_hi": 1.1518646470537783,
       "p": 2.402229748145503e-96,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.1920725899420181,
       "gain": 0.10279986904786294,
       "rel_gain": 1.1515261103080532,
       "rel_lo": 1.0710960399738567,
       "rel_hi": 1.234678259297658,
       "p": 1.482228614132967e-99,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.1851115640232029,
       "gain": 0.09583884312904775,
       "rel_gain": 1.073551272652232,
       "rel_lo": 0.9895023175885691,
       "rel_hi": 1.1597064082635362,
       "p": 7.495527178216918e-95,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.07689942364815995,
       "gain": -0.012373297245995193,
       "rel_gain": -0.13860109921669586,
       "rel_lo": -0.21184729600969596,
       "rel_hi": -0.05869025385610611,
       "p": 9.370809534029421e-06,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.33282400110845267,
       "gain": 0.24355128021429753,
       "rel_gain": 2.7281713582255485,
       "rel_lo": 2.5805140685733985,
       "rel_hi": 2.8771832975638385,
       "p": 1.200341792049697e-113,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "overlap_at_500",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.19527567987134906,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.21829665909292179,
       "gain": 0.023020979221572712,
       "rel_gain": 0.11788963805804863,
       "rel_lo": 0.08423008473290364,
       "rel_hi": 0.15082734242421222,
       "p": 2.699844111761901e-11,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.23322582189125593,
       "gain": 0.037950142019906874,
       "rel_gain": 0.19434136419296594,
       "rel_lo": 0.1652124164266768,
       "rel_hi": 0.22356908135284032,
       "p": 1.0244617248662356e-33,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.2352582247444165,
       "gain": 0.039982544873067426,
       "rel_gain": 0.20474922888200214,
       "rel_lo": 0.17576020791489233,
       "rel_hi": 0.23467484836239552,
       "p": 1.8716453742050316e-38,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.2425490993995086,
       "gain": 0.04727341952815954,
       "rel_gain": 0.24208554572337976,
       "rel_lo": 0.20946436478048022,
       "rel_hi": 0.27491902922246436,
       "p": 3.2989170231539197e-42,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.23508172876754335,
       "gain": 0.03980604889619427,
       "rel_gain": 0.2038453990912702,
       "rel_lo": 0.17113675580136892,
       "rel_hi": 0.2372482222284679,
       "p": 5.459298589174822e-32,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.13855505379988353,
       "gain": -0.05672062607146554,
       "rel_gain": -0.2904643635543046,
       "rel_lo": -0.33430780534115573,
       "rel_hi": -0.24592518218293177,
       "p": 4.270810097436123e-38,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.3069104148100039,
       "gain": 0.11163473493865479,
       "rel_gain": 0.5716776150117703,
       "rel_lo": 0.533453738367654,
       "rel_hi": 0.61298271152845,
       "p": 1.0157183546003437e-112,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_N",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.18506945115147844,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.1915630258813373,
       "gain": 0.006493574729858908,
       "rel_gain": 0.035087231790318266,
       "rel_lo": 0.015887424335079198,
       "rel_hi": 0.05523807371277073,
       "p": 0.5305918534933871,
       "verdict": "tie"
      },
      "epi_grn": {
       "mean": 0.1981191235734552,
       "gain": 0.013049672421976811,
       "rel_gain": 0.07051229871155623,
       "rel_lo": 0.05277191883112248,
       "rel_hi": 0.09011485812139206,
       "p": 1.5376795781116893e-16,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.1994298001153343,
       "gain": 0.01436034896385588,
       "rel_gain": 0.07759437808081035,
       "rel_lo": 0.05873506381107326,
       "rel_hi": 0.09689479604599503,
       "p": 5.0290568233747894e-21,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.19879358461953606,
       "gain": 0.013724133468057674,
       "rel_gain": 0.07415666595793023,
       "rel_lo": 0.05505527767757857,
       "rel_hi": 0.09533902216436893,
       "p": 1.7470866623647855e-09,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.19754467578751286,
       "gain": 0.012475224636034442,
       "rel_gain": 0.06740834080619568,
       "rel_lo": 0.04790689139732115,
       "rel_hi": 0.08822620341661128,
       "p": 1.908689414666834e-09,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.1676306900385092,
       "gain": -0.017438761112969173,
       "rel_gain": -0.09422819922179178,
       "rel_lo": -0.11517181475730004,
       "rel_hi": -0.07309383693593517,
       "p": 5.4702459132508846e-40,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.17904246919431693,
       "gain": -0.006026981957161483,
       "rel_gain": -0.03256605517367871,
       "rel_lo": -0.05207888755290265,
       "rel_hi": -0.012834499719568453,
       "p": 1.1783575414003902e-39,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_50",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.022646546121725914,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.07372636262513904,
       "gain": 0.05107981650341314,
       "rel_gain": 2.2555234793357664,
       "rel_lo": 2.0587166808788058,
       "rel_hi": 2.4477771131200536,
       "p": 4.65281218714058e-90,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.08451612903225807,
       "gain": 0.06186958291053216,
       "rel_gain": 2.7319655093532216,
       "rel_lo": 2.522345438295592,
       "rel_hi": 2.941007640957136,
       "p": 1.1491028963451864e-96,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.08411568409343716,
       "gain": 0.06146913797171123,
       "rel_gain": 2.7142831247340165,
       "rel_lo": 2.4980583906386893,
       "rel_hi": 2.927256939622514,
       "p": 1.5991771532909755e-95,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.08814238042269189,
       "gain": 0.06549583430096598,
       "rel_gain": 2.892089325627129,
       "rel_lo": 2.6830742038738737,
       "rel_hi": 3.1076073706509146,
       "p": 1.298318745871349e-101,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.08560622914349278,
       "gain": 0.06295968302176685,
       "rel_gain": 2.7801008897055,
       "rel_lo": 2.5695219550374815,
       "rel_hi": 2.9836108897029106,
       "p": 9.539875640985866e-101,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.040422691879866524,
       "gain": 0.017776145758140603,
       "rel_gain": 0.7849384918385898,
       "rel_lo": 0.6503368203722258,
       "rel_hi": 0.9145895918413076,
       "p": 6.70795740642237e-36,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.13830923248053392,
       "gain": 0.11566268635880803,
       "rel_gain": 5.107299176533029,
       "rel_lo": 4.806888325423254,
       "rel_hi": 5.399068444865169,
       "p": 1.6803903576971336e-112,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_100",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.029544616484809726,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.1088987764182425,
       "gain": 0.07935415993343278,
       "rel_gain": 2.6859092916041907,
       "rel_lo": 2.4965705237302824,
       "rel_hi": 2.879161418275535,
       "p": 2.664989751943161e-109,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.12630700778642936,
       "gain": 0.09676239130161965,
       "rel_gain": 3.27512768193724,
       "rel_lo": 3.0501980144728242,
       "rel_hi": 3.5091226110847566,
       "p": 1.312334140417936e-110,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.12840934371523915,
       "gain": 0.09886472723042944,
       "rel_gain": 3.346285685626024,
       "rel_lo": 3.1081232852120415,
       "rel_hi": 3.574704580972586,
       "p": 1.454919444656055e-110,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.1339488320355951,
       "gain": 0.10440421555078537,
       "rel_gain": 3.533781377885358,
       "rel_lo": 3.314138932532302,
       "rel_hi": 3.776528626875457,
       "p": 1.6820912096539832e-116,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.12771968854282537,
       "gain": 0.09817507205801564,
       "rel_gain": 3.32294284843711,
       "rel_lo": 3.106149833857986,
       "rel_hi": 3.5517302919352947,
       "p": 4.099011444693483e-115,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.046573971078976636,
       "gain": 0.01702935459416692,
       "rel_gain": 0.5763945049996676,
       "rel_lo": 0.4911986540972106,
       "rel_hi": 0.657175879619757,
       "p": 5.650051006305747e-43,
       "verdict": "better"
      },
      "context_mean": {
       "mean": 0.2539043381535039,
       "gain": 0.22435972166869417,
       "rel_gain": 7.593929059260188,
       "rel_lo": 7.1822780331454705,
       "rel_hi": 7.986603770634257,
       "p": 3.558227610536457e-117,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_200",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.09006798925866587,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.15862625139043385,
       "gain": 0.06855826213176797,
       "rel_gain": 0.7611834425977446,
       "rel_lo": 0.6875047872570964,
       "rel_hi": 0.8345825333977313,
       "p": 2.2108607569405536e-74,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.17867630700778642,
       "gain": 0.08860831774912058,
       "rel_gain": 0.9837936705197974,
       "rel_lo": 0.9085470123624075,
       "rel_hi": 1.060375613808986,
       "p": 3.3949798721198764e-102,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.18214228961885087,
       "gain": 0.09207430036018502,
       "rel_gain": 1.0222755178397203,
       "rel_lo": 0.9462052524885505,
       "rel_hi": 1.1003499589881458,
       "p": 1.1082250180509284e-101,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.1885928809788654,
       "gain": 0.09852489172019956,
       "rel_gain": 1.093894651486516,
       "rel_lo": 1.0171800061066827,
       "rel_hi": 1.1728033077569926,
       "p": 4.266454647153236e-106,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.1819187986651835,
       "gain": 0.09185080940651767,
       "rel_gain": 1.0197941595291056,
       "rel_lo": 0.9398106498272524,
       "rel_hi": 1.0987668413325231,
       "p": 2.3251783489490484e-99,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.06994994438264739,
       "gain": -0.02011804487601847,
       "rel_gain": -0.2233650938763776,
       "rel_lo": -0.2793896265328734,
       "rel_hi": -0.17008928324149658,
       "p": 8.566678536492352e-08,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.3265072302558398,
       "gain": 0.23643924099717398,
       "rel_gain": 2.625119567376431,
       "rel_lo": 2.470686594262104,
       "rel_hi": 2.775081980062204,
       "p": 3.725999646743369e-119,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "precision_at_500",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.20073683427542638,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.2108811684316923,
       "gain": 0.010144334156265927,
       "rel_gain": 0.05053548937783446,
       "rel_lo": 0.02254449933035142,
       "rel_hi": 0.07894275423891993,
       "p": 7.791346631847924e-06,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.2242386690065719,
       "gain": 0.02350183473114553,
       "rel_gain": 0.11707783883300263,
       "rel_lo": 0.0932918407637994,
       "rel_hi": 0.1411413767921399,
       "p": 4.51315190969892e-25,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.22650374502463563,
       "gain": 0.025766910749209244,
       "rel_gain": 0.12836164743863132,
       "rel_lo": 0.10267494539743285,
       "rel_hi": 0.153155196347524,
       "p": 1.6303868671294592e-30,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.23105210619857583,
       "gain": 0.030315271923149485,
       "rel_gain": 0.15101997614226895,
       "rel_lo": 0.1241010045676771,
       "rel_hi": 0.17764762690602132,
       "p": 4.509587638642097e-32,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.22476782090094405,
       "gain": 0.024030986625517673,
       "rel_gain": 0.1197138866529364,
       "rel_lo": 0.09270524859370571,
       "rel_hi": 0.1463599458468507,
       "p": 7.2296242784364e-23,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.13435376253651302,
       "gain": -0.06638307173891335,
       "rel_gain": -0.3306970142202734,
       "rel_lo": -0.36735024913983416,
       "rel_hi": -0.29411806931211776,
       "p": 1.2206374048692574e-45,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.28339043381535034,
       "gain": 0.08265359953992402,
       "rel_gain": 0.4117510363171162,
       "rel_lo": 0.3796710388376718,
       "rel_hi": 0.4439906019436141,
       "p": 3.62155527668374e-122,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_spearman_sig",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.4530433959434044,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.2710744442342726,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_grn": {
       "mean": 0.44000552114945063,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_grn_shuffled": {
       "mean": 0.44371264878113686,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_direct": {
       "mean": 0.23485112182976395,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "epi_direct_shuffled": {
       "mean": 0.2420599987509857,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "perturb_mean": {
       "mean": 0.3494869244217761,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "context_mean": {
       "mean": -0.15161371924108608,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_direction_match",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.6626083712046169,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.7445964308590257,
       "gain": 0.0819880596544089,
       "rel_gain": 0.12373532122052011,
       "rel_lo": 0.09727091934484261,
       "rel_hi": 0.14869333808815813,
       "p": 1.258725858155383e-18,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.7574013427004886,
       "gain": 0.09479297149587187,
       "rel_gain": 0.14306032886898032,
       "rel_lo": 0.11987774599789515,
       "rel_hi": 0.16734067869637445,
       "p": 2.7360069379346087e-35,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.7548918373023159,
       "gain": 0.09228346609769895,
       "rel_gain": 0.1392730157180603,
       "rel_lo": 0.11558294865671259,
       "rel_hi": 0.16355579740267945,
       "p": 4.191680638872447e-32,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.7695580846711024,
       "gain": 0.10694971346648564,
       "rel_gain": 0.1614071269157857,
       "rel_lo": 0.13805011638587317,
       "rel_hi": 0.1861532463828203,
       "p": 1.455161988216294e-46,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.7620751123896775,
       "gain": 0.09946674118506073,
       "rel_gain": 0.15011392174872612,
       "rel_lo": 0.12498268541057088,
       "rel_hi": 0.1765422397714131,
       "p": 1.0674369958159165e-37,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.6084786915465059,
       "gain": -0.054129679658111045,
       "rel_gain": -0.08169181376278677,
       "rel_lo": -0.10798289224057932,
       "rel_hi": -0.0539334941962415,
       "p": 2.0875877669886507e-12,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.8135057435340771,
       "gain": 0.15089737232946038,
       "rel_gain": 0.22773236633749452,
       "rel_lo": 0.20292313912442286,
       "rel_hi": 0.2524563755094412,
       "p": 7.057556424346996e-91,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_spearman_lfc_sig",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.38439983887210644,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.48735033482314866,
       "gain": 0.10295049595104218,
       "rel_gain": 0.26782138164551833,
       "rel_lo": 0.18071892242826193,
       "rel_hi": 0.3596429566672478,
       "p": 0.037182298283490865,
       "verdict": "better"
      },
      "epi_grn": {
       "mean": 0.5111786789931974,
       "gain": 0.1267788401210909,
       "rel_gain": 0.32980981597984343,
       "rel_lo": 0.24921589094707006,
       "rel_hi": 0.4140422065164449,
       "p": 5.7713944531926835e-05,
       "verdict": "better"
      },
      "epi_grn_shuffled": {
       "mean": 0.5040074182459849,
       "gain": 0.11960757937387852,
       "rel_gain": 0.3111540830111355,
       "rel_lo": 0.22725727962249803,
       "rel_hi": 0.39476032514766707,
       "p": 0.0005734503174237406,
       "verdict": "better"
      },
      "epi_direct": {
       "mean": 0.5296090786623648,
       "gain": 0.14520923979025832,
       "rel_gain": 0.37775572491478293,
       "rel_lo": 0.2883238029392724,
       "rel_hi": 0.4702587151652182,
       "p": 1.5315120714184592e-06,
       "verdict": "better"
      },
      "epi_direct_shuffled": {
       "mean": 0.5153822184200066,
       "gain": 0.1309823795479002,
       "rel_gain": 0.34074514685600404,
       "rel_lo": 0.2535956291415488,
       "rel_hi": 0.42457896683273205,
       "p": 8.439353820678094e-05,
       "verdict": "better"
      },
      "perturb_mean": {
       "mean": 0.2239994804057546,
       "gain": -0.1604003584663518,
       "rel_gain": -0.4172747806996833,
       "rel_lo": -0.5140606132958557,
       "rel_hi": -0.3197131573207207,
       "p": 3.1721963399952395e-17,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.6471480513225147,
       "gain": 0.26274821245040825,
       "rel_gain": 0.6835284146355408,
       "rel_lo": 0.5956214222284442,
       "rel_hi": 0.771672702751697,
       "p": 7.518359388661504e-90,
       "verdict": "better"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "de_sig_genes_recall",
     "higher": true,
     "headline": false,
     "values": {
      "state": {
       "mean": 0.6571260445570182,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.6237210926041035,
       "gain": -0.03340495195291478,
       "rel_gain": -0.050834923116513706,
       "rel_lo": -0.08367281055097833,
       "rel_hi": -0.015131017477832128,
       "p": 1.7977266576407254e-06,
       "verdict": "worse"
      },
      "epi_grn": {
       "mean": 0.5987995489949093,
       "gain": -0.0583264955621089,
       "rel_gain": -0.0887599815061781,
       "rel_lo": -0.12204696591667938,
       "rel_hi": -0.05664605579034874,
       "p": 3.611842663726815e-14,
       "verdict": "worse"
      },
      "epi_grn_shuffled": {
       "mean": 0.6090710087250595,
       "gain": -0.048055035831958894,
       "rel_gain": -0.07312909940185638,
       "rel_lo": -0.10538905638666245,
       "rel_hi": -0.039467810333134394,
       "p": 7.888667886315392e-12,
       "verdict": "worse"
      },
      "epi_direct": {
       "mean": 0.6662708508351269,
       "gain": 0.009144806278108613,
       "rel_gain": 0.01391636559508657,
       "rel_lo": -0.01840370000242521,
       "rel_hi": 0.047167949130014514,
       "p": 0.01828260684939878,
       "verdict": "tie"
      },
      "epi_direct_shuffled": {
       "mean": 0.6272541765916738,
       "gain": -0.029871867965344464,
       "rel_gain": -0.0454583534053679,
       "rel_lo": -0.07866782876226323,
       "rel_hi": -0.011443211057069337,
       "p": 9.795524392926461e-08,
       "verdict": "worse"
      },
      "perturb_mean": {
       "mean": 0.41952880771177975,
       "gain": -0.23759723684523854,
       "rel_gain": -0.3615702631378849,
       "rel_lo": -0.3953798358497625,
       "rel_hi": -0.32619728849303675,
       "p": 1.4211279109320814e-68,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.6663433922413845,
       "gain": 0.00921734768436613,
       "rel_gain": 0.014026757515873121,
       "rel_lo": -0.02439966547155835,
       "rel_hi": 0.0525603454605342,
       "p": 0.2096294365459327,
       "verdict": "tie"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "pr_auc",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.21393691668401818,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.19365834889776912,
       "gain": -0.020278567786249046,
       "rel_gain": -0.09478760421793031,
       "rel_lo": -0.1052670375523757,
       "rel_hi": -0.08424643944728041,
       "p": 5.752447615329144e-57,
       "verdict": "worse"
      },
      "epi_grn": {
       "mean": 0.20826999596803406,
       "gain": -0.005666920715984096,
       "rel_gain": -0.026488746326815856,
       "rel_lo": -0.036464677829969094,
       "rel_hi": -0.016678725165424242,
       "p": 4.8158406357908277e-08,
       "verdict": "worse"
      },
      "epi_grn_shuffled": {
       "mean": 0.21086569564029722,
       "gain": -0.003071221043720922,
       "rel_gain": -0.014355732013549921,
       "rel_lo": -0.024141726775282504,
       "rel_hi": -0.004153643673753772,
       "p": 0.0019590025235106303,
       "verdict": "worse"
      },
      "epi_direct": {
       "mean": 0.20533284638896238,
       "gain": -0.008604070295055803,
       "rel_gain": -0.04021779143318165,
       "rel_lo": -0.05002463863299949,
       "rel_hi": -0.030824369865726706,
       "p": 2.131830297678709e-14,
       "verdict": "worse"
      },
      "epi_direct_shuffled": {
       "mean": 0.20643468170264945,
       "gain": -0.007502234981368735,
       "rel_gain": -0.035067510075642676,
       "rel_lo": -0.045631013712071206,
       "rel_hi": -0.024611609480847636,
       "p": 4.5246434353565844e-11,
       "verdict": "worse"
      },
      "perturb_mean": {
       "mean": 0.17432328186374638,
       "gain": -0.039613634820271804,
       "rel_gain": -0.185165026374483,
       "rel_lo": -0.19772168181756863,
       "rel_hi": -0.17218239992600373,
       "p": 8.579904766047721e-120,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.16568604486984415,
       "gain": -0.04825087181417405,
       "rel_gain": -0.22553784808182456,
       "rel_lo": -0.23913876076555513,
       "rel_hi": -0.21205206228590837,
       "p": 2.627868690725402e-137,
       "verdict": "worse"
      }
     }
    },
    {
     "family": "differential expression",
     "family_label": "差异表达",
     "metric": "roc_auc",
     "higher": true,
     "headline": true,
     "values": {
      "state": {
       "mean": 0.5571560556703036,
       "gain": null,
       "rel_gain": null,
       "rel_lo": null,
       "rel_hi": null,
       "p": null,
       "verdict": null
      },
      "backbone": {
       "mean": 0.503707784156151,
       "gain": -0.05344827151415265,
       "rel_gain": -0.09593052246349558,
       "rel_lo": -0.10995163653725973,
       "rel_hi": -0.08102397478269625,
       "p": 2.289006214078634e-48,
       "verdict": "worse"
      },
      "epi_grn": {
       "mean": 0.53288078870628,
       "gain": -0.024275266964023597,
       "rel_gain": -0.04356995982897197,
       "rel_lo": -0.05930994421578044,
       "rel_hi": -0.02764013759063591,
       "p": 5.5375569299500044e-14,
       "verdict": "worse"
      },
      "epi_grn_shuffled": {
       "mean": 0.5348795325656321,
       "gain": -0.022276523104671448,
       "rel_gain": -0.03998255583504517,
       "rel_lo": -0.05494412922710008,
       "rel_hi": -0.023991322450852757,
       "p": 2.2240085723919086e-09,
       "verdict": "worse"
      },
      "epi_direct": {
       "mean": 0.5275853099176169,
       "gain": -0.02957074575268665,
       "rel_gain": -0.053074440189132766,
       "rel_lo": -0.06645240074917627,
       "rel_hi": -0.038542591744485724,
       "p": 7.8525009608762e-18,
       "verdict": "worse"
      },
      "epi_direct_shuffled": {
       "mean": 0.5294074298655189,
       "gain": -0.027748625804784724,
       "rel_gain": -0.049804045962312825,
       "rel_lo": -0.0648333366863231,
       "rel_hi": -0.03433899844924494,
       "p": 7.106189616801518e-17,
       "verdict": "worse"
      },
      "perturb_mean": {
       "mean": 0.474393586913314,
       "gain": -0.08276246875698962,
       "rel_gain": -0.14854450187644413,
       "rel_lo": -0.16317704718669931,
       "rel_hi": -0.13429594410727802,
       "p": 2.5535373849210415e-78,
       "verdict": "worse"
      },
      "context_mean": {
       "mean": 0.41929846613856236,
       "gain": -0.13785758953174124,
       "rel_gain": -0.24743083760596923,
       "rel_lo": -0.2597760059094684,
       "rel_hi": -0.23403851322499292,
       "p": 1.7793745581922553e-122,
       "verdict": "worse"
      }
     }
    }
   ]
  }
 }
};
