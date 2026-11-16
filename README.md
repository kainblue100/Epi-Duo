# Epi-Duo

两条把表观基因组证据送进虚拟细胞模型的路，接在同一套 STATE 风格的集合到集合骨架上：

| 模型 | 先验怎么读 | 结构对照 |
| --- | --- | --- |
| **Epi-GRN** | 公共表观数据 → 候选调控网络 → 消息传递 | 保持度数的双边交换 |
| **Epi-Direct** | 同一批证据 → 每基因 ≤24 个顺式元件 token → 注意力池化 | 基因间重排 token 集合 |
| **骨架** | 无先验 | — |

基准、训练预算与评分协议对齐 [STATE](https://github.com/ArcInstitute/state) / [cell-eval](https://github.com/ArcInstitute/cell-eval)。原理说明页（交互、真实计算标注）见 [`docs/`](docs/index.html)。

> 本仓库只发布代码、汇总表与说明。不包含单细胞矩阵、细胞条码、逐细胞预测或模型权重。

## 安装

```bash
# 核心训练依赖
pip install -e .

# cell-eval 评分
pip install -e ".[eval]"

# 可选：同一基准上跑官方 STATE
pip install -e ".[state]"
# 若 PyPI 上的 arc-state 版本不够新，请从 STATE 仓库安装对应提交。
```

需要 Python ≥ 3.10、CUDA 版 PyTorch。CLI 入口：

```bash
epiduo --help
```

## CLI 用法

流程与 STATE 的 `tx` 子命令对称：`prep → prior → train → predict → eval → compare`。

### 1. 准备基准

输入是 scPerturb 的 Replogle K562 essential / RPE1 原始计数，以及 STATE 预印本的 `replogle_tomls/{k562,rpe1}.toml` 测试列表。

```bash
epiduo prep \
  --k562 ReplogleWeissman2022_K562_essential.h5ad \
  --rpe1 ReplogleWeissman2022_rpe1.h5ad \
  --paper-k562 replogle_tomls/k562.toml \
  --paper-rpe1 replogle_tomls/rpe1.toml \
  --output benchmark/
```

写出：

- `data/{k562,rpe1}.h5ad` — log1p(CP10k)，`obsm["X_hvg"]` 为 2000 个 HVG
- `splits/{k562,rpe1}.toml` — 供 `state tx train` 与 `epiduo train` 共用的 few-shot 划分
- `genes.csv` / `targets.csv` / `manifest.json`

HVG 只在「两个划分下都属训练集」的细胞上、以固定种子抽 10 万细胞用 scanpy seurat flavour 选定。合格扰动需在两个细胞系都 ≥20 个细胞。

### 2. 构建表观先验

数据约定与 [Epi-C3](https://github.com/kainblue100/Epi-C3) 相同：ENCODE K562 ATAC / TF ChIP（只计 ATAC 峰内）/ Hi-C loops / WGBS，GENCODE v44。

```bash
epiduo prior \
  --benchmark benchmark/ \
  --chip-selection selected-files.json \
  --chip-dir verified-peaks/ \
  --atac ENCFF855PCP.bed.gz \
  --loops ENCFF134HIZ.bedpe.gz ENCFF440HUR.bedpe.gz ENCFF693XIL.bedpe.gz ENCFF757IIX.bedpe.gz \
  --wgbs ENCFF867JRG.bed.gz ENCFF721JMB.bed.gz \
  --gencode gencode.v44.annotation.gtf.gz \
  --output prior/
```

写出 `grn.npz`、`direct.npz`、`nodes.csv`、`summary.json`（含打乱后仍与真实图重合的边数）。

### 3. 训练

```bash
# 模型 A
epiduo train --benchmark benchmark/ --prior prior/ --split k562 --model grn \
  --output runs/k562/epi-grn-s42 --max-steps 20000 --seed 42

# 模型 B
epiduo train --benchmark benchmark/ --prior prior/ --split k562 --model direct \
  --output runs/k562/epi-direct-s42

# 无先验骨架
epiduo train --benchmark benchmark/ --split k562 --model none \
  --output runs/k562/backbone-s42

# 打乱对照
epiduo train --benchmark benchmark/ --prior prior/ --split k562 --model grn \
  --shuffled-prior --output runs/k562/epi-grn-shuffled-s42
```

默认：batch 16、cell set 128、hidden 512、4 层、8 头、lr 1e-4、weight decay 5e-4、每 1000 步验证。写出 `final.pt` / `best.pt` / `history.json`。

一键跑完整基准（含官方 STATE 与两个均值基线）可用 `scripts/run_benchmark.sh`。

### 4. 预测

```bash
epiduo predict --run runs/k562/epi-grn-s42 --checkpoint final.pt
```

对留出上下文的对照细胞与每个测试扰动各写一格预测（随机配对同上下文对照，集合长度与训练一致），裁到 `[0, 14]`，得到 `eval_final/adata_{pred,real}.h5ad`。

### 5. 评分（与 `state tx predict` 同协议）

```bash
epiduo eval \
  --pred runs/k562/epi-grn-s42/eval_final/adata_pred.h5ad \
  --real runs/k562/epi-grn-s42/eval_final/adata_real.h5ad \
  --genes benchmark/genes.csv \
  --output runs/k562/epi-grn-s42/cell-eval \
  --profile full
```

内部调用 cell-eval 0.8.x：`pdex_kwargs={"is_log1p": True, "geometric_mean": True}`，并跳过 `pearson_edistance`、`clustering_agreement`。

### 6. 比较

```bash
epiduo compare --reference state --output compare/k562 \
  --arm state=runs/k562/state_sm-s42/cell-eval \
  --arm backbone=runs/k562/backbone-s42/cell-eval \
  --arm epi_grn=runs/k562/epi-grn-s42/cell-eval \
  --arm epi_direct=runs/k562/epi-direct-s42/cell-eval \
  --arm epi_grn_shuffled=runs/k562/epi-grn-shuffled-s42/cell-eval \
  --arm epi_direct_shuffled=runs/k562/epi-direct-shuffled-s42/cell-eval \
  --arm perturb_mean=runs/k562/perturb_mean-s42/cell-eval \
  --arm context_mean=runs/k562/context_mean-s42/cell-eval
```

同一臂多个种子时，把多个 `cell-eval` 目录用逗号拼在一起；先按扰动对种子取平均，再做配对自助区间与 Wilcoxon。

### 在同一基准上跑 STATE

`epiduo prep` 写出的 TOML 可直接喂给官方 CLI（与本仓库 `scripts/run_state.sh` 相同）：

```bash
state tx train model=state_sm \
  data.kwargs.toml_config_path=benchmark/splits/k562.toml \
  data.kwargs.embed_key=X_hvg data.kwargs.output_space=embedding \
  data.kwargs.pert_col=target_gene data.kwargs.cell_type_key=cell_type \
  data.kwargs.batch_col=gem_group data.kwargs.control_pert=non-targeting \
  training.batch_size=16 training.max_steps=20000 \
  model.kwargs.cell_set_len=128

state tx predict --output-dir runs/k562/state_sm-s42 --checkpoint final.ckpt --predict-only
```

## 划分配置

每个 `splits/*.toml` 描述一个「留出一个细胞系」的 few-shot 设定：该细胞系上 STATE 预印本测试列表 ∩ 合格扰动为 test；另抽 100 个扰动作 val；其余 few-shot 训练扰动来自留出细胞系，另一细胞系的全部合格扰动也在训练集。对照细胞（`non-targeting`）出现在 train / val / test。

## 结果（seed 42 · 20 000 步）

完整表在 [`results/*/comparison/`](results/)。下面摘录均值（↑ 越高越好，↓ 越低越好）。**单一种子、固定步数预算；不是论文规模训练。**

### 留出 K562（表观与测试细胞系一致）

| 指标 | STATE | 骨架 | Epi-GRN | Epi-Direct | GRN 打乱 | context_mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pearson_delta ↑ | 0.064 | 0.245 | **0.256** | 0.247 | 0.263 | 0.271 |
| mse ↓ | 0.039 | 0.005 | **0.005** | 0.005 | 0.005 | 0.004 |
| discrimination_score_l1 ↑ | 0.537 | 0.630 | 0.644 | 0.631 | **0.653** | 0.502 |
| overlap_at_N ↑ | 0.064 | 0.097 | 0.098 | 0.096 | 0.100 | 0.098 |
| de_direction_match ↑ | 0.556 | 0.707 | 0.718 | 0.707 | **0.721** | 0.697 |

### 留出 RPE1（K562 表观跨细胞系迁移）

| 指标 | STATE | 骨架 | Epi-GRN | Epi-Direct | Direct 打乱 | context_mean |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| pearson_delta ↑ | 0.331 | 0.439 | 0.456 | **0.479** | 0.467 | 0.550 |
| mse ↓ | 0.040 | 0.014 | **0.013** | 0.013 | 0.014 | 0.013 |
| discrimination_score_l1 ↑ | 0.625 | 0.613 | **0.652** | 0.638 | 0.627 | 0.501 |
| overlap_at_N ↑ | 0.204 | 0.242 | 0.253 | 0.263 | 0.255 | **0.301** |
| de_direction_match ↑ | 0.663 | 0.745 | 0.757 | 0.770 | 0.762 | **0.814** |

### 读数时请注意

1. **相对 STATE**：在本预算下 Epi-Duo 与无先验骨架在多数指标上优于 `state_sm`；STATE 官方训练更长、容量更大，这里不对齐论文声明。
2. **真实先验 vs 打乱**：打乱臂经常接近甚至略好——不能声称「网络拓扑已被稳定利用」。更稳妥的结论是：接口能接上，增益需在更大预算 / 更广因子覆盖下再检验。
3. **`context_mean`**：在若干表达与 DE 指标上仍是强基线；区分分数通常较弱。
4. **RPE1**：先验来自 K562，跨细胞系迁移本身就是难题。
5. **因子覆盖**：源因子 25 个，远不是全 TF 组。

交互版图表与子图见原理页：<https://kainblue100.github.io/Epi-Duo/>（启用 GitHub Pages 的 `docs/` 后）。

## 进度面板（可选）

本机只读轮询服务器工作目录：

```bash
python dashboard/server.py --host user@server --work /path/to/epi-duo-work
# 打开 http://127.0.0.1:8787/
```

## 许可与引用

- 本仓库代码：MIT（见 [`LICENSE`](LICENSE)）
- STATE / cell-eval / cell-load：请遵循其各自许可（STATE 模型权重为非商业许可）
- 表观与扰动数据：ENCODE、GENCODE、Replogle et al. / scPerturb；使用时请引用原始来源

若引用本仓库，请同时引用 STATE、cell-eval 与所用 ENCODE 实验。

## 相关链接

- [Arc Institute / STATE](https://github.com/ArcInstitute/state)
- [Arc Institute / cell-eval](https://github.com/ArcInstitute/cell-eval)
- [kainblue100 / Epi-C3](https://github.com/kainblue100/Epi-C3)
- [kainblue100 / virtual-cell-explainer](https://github.com/kainblue100/virtual-cell-explainer)
