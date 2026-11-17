/* Power-suit effect: as the cursor passes over the portrait an armoured suit with a glowing visor
   "wears itself" along the path of the cursor, then slowly powers down again. */
(function () {
  var photo = document.getElementById('portrait'), cv = document.getElementById('armor');
  if (!photo || !cv) return;
  var W = 450, H = 523, ctx = cv.getContext('2d');
  cv.width = W; cv.height = H;
  var T = document.createElement('canvas'), M = document.createElement('canvas');
  T.width = M.width = W; T.height = M.height = H;
  var tc = T.getContext('2d'), mc = M.getContext('2d');
  var ready = false, energy = 0, running = false, last = null, t0 = performance.now();

  function hex(c, x, y, r) {
    c.beginPath();
    for (var i = 0; i < 6; i++) { var a = Math.PI / 3 * i + Math.PI / 6; c.lineTo(x + r * Math.cos(a), y + r * Math.sin(a)); }
    c.closePath();
  }
  function build() {
    tc.clearRect(0, 0, W, H);
    tc.globalCompositeOperation = 'source-over';
    tc.drawImage(photo, 0, 0, W, H);
    tc.globalCompositeOperation = 'source-atop';            /* everything below only paints on the body */
    var g = tc.createLinearGradient(0, 0, W * .35, H);
    g.addColorStop(0, 'rgba(6,24,66,.88)'); g.addColorStop(.5, 'rgba(14,62,130,.84)'); g.addColorStop(1, 'rgba(5,28,70,.9)');
    tc.fillStyle = g; tc.fillRect(0, 0, W, H);
    /* armour plates */
    var r = 15, dx = r * Math.sqrt(3), dy = r * 1.5;
    for (var row = -1; row < H / dy + 1; row++) for (var col = -1; col < W / dx + 1; col++) {
      var x = col * dx + (row % 2 ? dx / 2 : 0), y = row * dy;
      hex(tc, x, y, r - 1);
      var v = (row * 7 + col * 13) % 5;
      tc.fillStyle = v === 0 ? 'rgba(90,200,255,.20)' : v === 1 ? 'rgba(10,40,100,.35)' : 'rgba(40,120,220,.08)';
      tc.fill(); tc.strokeStyle = 'rgba(25,240,255,.42)'; tc.lineWidth = 1; tc.stroke();
    }
    /* metal sheen */
    var s = tc.createLinearGradient(0, 0, W, H * .5);
    s.addColorStop(0, 'rgba(255,255,255,0)'); s.addColorStop(.45, 'rgba(180,230,255,.22)'); s.addColorStop(.6, 'rgba(255,255,255,0)');
    tc.fillStyle = s; tc.fillRect(0, 0, W, H);
    /* glowing power lines */
    tc.shadowColor = '#19f0ff'; tc.shadowBlur = 8; tc.strokeStyle = 'rgba(120,250,255,.95)'; tc.lineWidth = 2;
    function line(pts) { tc.beginPath(); tc.moveTo(pts[0][0] * W, pts[0][1] * H); for (var i = 1; i < pts.length; i++) tc.lineTo(pts[i][0] * W, pts[i][1] * H); tc.stroke(); }
    line([[.40, .42], [.46, .50], [.50, .62]]); line([[.60, .42], [.54, .50], [.50, .62]]);
    line([[.50, .62], [.50, .98]]); line([[.28, .50], [.36, .56], [.42, .58]]); line([[.72, .50], [.64, .56], [.58, .58]]);
    line([[.25, .62], [.25, .98]]); line([[.75, .62], [.75, .98]]);
    /* arc reactor */
    var cx = .5 * W, cy = .60 * H;
    var rg = tc.createRadialGradient(cx, cy, 0, cx, cy, 34);
    rg.addColorStop(0, 'rgba(255,255,255,1)'); rg.addColorStop(.3, 'rgba(120,250,255,.95)'); rg.addColorStop(1, 'rgba(25,240,255,0)');
    tc.fillStyle = rg; tc.beginPath(); tc.arc(cx, cy, 34, 0, 7); tc.fill();
    tc.lineWidth = 2.5; tc.beginPath(); tc.arc(cx, cy, 17, 0, 7); tc.stroke();
    tc.lineWidth = 1.5; tc.beginPath(); tc.arc(cx, cy, 25, 0, 7); tc.stroke();
    /* keep the face clear: the suit becomes a helmet-and-visor around it */
    tc.shadowBlur = 0; tc.globalCompositeOperation = 'destination-out';
    tc.save(); tc.translate(.505 * W, .255 * H); tc.scale(.105 * W, .125 * H);
    var fg = tc.createRadialGradient(0, 0, 0, 0, 0, 1); fg.addColorStop(0, 'rgba(0,0,0,1)'); fg.addColorStop(.72, 'rgba(0,0,0,1)'); fg.addColorStop(1, 'rgba(0,0,0,0)');
    tc.fillStyle = fg; tc.beginPath(); tc.arc(0, 0, 1, 0, 7); tc.fill(); tc.restore();
    tc.globalCompositeOperation = 'source-over';
    tc.shadowColor = '#19f0ff';
    /* visor over the eyes */
    var vx = .425 * W, vy = .183 * H, vw = .185 * W, vh = .042 * H;
    tc.shadowBlur = 14; tc.fillStyle = 'rgba(10,60,130,.22)'; tc.strokeStyle = '#7ffcff'; tc.lineWidth = 2;
    tc.beginPath(); tc.moveTo(vx, vy + vh * .3); tc.lineTo(vx + vw * .5, vy); tc.lineTo(vx + vw, vy + vh * .3); tc.lineTo(vx + vw * .94, vy + vh); tc.lineTo(vx + vw * .06, vy + vh); tc.closePath();
    tc.fill(); tc.stroke();
    var vg = tc.createLinearGradient(vx, 0, vx + vw, 0);
    vg.addColorStop(0, 'rgba(25,240,255,.0)'); vg.addColorStop(.5, 'rgba(160,255,255,.35)'); vg.addColorStop(1, 'rgba(25,240,255,0)');
    tc.shadowBlur = 0; tc.fillStyle = vg; tc.fillRect(vx + 6, vy + vh * .42, vw - 12, vh * .22);
    tc.globalCompositeOperation = 'source-over'; tc.shadowBlur = 0;
    ready = true;
  }
  if (photo.complete && photo.naturalWidth) build(); else photo.addEventListener('load', build);

  function paint(x, y) {                                    /* reveal the suit around (x, y) in canvas pixels */
    var g = mc.createRadialGradient(x, y, 0, x, y, 62);
    g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(.6, 'rgba(0,0,0,.85)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    mc.globalCompositeOperation = 'source-over'; mc.fillStyle = g; mc.beginPath(); mc.arc(x, y, 62, 0, 7); mc.fill();
    energy = 1;
  }
  function move(e) {
    if (!ready) return;
    var b = cv.getBoundingClientRect();
    if (!b.width || e.clientX < b.left || e.clientX > b.right || e.clientY < b.top || e.clientY > b.bottom) { last = null; return; }
    var x = (e.clientX - b.left) / b.width * W, y = (e.clientY - b.top) / b.height * H;
    if (last) {
      var d = Math.hypot(x - last[0], y - last[1]), n = Math.max(1, Math.ceil(d / 14));
      for (var i = 1; i <= n; i++) paint(last[0] + (x - last[0]) * i / n, last[1] + (y - last[1]) * i / n);
    } else paint(x, y);
    last = [x, y];
    if (!running) { running = true; requestAnimationFrame(frame); }
  }
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', move, { passive: true });

  function frame(ts) {
    mc.globalCompositeOperation = 'destination-out'; mc.fillStyle = 'rgba(0,0,0,.010)'; mc.fillRect(0, 0, W, H);   /* slow power-down */
    ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
    ctx.drawImage(T, 0, 0);
    ctx.globalCompositeOperation = 'destination-in'; ctx.drawImage(M, 0, 0);
    ctx.globalCompositeOperation = 'source-over';
    energy *= 0.992;
    if (energy > 0.02 || last) requestAnimationFrame(frame);
    else { running = false; ctx.clearRect(0, 0, W, H); mc.clearRect(0, 0, W, H); }
  }
})();
