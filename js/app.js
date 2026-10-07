/* Kinara: everything that moves or answers a tap.
   Safety rules from CLAUDE.md that this file keeps:
   1. Nothing is saved: no storage, no cookies. The language choice lives only in memory.
   2. Nothing is loaded from other websites: sounds and language files come from this site.
   3. Quick exit (inline in index.html) calls window.KINARA_STOP to silence every sound at once. */
(function () {
  'use strict';

  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var VERSION = '2026-10-07';

  /* ================= Languages ================= */

  // In order of how many people speak them in India (Census 2011). Bengali is second.
  var LANGS = [
    { code: 'en', native: 'English', name: 'English' },
    { code: 'hi', native: 'हिन्दी', name: 'Hindi' },
    { code: 'bn', native: 'বাংলা', name: 'Bengali' },
    { code: 'mr', native: 'मराठी', name: 'Marathi' },
    { code: 'te', native: 'తెలుగు', name: 'Telugu' },
    { code: 'ta', native: 'தமிழ்', name: 'Tamil' },
    { code: 'gu', native: 'ગુજરાતી', name: 'Gujarati' },
    { code: 'ur', native: 'اردو', name: 'Urdu', dir: 'rtl' },
    { code: 'kn', native: 'ಕನ್ನಡ', name: 'Kannada' },
    { code: 'or', native: 'ଓଡ଼ିଆ', name: 'Odia' },
    { code: 'ml', native: 'മലയാളം', name: 'Malayalam' },
    { code: 'pa', native: 'ਪੰਜਾਬੀ', name: 'Punjabi' }
  ];
  // A language is marked checked once a native speaker has read every line (see CLAUDE.md).
  // Until then the page shows a small note that the translation is still being checked.
  var CHECKED = { en: true };

  // English text that is not on the page when it loads. Translations use the same keys.
  /* EN-START */
  var EN = {
    'call': 'Call {n}',
    'n14490.also': 'The same helpline also answers on {n}.',
    'n14416.also': 'Also on {n}.',
    'copied': 'Copied',
    'selected': 'Number selected',
    'breathe.in': 'Breathe in…',
    'breathe.out': 'Breathe out…',
    'breathe.stop': 'Stop',
    'breathe.unfull': 'Close full screen',
    'sand.empty': 'Write something first, then let the wave take it.',
    'sand.done': 'The wave took it. Nothing was saved.',
    'ground.next': 'Next',
    'ground.finish': 'Finish',
    'ground.again': 'Start again',
    'snd.loading': 'Loading…',
    'snd.on': 'On',
    'snd.err': 'This sound could not play on this phone. The other tools still work.',
    'snd.none': 'This browser cannot play sounds. The breathing waves may help instead.',
    'kind': [
      'None of this is your fault.',
      'You deserve to feel safe, at home and everywhere.',
      'Your feelings make sense. Anyone would feel this way.',
      'You have made it through every hard day so far. That takes real strength.',
      'Asking for help is a brave thing to do.',
      'You are not too much. You never were.',
      'Rest is allowed. You don’t have to fix everything today.',
      'You matter, just as you are.',
      'One slow breath at a time is enough.',
      'Being blamed for something doesn’t make it your fault.',
      'There are people whose job is to help you, and they are one call away.',
      'You can be gentle with yourself today.'
    ]
  };
  /* EN-END */

  window.KINARA_LANG = window.KINARA_LANG || {};
  var pageEnglish = {};
  var current = 'en';
  var onLanguage = [];

  function meta(code) { for (var i = 0; i < LANGS.length; i++) if (LANGS[i].code === code) return LANGS[i]; return null; }

  function t(key) {
    var d = current !== 'en' ? window.KINARA_LANG[current] : null;
    if (d && d[key] != null) return d[key];
    if (pageEnglish[key] != null) return pageEnglish[key];
    return EN[key];
  }

  // remember the English words already on the page, so we can switch back
  $$('[data-i18n]').forEach(function (el) {
    var k = el.getAttribute('data-i18n');
    if (!el.hasAttribute('data-n') && pageEnglish[k] == null) pageEnglish[k] = el.textContent;
  });
  $$('[data-i18n-alt]').forEach(function (el) { pageEnglish[el.getAttribute('data-i18n-alt')] = el.alt; });
  $$('[data-i18n-ph]').forEach(function (el) { pageEnglish[el.getAttribute('data-i18n-ph')] = el.placeholder; });
  $$('[data-i18n-aria]').forEach(function (el) { pageEnglish[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });

  // put a phone number inside a sentence, kept left to right even in Urdu
  function setText(el, s) {
    s = String(s).replace(/ ♡/g, ' ♡'); // keep the heart on the same line as the last word
    var n = el.getAttribute('data-n');
    if (n == null) { el.textContent = s; return; }
    el.textContent = '';
    var parts = String(s).split('{n}');
    for (var i = 0; i < parts.length; i++) {
      if (parts[i]) el.appendChild(document.createTextNode(parts[i]));
      if (i < parts.length - 1) {
        var num = document.createElement(el.classList.contains('also') ? 'b' : 'span');
        num.className = 'ltr';
        num.textContent = n;
        el.appendChild(num);
      }
    }
  }

  function apply(code) {
    current = code;
    var m = meta(code) || LANGS[0];
    var root = document.documentElement;
    root.lang = code;
    root.dir = m.dir || 'ltr';
    $$('[data-i18n]').forEach(function (el) {
      var s = t(el.getAttribute('data-i18n'));
      if (s != null && typeof s === 'string') setText(el, s);
    });
    $$('[data-i18n-alt]').forEach(function (el) { var s = t(el.getAttribute('data-i18n-alt')); if (s) el.alt = s; });
    $$('[data-i18n-ph]').forEach(function (el) { var s = t(el.getAttribute('data-i18n-ph')); if (s) el.placeholder = s; });
    $$('[data-i18n-aria]').forEach(function (el) { var s = t(el.getAttribute('data-i18n-aria')); if (s) el.setAttribute('aria-label', s); });
    $('#lang-current').textContent = m.native;
    $('#draft').hidden = !!CHECKED[code];
    $$('#lang-strip button, #lang-list button').forEach(function (b) {
      b.setAttribute('aria-current', b.getAttribute('data-lang') === code ? 'true' : 'false');
    });
    onLanguage.forEach(function (fn) { fn(); });
    window.dispatchEvent(new Event('kinara:layout'));
  }

  function load(code, done) {
    if (code === 'en' || window.KINARA_LANG[code]) { done(true); return; }
    var s = document.createElement('script');
    s.src = 'lang/' + code + '.js?v=' + VERSION;
    s.onload = function () { done(!!window.KINARA_LANG[code]); };
    s.onerror = function () { done(false); };
    document.head.appendChild(s);
  }

  function switchTo(code) {
    load(code, function (ok) { if (ok) apply(code); });
  }

  function detect() {
    var q = null;
    try { q = new URLSearchParams(window.location.search).get('lang'); } catch (e) { q = null; }
    if (q && meta(q)) return q;
    var list = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    for (var i = 0; i < list.length; i++) {
      var c = String(list[i]).toLowerCase().split('-')[0];
      if (c === 'en') return 'en';
      if (meta(c)) return c;
    }
    return 'en';
  }

  /* ---------- Dialogs ---------- */
  function openDialog(d) {
    if (typeof d.showModal === 'function') { if (!d.open) d.showModal(); } else d.setAttribute('open', '');
  }
  function closeDialog(d) {
    if (typeof d.close === 'function') { if (d.open) d.close(); } else d.removeAttribute('open');
  }
  $$('dialog').forEach(function (d) {
    d.addEventListener('click', function (e) { if (e.target === d || e.target.closest('[data-close]')) closeDialog(d); });
  });

  /* ---------- Language menu and the row of languages in the welcome ---------- */
  var langDialog = $('#lang-dialog');
  var strip = $('#lang-strip');
  var list = $('#lang-list');
  LANGS.forEach(function (l) {
    var li = document.createElement('li');
    var b = document.createElement('button');
    b.type = 'button';
    b.lang = l.code;
    if (l.dir) b.dir = l.dir;
    b.setAttribute('data-lang', l.code);
    b.textContent = l.native;
    b.addEventListener('click', function () { switchTo(l.code); });
    li.appendChild(b);
    strip.appendChild(li);

    var li2 = document.createElement('li');
    var b2 = document.createElement('button');
    b2.type = 'button';
    b2.setAttribute('data-lang', l.code);
    var big = document.createElement('span');
    big.lang = l.code;
    if (l.dir) big.dir = l.dir;
    big.textContent = l.native;
    b2.appendChild(big);
    if (l.code !== 'en') {
      var small = document.createElement('small');
      small.lang = 'en';
      small.textContent = l.name;
      b2.appendChild(small);
    }
    b2.addEventListener('click', function () { switchTo(l.code); closeDialog(langDialog); });
    li2.appendChild(b2);
    list.appendChild(li2);
  });
  $('#lang-open').addEventListener('click', function () { openDialog(langDialog); });

  /* ================= Top bar ================= */
  var bar = $('#bar');
  var hero = $('#hero');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      bar.classList.toggle('solid', window.scrollY > (hero ? hero.offsetHeight - 90 : 10));
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ================= Copy a number ================= */
  $$('[data-copy]').forEach(function (btn) {
    var label = btn.querySelector('span');
    function flash(key) {
      label.textContent = t(key);
      setTimeout(function () { label.textContent = t('copy'); }, 1800);
    }
    function selectNumber() {
      var num = btn.closest('article').querySelector('.num');
      var r = document.createRange();
      r.selectNodeContents(num);
      var sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(r);
      flash('selected');
    }
    btn.addEventListener('click', function () {
      var n = btn.getAttribute('data-copy');
      try { navigator.clipboard.writeText(n).then(function () { flash('copied'); }, selectNumber); }
      catch (e) { selectNumber(); }
    });
  });

  /* ================= The breath clock: 4 seconds in, 6 seconds out ================= */
  // Shared by the tide and the flute, so the flute rises when the water rises.
  var Breath = { running: false, start: performance.now(), version: 0 };
  function ease(x) { return 0.5 - 0.5 * Math.cos(Math.PI * x); }
  function breathAt(now) {
    var s = ((now - Breath.start) / 1000) % 10;
    if (s < 0) s += 10;
    if (s < 4) return { inhale: true, level: ease(s / 4) };
    return { inhale: false, level: 1 - ease((s - 4) / 6) };
  }

  /* ---------- Breathe with the waves ---------- */
  var tide = $('#tide');
  var stage = tide.parentNode;
  var panel = $('#breathe');
  var cue = $('#cue');
  var goBtn = $('#breathe-go');
  var fullBtn = $('#breathe-full');
  var tctx = tide.getContext('2d');
  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var tideVisible = false;
  var tideRunning = false;
  var lastPhase = null;

  function sizeTide() {
    var r = stage.getBoundingClientRect();
    var w = Math.max(2, Math.round(r.width * dpr));
    var h = Math.max(2, Math.round(r.height * dpr));
    if (tide.width !== w || tide.height !== h) { tide.width = w; tide.height = h; }
  }

  function wavePoints(w, h, y0, amp, i, t) {
    var pts = [];
    var step = Math.max(4, w / 80);
    for (var x = 0; x <= w + step; x += step) {
      var y = y0 + Math.sin(x / w * 6.283 * (1.1 + i * 0.37) + t * (0.55 + i * 0.22) + i * 1.7) * amp +
        Math.sin(x / w * 6.283 * (2.9 + i * 0.5) - t * (0.8 + i * 0.1) + i * 2.3) * amp * 0.38;
      pts.push(x, y);
    }
    return pts;
  }

  function drawTide(now) {
    var w = tide.width, h = tide.height;
    if (!w || !h) return;
    var c = tctx;
    var dark = darkQuery.matches;
    var t = reduceMotion ? 0 : now / 1000;
    var level = Breath.running ? breathAt(now).level : 0.3;

    var sky = c.createLinearGradient(0, 0, 0, h);
    if (dark) { sky.addColorStop(0, '#081A21'); sky.addColorStop(1, '#183C45'); }
    else { sky.addColorStop(0, '#F1C9A8'); sky.addColorStop(0.7, '#FBE7D1'); sky.addColorStop(1, '#FDF0E0'); }
    c.fillStyle = sky;
    c.fillRect(0, 0, w, h);

    var sx = w * 0.74, sy = h * 0.3, sr = h * 0.07;
    var glow = c.createRadialGradient(sx, sy, sr * 0.6, sx, sy, sr * 6);
    glow.addColorStop(0, dark ? 'rgba(226,234,240,0.30)' : 'rgba(255,214,150,0.85)');
    glow.addColorStop(1, dark ? 'rgba(226,234,240,0)' : 'rgba(255,214,150,0)');
    c.fillStyle = glow;
    c.fillRect(0, 0, w, h);
    c.fillStyle = dark ? '#EDEFE7' : '#FFF4DC';
    c.beginPath();
    c.arc(sx, sy, sr, 0, 6.2832);
    c.fill();

    var base = h * (0.82 - 0.44 * level);
    var colors = dark
      ? [['#24555C', '#0F3036', 0.5], ['#1B4950', '#0B282D', 0.75], ['#143D44', '#061C20', 1]]
      : [['#8CCBC3', '#4A9A97', 0.55], ['#5AAFAB', '#277775', 0.8], ['#2E8587', '#0F5560', 1]];
    var deepTop = 0;
    for (var i = 0; i < 3; i++) {
      var y0 = base + i * h * 0.075;
      var amp = h * (0.016 + i * 0.008);
      var pts = wavePoints(w, h, y0, amp, i, t);
      c.beginPath();
      c.moveTo(0, h);
      for (var p = 0; p < pts.length; p += 2) c.lineTo(pts[p], pts[p + 1]);
      c.lineTo(w, h);
      c.closePath();
      var g = c.createLinearGradient(0, y0 - amp, 0, h);
      g.addColorStop(0, colors[i][0]);
      g.addColorStop(1, colors[i][1]);
      c.globalAlpha = colors[i][2];
      c.fillStyle = g;
      c.fill();
      c.globalAlpha = 1;
      if (i < 2) {
        c.beginPath();
        for (var q = 0; q < pts.length; q += 2) { if (q === 0) c.moveTo(pts[q], pts[q + 1] + dpr); else c.lineTo(pts[q], pts[q + 1] + dpr); }
        c.strokeStyle = dark ? 'rgba(220,240,236,0.28)' : 'rgba(255,255,255,0.65)';
        c.lineWidth = 1.4 * dpr;
        c.stroke();
      }
      if (i === 2) deepTop = y0;
    }

    // the sun's path of light on the water
    for (var k = 0; k < 16; k++) {
      var yy = base + 4 * dpr + k * (h - base) / 17;
      var spread = w * (0.03 + k * 0.012);
      var xx = sx + Math.sin(k * 12.9898) * spread;
      var a = 0.25 + 0.45 * (0.5 + 0.5 * Math.sin(t * 2.1 + k * 1.7));
      c.fillStyle = dark ? 'rgba(230,238,245,' + (a * 0.5).toFixed(3) + ')' : 'rgba(255,245,215,' + a.toFixed(3) + ')';
      c.beginPath();
      c.ellipse(xx, yy, (5 + k * 0.9) * dpr, 1.1 * dpr, 0, 0, 6.2832);
      c.fill();
    }

    // two little fish, deep in the water
    for (var f = 0; f < 2; f++) {
      var dir = f === 0 ? 1 : -1;
      var pos = ((t * (0.035 + f * 0.012) + f * 0.55) % 1.3) - 0.15;
      var fx = dir > 0 ? pos * w : w - pos * w;
      var fy = deepTop + (h - deepTop) * (0.42 + f * 0.26) + Math.sin(t * 1.3 + f) * 2.5 * dpr;
      var s = (5 + f * 1.5) * dpr;
      c.fillStyle = dark ? 'rgba(170,215,210,0.22)' : 'rgba(255,255,255,0.28)';
      c.beginPath();
      c.ellipse(fx, fy, s * 1.6, s * 0.7, 0, 0, 6.2832);
      c.moveTo(fx - dir * s * 1.4, fy);
      c.lineTo(fx - dir * s * 2.6, fy - s * 0.8);
      c.lineTo(fx - dir * s * 2.6, fy + s * 0.8);
      c.closePath();
      c.fill();
    }
  }

  function updateCue(now) {
    if (!Breath.running || !tideRunning) return;
    var ph = breathAt(now).inhale ? 'in' : 'out';
    if (ph !== lastPhase) {
      lastPhase = ph;
      cue.textContent = t(ph === 'in' ? 'breathe.in' : 'breathe.out');
    }
  }

  var tideLoopOn = false;
  function tideLoop(now) {
    if (!tideLoopOn) return;
    drawTide(now);
    updateCue(now);
    requestAnimationFrame(tideLoop);
  }
  function syncTideLoop() {
    var want = tideVisible && !document.hidden && (tideRunning || !reduceMotion);
    if (want && !tideLoopOn) { tideLoopOn = true; requestAnimationFrame(tideLoop); }
    if (!want) { tideLoopOn = false; drawTide(performance.now()); }
  }

  function setBreathing(on) {
    tideRunning = on;
    Breath.running = on;
    if (on) { Breath.start = performance.now(); Breath.version++; lastPhase = null; }
    goBtn.textContent = t(on ? 'breathe.stop' : 'breathe.start');
    if (!on) cue.textContent = t('breathe.ready');
    syncTideLoop();
  }
  goBtn.addEventListener('click', function () { setBreathing(!tideRunning); });

  function setFull(on) {
    panel.classList.toggle('full', on);
    fullBtn.querySelector('span').textContent = t(on ? 'breathe.unfull' : 'breathe.full');
    if (on && panel.requestFullscreen && !document.fullscreenElement) { panel.requestFullscreen().catch(function () {}); }
    if (!on && document.fullscreenElement && document.exitFullscreen) { document.exitFullscreen().catch(function () {}); }
    setTimeout(function () { sizeTide(); drawTide(performance.now()); }, 60);
    if (on && !tideRunning) setBreathing(true);
  }
  fullBtn.addEventListener('click', function () { setFull(!panel.classList.contains('full')); });
  document.addEventListener('fullscreenchange', function () {
    if (!document.fullscreenElement && panel.classList.contains('full')) setFull(false);
  });

  sizeTide();
  drawTide(performance.now());
  window.addEventListener('resize', function () { sizeTide(); drawTide(performance.now()); }, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) { tideVisible = e[0].isIntersecting; syncTideLoop(); }).observe(stage);
  } else { tideVisible = true; syncTideLoop(); }
  document.addEventListener('visibilitychange', syncTideLoop);
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', function () { drawTide(performance.now()); });

  /* ================= Write it in the sand ================= */
  var sand = $('#sand');
  var sandText = $('#sand-text');
  var sandMsg = $('#sand-msg');
  var sandTimer = null;
  function sandSay(key) {
    sandMsg.textContent = t(key);
    clearTimeout(sandTimer);
    sandTimer = setTimeout(function () { sandMsg.textContent = ''; }, 6000);
  }
  $('#sand-go').addEventListener('click', function () {
    if (!sandText.value.trim()) { sandSay('sand.empty'); return; }
    if (reduceMotion) { sandText.value = ''; sandSay('sand.done'); return; }
    sand.classList.remove('washing');
    void sand.offsetWidth;
    sand.classList.add('washing');
    setTimeout(function () { sandText.value = ''; }, 1250);
    setTimeout(function () { sandSay('sand.done'); }, 2700);
    setTimeout(function () { sand.classList.remove('washing'); }, 6100);
  });
  // nothing stays behind when she leaves (rule 1)
  window.addEventListener('pagehide', function () { sandText.value = ''; });
  window.addEventListener('pageshow', function () { sandText.value = ''; });

  /* ================= Kind words ================= */
  var kindEl = $('#kind-word');
  var kindIndex = 0;
  var deck = [];
  function kindList() { var k = t('kind'); return Array.isArray(k) ? k : EN.kind; }
  function showKind() { kindEl.textContent = kindList()[kindIndex] || EN.kind[kindIndex]; }
  $('#kind-next').addEventListener('click', function () {
    var n = EN.kind.length;
    if (!deck.length) {
      for (var i = 0; i < n; i++) if (i !== kindIndex) deck.push(i);
      for (var j = deck.length - 1; j > 0; j--) { var r = Math.floor(Math.random() * (j + 1)); var tmp = deck[j]; deck[j] = deck[r]; deck[r] = tmp; }
    }
    kindIndex = deck.pop();
    showKind();
  });
  onLanguage.push(showKind);

  /* ================= 5-4-3-2-1 grounding ================= */
  var steps = $$('#ground li');
  var groundBtn = $('#ground-go');
  var groundDone = $('#ground-done');
  var step = -1;
  function groundLabel() {
    if (step < 0) return t('ground.start');
    if (step >= steps.length) return t('ground.again');
    return step === steps.length - 1 ? t('ground.finish') : t('ground.next');
  }
  groundBtn.addEventListener('click', function () {
    if (step >= steps.length) step = -1;
    step++;
    steps.forEach(function (li, j) {
      li.classList.toggle('now', j === step);
      if (j === step) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    groundDone.hidden = step < steps.length;
    groundBtn.textContent = groundLabel();
  });
  onLanguage.push(function () {
    groundBtn.textContent = groundLabel();
    goBtn.textContent = t(tideRunning ? 'breathe.stop' : 'breathe.start');
    fullBtn.querySelector('span').textContent = t(panel.classList.contains('full') ? 'breathe.unfull' : 'breathe.full');
    if (tideRunning) { lastPhase = null; updateCue(performance.now()); } else cue.textContent = t('breathe.ready');
  });

  /* ================= Paintings: tap to see one bigger ================= */
  var artDialog = $('#art-dialog');
  var artPic = $('#art-pic');
  var artCap = $('#art-cap');
  $$('.art').forEach(function (b) {
    b.addEventListener('click', function () {
      var base = b.getAttribute('data-large');
      var title = b.querySelector('b').textContent;
      artPic.textContent = '';
      if (b.hasAttribute('data-avif')) {
        var src = document.createElement('source');
        src.type = 'image/avif';
        src.srcset = base + '.avif';
        artPic.appendChild(src);
      }
      var img = document.createElement('img');
      img.src = base + '.webp';
      img.alt = title;
      img.decoding = 'async';
      artPic.appendChild(img);
      artCap.textContent = '';
      var bold = document.createElement('b');
      bold.textContent = title;
      artCap.appendChild(bold);
      artCap.appendChild(document.createTextNode(b.querySelector('small').textContent));
      artDialog.setAttribute('aria-label', title);
      openDialog(artDialog);
    });
  });

  /* ================= Sounds of the shore ================= */
  var Sound = (function () {
    var AC = window.AudioContext || window.webkitAudioContext;
    var ctx = null;
    var master = null;
    var cache = {};
    var layers = {};
    var ui = {};
    var LEVEL = { ocean: 1.0, birds: 0.7, water: 0.95, flute: 1.0 };
    var msg = $('#snd-msg');
    var stopBtn = $('#stop-all');
    var guide = $('#flute-guide');
    var ring = $('#flute-ring');
    var ext = '.m4a';
    try { if (document.createElement('audio').canPlayType('audio/webm; codecs="opus"')) ext = '.webm'; } catch (e) {}

    function audio() {
      if (!AC) return null;
      if (!ctx || ctx.state === 'closed') {
        try { if (navigator.audioSession) navigator.audioSession.type = 'playback'; } catch (e) {} // play even when an iPhone is on silent
        ctx = new AC();
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -20; comp.knee.value = 14; comp.ratio.value = 2.5; comp.attack.value = 0.03; comp.release.value = 0.5;
        master = ctx.createGain();
        master.gain.value = 0.95;
        master.connect(comp);
        comp.connect(ctx.destination);
        cache = {};
        // older iPhones only start sound inside the tap itself
        var b = ctx.createBuffer(1, 1, 22050), s = ctx.createBufferSource();
        s.buffer = b; s.connect(ctx.destination); s.start(0);
      }
      if (ctx.state === 'suspended' && ctx.resume) ctx.resume();
      return ctx;
    }

    function fetchDecode(url) {
      return fetch(url).then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.arrayBuffer();
      }).then(function (data) {
        return new Promise(function (res, rej) { ctx.decodeAudioData(data, res, rej); });
      });
    }
    function load(path) {
      if (!cache[path]) {
        var other = ext === '.webm' ? '.m4a' : '.webm';
        cache[path] = fetchDecode(path + ext).catch(function () { return fetchDecode(path + other); });
        cache[path].catch(function () { delete cache[path]; });
      }
      return cache[path];
    }

    // where the real sound starts and ends (codecs can add a little silence)
    function trim(buffer) {
      var d = buffer.getChannelData(0), n = d.length, a = 0, b = n - 1;
      while (a < n && Math.abs(d[a]) < 1e-4) a++;
      while (b > a && Math.abs(d[b]) < 1e-4) b--;
      return { start: a / buffer.sampleRate, end: (b + 1) / buffer.sampleRate };
    }

    // play a recording on a loop, overlapping each repeat so the seam is never heard
    function loop(buffer, dest, fade) {
      var tr = trim(buffer), dur = tr.end - tr.start, x = Math.min(fade, dur / 4);
      var steps = 64, curveIn = new Float32Array(steps), curveOut = new Float32Array(steps);
      for (var i = 0; i < steps; i++) { var th = (i / (steps - 1)) * Math.PI / 2; curveIn[i] = Math.sin(th); curveOut[i] = Math.cos(th); }
      var when = ctx.currentTime + 0.05, timer = null, stopped = false, live = [];
      function next() {
        if (stopped) return;
        var src = ctx.createBufferSource(), g = ctx.createGain();
        src.buffer = buffer;
        g.gain.value = 0;
        g.gain.setValueCurveAtTime(curveIn, when, x);
        g.gain.setValueCurveAtTime(curveOut, when + dur - x, x);
        src.connect(g); g.connect(dest);
        src.start(when, tr.start, dur);
        live.push(src);
        src.onended = function () { live.splice(live.indexOf(src), 1); try { g.disconnect(); } catch (e) {} };
        when += dur - x;
        timer = setTimeout(next, Math.max(60, (when - ctx.currentTime - 2) * 1000));
      }
      next();
      return { stop: function (at) { stopped = true; clearTimeout(timer); live.forEach(function (s) { try { s.stop(at || 0); } catch (e) {} }); } };
    }

    // soft bubbles for "under the water", made right here
    function bubbles(dest) {
      var alive = true, timer = null;
      var lp = ctx.createBiquadFilter();
      lp.type = 'lowpass'; lp.frequency.value = 2200; lp.connect(dest);
      function pop(at) {
        var o = ctx.createOscillator(), g = ctx.createGain(), f = 300 + Math.random() * 600;
        o.frequency.setValueAtTime(f, at);
        o.frequency.exponentialRampToValueAtTime(f * (1.5 + Math.random() * 0.8), at + 0.07 + Math.random() * 0.05);
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.04 + Math.random() * 0.05, at + 0.006);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.12 + Math.random() * 0.07);
        o.connect(g);
        var out = g;
        if (ctx.createStereoPanner) { var p = ctx.createStereoPanner(); p.pan.value = Math.random() * 1.4 - 0.7; g.connect(p); out = p; }
        out.connect(lp);
        o.start(at); o.stop(at + 0.24);
      }
      function tick() {
        if (!alive) return;
        var at = ctx.currentTime + 0.05, n = Math.random() < 0.35 ? 2 + Math.floor(Math.random() * 4) : 1;
        for (var i = 0; i < n; i++) pop(at + i * (0.05 + Math.random() * 0.12));
        timer = setTimeout(tick, 800 + Math.random() * 2800);
      }
      tick();
      return { stop: function () { alive = false; clearTimeout(timer); } };
    }

    // a room for the flute to sing in
    function room(seconds) {
      var rate = ctx.sampleRate, len = Math.floor(rate * seconds), ir = ctx.createBuffer(2, len, rate);
      for (var ch = 0; ch < 2; ch++) {
        var d = ir.getChannelData(ch), lp = 0;
        for (var i = 0; i < len; i++) {
          var k = i / len;
          lp += (Math.random() * 2 - 1 - lp) * (0.5 - 0.42 * k);
          d[i] = lp * Math.pow(1 - k, 2.6) * Math.min(1, i / (rate * 0.012));
        }
      }
      return ir;
    }

    /* ---------- The bansuri ----------
       Research behind it (sources in the "Why this flute?" note on the page):
       - each phrase rises for 4 s and falls for 6 s: six breaths a minute (Laborde et al. 2022);
       - phrases about 10 s long, louder as they rise and softer as they fall (Bernardi et al. 2009);
       - a breath of silence every few phrases, because pauses relax the body most (Bernardi et al. 2006);
       - slow, soft bansuri in an Indian raga eased anxiety in listeners (Gupta and Gupta 2005).
       The raga is Bhupali: five notes, nothing that clashes, Sa = E. */
    var NOTE = { 'P_': 59, 'D_': 61, 'S': 64, 'R': 66, 'G': 68, 'P': 71, 'D': 73, 'S\'': 76, 'R\'': 78 };
    var SAMPLES = [[60, 'c4'], [64, 'e4'], [69, 'a4'], [72, 'c5'], [76, 'e5'], [81, 'a5']];
    // rising phrases for the in-breath (4 s): [note, seconds, glide into the next note]
    var RISE = [
      { lv: 0, n: [['D_', 0.9], ['S', 0.9], ['R', 2.2]] },
      { lv: 0, n: [['S', 1.0], ['R', 0.8], ['G', 2.2]] },
      { lv: 0, n: [['D_', 0.7], ['S', 0.7], ['R', 0.6], ['G', 2.0]] },
      { lv: 0, n: [['S', 1.3, 1], ['G', 2.7]] },
      { lv: 1, n: [['G', 0.8], ['P', 0.9], ['D', 2.3]] },
      { lv: 1, n: [['R', 0.7], ['G', 0.8], ['P', 2.5]] },
      { lv: 1, n: [['S', 0.9], ['G', 1.0, 1], ['P', 2.1]] },
      { lv: 1, n: [['G', 1.2, 1], ['P', 0.6], ['D', 2.2]] },
      { lv: 2, n: [['P', 0.8], ['D', 0.8], ['S\'', 2.4]] },
      { lv: 2, n: [['G', 0.7], ['P', 0.7], ['D', 0.6], ['S\'', 2.0]] },
      { lv: 2, n: [['D', 0.9], ['S\'', 0.9], ['R\'', 2.2]] }
    ];
    // falling phrases for the out-breath (6 s), grouped by the note they start on
    var FALL = {
      'R': [[['R', 1.4], ['S', 1.4], ['D_', 3.2]], [['R', 1.6, 1], ['S', 4.4]]],
      'G': [[['G', 1.6], ['R', 1.2], ['S', 3.2]], [['G', 1.2], ['R', 0.9], ['S', 0.9], ['D_', 1.0], ['S', 2.0]], [['G', 2.0, 1], ['R', 1.4], ['S', 2.6]]],
      'P': [[['P', 1.4], ['G', 1.2], ['R', 1.0], ['S', 2.4]], [['P', 1.8, 1], ['G', 4.2]]],
      'D': [[['D', 1.4], ['P', 1.4], ['G', 3.2]], [['D', 1.2], ['P', 1.0], ['G', 1.0], ['R', 0.8], ['S', 2.0]]],
      'S\'': [[['S\'', 1.4], ['D', 1.2], ['P', 3.4]], [['S\'', 1.2], ['D', 1.0], ['P', 1.0], ['G', 2.8]]],
      'R\'': [[['R\'', 1.4], ['S\'', 1.2], ['D', 1.2], ['P', 2.2]]]
    };
    var ARC = [0, 0, 1, 1, 2, 2, 1, 1, 0]; // low, then higher, then home again, like an alap

    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function flute(layerGain) {
      var bus = ctx.createGain();
      bus.gain.value = 0.6;
      var soft = ctx.createBiquadFilter();
      soft.type = 'lowpass'; soft.frequency.value = 5200; soft.Q.value = 0.5;
      var dry = ctx.createGain(); dry.gain.value = 0.8;
      var verb = ctx.createConvolver(); verb.buffer = room(3.2);
      var wet = ctx.createGain(); wet.gain.value = 0.42;
      bus.connect(soft); soft.connect(dry); soft.connect(verb); verb.connect(wet);
      dry.connect(layerGain); wet.connect(layerGain);
      var droneGain = ctx.createGain(); droneGain.gain.value = 0.3;
      droneGain.connect(layerGain);

      return Promise.all([load('sounds/tanpura')].concat(SAMPLES.map(function (s) { return load('sounds/flute/' + s[1]); })))
        .then(function (bufs) {
          var samples = SAMPLES.map(function (s, i) { return { midi: s[0], buf: bufs[i + 1] }; });
          var tan = bufs[0];
          var drone = ctx.createBufferSource();
          drone.buffer = tan;
          drone.loop = true;
          drone.loopStart = 0;
          drone.loopEnd = Math.min(tan.duration, 11.2);
          drone.connect(droneGain);
          drone.start(ctx.currentTime + 0.05);

          var alive = true, timer = null, sounding = [];
          var offset = ctx.currentTime - performance.now() / 1000; // audio clock = page clock + offset
          var restIn = 3, arc = 0, last = 'S';
          if (!Breath.running) { Breath.start = performance.now() + 2500; Breath.version++; } // let the drone settle first
          var seen = Breath.version;
          function cycleStart(n) { return Breath.start / 1000 + offset + n * 10; }
          function firstCycleAfter(at) { return Math.ceil((at - (Breath.start / 1000 + offset)) / 10); }
          var nextCycle = firstCycleAfter(ctx.currentTime + 0.3);

          function nearest(midi) {
            var best = samples[0];
            samples.forEach(function (s) { if (Math.abs(s.midi - midi) < Math.abs(best.midi - midi)) best = s; });
            return best;
          }

          function note(midi, at, dur, glideTo, glideAt, vel, attack) {
            var s = nearest(glideTo == null ? midi : (midi + glideTo) / 2);
            var src = ctx.createBufferSource(), g = ctx.createGain();
            src.buffer = s.buf;
            var r1 = Math.pow(2, (midi - s.midi) / 12) * (1 + (Math.random() - 0.5) * 0.002);
            src.playbackRate.setValueAtTime(r1, at);
            if (glideTo != null) {
              src.playbackRate.setValueAtTime(r1, glideAt);
              src.playbackRate.exponentialRampToValueAtTime(Math.pow(2, (glideTo - s.midi) / 12), glideAt + 0.42);
            }
            g.gain.setValueAtTime(0, at);
            g.gain.linearRampToValueAtTime(vel, at + attack);
            g.gain.setValueAtTime(vel, at + dur - 0.04);
            g.gain.setTargetAtTime(0, at + dur - 0.04, 0.2);
            src.connect(g); g.connect(bus);
            src.start(at, 0.015);
            src.stop(at + dur + 1.4);
            var item = { src: src, g: g, at: at };
            sounding.push(item);
            src.onended = function () { sounding.splice(sounding.indexOf(item), 1); try { g.disconnect(); } catch (e) {} };
          }

          function phrase(notes, at) {
            var clock = at;
            for (var i = 0; i < notes.length; i++) {
              var n = notes[i], dur = n[1], midi = NOTE[n[0]];
              var vel = (0.82 + Math.random() * 0.12) * (i === notes.length - 1 ? 0.92 : 1);
              var attack = i === 0 ? 0.16 : 0.07;
              var jitter = i === 0 ? 0 : (Math.random() - 0.5) * 0.04;
              if (n[2] && i + 1 < notes.length) { // a meend: slide into the next note on one breath
                var nx = notes[i + 1];
                note(midi, clock + jitter, dur + nx[1], NOTE[nx[0]], clock + dur - 0.25, vel, attack);
                clock += dur + nx[1];
                i++;
              } else {
                note(midi, clock + jitter, dur * (0.97 + Math.random() * 0.06), null, 0, vel, attack);
                clock += dur;
              }
            }
          }

          function cycle(at) {
            // louder as the breath rises, softer as it falls
            bus.gain.cancelScheduledValues(at);
            bus.gain.setValueAtTime(0.6, at);
            bus.gain.linearRampToValueAtTime(1.0, at + 4);
            bus.gain.linearRampToValueAtTime(0.5, at + 10);
            if (--restIn <= 0) { restIn = 4 + Math.floor(Math.random() * 2); return; } // a breath of silence
            var lv = ARC[arc % ARC.length];
            arc++;
            var options = RISE.filter(function (r) { return r.lv === lv && Math.abs(NOTE[r.n[0][0]] - NOTE[last]) <= 7; });
            if (!options.length) options = RISE.filter(function (r) { return r.lv === lv; });
            var rise = pick(options).n;
            var top = rise[rise.length - 1][0];
            var fall = pick(FALL[top]);
            var notes = rise.slice(0, -1);
            var joined = [top, rise[rise.length - 1][1] + fall[0][1]]; // hold the top note across the turn of the breath
            if (fall[0][2]) joined.push(1);
            notes.push(joined);
            notes = notes.concat(fall.slice(1));
            phrase(notes, at);
            last = fall[fall.length - 1][0];
          }

          function cancelFuture() {
            var now = ctx.currentTime;
            sounding.slice().forEach(function (s) {
              if (s.at > now) { try { s.src.stop(0); } catch (e) {} }
              else { s.g.gain.cancelScheduledValues(now); s.g.gain.setTargetAtTime(0, now, 0.15); }
            });
          }

          function tick() {
            if (!alive) return;
            if (Breath.version !== seen) { seen = Breath.version; cancelFuture(); nextCycle = firstCycleAfter(ctx.currentTime + 0.2); }
            var at = cycleStart(nextCycle);
            if (at - ctx.currentTime < 2.2) { if (at > ctx.currentTime) cycle(at); nextCycle++; }
            timer = setTimeout(tick, 350);
          }
          tick();

          return {
            stop: function (at) {
              alive = false; clearTimeout(timer);
              sounding.forEach(function (s) { try { s.src.stop(at || 0); } catch (e) {} });
              try { drone.stop(at || 0); } catch (e) {}
            }
          };
        });
    }

    function volume(name) {
      var v = ui[name].input.value / 100;
      return v * v * LEVEL[name];
    }

    function setState(name, key) {
      var u = ui[name];
      u.state.textContent = key ? t(key) : '';
      u.stateKey = key;
    }

    var ringOn = false;
    function ringLoop(now) {
      if (!ringOn) return;
      var lv = breathAt(now).level;
      ring.style.transform = 'scale(' + (0.55 + 0.45 * lv).toFixed(3) + ')';
      var c = ui.flute.btn.querySelector('.viz-ring');
      if (c) c.setAttribute('r', (6 + 11 * lv).toFixed(2));
      requestAnimationFrame(ringLoop);
    }

    function refresh() {
      var any = Object.keys(layers).length > 0;
      stopBtn.disabled = !any;
      var fluteOn = !!layers.flute;
      guide.hidden = !fluteOn;
      if (fluteOn && !ringOn && !reduceMotion) { ringOn = true; requestAnimationFrame(ringLoop); }
      if (!fluteOn) ringOn = false;
    }

    function start(name) {
      if (!audio()) { msg.textContent = t('snd.none'); return; }
      var u = ui[name];
      var g = ctx.createGain();
      g.gain.value = 0;
      g.connect(master);
      var layer = { gain: g, handle: null, cancelled: false };
      layers[name] = layer;
      u.btn.setAttribute('aria-pressed', 'true');
      u.vol.hidden = false;
      setState(name, 'snd.loading');
      refresh();
      var job;
      if (name === 'ocean') job = load('sounds/ocean').then(function (b) { return loop(b, g, 4); });
      else if (name === 'birds') job = load('sounds/birds').then(function (b) { return loop(b, g, 4); });
      else if (name === 'water') job = load('sounds/underwater').then(function (b) {
        var l = loop(b, g, 3), bub = bubbles(g);
        return { stop: function (at) { l.stop(at); bub.stop(); } };
      });
      else job = flute(g);
      job.then(function (handle) {
        if (layer.cancelled) { handle.stop(0); return; }
        layer.handle = handle;
        g.gain.setValueAtTime(0, ctx.currentTime);
        g.gain.linearRampToValueAtTime(volume(name), ctx.currentTime + 2);
        setState(name, 'snd.on');
      }).catch(function () {
        stop(name, true);
        msg.textContent = t('snd.err');
      });
    }

    function stop(name, now) {
      var layer = layers[name];
      if (!layer) return;
      delete layers[name];
      layer.cancelled = true;
      var u = ui[name];
      u.btn.setAttribute('aria-pressed', 'false');
      u.vol.hidden = true;
      setState(name, null);
      refresh();
      if (!ctx) return;
      var at = ctx.currentTime;
      layer.gain.gain.cancelScheduledValues(at);
      layer.gain.gain.setValueAtTime(layer.gain.gain.value, at);
      layer.gain.gain.linearRampToValueAtTime(0, at + (now ? 0.05 : 0.9));
      setTimeout(function () {
        if (layer.handle) layer.handle.stop(0);
        try { layer.gain.disconnect(); } catch (e) {}
      }, now ? 80 : 1000);
    }

    function stopAll(hard) {
      Object.keys(layers).forEach(function (n) { stop(n, hard); });
      if (hard && ctx) { try { ctx.close(); } catch (e) {} ctx = null; }
    }

    $$('.snd').forEach(function (box) {
      var name = box.getAttribute('data-sound');
      var u = ui[name] = {
        btn: box.querySelector('.tile'),
        state: box.querySelector('.state'),
        vol: box.querySelector('.vol'),
        input: box.querySelector('.vol input'),
        stateKey: null
      };
      u.input.setAttribute('aria-label', u.btn.querySelector('b').textContent);
      u.btn.addEventListener('click', function () { if (layers[name]) stop(name); else start(name); });
      u.input.addEventListener('input', function () {
        var l = layers[name];
        if (l && ctx) { l.gain.gain.cancelScheduledValues(ctx.currentTime); l.gain.gain.setTargetAtTime(volume(name), ctx.currentTime, 0.08); }
      });
    });
    stopBtn.addEventListener('click', function () { stopAll(false); });
    onLanguage.push(function () {
      Object.keys(ui).forEach(function (n) {
        var u = ui[n];
        if (u.stateKey) u.state.textContent = t(u.stateKey);
        u.input.setAttribute('aria-label', u.btn.querySelector('b').textContent);
      });
    });

    return { stopAll: stopAll };
  })();

  // Quick exit and leaving the page silence everything at once
  window.KINARA_STOP = function () { Sound.stopAll(true); sandText.value = ''; };
  window.addEventListener('pagehide', function () { Sound.stopAll(true); });

  /* ================= Keep Quick exit fully on screen ================= */
  // On small phones some languages need more room. Step by step: show the
  // language button as a globe only, then the sun mark without the word
  // "Kinara", then a slightly smaller Quick exit, until everything fits.
  var bar = $('#bar');
  var barIn = bar && bar.querySelector('.bar-in');
  var exitLink = $('#exit');
  function barOverflows() {
    var cs = getComputedStyle(barIn), box = barIn.getBoundingClientRect(), e = exitLink.getBoundingClientRect();
    if (document.documentElement.dir === 'rtl') return e.left < box.left + parseFloat(cs.paddingLeft) - 0.5;
    return e.right > box.right - parseFloat(cs.paddingRight) + 0.5;
  }
  function fitBar() {
    if (!barIn || !exitLink) return;
    bar.classList.add('measuring');
    bar.classList.remove('fit1', 'fit2', 'fit3');
    for (var i = 1; i <= 3 && barOverflows(); i++) bar.classList.add('fit' + i);
    bar.classList.remove('measuring');
  }
  var fitQueued = false;
  function queueFit() {
    if (fitQueued) return;
    fitQueued = true;
    requestAnimationFrame(function () { fitQueued = false; fitBar(); });
  }
  onLanguage.push(fitBar);
  window.addEventListener('resize', queueFit, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitBar);
  if (document.fonts && document.fonts.addEventListener) document.fonts.addEventListener('loadingdone', queueFit);
  fitBar();

  /* ================= Start in her phone's language ================= */
  var first = detect();
  if (first !== 'en') switchTo(first);
})();
