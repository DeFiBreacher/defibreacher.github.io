/* ==========================================================================
   DFB Intro Loader — Declassified Intelligence File Edition v8
   Intro: scan → slide in. Exit: fade out.
   Session key: dfb-intro-v17
   ========================================================================== */
(function () {
  'use strict';

  var KEY  = 'dfb-intro-v17';
  var root = document.getElementById('dfb-intro');
  if (!root) return;

  if (sessionStorage.getItem(KEY)) { root.parentNode.removeChild(root); return; }
  sessionStorage.setItem(KEY, '1');
  document.documentElement.classList.add('dfb-intro-lock');

  var wrap        = root.querySelector('#dfb-wrap');
  var skipBtn     = root.querySelector('#dfb-skip');
  var starsCanvas = root.querySelector('#dfb-stars');

  /* ══════════════════════════════════════════════════════════════
     DOT GLOBE BACKGROUND
  ══════════════════════════════════════════════════════════════ */
  (function () {
    var ctx = starsCanvas.getContext('2d');
    var W, H, cx, cy, R;
    var pts = [];
    var angle = 0;
    var TILT = 0.20;
    var cosT = Math.cos(TILT), sinT = Math.sin(TILT);

    function build() {
      pts = [];
      var n   = 3000;
      var phi = Math.PI * (3 - Math.sqrt(5));
      for (var i = 0; i < n; i++) {
        var y0 = 1 - (i / (n - 1)) * 2;
        var r0 = Math.sqrt(1 - y0 * y0);
        var th = phi * i;
        pts.push({
          x:  r0 * Math.cos(th),
          y:  y0,
          z:  r0 * Math.sin(th),
          sz: 0.55 + Math.random() * 0.95,
          bA: 0.45 + Math.random() * 0.55
        });
      }
    }

    function resize() {
      W = starsCanvas.width  = window.innerWidth;
      H = starsCanvas.height = window.innerHeight;
      cx = W / 2;
      cy = H / 2;
      R  = Math.min(W, H) * 0.41;
      build();
    }

    function draw() {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = '#020408';
      ctx.fillRect(0, 0, W, H);

      angle += 0.0007;
      var cosY = Math.cos(angle), sinY = Math.sin(angle);

      var visible = [];
      for (var i = 0; i < pts.length; i++) {
        var p  = pts[i];
        var rx = p.x * cosY + p.z * sinY;
        var ry = p.y;
        var rz = -p.x * sinY + p.z * cosY;
        var fy = ry * cosT - rz * sinT;
        var fz = ry * sinT + rz * cosT;
        if (fz < 0.0) continue;
        visible.push({
          sx: cx + rx * R,
          sy: cy + fy * R,
          fz: fz,
          df: (fz + 1) * 0.5,
          sz: p.sz,
          bA: p.bA
        });
      }

      visible.sort(function (a, b) { return a.fz - b.fz; });

      for (var j = 0; j < visible.length; j++) {
        var v     = visible[j];
        var alpha = v.bA * (0.18 + v.df * 0.82);
        var dotR  = v.sz * (0.38 + v.df * 0.62);
        ctx.globalAlpha = alpha;
        ctx.fillStyle   = '#b8ccff';
        ctx.beginPath();
        ctx.arc(v.sx, v.sy, dotR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      var g1 = ctx.createRadialGradient(cx - R * 0.62, cy - R * 0.28, 0, cx - R * 0.62, cy - R * 0.28, R * 1.35);
      g1.addColorStop(0,    'rgba(228, 55, 175, 0.24)');
      g1.addColorStop(0.42, 'rgba(180, 35, 145, 0.11)');
      g1.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g1; ctx.fillRect(0, 0, W, H);

      var g2 = ctx.createRadialGradient(cx + R * 0.78, cy + R * 0.08, 0, cx + R * 0.78, cy + R * 0.08, R * 1.25);
      g2.addColorStop(0,    'rgba(55, 95, 255, 0.24)');
      g2.addColorStop(0.40, 'rgba(90, 55, 230, 0.13)');
      g2.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = g2; ctx.fillRect(0, 0, W, H);

      var g3 = ctx.createRadialGradient(cx + R * 0.15, cy + R * 0.52, 0, cx + R * 0.15, cy + R * 0.52, R * 0.85);
      g3.addColorStop(0,   'rgba(115, 50, 210, 0.12)');
      g3.addColorStop(1,   'rgba(0,0,0,0)');
      ctx.fillStyle = g3; ctx.fillRect(0, 0, W, H);

      var rim = ctx.createRadialGradient(cx, cy, R * 0.76, cx, cy, R * 1.14);
      rim.addColorStop(0,    'rgba(0,0,0,0)');
      rim.addColorStop(0.50, 'rgba(140, 80, 240, 0.16)');
      rim.addColorStop(1,    'rgba(0,0,0,0)');
      ctx.fillStyle = rim; ctx.fillRect(0, 0, W, H);

      requestAnimationFrame(draw);
    }

    resize();
    requestAnimationFrame(draw);
    window.addEventListener('resize', resize);
  })();

  /* ══════════════════════════════════════════════════════════════
     TYPEWRITER HELPER
  ══════════════════════════════════════════════════════════════ */
  function typewrite(el, text, speed, done) {
    speed = speed || 14;
    var i = 0;
    el.textContent = '';
    el.classList.remove('dfb-typed');
    function tick() {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speed + Math.random() * 8);
      } else {
        el.classList.add('dfb-typed');
        if (done) done();
      }
    }
    tick();
  }

  /* ══════════════════════════════════════════════════════════════
     REVEAL HELPER
  ══════════════════════════════════════════════════════════════ */
  function show(id, delay) {
    setTimeout(function(){
      var el = root.querySelector('#' + id);
      if (el) el.classList.add('dfb-show');
    }, delay);
  }

  /* ══════════════════════════════════════════════════════════════
     TYPEWRITER FIELDS
  ══════════════════════════════════════════════════════════════ */
  function runTypewriters(startDelay) {
    var fields = root.querySelectorAll('.dfb-type');
    var delay  = startDelay || 0;
    fields.forEach(function(el){
      var text = el.getAttribute('data-text') || '';
      setTimeout(function(){ typewrite(el, text, 14); }, delay);
      delay += text.length * 16 + 60;
    });
  }

  /* ══════════════════════════════════════════════════════════════
     MATRIX BARS
  ══════════════════════════════════════════════════════════════ */
  function animateBars(delay) {
    setTimeout(function(){
      root.querySelectorAll('#dfb-matrix .dfb-mx-bar').forEach(function(bar){
        bar.style.width = (bar.getAttribute('data-pct') || '0') + '%';
      });
    }, delay);
  }

  /* ══════════════════════════════════════════════════════════════
     REDACTION FLICKER
  ══════════════════════════════════════════════════════════════ */
  function flickerRedacts(delay) {
    setTimeout(function(){
      root.querySelectorAll('.dfb-redact').forEach(function(r,i){
        setTimeout(function(){
          r.classList.add('dfb-redact-flicker');
          setTimeout(function(){ r.classList.remove('dfb-redact-flicker'); }, 450);
        }, i*130);
      });
    }, delay);
  }

  /* ══════════════════════════════════════════════════════════════
     FADE EXIT
  ══════════════════════════════════════════════════════════════ */
  var finished = false;

  function wipeExit() {
    if (finished) return; finished = true;
    skipBtn.style.opacity       = '0';
    skipBtn.style.pointerEvents = 'none';
    root.style.transition = 'opacity 0.35s ease';
    root.style.opacity    = '0';
    setTimeout(function() {
      document.documentElement.classList.remove('dfb-intro-lock');
      if (root && root.parentNode) root.parentNode.removeChild(root);
    }, 360);
  }

  function instantExit() { wipeExit(); }

  skipBtn.addEventListener('click', instantExit);
  document.addEventListener('keydown', function(e){ if(e.key==='Escape') instantExit(); });

  /* ══════════════════════════════════════════════════════════════
     INTRO SLIDE-IN
  ══════════════════════════════════════════════════════════════ */
  requestAnimationFrame(function(){ requestAnimationFrame(function(){
    wrap.classList.add('dfb-in');
  }); });

  setTimeout(function(){ skipBtn.classList.add('dfb-show'); }, 300);

  /* ══════════════════════════════════════════════════════════════
     CONTENT SEQUENCE — fast (~2.2s total)
  ══════════════════════════════════════════════════════════════ */

  /* HEADER */
  show('dfb-ts',   280);
  show('dfb-decl', 420);
  show('dfb-cb',   520);

  /* LEFT — §1 Subject Profile */
  show('dfb-sl1',     560);
  show('dfb-profile', 640);
  runTypewriters(660);

  /* LEFT — §2 Capabilities */
  show('dfb-d1',   900);
  show('dfb-sl3',  950);
  show('dfb-caps', 990);
  ['dfb-c1','dfb-c2','dfb-c3','dfb-c4','dfb-c5'].forEach(function(id,i){
    show(id, 1010 + i*40);
  });

  /* LEFT — §3 Threat Matrix */
  show('dfb-d3',     1230);
  show('dfb-sl4',    1270);
  show('dfb-matrix', 1310);
  ['dfb-mx1','dfb-mx2','dfb-mx3','dfb-mx4','dfb-mx5'].forEach(function(id,i){
    show(id, 1330 + i*35);
  });
  animateBars(1350);

  /* RIGHT COLUMN */
  show('dfb-rsl1',  580);
  show('dfb-surv',  660);
  show('dfb-rrd3',  860);
  show('dfb-rsl4',  910);
  show('dfb-notes', 970);
  show('dfb-rrd4',  1280);
  show('dfb-sig',   1330);
  show('dfb-bc',    1400);

  /* FOOTER */
  show('dfb-ft', 1550);

  /* REDACTION FLICKER */
  flickerRedacts(720);
  flickerRedacts(1300);

  /* AUTO-WIPE — 2.8s total */
  setTimeout(wipeExit, 2800);

}());
