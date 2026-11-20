// Utilidades comunes de las pruebas (Playwright). Simular un Safari sin eventos de puntero (iOS 12): SIN_PUNTERO=1 node pruebas/<prueba>.js
const { chromium } = require('playwright');
const path = require('path'), fs = require('fs'), os = require('os');
// Dónde está el juego (por defecto, el servidor local de pruebas/servidor.js) y dónde se dejan las capturas (fuera del repo).
const BASE = process.env.JUEGO || 'http://localhost:8765/';
const URL = BASE + '?prueba';   // ?prueba activa window.__juego, con lo que las pruebas miran dentro del juego
const CAP = process.env.CAPTURAS || path.join(os.tmpdir(), 'mundobloque-capturas');
try { fs.mkdirSync(CAP, { recursive: true }); } catch (e) {}
const KINDS = ['pon','torre','pica','cerdos','serie','serie','suma','suma','resta','alta','copia','copia','programa','programa','junta','junta','letra','letra'];
const COLS = 48, ROWS = 32;
async function open(viewport, opts = {}) {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport, deviceScaleFactor: opts.dsf || 1, hasTouch: true, isMobile: !!opts.mobile, serviceWorkers: opts.sw ? 'allow' : 'block' });
  // simula un Safari viejo: sin eventos de puntero (iOS 12)
  if (opts.sinPuntero || process.env.SIN_PUNTERO) await ctx.addInitScript(() => { try { delete window.PointerEvent; } catch (e) {} window.PointerEvent = undefined; });
  const p = await ctx.newPage();
  const errs = [];
  p.on('console', m => { if (m.type() === 'error') errs.push('console: ' + m.text()); });
  p.on('pageerror', e => errs.push('pageerror: ' + e.message));
  await p.goto(URL);
  await p.waitForTimeout(400);
  return { b, ctx, p, errs };
}
// mundo nuevo con un nivel dado (para todas las familias de retos)
async function fresh(p, level = 0) {
  await p.evaluate(() => localStorage.clear());
  await p.reload(); await p.waitForTimeout(300);
  if (level) {
    await p.evaluate(l => { const d = JSON.parse(localStorage.getItem('bloques2')); d.level = l; delete d.niv; delete d.base; localStorage.setItem('bloques2', JSON.stringify(d)); }, level);
    await p.reload(); await p.waitForTimeout(300);
  }
}
// el guardado tiene varios mundos: se devuelve el actual a la vista
const state = p => p.evaluate(() => { const d = JSON.parse(localStorage.getItem('bloques2')); return d && d.mundos ? { ...d, ...d.mundos[d.mundo] } : d; });
// fuerza el tipo de reto fijando el primer Math.random() que consume startReto
async function startKind(p, kind) {
  const i = KINDS.indexOf(kind);
  await p.evaluate(v => { const o = Math.random; Math.random = () => { Math.random = o; return v; }; document.getElementById('tReto').click(); }, (i + .5) / KINDS.length);
  await p.waitForTimeout(100);
  return p.evaluate(() => document.getElementById('retoIco').textContent);
}
const toast = p => p.evaluate(() => { const t = document.getElementById('toast'); return t.classList.contains('on') ? t.textContent : ''; });
const starsN = p => p.evaluate(() => +document.getElementById('starN').textContent);
// la vista en este instante (no la guardada): columna y fila de la esquina, tamaño de bloque y dónde está el lienzo
const cam = p => p.evaluate(() => { const c = window.__juego.cam(), r = document.getElementById('cv').getBoundingClientRect(); return { ...c, left: r.left, top: r.top }; });
const geom = cam;
const cell = (st, x, y) => st.grid[y * COLS + x];
const topOf = (st, x) => { let y = 0; while (y < ROWS && !cell(st, x, y)) y++; return y; };
// espera a que la vista deje de moverse (los retos la llevan hasta el marco)
async function quieta(p) { let a = await cam(p); for (let i = 0; i < 40; i++) { await p.waitForTimeout(120); const b = await cam(p); if (Math.abs(a.camC - b.camC) < .001 && Math.abs(a.camR - b.camR) < .001) return b; a = b; } return a; }
// toca la celda (x,y) del mundo, esté donde esté la vista; devuelve false si cae fuera de la pantalla
async function tapCell(p, _g, _camC, x, y) {
  const c = await cam(p), sx = c.left + (x - c.camC + .5) * c.S, sy = c.top + (y + .5) * c.S + c.offY;
  if (sx < c.left || sx > c.left + c.W || sy < c.top || sy > c.top + c.H) return false;
  await p.mouse.click(sx, sy); await p.waitForTimeout(60); return true;
}
// n huecos despejados a la vista, tres filas por encima del suelo y sin nada encima, lejos de la cabecera
async function huecos(p, n = 1, alto = 3) {
  const st = await state(p), c = await cam(p), out = [];
  for (const margen of [2, 1, 0]) { // primero lejos de los cerditos; si no hay bastantes, se afloja
    for (let x = Math.ceil(c.camC) + 1; out.length < n && x < c.camC + c.W / c.S - 1; x++) {
      if (out.some(o => o[0] === x)) continue;
      const t = topOf(st, x), y = t - alto; let libre = y > c.camR + 2.6 && t < c.camR + c.H / c.S;
      for (let k = 1; k <= alto + 1 && libre; k++) if (cell(st, x, t - k)) libre = false;
      if (libre && !st.pigs.some(q => Math.abs(q[0] - x) < margen)) out.push([x, y]);
    }
    if (out.length >= n) break;
  }
  if (out.length < n) throw new Error('no hay ' + n + ' huecos a la vista');
  return out;
}
module.exports = { BASE, URL, CAP, open, fresh, state, startKind, toast, starsN, geom, cam, quieta, tapCell, huecos, cell, topOf, COLS, ROWS, KINDS };
