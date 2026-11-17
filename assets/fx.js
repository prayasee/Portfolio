/* Electricity layer: lightning bolts, cursor sparks, click shockwaves, arcs that jump off [data-arc] elements. */
(function () {
  var cv = document.getElementById('fx');
  if (!cv) return;
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) { cv.style.display = 'none'; return; }
  var ctx = cv.getContext('2d');
  var W = 0, H = 0, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); window.addEventListener('resize', size);

  var home = document.body.getAttribute('data-page') === 'index';
  var K = home ? 1 : 0.55;           /* gentler on reading pages */
  var bolts = [], sparks = [], rings = [];

  function bolt(x1, y1, x2, y2, o) {
    o = o || {};
    var pts = [[x1, y1], [x2, y2]];
    var len = Math.hypot(x2 - x1, y2 - y1);
    var disp = o.disp || len * 0.2;
    for (var it = 0; it < (o.iter || 5); it++) {
      var np = [];
      for (var j = 0; j < pts.length - 1; j++) {
        var a = pts[j], b = pts[j + 1];
        var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
        var off = (Math.random() - 0.5) * disp;
        np.push(a, [(a[0] + b[0]) / 2 - dy / l * off, (a[1] + b[1]) / 2 + dx / l * off]);
      }
      np.push(pts[pts.length - 1]); pts = np; disp *= 0.55;
    }
    var life = o.life || 18;
    var b = { pts: pts, life: life, max: life, w: o.w || 2, a: o.a == null ? 1 : o.a, kids: [] };
    if (o.branch !== false) {
      var nb = o.nb == null ? 2 : o.nb;
      for (var k = 0; k < nb; k++) {
        var p = pts[Math.floor(pts.length * (0.25 + Math.random() * 0.5))];
        var ang = Math.atan2(y2 - y1, x2 - x1) + (Math.random() - 0.5) * 1.5;
        var bl = len * (0.14 + Math.random() * 0.2);
        b.kids.push(bolt(p[0], p[1], p[0] + Math.cos(ang) * bl, p[1] + Math.sin(ang) * bl,
          { iter: 3, life: life - 3, w: 1, a: b.a * 0.8, branch: false, disp: bl * 0.3 }));
      }
    }
    return b;
  }
  function add(x1, y1, x2, y2, o) { bolts.push(bolt(x1, y1, x2, y2, o)); if (bolts.length > 40) bolts.shift(); }

  function stroke(pts, w, col) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
    ctx.lineWidth = w; ctx.strokeStyle = col; ctx.stroke();
  }
  function drawBolt(b) {
    var f = b.life / b.max; var flick = (b.life % 4 < 2) ? 1 : 0.65;
    var al = f * flick * b.a;
    stroke(b.pts, b.w * 6, 'rgba(25,240,255,' + (0.12 * al) + ')');
    stroke(b.pts, b.w * 2.6, 'rgba(45,123,255,' + (0.35 * al) + ')');
    stroke(b.pts, b.w, 'rgba(225,252,255,' + al + ')');
    for (var i = 0; i < b.kids.length; i++) drawBolt(b.kids[i]);
  }
  function tick(b) { b.life--; for (var i = 0; i < b.kids.length; i++) tick(b.kids[i]); }

  /* cursor sparks */
  var lx = -999, ly = -999, hoverEl = null, lastArc = 0;
  function spark(x, y, n, sp) {
    for (var i = 0; i < n; i++) {
      var a = Math.random() * 6.283, v = (0.6 + Math.random()) * sp;
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 14 + Math.random() * 12, max: 26 });
    }
    if (sparks.length > 160) sparks.splice(0, sparks.length - 160);
  }
  function edgePoint(r, x, y) {
    var d = [Math.abs(x - r.left), Math.abs(x - r.right), Math.abs(y - r.top), Math.abs(y - r.bottom)];
    var m = Math.min(d[0], d[1], d[2], d[3]);
    var cx = Math.min(Math.max(x, r.left), r.right), cy = Math.min(Math.max(y, r.top), r.bottom);
    if (m === d[0]) return [r.left, cy];
    if (m === d[1]) return [r.right, cy];
    if (m === d[2]) return [cx, r.top];
    return [cx, r.bottom];
  }
  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    var x = e.clientX, y = e.clientY;
    if (Math.hypot(x - lx, y - ly) > 16) { spark(x, y, 1, 1.6); lx = x; ly = y; }
    hoverEl = e.target && e.target.closest ? e.target.closest('[data-arc]') : null;
    if (hoverEl) {
      var now = performance.now();
      if (now - lastArc > 110) {
        lastArc = now;
        var r = hoverEl.getBoundingClientRect(), p = edgePoint(r, x, y);
        add(p[0], p[1], x, y, { life: 12, w: 1.8, nb: 1, a: 0.95 });
      }
    }
  }, { passive: true });
  window.addEventListener('pointerdown', function (e) {
    var t = e.target;
    if (t && t.closest && t.closest('input,textarea,.lb')) return;
    var x = e.clientX, y = e.clientY;
    rings.push({ x: x, y: y, r: 6, max: 120 });
    spark(x, y, 18, 4.2);
    for (var i = 0; i < 5; i++) {
      var a = Math.random() * 6.283, l = 70 + Math.random() * 90;
      add(x, y, x + Math.cos(a) * l, y + Math.sin(a) * l, { life: 14, w: 1.6, nb: 1, a: 0.9 });
    }
  }, { passive: true });

  /* ambient behaviour */
  var nextSky = performance.now() + 900;
  var nextCard = performance.now() + 1200;
  function sky() {
    var x1, y1, x2, y2;
    if (home || Math.random() < 0.3) {
      x1 = Math.random() * W; y1 = -10; x2 = x1 + (Math.random() - 0.5) * W * 0.3; y2 = H * (0.25 + Math.random() * 0.4);
    } else {
      var left = Math.random() < 0.5;
      x1 = left ? -10 : W + 10; y1 = Math.random() * H * 0.7;
      x2 = left ? W * 0.14 : W * 0.86; y2 = y1 + (Math.random() - 0.3) * H * 0.25;
    }
    add(x1, y1, x2, y2, { life: 20, w: 2.2, nb: 3, a: K });
  }
  function cardArc() {
    var els = document.querySelectorAll('[data-arc="ambient"]');
    for (var i = 0; i < els.length; i++) {
      var r = els[i].getBoundingClientRect();
      if (r.bottom < 0 || r.top > H || r.width < 40) continue;
      var side = Math.floor(Math.random() * 4), t = Math.random(), x, y;
      if (side === 0) { x = r.left + r.width * t; y = r.top; }
      else if (side === 1) { x = r.right; y = r.top + r.height * t; }
      else if (side === 2) { x = r.left + r.width * t; y = r.bottom; }
      else { x = r.left; y = r.top + r.height * t; }
      var ang = [-Math.PI / 2, 0, Math.PI / 2, Math.PI][side] + (Math.random() - 0.5) * 0.9;
      var l = 50 + Math.random() * 90;
      add(x, y, x + Math.cos(ang) * l, y + Math.sin(ang) * l, { life: 11, w: 1.6, nb: 1, a: 0.9 });
    }
  }
  setTimeout(function () { add(W * 0.5, -10, W * (0.4 + Math.random() * 0.2), H * 0.4, { life: 24, w: 2.6, nb: 3, a: K }); }, 450);

  var running = true;
  document.addEventListener('visibilitychange', function () { running = !document.hidden; });

  function frame(now) {
    requestAnimationFrame(frame);
    if (!running) return;
    if (now > nextSky) { sky(); nextSky = now + (home ? 3500 + Math.random() * 4500 : 9000 + Math.random() * 8000); }
    if (now > nextCard) { cardArc(); nextCard = now + 1300 + Math.random() * 1800; }
    ctx.clearRect(0, 0, W, H);
    if (!bolts.length && !sparks.length && !rings.length) return;
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (var i = bolts.length - 1; i >= 0; i--) {
      drawBolt(bolts[i]); tick(bolts[i]);
      if (bolts[i].life <= 0) bolts.splice(i, 1);
    }
    for (var s = sparks.length - 1; s >= 0; s--) {
      var p = sparks[s]; p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.vx *= 0.97; p.life--;
      if (p.life <= 0) { sparks.splice(s, 1); continue; }
      var a = p.life / p.max;
      ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p.x - p.vx * 2.4, p.y - p.vy * 2.4);
      ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(160,250,255,' + a + ')'; ctx.stroke();
    }
    for (var r = rings.length - 1; r >= 0; r--) {
      var g = rings[r]; g.r += 5.5;
      if (g.r > g.max) { rings.splice(r, 1); continue; }
      ctx.beginPath(); ctx.arc(g.x, g.y, g.r, 0, 6.283);
      ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(25,240,255,' + (1 - g.r / g.max) * 0.7 + ')'; ctx.stroke();
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  requestAnimationFrame(frame);
})();
