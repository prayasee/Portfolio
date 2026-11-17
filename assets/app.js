(function () {
  var body = document.body;
  window.addEventListener('pageshow', function (e) { if (e.persisted) body.classList.remove('leaving'); });

  /* menu */
  var btn = document.getElementById('menuBtn');
  var menu = document.getElementById('menu');
  function setMenu(open) {
    menu.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
    menu.setAttribute('aria-hidden', !open);
    body.style.overflow = open ? 'hidden' : '';
  }
  btn.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  menu.addEventListener('click', function (e) { if (e.target === menu) setMenu(false); });

  var cur = location.pathname.split('/').pop() || 'index.html';
  if (cur.indexOf('.') < 0) cur += '.html';
  document.querySelectorAll('.menu-link').forEach(function (a) {
    if (a.getAttribute('href') === cur) a.classList.add('cur');
  });

  /* smooth page fade */
  document.querySelectorAll('a[href]').forEach(function (a) {
    var h = a.getAttribute('href');
    if (!h || h.charAt(0) === '#' || /^(https?:|mailto:|tel:)/.test(h) || a.target === '_blank' || /\.(pdf|jpe?g|png|webp)$/i.test(h) || a.hasAttribute('download')) return;
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      body.classList.add('leaving');
      setTimeout(function () { location.href = h; }, 260);
    });
  });

  /* reveal on scroll */
  var els = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          var d = (Array.prototype.indexOf.call(en.target.parentNode.children, en.target) % 6) * 70;
          en.target.style.transitionDelay = d + 'ms';
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.1 });
    els.forEach(function (el) { io.observe(el); });
  } else { els.forEach(function (el) { el.classList.add('in'); }); }

  /* count-up numbers */
  var counters = document.querySelectorAll('[data-count]');
  function run(el) {
    var target = +el.getAttribute('data-count'), t0 = null;
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 1100, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (en) {
      en.forEach(function (x) { if (x.isIntersecting) { run(x.target); co.unobserve(x.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  } else { counters.forEach(function (c) { c.textContent = c.getAttribute('data-count'); }); }

  /* contact form -> mail app */
  var f = document.getElementById('contactForm');
  if (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var d = new FormData(f);
      if (!d.get('name') || !d.get('email') || !d.get('message')) { alert('Please fill in name, email and message.'); return; }
      var subj = d.get('subject') || 'Portfolio enquiry from ' + d.get('name');
      var msg = d.get('message') + '\n\n' + d.get('name') + '\n' + d.get('email');
      location.href = 'mailto:prayas629@gmail.com?subject=' + encodeURIComponent(subj) + '&body=' + encodeURIComponent(msg);
    });
  }
})();
