/* ============================================================
   Epi-Duo 原理说明 · 交互部分

   数据来源（window.EPIDUO，由 scripts/build_site_data.py 生成）：
     example  一个真实基因的顺式元件 token、候选边和训练后的注意力
     prior    两种先验的汇总计数
     results  cell-eval 的实测结果
   三处是真实计算：
     图 3  消息传递：按发送者取平均的归一化邻接传播，以及保持度数的换边
     图 4  注意力池化：softmax 打分与加权求和
     图 5  结果：全部来自实测 CSV，没有手填数字
   其余（页首背景、图 2 结构图）是示意图。
   ============================================================ */
(function () {
  'use strict';

  var D = window.EPIDUO || {};
  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var C = {
    ctl: '#2fc7bd', pert: '#f2a13c', ink: '#0b0e13', ink9: '#07090c', grid: '#212833',
    line: '#2e3745', text: '#eef2f6', soft: '#aeb8c4', mut: '#7c8798', dim: '#414c5e'
  };
  var VIRIDIS = [[68, 1, 84], [59, 82, 139], [33, 145, 140], [94, 201, 98], [253, 231, 37]];
  var REL = {
    tf_promoter: { color: '#f2a13c', label: '因子结合启动子' },
    tf_distal: { color: '#e0603c', label: '因子结合环连远端元件' },
    promoter_contact: { color: '#2fc7bd', label: '启动子-启动子接触' },
    shared_element: { color: '#5ec962', label: '共用远端元件' }
  };

  function viridis(t) {
    t = Math.max(0, Math.min(1, t)) * (VIRIDIS.length - 1);
    var i = Math.min(Math.floor(t), VIRIDIS.length - 2), f = t - i;
    var a = VIRIDIS[i], b = VIRIDIS[i + 1];
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * f) + ',' + Math.round(a[1] + (b[1] - a[1]) * f) + ',' +
      Math.round(a[2] + (b[2] - a[2]) * f) + ')';
  }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
  }
  function setup(canvas) {
    if (!canvas) return null;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var rect = canvas.getBoundingClientRect();
    var w = Math.max(rect.width, 240), h = Math.max(rect.height, 120);
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    var g = canvas.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g: g, w: w, h: h };
  }
  var REDRAWS = [];
  function redrawOnResize(fn) { REDRAWS.push(fn); }
  (function () {
    var t;
    function all() { REDRAWS.forEach(function (f) { try { f(); } catch (e) { /* keep the other figures alive */ } }); }
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(all, 160); });
    window.addEventListener('load', function () { setTimeout(all, 30); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(function () { setTimeout(all, 30); });
  })();
  function rng(seed) {
    var s = seed >>> 0;
    return function () { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  }
  function $(id) { return document.getElementById(id); }
  function font(g, size, weight) {
    g.font = (weight || 400) + ' ' + size + 'px "IBM Plex Mono", ui-monospace, Menlo, Consolas, monospace';
  }
  function press(buttons, active) {
    buttons.forEach(function (b) { if (b) b.setAttribute('aria-pressed', b === active ? 'true' : 'false'); });
  }
  function fmt(v, digits) {
    if (v === null || v === undefined || !isFinite(v)) return '未定义';
    return Number(v).toFixed(digits === undefined ? 3 : digits);
  }
  function pointer(canvas, event) {
    var r = canvas.getBoundingClientRect();
    return { x: event.clientX - r.left, y: event.clientY - r.top };
  }

  /* ============================================================
     页首背景：左侧连成网，右侧排成 token（示意）
     ============================================================ */
  (function hero() {
    var cv = $('heroField');
    if (!cv) return;
    var r = rng(11), ctx, W, H, pts = [];
    function build() {
      var s = setup(cv); if (!s) return;
      ctx = s.g; W = s.w; H = s.h; pts = [];
      for (var i = 0; i < 70; i++) pts.push({ x: r() * W, y: r() * H, vx: (r() - .5) * .12, vy: (r() - .5) * .12 });
    }
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < pts.length; i++) {
        var p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > W) p.vx *= -1;
        if (p.y < 0 || p.y > H) p.vy *= -1;
        var network = p.x < W * 0.5;
        if (network) {
          for (var j = i + 1; j < pts.length; j++) {
            var q = pts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.sqrt(dx * dx + dy * dy);
            if (q.x < W * 0.5 && d < 110) {
              ctx.strokeStyle = 'rgba(242,161,60,' + (0.16 * (1 - d / 110)) + ')';
              ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
            }
          }
          ctx.fillStyle = 'rgba(242,161,60,.32)';
          ctx.beginPath(); ctx.arc(p.x, p.y, 1.8, 0, 6.2832); ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(47,199,189,.26)';
          for (var k = 0; k < 4; k++) ctx.fillRect(p.x + k * 7, p.y, 5, 9);
        }
      }
      if (!REDUCED) requestAnimationFrame(frame);
    }
    build(); frame(); redrawOnResize(function () { build(); if (REDUCED) frame(); });
  })();

  /* ============================================================
     图 1：一个真实基因座的证据，以及两种读法
     ============================================================ */
  (function locus() {
    var cv = $('locus'), ex = D.example;
    if (!cv || !ex) return;
    var F = ex.features, T = ex.tokens;
    var ix = {}; F.forEach(function (name, i) { ix[name] = i; });
    var chip = F.map(function (n, i) { return n.indexOf('chip_') === 0 ? i : -1; }).filter(function (i) { return i >= 0; });
    var mode = 'raw', hover = -1, hit = [];
    var buttons = [$('locusRaw'), $('locusGrn'), $('locusDirect')];

    function factors(t) { return chip.filter(function (i) { return t[i] > 0; }).map(function (i) { return F[i].slice(5); }); }
    function kind(t) { return t[ix.is_promoter] ? 'promoter' : t[ix.is_loop_linked] ? 'loop' : 'near'; }
    function bp(t) {
      var d = Math.round(Math.pow(10, t[ix.abs_distance] * 6.5) - 1);
      return (t[ix.signed_distance] < 0 ? '−' : '+') + (d >= 1000 ? (d / 1000).toFixed(1) + ' kb' : d + ' bp');
    }

    function draw() {
      var s = setup(cv); if (!s) return;
      var g = s.g, W = s.w, H = s.h;
      g.clearRect(0, 0, W, H);
      var top = 34, base = Math.round(H * (mode === 'raw' ? 0.62 : 0.46)), mid = W / 2, half = W / 2 - 34;
      function X(sd) { return mid + sd * half; }

      // axis
      g.strokeStyle = C.line; g.lineWidth = 1;
      g.beginPath(); g.moveTo(24, base); g.lineTo(W - 24, base); g.stroke();
      font(g, 10.5); g.fillStyle = C.mut; g.textAlign = 'center';
      [[1e3, '1 kb'], [1e4, '10 kb'], [1e5, '100 kb'], [1e6, '1 Mb']].forEach(function (tick) {
        var sd = Math.log(1 + tick[0]) / Math.LN10 / 6.5;
        [-1, 1].forEach(function (sign) {
          g.beginPath(); g.moveTo(X(sign * sd), base); g.lineTo(X(sign * sd), base + 5); g.stroke();
          g.fillText((sign < 0 ? '−' : '+') + tick[1], X(sign * sd), base + 18);
        });
      });
      g.fillStyle = C.pert; g.fillRect(mid - 1, base - 9, 2, 18);
      font(g, 11, 600); g.fillText('TSS · ' + ex.gene, mid, base + 34);
      font(g, 10.5); g.fillStyle = C.mut; g.textAlign = 'left';
      g.fillText('上游', 26, base - 8); g.textAlign = 'right'; g.fillText('下游（对数距离）', W - 26, base - 8);

      // elements
      hit = [];
      T.forEach(function (t, i) {
        var x = X(t[ix.signed_distance]), h = 14 + t[ix.accessibility] * (base - top - 44), k = kind(t);
        var used = mode !== 'grn' || k !== 'near';
        g.globalAlpha = used ? 1 : 0.22;
        if (k === 'loop') {
          g.strokeStyle = hexA(C.ctl, .8); g.lineWidth = 1.4;
          g.beginPath(); g.moveTo(x, base - h);
          g.quadraticCurveTo((x + mid) / 2, top - 26, mid, base - 10); g.stroke();
        }
        g.fillStyle = t[ix.methylation_observed] ? viridis(t[ix.methylation]) : C.dim;
        g.fillRect(x - 4, base - h, 8, h);
        if (k === 'promoter') { g.fillStyle = C.pert; g.fillRect(x - 5, base + 1, 10, 3); }
        var n = factors(t).length;
        for (var d = 0; d < Math.min(n, 8); d++) {
          g.fillStyle = C.text;
          g.beginPath(); g.arc(x, base - h - 6 - d * 5, 1.7, 0, 6.2832); g.fill();
        }
        if (i === hover) { g.strokeStyle = C.text; g.lineWidth = 1.5; g.strokeRect(x - 6.5, base - h - 2.5, 13, h + 5); }
        g.globalAlpha = 1;
        hit.push({ x: x, i: i });
      });

      // lower half: what each model receives
      var y0 = base + 54;
      if (mode === 'grn') {
        var prom = {}, dist = {};
        T.forEach(function (t) {
          var k = kind(t);
          factors(t).forEach(function (f) { if (k === 'promoter') prom[f] = 1; else if (k === 'loop') dist[f] = 1; });
        });
        var names = Object.keys(prom).concat(Object.keys(dist).filter(function (f) { return !prom[f]; }));
        var gx = mid, gy = H - 30;
        font(g, 10.5); g.textAlign = 'center';
        names.forEach(function (f, i) {
          var x = 40 + (W - 80) * (names.length === 1 ? 0.5 : i / (names.length - 1)), rel = prom[f] ? 'tf_promoter' : 'tf_distal';
          g.strokeStyle = hexA(REL[rel].color, .75); g.lineWidth = 1.3;
          g.beginPath(); g.moveTo(x, y0 + 14); g.lineTo(gx, gy - 12); g.stroke();
          g.fillStyle = REL[rel].color;
          g.beginPath(); g.arc(x, y0 + 8, 5, 0, 6.2832); g.fill();
          g.fillStyle = C.soft; g.fillText(f, x, y0 - 4);
        });
        g.fillStyle = C.pert; g.beginPath(); g.arc(gx, gy - 4, 7, 0, 6.2832); g.fill();
        g.fillStyle = C.text; font(g, 11, 600); g.fillText(ex.gene, gx, gy + 16);
      } else if (mode === 'direct') {
        var cols = F.length, rows = T.length, cw = Math.min(16, (W - 150) / cols), ch = Math.min(12, (H - y0 - 22) / rows);
        var x0 = (W - cw * cols) / 2 + 30;
        font(g, 10); g.textAlign = 'right';
        T.forEach(function (t, r) {
          g.fillStyle = r === hover ? C.text : C.mut;
          g.fillText('token ' + (r + 1), x0 - 8, y0 + r * ch + ch * 0.8);
          for (var c = 0; c < cols; c++) {
            var v = c === ix.signed_distance ? Math.abs(t[c]) : t[c];
            g.fillStyle = viridis(v);
            g.fillRect(x0 + c * cw, y0 + r * ch, cw - 1, ch - 1);
          }
        });
        g.textAlign = 'left'; g.fillStyle = C.mut;
        g.fillText('7 个位置/染色质特征', x0, y0 + rows * ch + 13);
        g.fillText(chip.length + ' 个因子结合位', x0 + 7 * cw + 4, y0 + rows * ch + 13);
        g.strokeStyle = C.line; g.beginPath(); g.moveTo(x0 + 7 * cw - 0.5, y0 - 2); g.lineTo(x0 + 7 * cw - 0.5, y0 + rows * ch); g.stroke();
      }

      var info = $('locusInfo');
      if (info) {
        if (hover >= 0) {
          var t = T[hover], fs = factors(t);
          info.innerHTML = '<b>元件 ' + (hover + 1) + '</b> · ' + bp(t) + ' · ' +
            ({ promoter: '与启动子重叠', loop: '经 Hi-C 环连到启动子', near: '50 kb 内的邻近元件' })[kind(t)] +
            ' · 开放度 ' + t[ix.accessibility].toFixed(2) +
            ' · 甲基化 ' + (t[ix.methylation_observed] ? (t[ix.methylation] * 100).toFixed(0) + '%' : '未观测') +
            ' · 结合因子 ' + (fs.length ? fs.join('、') : '无');
        } else {
          info.textContent = ({
            raw: '把鼠标移到一根柱子上，看这个元件的全部证据。',
            grn: '模型 A：只有落在启动子或环锚点里的结合才会变成一条「因子 → ' + ex.gene + '」候选边；邻近元件（变淡的柱子）不产生边。',
            direct: '模型 B：每个元件原样变成一行 ' + F.length + ' 维向量，全部保留，不连成边。'
          })[mode];
        }
      }
    }
    cv.addEventListener('mousemove', function (e) {
      var p = pointer(cv, e), best = -1, bd = 14;
      hit.forEach(function (h) { var d = Math.abs(h.x - p.x); if (d < bd) { bd = d; best = h.i; } });
      if (best !== hover) { hover = best; draw(); }
    });
    cv.addEventListener('mouseleave', function () { hover = -1; draw(); });
    buttons.forEach(function (b, i) {
      if (b) b.addEventListener('click', function () { mode = ['raw', 'grn', 'direct'][i]; press(buttons, b); draw(); });
    });
    draw(); redrawOnResize(draw);
  })();

  /* ============================================================
     图 2：共同骨架与先验接入的位置（结构示意）
     ============================================================ */
  (function arch() {
    var cv = $('arch');
    if (!cv) return;
    var mode = 'grn', buttons = [$('archNone'), $('archGrn'), $('archDirect')];
    function box(g, x, y, w, h, label, sub, color, on) {
      g.globalAlpha = on ? 1 : 0.22;
      g.fillStyle = C.ink; g.strokeStyle = color; g.lineWidth = 1.2;
      g.fillRect(x, y, w, h); g.strokeRect(x + .5, y + .5, w, h);
      g.fillStyle = C.text; font(g, 11.5, 600); g.textAlign = 'center';
      g.fillText(label, x + w / 2, y + h / 2 + (sub ? -3 : 4));
      if (sub) { g.fillStyle = C.mut; font(g, 10); g.fillText(sub, x + w / 2, y + h / 2 + 12); }
      g.globalAlpha = 1;
    }
    function arrow(g, x1, y1, x2, y2, color, on) {
      g.globalAlpha = on ? 1 : 0.18;
      g.strokeStyle = color; g.fillStyle = color; g.lineWidth = 1.3;
      g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
      var a = Math.atan2(y2 - y1, x2 - x1);
      g.beginPath(); g.moveTo(x2, y2);
      g.lineTo(x2 - 7 * Math.cos(a - .4), y2 - 7 * Math.sin(a - .4));
      g.lineTo(x2 - 7 * Math.cos(a + .4), y2 - 7 * Math.sin(a + .4)); g.fill();
      g.globalAlpha = 1;
    }
    function draw() {
      var s = setup(cv); if (!s) return;
      var g = s.g, W = s.w, H = s.h;
      g.clearRect(0, 0, W, H);
      var prior = mode !== 'none', bw = Math.min(150, W * 0.19), bh = 44;
      var c1 = W * 0.13, c2 = W * 0.38, c3 = W * 0.63, c4 = W * 0.87, r1 = H * 0.2, r2 = H * 0.5, r3 = H * 0.8;
      box(g, c1 - bw / 2, r1 - bh / 2, bw, bh, '对照细胞集合', 'S × 2000 基因', C.ctl, true);
      box(g, c1 - bw / 2, r2 - bh / 2, bw, bh, '扰动标签', '学出来的嵌入', C.pert, true);
      box(g, c1 - bw / 2, r3 - bh / 2, bw, bh, mode === 'direct' ? '顺式元件 token' : '候选调控网络',
        mode === 'direct' ? '每基因 ≤ 24 行' : '4 类边 + 节点特征', C.pert, prior);
      box(g, c2 - bw / 2, r1 - bh / 2, bw, bh, '基础编码器', 'MLP', C.line, true);
      box(g, c2 - bw / 2, r3 - bh / 2, bw, bh, mode === 'direct' ? '注意力池化' : '关系消息传递',
        '每个基因一个向量 z', C.pert, prior);
      box(g, c3 - bw / 2, r1 - bh / 2, bw, bh, '集合 Transformer', '细胞之间互相注意', C.line, true);
      box(g, c4 - bw / 2, r1 - bh / 2, bw, bh, '预测的扰动集合', '对照 + Δ', C.pert, true);
      box(g, c4 - bw / 2, r3 - bh / 2, bw, bh, '逐基因读出', 'q(h)·k(z_g)', C.pert, prior);
      arrow(g, c1 + bw / 2, r1, c2 - bw / 2, r1, C.ctl, true);
      arrow(g, c2 + bw / 2, r1, c3 - bw / 2, r1, C.soft, true);
      arrow(g, c3 + bw / 2, r1, c4 - bw / 2, r1, C.soft, true);
      arrow(g, c1 + bw / 2, r2, c3 - bw / 2 - 14, r1 + 14, C.pert, true);
      arrow(g, c1 + bw / 2, r3, c2 - bw / 2, r3, C.pert, prior);
      arrow(g, c2 + bw * 0.2, r3 - bh / 2, c3 - bw / 2 - 2, r1 + bh / 2 + 2, C.pert, prior);
      arrow(g, c2 + bw / 2, r3, c4 - bw / 2, r3, C.pert, prior);
      arrow(g, c3 + bw * 0.2, r1 + bh / 2, c4 - bw * 0.2, r3 - bh / 2, C.soft, prior);
      arrow(g, c4, r3 - bh / 2, c4, r1 + bh / 2, C.pert, prior);
      font(g, 10); g.textAlign = 'center';
      g.globalAlpha = prior ? 1 : 0.2; g.fillStyle = C.pert;
      g.fillText('① 被敲基因的 z', (c2 + c3) / 2 - 12, (r1 + r3) / 2 + 22);
      g.fillText('② 每个输出基因的 z', (c2 + c4) / 2, r3 + 18);
      g.globalAlpha = 1;
    }
    buttons.forEach(function (b, i) {
      if (b) b.addEventListener('click', function () { mode = ['none', 'grn', 'direct'][i]; press(buttons, b); draw(); });
    });
    draw(); redrawOnResize(draw);
  })();

  /* ============================================================
     图 3：消息传递（真实计算）
     传播算子与模型相同：每类关系一个邻接矩阵，按发送者取平均；
     有向关系有正、反两个通道。权重矩阵取单位阵，所以看到的是
     「信号能走到哪」，不是训练后的模型输出。
     ============================================================ */
  (function messagePassing() {
    var cv = $('mp'), ex = D.example;
    if (!cv || !ex || !ex.subgraph) return;
    var names = ex.subgraph.nodes, isTF = ex.subgraph.is_factor, real = ex.subgraph.edges, N = names.length;
    var source = 0, layers = 1, shuffled = false, pos = [], edges = real, swapInfo = null;
    var slider = $('mpLayers'), val = $('mpLayersVal'), btn = $('mpShuffle');

    /* degree-preserving double-edge swaps, per relation — the same control the benchmark uses */
    function shuffle(list) {
      var r = rng(20261116), out = list.map(function (e) { return { relation: e.relation, source: e.source, target: e.target }; });
      var done = 0, tried = 0;
      function key(e, s, t) {
        var sym = e.relation === 'promoter_contact' || e.relation === 'shared_element';
        return e.relation + ':' + (sym ? Math.min(s, t) + '-' + Math.max(s, t) : s + '>' + t);
      }
      var present = {}; out.forEach(function (e) { present[key(e, e.source, e.target)] = 1; });
      while (tried < out.length * 60 && done < out.length * 5) {
        tried++;
        var a = out[Math.floor(r() * out.length)], b = out[Math.floor(r() * out.length)];
        if (a === b || a.relation !== b.relation) continue;
        if (a.source === b.target || b.source === a.target) continue;
        var k1 = key(a, a.source, b.target), k2 = key(b, b.source, a.target);
        if (present[k1] || present[k2] || k1 === k2) continue;
        delete present[key(a, a.source, a.target)]; delete present[key(b, b.source, b.target)];
        var t = a.target; a.target = b.target; b.target = t;
        present[k1] = 1; present[k2] = 1; done++;
      }
      var before = {}; list.forEach(function (e) { before[key(e, e.source, e.target)] = 1; });
      var kept = out.filter(function (e) { return before[key(e, e.source, e.target)]; }).length;
      return { edges: out, swaps: done, kept: kept };
    }
    var shuffledResult = shuffle(real);

    function propagate() {
      // channels: each directed relation forward + reverse, each symmetric relation once
      var channels = {};
      edges.forEach(function (e) {
        var sym = e.relation === 'promoter_contact' || e.relation === 'shared_element';
        function add(name, receiver, sender) {
          (channels[name] = channels[name] || []).push([receiver, sender]);
        }
        add(e.relation + (sym ? '' : ':fwd'), e.target, e.source);
        add(e.relation + (sym ? '' : ':rev'), e.source, e.target);
      });
      var h = []; for (var i = 0; i < N; i++) h.push(i === source ? 1 : 0);
      for (var l = 0; l < layers; l++) {
        var next = h.slice();
        Object.keys(channels).forEach(function (name) {
          var sum = new Array(N).fill(0), count = new Array(N).fill(0);
          channels[name].forEach(function (pair) { sum[pair[0]] += h[pair[1]]; count[pair[0]]++; });
          for (var i = 0; i < N; i++) if (count[i]) next[i] += sum[i] / count[i];   // mean over senders
        });
        h = next;
      }
      return h;
    }

    function layout(W, H) {
      pos = [];
      var tfs = [], others = [];
      for (var i = 0; i < N; i++) (isTF[i] ? tfs : others).push(i);
      tfs.forEach(function (n, i) { pos[n] = { x: W * (i + 1) / (tfs.length + 1), y: H * 0.2 }; });
      others.forEach(function (n, i) {
        var u = (i + 0.5) / others.length;
        pos[n] = { x: W * (0.08 + 0.84 * u), y: H * (0.68 + 0.14 * Math.sin(u * Math.PI * others.length)) };
      });
    }
    function draw() {
      var s = setup(cv); if (!s) return;
      var g = s.g, W = s.w, H = s.h;
      g.clearRect(0, 0, W, H);
      layout(W, H);
      var h = propagate(), max = Math.max.apply(null, h.map(function (v, i) { return i === source ? 0 : v; })) || 1;
      edges.forEach(function (e) {
        var a = pos[e.source], b = pos[e.target];
        g.strokeStyle = hexA(REL[e.relation].color, .55); g.lineWidth = 1.2;
        g.beginPath(); g.moveTo(a.x, a.y); g.lineTo(b.x, b.y); g.stroke();
      });
      for (var i = 0; i < N; i++) {
        var p = pos[i], v = i === source ? 1 : Math.min(1, h[i] / max);
        g.fillStyle = h[i] > 0 ? viridis(0.15 + 0.85 * v) : C.ink;
        g.strokeStyle = i === source ? C.text : C.dim; g.lineWidth = i === source ? 2.2 : 1;
        g.beginPath();
        if (isTF[i]) g.rect(p.x - 9, p.y - 9, 18, 18); else g.arc(p.x, p.y, 10, 0, 6.2832);
        g.fill(); g.stroke();
        font(g, 10.5, i === source ? 600 : 400); g.textAlign = 'center';
        g.fillStyle = i === source ? C.text : C.soft;
        g.fillText(names[i], p.x, p.y + (isTF[i] ? -16 : 25));
        if (h[i] > 0 && i !== source) { g.fillStyle = C.mut; font(g, 9.5); g.fillText(h[i].toFixed(2), p.x, p.y + (isTF[i] ? 24 : 37)); }
      }
      font(g, 10); g.textAlign = 'left';
      var lx = 14;
      Object.keys(REL).forEach(function (k) {
        if (!edges.some(function (e) { return e.relation === k; })) return;
        g.fillStyle = REL[k].color; g.fillRect(lx, H - 15, 12, 3);
        g.fillStyle = C.mut; g.fillText(REL[k].label, lx + 17, H - 10);
        lx += 30 + g.measureText(REL[k].label).width;
      });
      var reached = h.filter(function (v, i) { return v > 0 && i !== source; }).length;
      if ($('mpSource')) $('mpSource').textContent = names[source];
      if ($('mpReached')) $('mpReached').textContent = reached + ' / ' + (N - 1);
      if ($('mpEdges')) $('mpEdges').textContent = shuffled
        ? shuffledResult.kept + ' / ' + real.length + ' 条与真实图相同'
        : real.length + ' 条（真实）';
      if (val) val.textContent = String(layers);
    }
    cv.addEventListener('click', function (e) {
      var p = pointer(cv, e), best = -1, bd = 22;
      pos.forEach(function (q, i) { var d = Math.hypot(q.x - p.x, q.y - p.y); if (d < bd) { bd = d; best = i; } });
      if (best >= 0) { source = best; draw(); }
    });
    if (slider) slider.addEventListener('input', function () { layers = +slider.value; draw(); });
    if (btn) btn.addEventListener('click', function () {
      shuffled = !shuffled; edges = shuffled ? shuffledResult.edges : real;
      btn.setAttribute('aria-pressed', shuffled ? 'true' : 'false'); draw();
    });
    draw(); redrawOnResize(draw);
  })();

  /* ============================================================
     图 4：注意力池化（真实计算）
     ============================================================ */
  (function pooling() {
    var cv = $('pool'), ex = D.example;
    if (!cv || !ex) return;
    var F = ex.features, T = ex.tokens, ix = {};
    F.forEach(function (n, i) { ix[n] = i; });
    var chip = F.map(function (n, i) { return n.indexOf('chip_') === 0 ? i : -1; }).filter(function (i) { return i >= 0; });
    var trained = ex.trained_attention, mode = trained ? 'trained' : 'manual';
    var sliders = ['pwPromoter', 'pwAccess', 'pwLoop', 'pwDist', 'pwChip'].map($);
    var buttons = [$('poolTrained'), $('poolManual')];
    if (!trained && buttons[0]) { buttons[0].disabled = true; press(buttons, buttons[1]); }

    function weights() {
      if (mode === 'trained') return trained;
      var w = sliders.map(function (s) { return s ? +s.value : 0; });
      var scores = T.map(function (t) {
        var nChip = chip.reduce(function (a, i) { return a + t[i]; }, 0) / Math.max(chip.length, 1);
        return w[0] * t[ix.is_promoter] + w[1] * t[ix.accessibility] + w[2] * t[ix.is_loop_linked] -
          w[3] * t[ix.abs_distance] + w[4] * nChip * 5;
      });
      var m = Math.max.apply(null, scores), e = scores.map(function (v) { return Math.exp(v - m); });
      var z = e.reduce(function (a, b) { return a + b; }, 0);
      return e.map(function (v) { return v / z; });            // softmax
    }
    function draw() {
      var s = setup(cv); if (!s) return;
      var g = s.g, W = s.w, H = s.h;
      g.clearRect(0, 0, W, H);
      var a = weights(), n = T.length, left = 46, right = 16, top = 22, barH = H * 0.5;
      var bw = (W - left - right) / n, max = Math.max.apply(null, a);
      font(g, 10); g.fillStyle = C.mut; g.textAlign = 'right';
      g.fillText('权重', left - 8, top + 8);
      g.strokeStyle = C.line; g.beginPath(); g.moveTo(left, top + barH); g.lineTo(W - right, top + barH); g.stroke();
      a.forEach(function (v, i) {
        var t = T[i], x = left + i * bw, h = (v / Math.max(max, 1e-9)) * (barH - 16);
        g.fillStyle = t[ix.is_promoter] ? C.pert : t[ix.is_loop_linked] ? C.ctl : C.dim;
        g.fillRect(x + 3, top + barH - h, bw - 6, h);
        g.fillStyle = C.soft; g.textAlign = 'center'; font(g, 9.5);
        g.fillText((v * 100).toFixed(0) + '%', x + bw / 2, top + barH - h - 5);
        g.fillStyle = C.mut; g.fillText(String(i + 1), x + bw / 2, top + barH + 13);
      });
      // pooled feature vector = sum_i a_i x_i
      var pooled = F.map(function (_, c) { return T.reduce(function (acc, t, i) { return acc + a[i] * (c === ix.signed_distance ? Math.abs(t[c]) : t[c]); }, 0); });
      var y = top + barH + 40, cw = (W - left - right) / F.length;
      g.textAlign = 'right'; g.fillStyle = C.mut; font(g, 10); g.fillText('Σ aᵢxᵢ', left - 8, y + 13);
      pooled.forEach(function (v, c) { g.fillStyle = viridis(v); g.fillRect(left + c * cw, y, cw - 1, 18); });
      g.textAlign = 'left'; g.fillStyle = C.mut; font(g, 9.5);
      g.fillText('位置/染色质特征', left, y + 33); g.fillText('因子结合', left + 7 * cw, y + 33);
      var lx = left; y = H - 8;
      [['与启动子重叠', C.pert], ['环连', C.ctl], ['邻近', C.dim]].forEach(function (item) {
        g.fillStyle = item[1]; g.fillRect(lx, y - 8, 10, 8);
        g.fillStyle = C.mut; g.fillText(item[0], lx + 15, y);
        lx += 32 + g.measureText(item[0]).width;
      });
      var groups = { promoter: 0, loop: 0, near: 0 };
      T.forEach(function (t, i) { groups[t[ix.is_promoter] ? 'promoter' : t[ix.is_loop_linked] ? 'loop' : 'near'] += a[i]; });
      var entropy = -a.reduce(function (acc, v) { return acc + (v > 0 ? v * Math.log(v) : 0); }, 0);
      if ($('poolProm')) $('poolProm').textContent = (groups.promoter * 100).toFixed(0) + '%';
      if ($('poolLoop')) $('poolLoop').textContent = (groups.loop * 100).toFixed(0) + '%';
      if ($('poolNear')) $('poolNear').textContent = (groups.near * 100).toFixed(0) + '%';
      if ($('poolEff')) $('poolEff').textContent = Math.exp(entropy).toFixed(1) + ' / ' + n;
      sliders.forEach(function (sl) { if (sl) sl.disabled = mode === 'trained'; });
    }
    buttons.forEach(function (b, i) {
      if (b) b.addEventListener('click', function () {
        if (b.disabled) return;
        mode = i === 0 ? 'trained' : 'manual'; press(buttons, b); draw();
      });
    });
    sliders.forEach(function (sl) { if (sl) sl.addEventListener('input', draw); });
    if (trained && buttons[0]) press(buttons, buttons[0]);
    draw(); redrawOnResize(draw);
  })();

  /* ============================================================
     图 5 与结果表：全部来自实测 CSV
     ============================================================ */
  (function results() {
    var R = D.results;
    var cv = $('resChart'), table = $('resTable');
    if (!R || !cv || !table) return;
    var split = R.k562 ? 'k562' : Object.keys(R)[0];
    var buttons = [$('resK562'), $('resRpe1')];
    var COLORS = { state: '#aeb8c4', perturb_mean: '#586273', context_mean: '#414c5e', backbone: '#7c8798',
      epi_grn: '#f2a13c', epi_grn_shuffled: '#a76b1e', epi_direct: '#2fc7bd', epi_direct_shuffled: '#1b7f79' };
    var SHOWN = ['epi_grn', 'epi_direct', 'backbone', 'perturb_mean', 'context_mean'];

    function draw() {
      var data = R[split]; if (!data) return;
      var s = setup(cv); if (!s) return;
      var g = s.g, W = s.w, H = s.h;
      g.clearRect(0, 0, W, H);
      var rows = data.rows.filter(function (r) { return r.headline; });
      var arms = SHOWN.filter(function (a) { return data.arms.indexOf(a) >= 0; });
      var left = 178, right = 22, top = 34, rowH = (H - top - 34) / rows.length, mid = left + (W - left - right) / 2;
      var span = 0;
      rows.forEach(function (r) {
        arms.forEach(function (a) {
          var v = r.values[a]; if (!v || v.rel_gain === null) return;
          span = Math.max(span, Math.abs(v.rel_lo), Math.abs(v.rel_hi), Math.abs(v.rel_gain));
        });
      });
      span = Math.min(Math.max(span * 1.1, 0.05), 1.5);
      function X(v) { return mid + Math.max(-1, Math.min(1, v / span)) * (W - left - right) / 2; }
      font(g, 10); g.fillStyle = C.mut; g.textAlign = 'center';
      g.fillText('← 比 STATE 差', (left + mid) / 2, 16); g.fillText('比 STATE 好 →', (mid + W - right) / 2, 16);
      g.strokeStyle = C.line;
      [-1, -0.5, 0, 0.5, 1].forEach(function (f) {
        var x = X(f * span);
        g.beginPath(); g.moveTo(x, top - 6); g.lineTo(x, H - 26); g.stroke();
        g.fillText((f * span * 100 > 0 ? '+' : '') + (f * span * 100).toFixed(0) + '%', x, H - 12);
      });
      g.strokeStyle = C.soft; g.beginPath(); g.moveTo(mid, top - 6); g.lineTo(mid, H - 26); g.stroke();
      rows.forEach(function (r, i) {
        var y0 = top + i * rowH;
        g.textAlign = 'right'; g.fillStyle = C.soft; font(g, 10.5);
        g.fillText(r.metric, left - 12, y0 + rowH / 2 + 4);
        arms.forEach(function (a, k) {
          var v = r.values[a]; if (!v || v.rel_gain === null) return;
          var y = y0 + rowH * (k + 1) / (arms.length + 1);
          g.strokeStyle = COLORS[a]; g.lineWidth = 1.6;
          g.beginPath(); g.moveTo(X(v.rel_lo), y); g.lineTo(X(v.rel_hi), y); g.stroke();
          g.fillStyle = COLORS[a];
          g.beginPath(); g.arc(X(v.rel_gain), y, 3.4, 0, 6.2832); g.fill();
        });
        g.strokeStyle = C.grid; g.lineWidth = 1;
        g.beginPath(); g.moveTo(8, y0 + rowH); g.lineTo(W - 8, y0 + rowH); g.stroke();
      });
      var legend = $('resLegend');
      if (legend) legend.innerHTML = arms.map(function (a) {
        return '<span class="nowrap"><span class="swatch" style="background:' + COLORS[a] + '"></span>' + data.labels[a] + '</span>';
      }).join(' &nbsp; ');

      // full table
      var order = data.arms, html = '<table><caption>' + data.caption + '</caption><thead><tr><th>指标</th>';
      order.forEach(function (a) { html += '<th>' + data.labels[a] + '</th>'; });
      html += '</tr></thead><tbody>';
      var family = '';
      data.rows.forEach(function (r) {
        if (r.family !== family) {
          family = r.family;
          html += '<tr><td colspan="' + (order.length + 1) + '" class="fam">' + r.family_label + '</td></tr>';
        }
        var best = null;
        order.forEach(function (a) {
          var v = r.values[a]; if (!v) return;
          if (best === null || (r.higher ? v.mean > best : v.mean < best)) best = v.mean;
        });
        html += '<tr><td>' + r.metric + (r.higher ? ' ↑' : ' ↓') + '</td>';
        order.forEach(function (a) {
          var v = r.values[a];
          var mark = v && v.verdict === 'better' ? ' class="num win"' : v && v.verdict === 'worse' ? ' class="num lose"' : ' class="num"';
          html += '<td' + mark + '>' + (v ? (v.mean === best ? '<b>' + fmt(v.mean) + '</b>' : fmt(v.mean)) : '—') + '</td>';
        });
        html += '</tr>';
      });
      table.innerHTML = html + '</tbody></table>';
    }
    buttons.forEach(function (b, i) {
      if (!b) return;
      var key = ['k562', 'rpe1'][i];
      if (!R[key]) { b.disabled = true; return; }
      b.addEventListener('click', function () { split = key; press(buttons, b); draw(); });
    });
    draw(); redrawOnResize(draw);
  })();

  /* ---------- fill simple counters from data ---------- */
  (function fill() {
    document.querySelectorAll('[data-fill]').forEach(function (el) {
      var value = el.getAttribute('data-fill').split('.').reduce(function (o, k) { return o == null ? o : o[k]; }, D);
      if (value !== undefined && value !== null) el.textContent = typeof value === 'number' ? value.toLocaleString('en-US') : value;
    });
  })();

  /* ---------- reveal on scroll ---------- */
  (function reveal() {
    var items = document.querySelectorAll('[data-reveal]');
    if (REDUCED || !('IntersectionObserver' in window)) {
      items.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -8% 0px' });
    items.forEach(function (el) { io.observe(el); });
  })();
})();
