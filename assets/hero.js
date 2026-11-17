/* Home hero: lightning that arcs between the cursor and the outline of the portrait, ambient strikes,
   click shock, x-ray lens, gentle parallax and the rotating role line. */
(function () {
  var hero = document.getElementById('hero');
  if (!hero) return;
  var stage = document.getElementById('stage');
  var photo = document.getElementById('portrait');
  var cv = document.getElementById('bolts');
  var cur = document.getElementById('cur');
  var word = hero.querySelector('.bg-word');
  var flash = hero.querySelector('.flash');
  var roleEl = document.getElementById('roleSwap');
  var ctx = cv.getContext('2d');
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia && window.matchMedia('(pointer:fine)').matches;

  var W = 0, H = 0, dpr = 1;
  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    W = hero.clientWidth; H = hero.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); window.addEventListener('resize', size);

  /* ---------- silhouette of the portrait ---------- */
  var FALL = [[468,62],[540,80],[600,140],[592,250],[572,330],[556,392],[600,430],[740,470],[840,520],[868,700],[862,1000],[840,1040],[60,1040],[40,1000],[90,800],[215,520],[330,470],[400,420],[384,330],[352,240],[345,150],[400,80]]
    .map(function (p) { return [p[0] / 900, p[1] / 1046]; });
  var edges = [], mask = null;

  function fallbackEdges() {
    edges = [];
    for (var i = 0; i < FALL.length; i++) {
      var a = FALL[i], b = FALL[(i + 1) % FALL.length];
      var n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 0.012));
      for (var k = 0; k < n; k++) {
        var y = a[1] + (b[1] - a[1]) * k / n;
        if (y < 0.965) edges.push([a[0] + (b[0] - a[0]) * k / n, y]);
      }
    }
  }
  function inPoly(u, v) {
    var ins = false;
    for (var i = 0, j = FALL.length - 1; i < FALL.length; j = i++) {
      var xi = FALL[i][0], yi = FALL[i][1], xj = FALL[j][0], yj = FALL[j][1];
      if (((yi > v) !== (yj > v)) && (u < (xj - xi) * (v - yi) / (yj - yi) + xi)) ins = !ins;
    }
    return ins;
  }
  function buildMask() {
    var w = 112, h = Math.round(w * photo.naturalHeight / photo.naturalWidth);
    var c = document.createElement('canvas'); c.width = w; c.height = h;
    var x = c.getContext('2d'); x.drawImage(photo, 0, 0, w, h);
    var d = x.getImageData(0, 0, w, h).data;
    function al(i, j) { return (i < 0 || j < 0 || i >= w || j >= h) ? 0 : d[(j * w + i) * 4 + 3]; }
    var e = [];
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) {
      if (al(i, j) > 128 && (al(i - 1, j) < 128 || al(i + 1, j) < 128 || al(i, j - 1) < 128 || al(i, j + 1) < 128) && j < h * 0.965)
        e.push([(i + 0.5) / w, (j + 0.5) / h]);
    }
    if (e.length < 40) throw new Error('mask');
    edges = e; mask = { w: w, h: h, d: d };
  }
  function prep() { try { buildMask(); } catch (err) { mask = null; fallbackEdges(); } }
  fallbackEdges();
  if (photo.complete && photo.naturalWidth) prep(); else photo.addEventListener('load', prep);

  function overPerson(u, v) {
    if (u < 0 || v < 0 || u > 1 || v > 1) return false;
    if (mask) {
      var i = Math.min(mask.w - 1, Math.floor(u * mask.w)), j = Math.min(mask.h - 1, Math.floor(v * mask.h));
      return mask.d[(j * mask.w + i) * 4 + 3] > 40;
    }
    return inPoly(u, v);
  }

  /* ---------- lightning drawing ---------- */
  function jag(x1, y1, x2, y2, disp) {
    var pts = [[x1, y1], [x2, y2]];
    var len = Math.hypot(x2 - x1, y2 - y1);
    var it = Math.max(2, Math.min(5, Math.round(Math.log(len / 12) / Math.LN2)));
    var d = disp == null ? len * 0.16 : disp;
    for (var n = 0; n < it; n++) {
      var np = [pts[0]];
      for (var i = 0; i < pts.length - 1; i++) {
        var a = pts[i], b = pts[i + 1];
        var dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1;
        var o = (Math.random() - 0.5) * d;
        np.push([(a[0] + b[0]) / 2 - dy / l * o, (a[1] + b[1]) / 2 + dx / l * o], b);
      }
      pts = np; d *= 0.55;
    }
    return pts;
  }
  function path(pts) {
    ctx.beginPath(); ctx.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  }
  function drawBolt(pts, w, a) {
    path(pts); ctx.lineWidth = 9 * w; ctx.strokeStyle = 'rgba(45,123,255,' + (0.16 * a) + ')'; ctx.stroke();
    ctx.lineWidth = 3.4 * w; ctx.strokeStyle = 'rgba(25,240,255,' + (0.6 * a) + ')'; ctx.stroke();
    ctx.lineWidth = 1.2 * w; ctx.strokeStyle = 'rgba(235,253,255,' + a + ')'; ctx.stroke();
  }
  function branches(pts, w, a) {
    for (var i = 3; i < pts.length - 3; i += 3) {
      if (Math.random() > 0.2) continue;
      var p = pts[i], ang = Math.random() * 6.283, l = 26 + Math.random() * 56;
      drawBolt(jag(p[0], p[1], p[0] + Math.cos(ang) * l, p[1] + Math.sin(ang) * l, l * 0.3), w * 0.5, a * 0.7);
    }
  }

  /* ---------- state ---------- */
  var mx = -999, my = -999, active = false, over = false;
  var nx = 0, ny = 0, px = 0, py = 0;
  var curX = 0, curY = 0, gx = 0, gy = 0, lastX = 0, lastY = 0;
  var timed = [];            /* short-lived bolts: {x1,y1,x2,y2,born,life,w,a,pts,regen} */
  var nextAmb = 900, nextStrike = 3200, tick = 0;

  var geo = { l: 0, t: 0, w: 1, h: 1 };
  function measure() {
    var r = stage.getBoundingClientRect(), hr = hero.getBoundingClientRect();
    geo.l = r.left - hr.left; geo.t = r.top - hr.top; geo.w = r.width; geo.h = r.height;
  }
  function E(i) { var p = edges[i]; return [geo.l + p[0] * geo.w, geo.t + p[1] * geo.h]; }
  function addBolt(x1, y1, x2, y2, life, w, a) {
    timed.push({ x1: x1, y1: y1, x2: x2, y2: y2, born: performance.now(), life: life, w: w, a: a, pts: jag(x1, y1, x2, y2), regen: 0 });
    if (timed.length > 30) timed.shift();
  }
  function doFlash(o) {
    if (!flash) return;
    flash.style.opacity = o == null ? 1 : o; flash.classList.add('on');
    requestAnimationFrame(function () { requestAnimationFrame(function () { flash.classList.remove('on'); flash.style.opacity = ''; }); });
  }
  function jolt() {
    stage.classList.remove('jolt'); void stage.offsetWidth; stage.classList.add('jolt');
  }
  function topIdx() {
    var best = 0;
    for (var i = 1; i < edges.length; i++) if (edges[i][1] < edges[best][1]) best = i;
    return best;
  }
  function strike() {
    var t = E(topIdx());
    var sx = t[0] + (Math.random() - 0.5) * W * 0.3;
    addBolt(sx, -10, t[0], t[1], 240, 1.8, 1);
    doFlash(0.8); jolt();
  }

  /* ---------- pointer ---------- */
  function move(e) {
    mx = e.clientX - hero.getBoundingClientRect().left; my = e.clientY - hero.getBoundingClientRect().top;
    active = true;
    nx = (e.clientX / window.innerWidth - 0.5) * 2; ny = (e.clientY / window.innerHeight - 0.5) * 2;
    measure();
    var u = (mx - geo.l) / geo.w, v = (my - geo.t) / geo.h;
    over = overPerson(u, v);
    stage.style.setProperty('--mx', (mx - geo.l) + 'px');
    stage.style.setProperty('--my', (my - geo.t) + 'px');
    stage.classList.toggle('on', over);
    if (cur) { cur.classList.add('show'); cur.classList.toggle('scan', over); }
  }
  hero.addEventListener('pointermove', move);
  hero.addEventListener('pointerdown', function (e) {
    move(e);
    if (reduce) return;
    measure();
    var n = over ? 6 : 3;
    for (var i = 0; i < n; i++) {
      var p = E(Math.floor(Math.random() * edges.length));
      addBolt(mx, my, p[0], p[1], 220, 1.5, 1);
    }
    doFlash(0.55); jolt();
  });
  hero.addEventListener('pointerleave', function () {
    active = false; over = false; stage.classList.remove('on');
    if (cur) cur.classList.remove('show', 'scan');
  });

  /* ---------- role line ---------- */
  var roles = ['Embedded Systems', 'EV Motor Control', 'Power Electronics', 'Machine Learning', 'IoT & Research'], ri = 0;
  if (roleEl && !reduce) {
    setInterval(function () {
      roleEl.classList.add('out');
      setTimeout(function () { ri = (ri + 1) % roles.length; roleEl.textContent = roles[ri]; roleEl.classList.remove('out'); }, 300);
    }, 2600);
  }

  /* ---------- main loop ---------- */
  var running = true, last = performance.now();
  document.addEventListener('visibilitychange', function () { running = !document.hidden; last = performance.now(); });

  setTimeout(function () { if (!reduce) { measure(); strike(); } }, 700);

  function frame(now) {
    requestAnimationFrame(frame);
    if (!running) return;
    tick++;
    var dt = Math.min(0.05, (now - last) / 1000); last = now;

    if (!reduce) {
      px += (nx * -10 - px) * 0.07; py += (ny * -5 - py) * 0.07;
      stage.style.transform = 'translate3d(' + px.toFixed(2) + 'px,' + py.toFixed(2) + 'px,0)';
      if (word) word.style.transform = 'translate(calc(-50% + ' + (nx * -34).toFixed(1) + 'px),' + (ny * -16).toFixed(1) + 'px)';
    }
    var vx = mx - lastX, vy = my - lastY; lastX = mx; lastY = my;
    gx += (Math.max(-14, Math.min(14, vx)) - gx) * 0.25; gy += (Math.max(-14, Math.min(14, vy)) - gy) * 0.25;
    stage.style.setProperty('--gx', gx.toFixed(1) + 'px'); stage.style.setProperty('--gy', gy.toFixed(1) + 'px');
    if (cur && fine) {
      curX += (mx + hero.getBoundingClientRect().left - curX) * 0.24; curY += (my + hero.getBoundingClientRect().top - curY) * 0.24;
      cur.style.transform = 'translate3d(' + curX.toFixed(1) + 'px,' + curY.toFixed(1) + 'px,0) translate(-50%,-50%)';
    }
    if (reduce) return;

    if (now > nextAmb) {
      measure();
      var a = Math.floor(Math.random() * edges.length), p1 = E(a), p2 = null;
      for (var tries = 0; tries < 14 && !p2; tries++) {
        var q = E(Math.floor(Math.random() * edges.length)), d = Math.hypot(q[0] - p1[0], q[1] - p1[1]);
        if (d > 90 && d < 360) p2 = q;
      }
      if (p2) addBolt(p1[0], p1[1], p2[0], p2[1], 170, 1.2, 0.9);
      nextAmb = now + 900 + Math.random() * 1700;
    }
    if (now > nextStrike) { measure(); strike(); nextStrike = now + 6500 + Math.random() * 5500; }

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = 'lighter'; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

    /* arcs from the cursor to the nearby outline */
    if (active && edges.length) {
      measure();
      var R = over ? 420 : 330, near = [];
      for (var i = 0; i < edges.length; i++) {
        var P = E(i), dd = Math.hypot(P[0] - mx, P[1] - my);
        if (dd < R) near.push([dd, P]);
      }
      if (near.length) {
        near.sort(function (m, n) { return m[0] - n[0]; });
        var k = over ? 4 : 2;
        for (var c = 0; c < k && c < near.length; c++) {
          var tgt = c === 0 ? near[0][1] : near[Math.min(near.length - 1, Math.floor(Math.random() * Math.min(near.length, 40)))][1];
          var pts = jag(mx, my, tgt[0], tgt[1], Math.hypot(tgt[0] - mx, tgt[1] - my) * 0.2);
          var alpha = Math.max(0.35, 1 - near[0][0] / R * 0.6);
          drawBolt(pts, c === 0 ? 1.1 : 0.8, alpha);
          if (c === 0 && tick % 3 === 0) branches(pts, 0.9, alpha);
        }
        var g = ctx.createRadialGradient(mx, my, 0, mx, my, over ? 46 : 28);
        g.addColorStop(0, 'rgba(255,255,255,.9)'); g.addColorStop(0.3, 'rgba(25,240,255,.5)'); g.addColorStop(1, 'rgba(25,240,255,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mx, my, over ? 46 : 28, 0, 6.283); ctx.fill();
      }
    }

    /* timed bolts (ambient, strikes, click shock) */
    for (var b = timed.length - 1; b >= 0; b--) {
      var t = timed[b], age = now - t.born;
      if (age > t.life) { timed.splice(b, 1); continue; }
      if (now - t.regen > 45) { t.pts = jag(t.x1, t.y1, t.x2, t.y2); t.regen = now; }
      var f = 1 - age / t.life, fl = (Math.floor(age / 38) % 2) ? 1 : 0.6;
      drawBolt(t.pts, t.w, f * fl * t.a);
      if (age < 90) branches(t.pts, t.w, f * t.a);
    }
    ctx.globalCompositeOperation = 'source-over';
  }
  requestAnimationFrame(frame);
})();
