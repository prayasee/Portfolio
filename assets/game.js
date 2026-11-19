/* Spark Arena: lightweight quiz game (electrical engineering, world affairs, finance). No canvas, transform/opacity animations only. */
(function () {
  var Q = {
    elec: [
      ['Which unit measures electrical resistance?', 'Ohm', ['Henry', 'Farad', 'Weber'], 'Named after Georg Ohm. One ohm lets 1 A flow when 1 V is applied.'],
      ['Ohm’s law is written as…', 'V = I × R', ['P = V / I', 'V = I / R', 'I = V × R'], 'Voltage equals current times resistance.'],
      ['India’s power grid runs at which frequency?', '50 Hz', ['60 Hz', '25 Hz', '100 Hz'], 'Most of the world uses 50 Hz; the USA and some others use 60 Hz.'],
      ['Which device steps AC voltage up or down?', 'Transformer', ['Rectifier', 'Inverter', 'Capacitor'], 'Transformers work by mutual induction and have no moving parts.'],
      ['Which device converts AC to DC?', 'Rectifier', ['Inverter', 'Transformer', 'Relay'], 'Diode bridges are the classic rectifier. An inverter does the opposite (DC to AC).'],
      ['Who discovered electromagnetic induction in 1831?', 'Michael Faraday', ['Nikola Tesla', 'Alessandro Volta', 'James Watt'], 'Faraday’s discovery is the basis of every generator and transformer.'],
      ['The SI unit of capacitance is the…', 'Farad', ['Henry', 'Tesla', 'Siemens'], 'Named after Michael Faraday.'],
      ['Electrical power in a DC circuit is…', 'P = V × I', ['P = V / I', 'P = I / V', 'P = R / V'], 'Watts = volts times amperes. It also equals I²R and V²/R.'],
      ['A generator converts…', 'Mechanical energy to electrical energy', ['Electrical energy to mechanical energy', 'AC to DC only', 'Heat to light'], 'A motor does the reverse.'],
      ['Why is electricity transmitted at very high voltage?', 'It cuts I²R losses', ['It increases current', 'It makes wires heavier', 'It raises frequency'], 'For the same power, higher voltage means lower current, so far less heat loss in the lines.'],
      ['The SI unit of inductance is the…', 'Henry', ['Farad', 'Ohm', 'Coulomb'], 'Named after Joseph Henry.'],
      ['Which semiconductor dominates modern chips?', 'Silicon', ['Copper', 'Iron', 'Gold'], 'Silicon is abundant and forms a stable oxide, ideal for transistors.'],
      ['Which component stores energy in a magnetic field?', 'Inductor', ['Capacitor', 'Resistor', 'Diode'], 'A capacitor stores energy in an electric field instead.'],
      ['Which component mainly lets current flow in one direction?', 'Diode', ['Resistor', 'Capacitor', 'Inductor'], 'Diodes conduct when forward biased and block when reverse biased.'],
      ['Regenerative braking in an EV…', 'Turns braking energy back into stored charge', ['Cools the battery', 'Adds tyre grip', 'Charges from the sun'], 'The motor acts as a generator while slowing the vehicle.'],
      ['In an EV, what does BMS stand for?', 'Battery Management System', ['Basic Motor Switch', 'Brake Monitoring System', 'Battery Mapping Software'], 'It balances cells and protects the pack from over-charge, over-discharge and over-temperature.'],
      ['A typical lightning stroke peaks at roughly…', '30,000 A', ['30 A', '300 mA', '3 A'], 'Peak currents of tens of kiloamperes are typical, for a few microseconds.'],
      ['In a balanced three-phase supply the phases are apart by…', '120°', ['90°', '60°', '180°'], 'That is why three-phase power gives smooth, constant power delivery.'],
      ['PWM stands for…', 'Pulse Width Modulation', ['Power Wave Modulation', 'Phase Winding Method', 'Peak Wattage Meter'], 'Varying the duty cycle controls average power to motors, LEDs and converters.'],
      ['Which law says the currents at a node sum to zero?', 'Kirchhoff’s Current Law', ['Faraday’s Law', 'Lenz’s Law', 'Ampere’s Law'], 'Charge is conserved: what flows in must flow out.'],
      ['What creates the rotating magnetic field in an induction motor?', 'Three-phase supply to the stator', ['DC supply to the rotor', 'Capacitor bank', 'Permanent magnets in the rotor'], 'The rotating field induces current in the rotor, which then follows the field.'],
      ['Who built the first commercial central power station in New York (1882)?', 'Thomas Edison', ['Nikola Tesla', 'Michael Faraday', 'Alexander Bell'], 'Pearl Street Station used DC. AC later won the long-distance transmission race.'],
      ['MPPT in a solar system stands for…', 'Maximum Power Point Tracking', ['Minimum Power Phase Timer', 'Multi-Panel Power Transfer', 'Motor Power Pulse Test'], 'It keeps the panel at the voltage where it delivers the most power.'],
      ['The power factor of a purely resistive load is…', '1', ['0', '0.5', 'Infinity'], 'Voltage and current are in phase, so all apparent power is real power.'],
      ['The ESP32 microcontroller is made by…', 'Espressif Systems', ['Arduino', 'Microchip', 'Texas Instruments'], 'It has built-in Wi-Fi and Bluetooth, popular for IoT projects.'],
      ['A kilowatt-hour (kWh) measures…', 'Energy', ['Power', 'Voltage', 'Current'], 'Your electricity bill is charged in kWh, which is 3.6 million joules.'],
      ['One mechanical horsepower is about…', '746 watts', ['100 watts', '1,000 watts', '500 watts'], 'The figure is 745.7 W exactly for mechanical horsepower.'],
      ['A Hall-effect sensor detects…', 'Magnetic fields', ['Sound only', 'Light only', 'Gas only'], 'Used for current sensing, speed sensing and position in motors.'],
      ['Superconductors carry current with…', 'Zero resistance below a critical temperature', ['Double resistance', 'Only AC', 'No voltage at all'], 'Used in MRI magnets and research on lossless power cables.']
    ],
    world: [
      ['How many permanent members does the UN Security Council have?', '5', ['7', '10', '15'], 'USA, UK, France, Russia and China, each with veto power.'],
      ['Which of these is NOT a permanent member of the UN Security Council?', 'India', ['France', 'China', 'United States'], 'India is among the countries seeking a permanent seat.'],
      ['Where is the UN headquarters?', 'New York', ['Geneva', 'Paris', 'Brussels'], 'The UN also has major offices in Geneva, Vienna and Nairobi.'],
      ['Where is the World Trade Organization headquartered?', 'Geneva', ['New York', 'Washington D.C.', 'London'], 'The WTO sets rules for trade between nations.'],
      ['What is the lower house of India’s Parliament?', 'Lok Sabha', ['Rajya Sabha', 'Vidhan Sabha', 'Gram Sabha'], 'Its members are directly elected.'],
      ['How many seats are elected in the Lok Sabha?', '543', ['545', '500', '552'], 'The majority mark is 272.'],
      ['Roughly how many member states does the UN have?', '193', ['175', '205', '215'], 'South Sudan became the 193rd member in 2011.'],
      ['Which group was admitted as a permanent member of the G20 at the 2023 New Delhi summit?', 'African Union', ['ASEAN', 'OPEC', 'BRICS'], 'India held the G20 presidency in 2023.'],
      ['Which country joined Brazil, Russia, India and China in 2010 to make BRICS?', 'South Africa', ['Egypt', 'Indonesia', 'Mexico'], 'The final S in BRICS stands for South Africa.'],
      ['Which institution, based in Washington D.C., lends to countries and monitors the global economy?', 'IMF', ['WTO', 'ECB', 'BIS'], 'The International Monetary Fund was created at Bretton Woods in 1944.'],
      ['In which year was NATO founded?', '1949', ['1939', '1955', '1961'], 'The North Atlantic Treaty was signed in Washington in April 1949.'],
      ['The Constitution of India came into effect on…', '26 January 1950', ['15 August 1947', '2 October 1949', '26 November 1949'], 'Celebrated every year as Republic Day.'],
      ['Which is the largest country by area?', 'Russia', ['Canada', 'China', 'United States'], 'Russia covers more than 17 million square kilometres.'],
      ['The 2015 Paris Agreement aims to hold warming well below…', '2 °C', ['0.5 °C', '5 °C', '10 °C'], 'It also pursues efforts to limit warming to 1.5 °C.'],
      ['In climate talks, COP stands for…', 'Conference of the Parties', ['Council of Power', 'Committee on Pollution', 'Convention of Peace'], 'It is the yearly UN climate conference.'],
      ['Who is the head of government in India’s parliamentary system?', 'Prime Minister', ['President', 'Chief Justice', 'Speaker'], 'The President is the head of state.']
    ],
    fin: [
      ['What does RBI stand for?', 'Reserve Bank of India', ['Regional Bank of India', 'Republic Bank of India', 'Rural Bank of India'], 'India’s central bank, founded in 1935.'],
      ['Which body regulates India’s securities market?', 'SEBI', ['RBI', 'IRDAI', 'TRAI'], 'Securities and Exchange Board of India.'],
      ['The Sensex is an index of which exchange?', 'BSE', ['NSE', 'MCX', 'NYSE'], 'The Nifty 50 belongs to the NSE.'],
      ['Inflation means…', 'A general rise in prices over time', ['A fall in prices', 'A rise in employment', 'A rise in the stock market'], 'Your money buys less than before.'],
      ['GDP stands for…', 'Gross Domestic Product', ['General Domestic Profit', 'Gross Domestic Price', 'Global Development Plan'], 'The total value of goods and services produced in a country.'],
      ['When a central bank raises interest rates, it usually aims to…', 'Cool inflation', ['Increase prices', 'Print more money', 'Cut taxes'], 'Higher rates make borrowing costlier and slow demand.'],
      ['A “bull market” means prices are generally…', 'Rising', ['Falling', 'Flat', 'Frozen'], 'A bear market is the opposite.'],
      ['What is diversification?', 'Spreading investments to reduce risk', ['Putting all money in one stock', 'Selling everything', 'Only buying gold'], 'Don’t put all your eggs in one basket.'],
      ['SIP in mutual funds stands for…', 'Systematic Investment Plan', ['Stock Income Policy', 'Savings Interest Plan', 'Secure Investment Pool'], 'You invest a fixed amount at regular intervals.'],
      ['Compound interest is interest earned on…', 'Principal plus past interest', ['Principal only', 'Tax only', 'Inflation'], 'It is why starting early matters so much.'],
      ['IPO stands for…', 'Initial Public Offering', ['Internal Profit Order', 'Indexed Price Option', 'Investor Priority Offer'], 'The first time a company sells shares to the public.'],
      ['The “Rule of 72” estimates…', 'Years for money to double', ['Yearly tax', 'Loan EMI', 'Inflation rate'], '72 divided by the annual return gives the doubling time.'],
      ['A dividend is…', 'A share of profit paid to shareholders', ['A bank fee', 'A tax on shares', 'A loan to a company'], 'Not every company pays one.'],
      ['The P/E ratio compares a share’s price with its…', 'Earnings per share', ['Employees', 'Expenses', 'Equity'], 'It is one quick way to judge how richly a stock is valued.'],
      ['The 2008 global financial crisis was triggered mainly by…', 'The US housing and mortgage collapse', ['An oil embargo', 'A tech bubble', 'A currency peg in Asia'], 'Lehman Brothers collapsed in September 2008.'],
      ['The Bretton Woods conference of 1944 created…', 'The IMF and the World Bank', ['The WTO and NATO', 'The UN and OPEC', 'The Euro and ECB'], 'It set up the post-war monetary order.'],
      ['UPI payments in India are run by…', 'NPCI', ['SEBI', 'IRDAI', 'NABARD'], 'The National Payments Corporation of India.'],
      ['Which body regulates the US stock market?', 'SEC', ['FDA', 'FBI', 'NASA'], 'The Securities and Exchange Commission.'],
      ['A bear market is usually defined as a fall of at least…', '20% from a recent high', ['2%', '5%', '50%'], 'The opposite of a bull market.']
    ]
  };
  var MODES = { mix: 'Mixed', elec: 'Electrical', world: 'World & Politics', fin: 'Finance' };
  var RANKS = [[0, 'Apprentice'], [350, 'Technician'], [750, 'Engineer'], [1150, 'Grid Master'], [1600, 'Tesla Level']];
  var ROUND = 10, TIME = 15;
  var root = document.getElementById('arena'); if (!root) return;
  var $ = function (s) { return root.querySelector(s); };
  var st = {};

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) {} return null; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function clear() { while (root.firstChild) root.removeChild(root.firstChild); }
  function rank(s) { var r = RANKS[0][1]; RANKS.forEach(function (x) { if (s >= x[0]) r = x[1]; }); return r; }

  function menu() {
    stop(); clear();
    root.className = 'arena';
    var h = el('div', 'ar-top');
    h.appendChild(el('p', 'eyebrow', 'CHOOSE YOUR ARENA'));
    h.appendChild(el('h2', 'ar-h', 'Charge up your brain.'));
    h.appendChild(el('p', 'ar-sub', '10 questions. 15 seconds each. Quick answers and streaks fill the voltage meter and multiply your score. Facts are general knowledge, not live news.'));
    root.appendChild(h);
    var g = el('div', 'ar-modes');
    Object.keys(MODES).forEach(function (k) {
      var b = el('button', 'ar-mode'); b.type = 'button';
      var best = store('spark-best-' + k);
      b.appendChild(el('b', null, MODES[k]));
      b.appendChild(el('span', null, k === 'mix' ? 'All topics together' : k === 'elec' ? 'Circuits, machines, EVs, power' : k === 'world' ? 'Institutions, geography, climate' : 'Markets, banking, economy'));
      b.appendChild(el('em', null, best ? 'Best ' + best + ' · ' + rank(+best) : 'Not played yet'));
      b.addEventListener('click', function () { start(k); });
      g.appendChild(b);
    });
    root.appendChild(g);
  }

  function start(mode) {
    var pool = mode === 'mix' ? Q.elec.concat(Q.world, Q.fin) : Q[mode];
    st = { mode: mode, qs: shuffle(pool).slice(0, ROUND), i: 0, score: 0, streak: 0, best: 0, right: 0, charge: 0, f5: 1, ft: 1, left: TIME, timer: null, locked: false, t0: 0 };
    build();
    show();
  }

  function build() {
    clear(); root.className = 'arena playing';
    var hud = el('div', 'ar-hud');
    [['sc', 'SCORE', '0'], ['st', 'STREAK', '0'], ['mx', 'MULTIPLIER', '×1'], ['qn', 'QUESTION', '1/' + ROUND]].forEach(function (x) {
      var d = el('div', 'hud-i'); d.appendChild(el('small', null, x[1])); var b = el('b', null, x[2]); b.id = 'h-' + x[0]; d.appendChild(b); hud.appendChild(d);
    });
    root.appendChild(hud);
    var m = el('div', 'ar-meter'); var mi = el('i'); mi.id = 'meter'; m.appendChild(mi); m.appendChild(el('span', null, 'VOLTAGE'));
    root.appendChild(m);
    var tm = el('div', 'ar-time'); var ti = el('i'); ti.id = 'tbar'; tm.appendChild(ti); root.appendChild(tm);
    var c = el('div', 'ar-card'); c.id = 'qcard';
    c.appendChild(el('small', 'ar-cat', '')); c.lastChild.id = 'qcat';
    c.appendChild(el('h2', 'ar-q', '')); c.lastChild.id = 'qtext';
    var o = el('div', 'ar-opts'); o.id = 'opts'; c.appendChild(o);
    var ex = el('div', 'ar-ex'); ex.id = 'qex'; c.appendChild(ex);
    root.appendChild(c);
    var lf = el('div', 'ar-life');
    var b1 = el('button', 'ar-btn', '50 / 50'); b1.type = 'button'; b1.id = 'l5'; b1.addEventListener('click', fifty);
    var b2 = el('button', 'ar-btn', '+8 sec'); b2.type = 'button'; b2.id = 'lt'; b2.addEventListener('click', extra);
    var b3 = el('button', 'ar-btn ghost', 'Quit'); b3.type = 'button'; b3.addEventListener('click', menu);
    var nx = el('button', 'ar-btn go', 'Next →'); nx.type = 'button'; nx.id = 'nx'; nx.hidden = true; nx.addEventListener('click', next);
    lf.appendChild(b1); lf.appendChild(b2); lf.appendChild(b3); lf.appendChild(nx);
    root.appendChild(lf);
  }

  function mult() { return Math.min(4, 1 + Math.floor(st.streak / 3)); }
  function hud() {
    $('#h-sc').textContent = st.score; $('#h-st').textContent = st.streak; $('#h-mx').textContent = '×' + mult();
    $('#h-qn').textContent = Math.min(st.i + 1, ROUND) + '/' + ROUND;
    $('#meter').style.transform = 'scaleX(' + Math.min(1, st.charge / 100) + ')';
    $('#l5').disabled = !st.f5 || st.locked; $('#lt').disabled = !st.ft || st.locked;
  }

  function show() {
    var q = st.qs[st.i]; st.locked = false; st.left = TIME;
    var cat = Q.elec.indexOf(q) > -1 ? 'ELECTRICAL' : Q.world.indexOf(q) > -1 ? 'WORLD & POLITICS' : 'FINANCE';
    $('#qcat').textContent = cat; $('#qtext').textContent = q[0];
    var opts = shuffle([q[1]].concat(q[2])); var box = $('#opts'); box.textContent = '';
    opts.forEach(function (t, n) {
      var b = el('button', 'ar-opt'); b.type = 'button'; b.dataset.v = t;
      b.appendChild(el('kbd', null, String(n + 1))); b.appendChild(el('span', null, t));
      b.addEventListener('click', function () { answer(b, q); });
      box.appendChild(b);
    });
    $('#qex').textContent = ''; $('#qex').className = 'ar-ex'; $('#nx').hidden = true;
    var c = $('#qcard'); c.classList.remove('in'); void c.offsetWidth; c.classList.add('in');
    var tb = $('#tbar'); tb.style.transition = 'none'; tb.style.transform = 'scaleX(1)'; void tb.offsetWidth;
    tb.style.transition = 'transform ' + TIME + 's linear'; tb.style.transform = 'scaleX(0)';
    st.t0 = Date.now(); st.dur = TIME * 1000;
    clearInterval(st.timer); st.timer = setInterval(tick, 200);
    hud();
  }

  function tick() {
    st.left = Math.max(0, (st.dur - (Date.now() - st.t0)) / 1000);
    if (st.left <= 0 && !st.locked) { answer(null, st.qs[st.i]); }
  }
  function stop() { if (st.timer) clearInterval(st.timer); }

  function answer(btn, q) {
    if (st.locked) return; st.locked = true; stop();
    var tb = $('#tbar'); var cs = getComputedStyle(tb).transform; tb.style.transition = 'none'; tb.style.transform = cs;
    var ok = btn && btn.dataset.v === q[1];
    $('#opts').querySelectorAll('.ar-opt').forEach(function (b) {
      b.disabled = true;
      if (b.dataset.v === q[1]) b.classList.add('right');
      else if (b === btn) b.classList.add('wrong');
    });
    var ex = $('#qex');
    if (ok) {
      var m = mult(), gain = Math.round((100 + Math.floor(st.left) * 3) * m);
      st.score += gain; st.streak++; st.right++; st.best = Math.max(st.best, st.streak);
      st.charge = Math.min(100, st.charge + 12 + Math.floor(st.left));
      ex.className = 'ar-ex ok'; ex.textContent = '+' + gain + ' pts. ' + q[3];
      $('#qcard').classList.add('zap');
    } else {
      st.streak = 0; st.charge = Math.max(0, st.charge - 25);
      ex.className = 'ar-ex bad'; ex.textContent = (btn ? 'Not quite. ' : 'Time’s up. ') + 'Answer: ' + q[1] + '. ' + q[3];
      $('#qcard').classList.add('shake');
    }
    setTimeout(function () { var c = $('#qcard'); if (c) c.classList.remove('zap', 'shake'); }, 600);
    var nx = $('#nx'); nx.textContent = st.i === ROUND - 1 ? 'See result' : 'Next →'; nx.hidden = false; nx.focus({ preventScroll: true });
    hud();
  }

  function fifty() {
    if (!st.f5 || st.locked) return; st.f5 = 0;
    var q = st.qs[st.i], bs = Array.prototype.slice.call($('#opts').querySelectorAll('.ar-opt'));
    shuffle(bs.filter(function (b) { return b.dataset.v !== q[1]; })).slice(0, 2).forEach(function (b) { b.disabled = true; b.classList.add('gone'); });
    hud();
  }
  function extra() {
    if (!st.ft || st.locked) return; st.ft = 0; st.dur += 8000;
    var tb = $('#tbar'); var remain = Math.max(0, (st.dur - (Date.now() - st.t0)) / 1000);
    var frac = Math.min(1, remain / TIME);
    tb.style.transition = 'none'; tb.style.transform = 'scaleX(' + frac + ')'; void tb.offsetWidth;
    tb.style.transition = 'transform ' + remain + 's linear'; tb.style.transform = 'scaleX(0)';
    hud();
  }

  function next() {
    if (!st.locked) return;
    st.i++;
    if (st.i >= ROUND) return end();
    show();
  }

  function end() {
    stop(); clear(); root.className = 'arena done';
    var key = 'spark-best-' + st.mode, prev = +(store(key) || 0), isBest = st.score > prev;
    if (isBest) store(key, String(st.score));
    var c = el('div', 'ar-card end in');
    c.appendChild(el('p', 'eyebrow', 'ROUND COMPLETE'));
    c.appendChild(el('h2', 'ar-rank', rank(st.score)));
    c.appendChild(el('p', 'ar-big', String(st.score) + ' pts'));
    var l = el('div', 'ar-stats');
    [['Correct', st.right + '/' + ROUND], ['Best streak', st.best], ['Mode', MODES[st.mode]]].forEach(function (x) { var d = el('div'); d.appendChild(el('small', null, x[0])); d.appendChild(el('b', null, String(x[1]))); l.appendChild(d); });
    c.appendChild(l);
    if (isBest) c.appendChild(el('p', 'ar-new', 'New personal best!'));
    var r = el('div', 'ar-life');
    var a = el('button', 'ar-btn go', 'Play again'); a.type = 'button'; a.addEventListener('click', function () { start(st.mode); });
    var b = el('button', 'ar-btn', 'Change arena'); b.type = 'button'; b.addEventListener('click', menu);
    r.appendChild(a); r.appendChild(b); c.appendChild(r); root.appendChild(c);
  }

  document.addEventListener('keydown', function (e) {
    if (!root.classList.contains('playing') || e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key >= '1' && e.key <= '4' && !st.locked) { var b = $('#opts').children[+e.key - 1]; if (b && !b.disabled) b.click(); e.stopPropagation(); }
    else if ((e.key === 'Enter' || e.key === ' ') && st.locked && !$('#nx').hidden) { e.preventDefault(); next(); }
  }, true);
  document.addEventListener('visibilitychange', function () { /* pause nothing: timer is timestamp based */ });
  menu();
})();
