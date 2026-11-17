(function () {
  var items = [].slice.call(document.querySelectorAll('.g-item a'));
  var chips = [].slice.call(document.querySelectorAll('.fchip'));
  var lb = document.getElementById('lb');
  if (!items.length || !lb) return;
  var img = lb.querySelector('img'), cap = lb.querySelector('.lb-c'), ttl = lb.querySelector('.lb-t');
  var groups = [].slice.call(document.querySelectorAll('.g-group'));
  var cur = 0;

  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      chips.forEach(function (x) { x.classList.remove('on'); });
      c.classList.add('on');
      var f = c.getAttribute('data-f');
      items.forEach(function (i) { i.parentNode.hidden = !(f === 'all' || i.parentNode.getAttribute('data-cat') === f); });
      groups.forEach(function (g) { g.hidden = !(f === 'all' || g.getAttribute('data-g') === f); });
    });
  });

  function vis() { return items.filter(function (i) { return !i.parentNode.hidden && !i.parentNode.parentNode.parentNode.hidden; }); }
  function show() {
    var v = vis(), a = v[cur];
    img.src = a.getAttribute('href');
    img.alt = a.querySelector('img').alt;
    ttl.textContent = a.getAttribute('data-cap') + '  ·  ' + (cur + 1) + '/' + v.length;
    cap.textContent = a.getAttribute('data-desc');
  }
  function open(el) {
    var v = vis(); cur = v.indexOf(el); show();
    lb.hidden = false; document.body.style.overflow = 'hidden';
    requestAnimationFrame(function () { lb.classList.add('on'); });
  }
  function close() {
    lb.classList.remove('on'); document.body.style.overflow = '';
    setTimeout(function () { lb.hidden = true; img.removeAttribute('src'); }, 280);
  }
  function go(d) { var n = vis().length; cur = (cur + d + n) % n; show(); }

  items.forEach(function (i) { i.addEventListener('click', function (e) { e.preventDefault(); open(i); }); });
  lb.querySelector('.lb-x').addEventListener('click', close);
  lb.querySelector('.lb-p').addEventListener('click', function () { go(-1); });
  lb.querySelector('.lb-n').addEventListener('click', function () { go(1); });
  lb.addEventListener('click', function (e) { if (e.target === lb || e.target.classList.contains('lb-box')) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') go(-1);
    if (e.key === 'ArrowRight') go(1);
  });
  var sx = 0;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  }, { passive: true });
})();
