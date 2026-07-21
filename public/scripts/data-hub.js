// Data hub — interaktivní hero graf (přepínač komodit + hover cena k datu) + count-up.
// Data se čtou z <script id="dhChartData"> (series z agro-stats.json).
(function () {
  'use strict';
  var cfgEl = document.getElementById('dhChartData');
  if (!cfgEl) return;
  var cfg = {};
  try { cfg = JSON.parse(cfgEl.textContent || '{}'); } catch (e) { return; }
  var numLocale = cfg.numLocale || 'cs-CZ';
  var COMS = (cfg.series || []).filter(function (s) { return s.points && s.points.length > 1; });

  // ── count-up ──
  var nf = new Intl.NumberFormat(numLocale);
  function animateCount(el) {
    var target = +el.dataset.count, dur = 1100, t0 = performance.now();
    function step(t) {
      var p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = nf.format(Math.round(target * e));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-count]').forEach(function (el) { io.observe(el); });

  if (!COMS.length) return;

  // ── hero graf ──
  var svg = document.getElementById('hcSvg'), fill = document.getElementById('hcFill'), line = document.getElementById('hcLine'),
    cross = document.getElementById('hcCross'), dot = document.getElementById('hcDot'), tip = document.getElementById('hcTip'),
    elLabel = document.getElementById('hcLabel'), elPrice = document.getElementById('hcPrice'), elChg = document.getElementById('hcChg'),
    dots = document.getElementById('hcDots');
  if (!svg || !line) return;
  var W = 340, H = 120, PT = 14, PB = 14, cur = 0, pts = [];
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function dec(unit) { return /\/l$/.test(unit) ? 2 : 0; }
  function fmtV(v, unit) { return v.toLocaleString(numLocale, { minimumFractionDigits: dec(unit), maximumFractionDigits: dec(unit) }); }

  function build(i) {
    var c = COMS[i], vals = c.points.map(function (p) { return p.value; });
    var min = Math.min.apply(null, vals), max = Math.max.apply(null, vals), rng = (max - min) || 1;
    pts = c.points.map(function (p, k) {
      return { x: (k / (c.points.length - 1)) * W, y: PT + (1 - (p.value - min) / rng) * (H - PT - PB), v: p.value, label: p.label };
    });
    var d = pts.map(function (p, k) { return (k ? 'L' : 'M') + p.x.toFixed(1) + ',' + p.y.toFixed(1); }).join(' ');
    line.setAttribute('d', d);
    fill.setAttribute('d', d + ' L' + W + ',' + H + ' L0,' + H + ' Z');
    elLabel.textContent = c.name + ' · ' + c.unit;
    elPrice.textContent = fmtV(vals[vals.length - 1], c.unit);
    var chg = ((vals[vals.length - 1] - vals[0]) / vals[0]) * 100;
    elChg.textContent = (chg >= 0 ? '▲ ' : '▼ ') + Math.abs(chg).toFixed(1).replace('.', ',') + ' %';
    elChg.className = 'dh-chg' + (chg < 0 ? ' dn' : '');
    dots.innerHTML = COMS.map(function (_, k) { return '<i class="' + (k === i ? 'on' : '') + '" data-i="' + k + '"></i>'; }).join('');
    if (!reduce) {
      var len = line.getTotalLength();
      line.style.strokeDasharray = len; line.style.strokeDashoffset = len; line.style.transition = 'none'; fill.style.opacity = 0;
      requestAnimationFrame(function () {
        line.style.transition = 'stroke-dashoffset .9s ease'; line.style.strokeDashoffset = 0;
        fill.style.transition = 'opacity .6s ease .2s'; fill.style.opacity = 1;
      });
    }
  }
  function go(i) { cur = (i + COMS.length) % COMS.length; build(cur); }
  document.getElementById('hcPrev').onclick = function () { go(cur - 1); };
  document.getElementById('hcNext').onclick = function () { go(cur + 1); };
  dots.onclick = function (e) { var i = e.target.getAttribute('data-i'); if (i != null) go(+i); };

  function onMove(clientX) {
    var r = svg.getBoundingClientRect(), rel = (clientX - r.left) / r.width * W, best = pts[0];
    for (var k = 0; k < pts.length; k++) if (Math.abs(pts[k].x - rel) < Math.abs(best.x - rel)) best = pts[k];
    cross.setAttribute('x1', best.x); cross.setAttribute('x2', best.x); cross.style.opacity = 1;
    dot.setAttribute('cx', best.x); dot.setAttribute('cy', best.y); dot.style.opacity = 1;
    tip.querySelector('.d').textContent = best.label;
    tip.querySelector('b').textContent = fmtV(best.v, COMS[cur].unit) + ' ' + COMS[cur].unit;
    tip.style.left = (best.x / W * 100) + '%'; tip.style.top = (best.y / H * 100) + '%'; tip.style.opacity = 1;
  }
  svg.addEventListener('mousemove', function (e) { onMove(e.clientX); });
  svg.addEventListener('mouseleave', function () { cross.style.opacity = 0; dot.style.opacity = 0; tip.style.opacity = 0; });
  svg.addEventListener('touchmove', function (e) { if (e.touches[0]) onMove(e.touches[0].clientX); }, { passive: true });
  build(0);
})();
