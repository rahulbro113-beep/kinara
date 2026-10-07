/* Kinara: the living sunrise over the sea at the top of the page.
   Painted with WebGL, entirely in this file: nothing is downloaded.
   It rests when it is off screen, stops if the phone is slow, and holds still for people who prefer less motion.
   In dark mode it becomes the same sea under the moon. */
(function () {
  'use strict';

  var canvas = document.getElementById('sea');
  var hero = document.getElementById('hero');
  var heroIn = hero && hero.querySelector('.hero-in');
  if (!canvas || !hero || !heroIn) return;

  var gl = null;
  try {
    gl = canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false, powerPreference: 'low-power' });
  } catch (e) { gl = null; }
  if (!gl) return; // the painted gradient behind stays on screen

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
  var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
  var high = gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT);
  var precision = high && high.precision > 0 ? 'highp' : 'mediump';

  var VERT = 'attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }';

  var FRAG = [
    'precision ' + precision + ' float;',
    'uniform vec2 uRes;',
    'uniform float uTime;',
    'uniform float uRise;',
    'uniform float uNight;',
    'uniform float uHz;',
    'uniform float uSunX;',
    'uniform float uSunY;',
    'uniform float uSunS;',
    'const float FOCAL = 1.6;',
    'const float CAMH = 1.5;',

    'float hash(vec2 p) { p = fract(p * vec2(234.34, 435.345)); p += dot(p, p + 34.23); return fract(p.x * p.y); }',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p); vec2 f = fract(p); vec2 u = f * f * (3.0 - 2.0 * f);',
    '  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);',
    '}',
    'float fbm(vec2 p) { float v = 0.0; float a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p = p * 2.07 + vec2(1.7, 9.2); a *= 0.5; } return v; }',

    // the colour of the sky in any direction, with the sun's (or moon's) glow
    'vec3 sky(vec3 d, vec3 sd) {',
    '  float h = clamp(d.y * 3.2, 0.0, 1.0);',
    '  vec3 c = mix(vec3(1.0, 0.80, 0.58), vec3(0.98, 0.85, 0.76), smoothstep(0.0, 0.16, h));',
    '  c = mix(c, vec3(0.63, 0.77, 0.87), smoothstep(0.14, 0.95, h));',
    '  c = mix(c * vec3(0.90, 0.78, 0.84), c, smoothstep(0.0, 0.7, uRise));',
    '  float a = max(dot(d, sd), 0.0);',
    '  float k = 1.0 / (uSunS * uSunS);',
    '  c += vec3(1.0, 0.84, 0.60) * (pow(a, 6.0 * k) * 0.16 + pow(a, 48.0 * k) * 0.32 + pow(a, 520.0 * k) * 0.55) * (0.55 + 0.45 * uRise);',
    '  vec3 n = mix(vec3(0.09, 0.19, 0.24), vec3(0.012, 0.035, 0.065), smoothstep(0.0, 0.75, h));',
    '  n += vec3(0.72, 0.80, 0.90) * (pow(a, 24.0 * k) * 0.10 + pow(a, 380.0 * k) * 0.35);',
    '  return mix(c, n, uNight);',
    '}',

    // one gentle swell: returns how steep the water is here
    'vec2 swell(vec2 xz, vec2 dir, float len, float amp, float speed) {',
    '  float k = 6.2831853 / len;',
    '  return amp * k * dir * cos(dot(dir, xz) * k + uTime * speed);',
    '}',

    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / uRes;',
    '  float aspect = uRes.x / uRes.y;',
    '  vec3 d = normalize(vec3((uv.x - 0.5) * aspect, uv.y - uHz, FOCAL));',
    '  float elev = uNight > 0.5 ? uSunY * 1.8 : mix(-0.012, uSunY, uRise);',
    '  vec3 sd = normalize(vec3((uSunX - 0.5) * aspect, elev, FOCAL));',
    '  vec3 col;',
    '  if (d.y >= 0.0) {',
    '    col = sky(d, sd);',
    // soft streaks of cloud, lit gold near the sun
    '    float above = uv.y - uHz;',
    '    vec2 q = vec2(uv.x * aspect * 1.3 + uTime * 0.004, above * 7.5);',
    '    float cl = smoothstep(0.56, 0.86, fbm(q)) * smoothstep(0.015, 0.1, above) * (1.0 - smoothstep(0.32, 0.6, above));',
    '    float near = pow(max(dot(d, sd), 0.0), 10.0);',
    '    vec3 cloudDay = mix(vec3(1.0, 0.91, 0.86), vec3(1.0, 0.78, 0.58), near);',
    '    vec3 cloudNight = vec3(0.16, 0.22, 0.28) + vec3(0.25) * near;',
    '    col = mix(col, mix(cloudDay, cloudNight, uNight), cl * 0.42);',
    // the sun, or the moon at night
    '    float ang = acos(clamp(dot(d, sd), -1.0, 1.0));',
    '    float r = mix(0.030, 0.021, uNight) * uSunS;',
    '    float disc = smoothstep(r, r * 0.8, ang);',
    '    vec3 sunDisc = mix(vec3(1.0, 0.90, 0.70), vec3(1.0, 0.98, 0.92), smoothstep(r, r * 0.3, ang));',
    '    vec3 moonDisc = vec3(0.93, 0.94, 0.90) - 0.06 * fbm(d.xy * 260.0);',
    '    col = mix(col, mix(sunDisc, moonDisc, uNight), disc * mix(0.55 + 0.45 * uRise, 1.0, uNight));',
    // a few quiet stars at night
    '    float st = step(0.9982, hash(floor(gl_FragCoord.xy / 2.0))) * smoothstep(0.12, 0.4, above);',
    '    col += vec3(0.85, 0.9, 1.0) * st * uNight * (0.45 + 0.35 * sin(uTime * 0.7 + hash(floor(gl_FragCoord.xy)) * 40.0));',
    '  } else {',
    // where this pixel meets the water, and how the water tilts there
    '    float t = CAMH / -d.y;',
    '    vec2 xz = (d * t).xz;',
    '    vec2 g = vec2(0.0);',
    '    g += swell(xz, vec2(0.0, 1.0), 7.0, 0.07, 0.75);',
    '    g += swell(xz, normalize(vec2(0.32, 1.0)), 3.8, 0.04, 1.05);',
    '    g += swell(xz, normalize(vec2(-0.45, 1.0)), 2.2, 0.022, 1.35);',
    '    g += swell(xz, normalize(vec2(0.85, 0.55)), 1.15, 0.009, 1.8);',
    '    vec2 q = xz * vec2(1.6, 2.4) + vec2(uTime * 0.05, uTime * 0.32);',
    '    float e = 0.06;',
    '    float n0 = noise(q);',
    '    g += vec2(noise(q + vec2(e, 0.0)) - n0, noise(q + vec2(0.0, e)) - n0) / e * 0.022;',
    '    float fade = exp(-t * 0.03);',
    '    g *= mix(0.18, 1.0, fade);',
    '    vec3 N = normalize(vec3(-g.x, 1.0, -g.y));',
    '    vec3 R = reflect(d, N);',
    '    R.y = abs(R.y);',
    '    float fres = 0.03 + 0.97 * pow(1.0 - max(dot(N, -d), 0.0), 5.0);',
    '    vec3 refl = sky(R, sd) * 0.86;',
    '    float a = max(dot(R, sd), 0.0);',
    '    float glint = pow(a, 1500.0) * 4.5 + pow(a, 180.0) * 0.45;',
    '    vec3 glintCol = mix(vec3(1.0, 0.88, 0.62), vec3(0.85, 0.9, 1.0), uNight);',
    '    vec3 bodyDay = mix(vec3(0.30, 0.53, 0.56), vec3(0.035, 0.25, 0.29), fade);',
    '    vec3 bodyNight = mix(vec3(0.06, 0.15, 0.18), vec3(0.008, 0.06, 0.075), fade);',
    '    col = mix(mix(bodyDay, bodyNight, uNight), refl, fres * 0.9);',
    '    col += glintCol * glint * mix(0.45 + 0.55 * uRise, 0.55, uNight);',
    '    float haze = exp(d.y * 120.0);',
    '    col = mix(col, sky(normalize(vec3(d.x, 0.0, d.z)), sd) * vec3(0.93, 0.96, 0.98), haze * 0.55);',
    '  }',
    '  col += (hash(gl_FragCoord.xy + fract(uTime)) - 0.5) / 255.0;',
    '  gl_FragColor = vec4(col, 1.0);',
    '}'
  ].join('\n');

  function compile(type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn(gl.getShaderInfoLog(s)); return null; }
    return s;
  }
  var vs = compile(gl.VERTEX_SHADER, VERT);
  var fs = compile(gl.FRAGMENT_SHADER, FRAG);
  if (!vs || !fs) return;
  var prog = gl.createProgram();
  gl.attachShader(prog, vs);
  gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
  gl.useProgram(prog);

  var buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  var U = {};
  ['uRes', 'uTime', 'uRise', 'uNight', 'uHz', 'uSunX', 'uSunY', 'uSunS'].forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

  var scale = Math.min(Math.max((window.devicePixelRatio || 1) * 0.75, 0.75), 1.25);
  var hz = 0.3, sunX = 0.6, sunY = 0.085, sunS = 1;
  var start = performance.now();
  var riseStart = start;
  var visible = true;
  var running = false;
  var frameAvg = 16, frames = 0, last = 0;
  var still = reduce.matches;

  function layout() {
    var rect = hero.getBoundingClientRect();
    var gap = parseFloat(getComputedStyle(hero).getPropertyValue('--sun-gap')) || 24;
    var seaPx = parseFloat(getComputedStyle(heroIn).paddingBottom) - gap;
    hz = Math.min(0.55, Math.max(0.12, seaPx / rect.height));
    var aspect = rect.width / rect.height;
    sunS = Math.min(1, Math.max(0.5, aspect * 1.3));          // a smaller sun on tall phone screens
    if (rect.width < 640) { sunX = 0.72; sunY = (gap * 0.52) / rect.height; } // rise in the clear sky below the words
    else { sunX = 0.6; sunY = 0.085; }
    hero.style.setProperty('--hz', (hz * 100).toFixed(2) + '%');
    hero.style.setProperty('--sunx', (sunX * 100).toFixed(1) + '%');
    var maxPixels = 900000;
    var s = scale;
    if (rect.width * rect.height * s * s > maxPixels) s = Math.sqrt(maxPixels / (rect.width * rect.height));
    var w = Math.max(2, Math.round(rect.width * s));
    var h = Math.max(2, Math.round(rect.height * s));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
  }

  function draw(now) {
    var t = (now - start) / 1000;
    var rise = still ? 1 : Math.min(1, (now - riseStart) / 9000);
    rise = 1 - Math.pow(1 - rise, 3);
    gl.uniform2f(U.uRes, canvas.width, canvas.height);
    gl.uniform1f(U.uTime, still ? 12.0 : t % 600);
    gl.uniform1f(U.uRise, rise);
    gl.uniform1f(U.uNight, darkQuery.matches ? 1 : 0);
    gl.uniform1f(U.uHz, hz);
    gl.uniform1f(U.uSunX, sunX);
    gl.uniform1f(U.uSunY, sunY);
    gl.uniform1f(U.uSunS, sunS);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (!canvas.classList.contains('on')) canvas.classList.add('on');
  }

  function loop(now) {
    if (!running) return;
    if (now - last >= 32) { // about 30 frames a second is plenty for a calm sea
      var t0 = performance.now();
      draw(now);
      var spent = performance.now() - t0;
      frameAvg = frameAvg * 0.9 + spent * 0.1;
      frames++;
      last = now;
      if (frames > 45 && frameAvg > 28) {
        if (scale > 0.4) { scale *= 0.7; frames = 0; layout(); }
        else { still = true; draw(now); running = false; return; } // a slow phone gets a still painting
      }
    }
    requestAnimationFrame(loop);
  }

  function play() {
    if (running || still) { if (still) draw(performance.now()); return; }
    running = true;
    requestAnimationFrame(loop);
  }
  function pause() { running = false; }

  layout();
  draw(performance.now());
  if (!still) play();

  window.addEventListener('resize', function () { layout(); draw(performance.now()); }, { passive: true });
  window.addEventListener('kinara:layout', function () { layout(); draw(performance.now()); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) pause(); else if (visible) play();
  });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      visible = entries[0].isIntersecting;
      if (visible && !document.hidden) play(); else pause();
    }).observe(hero);
  }
  function onMotion() { still = reduce.matches; if (still) { pause(); draw(performance.now()); } else play(); }
  if (reduce.addEventListener) reduce.addEventListener('change', onMotion);
  if (darkQuery.addEventListener) darkQuery.addEventListener('change', function () { draw(performance.now()); });
  canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); pause(); canvas.classList.remove('on'); });
})();
