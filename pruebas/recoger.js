// Al cerrar un reto, el mundo queda como estaba: se retira la ficha del reto y no lo que el niño construyó por su cuenta.
// Y el inventario se ve entero (los catorce bloques) en pantallas estrechas.
const L = require('./lib');
const { chromium } = require('playwright');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  const G = () => p.evaluate(() => window.__juego.grid().slice());
  const dif = (a, c) => a.reduce((n, v, i) => n + (v !== c[i] ? 1 : 0), 0);
  // cada tipo de reto que planta algo: se abre, se cierra sin tocar, y el mundo vuelve a ser el de antes
  const vistos = {}; let intentos = 0;
  while (Object.keys(vistos).length < 6 && intentos++ < 60) {
    const antes = await G(); await p.click('#tReto'); await p.waitForTimeout(350);
    const r = await p.evaluate(() => { const q = window.__juego.retoFull(); return q && { kind: q.kind, puesto: (q.puesto || []).length }; });
    const con = await G(); await p.click('#rClose'); await p.waitForTimeout(250); const despues = await G();
    if (r.puesto && !vistos[r.kind]) { vistos[r.kind] = true; ok(dif(antes, con) === r.puesto && dif(antes, despues) === 0, `${r.kind}: el reto planta ${r.puesto} bloques y al cerrarlo no queda ninguno`); }
    else if (!r.puesto && dif(antes, despues) !== 0) ok(false, `${r.kind}: no planta nada pero el mundo ha cambiado`);
  }
  ok(Object.keys(vistos).length >= 5, 'probados: ' + Object.keys(vistos).join(', '));
  // una serie resuelta: tras la celebración desaparece entera (lo dado y lo puesto por el niño)
  let serie = null; for (let k = 0; k < 40 && !serie; k++) { await p.click('#tReto'); await p.waitForTimeout(350); const q = await p.evaluate(() => { const r = window.__juego.retoFull(); return { kind: r.kind, ghost: r.ghost }; }); if (q.kind === 'serie') serie = q; else { await p.click('#rClose'); await p.waitForTimeout(150); } }
  if (serie) { const antes = await p.evaluate(() => window.__juego.retoFull().base.slice()); await L.quieta(p);
    for (const g of serie.ghost) { await p.click('#b' + g.b); await L.tapCell(p, null, null, g.x, g.y); }
    await p.waitForTimeout(600); ok(await p.evaluate(() => window.__juego.retoFull() && window.__juego.retoFull().won), 'la serie se resuelve');
    const lleno = await G(); ok(dif(antes, lleno) === 6, 'mientras se celebra siguen ahí sus seis bloques');
    await p.waitForTimeout(4600); ok(dif(antes, await G()) === 0, 'y al cerrarse sola, el cielo queda limpio');
  } else ok(false, 'no ha salido ninguna serie en 40 intentos');
  // lo que construye por su cuenta no se toca: los bloques de un reto de "pon tantos bloques" se quedan donde los puso
  // se pide el reto de poner bloques fijando el sorteo: el juego elige al azar entre sus tipos, quitando el último que salió
  const pide = async (kind, ultimo) => { const ks = L.KINDS.filter(k => k !== ultimo), i = ks.indexOf(kind); await p.evaluate(v => { const o = Math.random; Math.random = () => { Math.random = o; return v; }; document.getElementById('tReto').click(); }, (i + .5) / ks.length); await p.waitForTimeout(300); return p.evaluate(() => { const r = window.__juego.retoFull(); return { kind: r.kind, b: r.b, n: r.n }; }); };
  let q = await pide('torre', 'serie'); await p.click('#rClose'); await p.waitForTimeout(150); q = await pide('pon', q.kind);
  if (q.kind === 'pon') { await L.quieta(p); const antes = await G(); await p.click('#b' + q.b); for (const hq of await L.huecos(p, q.n, 1)) await L.tapCell(p, null, null, hq[0], hq[1]);
    await p.waitForTimeout(5200); const d = dif(antes, await G()); ok(d === q.n && await p.evaluate(() => !window.__juego.retoFull()), `sus ${q.n} bloques siguen en su sitio después del reto (cambios: ${d})`); } else ok(false, 'no ha salido un reto de poner bloques');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();

  // inventario: los catorce bloques a la vista, sin deslizar
  const nav = await chromium.launch();
  for (const [n, w, hh] of [['iPhone vertical', 390, 844], ['iPhone pequeño', 375, 667], ['iPhone tumbado', 844, 390], ['iPhone pequeño tumbado', 667, 375], ['iPad vertical', 768, 1004], ['iPad tumbado', 1024, 748]]) {
    for (const sinGap of [false, true]) {
      const ctx = await nav.newContext({ viewport: { width: w, height: hh }, hasTouch: true, serviceWorkers: 'block' }); const pg = await ctx.newPage();
      await pg.goto(L.URL); await pg.waitForTimeout(400); if (sinGap) await pg.evaluate(() => { document.documentElement.classList.add('sin-gap'); const e = document.createElement('style'); e.textContent = '*{gap:0!important}'; document.head.appendChild(e); window.dispatchEvent(new Event('resize')); }), await pg.waitForTimeout(250); // como un Safari que no entiende gap en flex
      const m = await pg.evaluate(() => { const bl = document.getElementById('blocks'), rs = [...bl.children].map(e => e.getBoundingClientRect()), cs = rs.map(r => r.top + r.height / 2).sort((a, c) => a - c), cortes = cs.filter((v, i) => i === 0 || v - cs[i - 1] > 14), fila = r => cortes.filter(v => v <= r.top + r.height / 2 + 7).length, filas = new Set(rs.map(fila)); return { visibles: rs.filter(r => r.left >= -1 && r.right <= innerWidth + 1 && r.width >= 30).length, filas: filas.size, lado: Math.round(rs[1].width), alto: Math.round(rs[1].height), porFila: rs.filter(r => fila(r) === fila(rs[0])).length, mundo: Math.round(document.getElementById('world').getBoundingClientRect().height) }; });
      ok(m.visibles === 14 && m.lado >= 38 && Math.abs(m.lado - m.alto) <= 2 && (m.filas === 1 || m.porFila === 7), `${n}${sinGap ? ' (sin gap, iOS antiguo)' : ''}: ${m.visibles} bloques a la vista en ${m.filas} fila${m.filas > 1 ? 's de ' + m.porFila : ''}, de ${m.lado}×${m.alto} px; mundo de ${m.mundo} px de alto`);
      if (!sinGap) await pg.screenshot({ path: `${L.CAP}/inv-${w}x${hh}.png` });
      await ctx.close();
    }
  }
  await nav.close();
})();
