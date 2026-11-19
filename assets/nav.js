/* Small UX helpers: scroll progress bar, ←/→ page keys, adaptive performance mode. */
(function () {
  var bar = document.querySelector('.prog i');
  var ticking = false;
  function prog() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? Math.min(1, window.scrollY / h) : 0) + ')';
    ticking = false;
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, { passive: true });
  prog();

  /* ← / → move between pages (not while typing or when the menu / lightbox is open) */
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    var t = e.target && e.target.tagName;
    if (t === 'INPUT' || t === 'TEXTAREA') return;
    var lb = document.getElementById('lb'), menu = document.getElementById('menu');
    if ((lb && !lb.hidden) || (menu && menu.classList.contains('open'))) return;
    var sel = e.key === 'ArrowRight' ? 'link[rel=next]' : e.key === 'ArrowLeft' ? 'link[rel=prev]' : null;
    var l = sel && document.querySelector(sel);
    if (l) { if (!('onpageswap' in window)) document.body.classList.add('leaving'); setTimeout(function () { location.href = l.getAttribute('href'); }, 'onpageswap' in window ? 0 : 200); }
  });

  /* if the device struggles, drop the animated circuit background so everything else stays smooth */
  var n = 0, t0 = 0;
  function probe(ts) {
    if (!t0) t0 = ts;
    n++;
    if (ts - t0 < 1400) return requestAnimationFrame(probe);
    var fps = n / ((ts - t0) / 1000);
    if (fps < 38) document.documentElement.classList.add('lite');
  }
  setTimeout(function () { requestAnimationFrame(probe); }, 1200);
})();
