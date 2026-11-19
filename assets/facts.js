/* Rotating motivation + electrical engineering facts above the portrait. Opacity-only animation, one timer. */
(function () {
  var box = document.getElementById('heroFact'), tx = document.getElementById('factText');
  if (!box || !tx) return;
  var F = [
    'Every great grid started as one spark of curiosity.',
    'Lightning peaks at around 30,000 amperes for a few microseconds.',
    'Power travels at high voltage because I\u00b2R losses fall as current drops.',
    'Faraday discovered induction in 1831. Every generator still runs on it.',
    'Small steps in code, circuits and study compound like interest.',
    'An EV motor turns into a generator the moment you brake.',
    'Hard problems are just circuits nobody has closed yet.',
    'One kilowatt-hour is 3.6 million joules of energy.',
    'Markets, machines and politics all run on energy. Keep learning all three.',
    'A balanced three-phase supply gives smooth, constant power.',
    'The best way to predict the future of energy is to build it.',
    'An MPPT keeps a solar panel at the voltage where it gives the most power.'
  ];
  var i = Math.floor(Math.random() * F.length), reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  tx.textContent = F[i];
  setInterval(function () {
    if (document.hidden) return;
    i = (i + 1) % F.length;
    if (reduce) { tx.textContent = F[i]; return; }
    box.classList.add('out');
    setTimeout(function () { tx.textContent = F[i]; box.classList.remove('out'); }, 380);
  }, 5600);
})();
