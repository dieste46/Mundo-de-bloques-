// El mundo mide ahora 96 de ancho. Un mundo guardado de cuando medía 48 se ensancha al cargarlo: queda en el centro, intacto,
// con terreno nuevo a los dos lados. También al importar una copia antigua.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  ok(await p.evaluate(() => window.__juego.COLS === 96 && window.__juego.grid().length === 96 * 32), 'un mundo nuevo mide 96 × 32');
  ok(await p.evaluate(() => { const g = window.__juego.grid(); for (let x = 0; x < 96; x++) { let y = 0; while (y < 32 && !g[y * 96 + x]) y++; if (y >= 32) return false; } return true; }), 'y tiene suelo en todas sus columnas');
  const charcas = await p.evaluate(() => { const g = window.__juego.grid(), cs = []; for (let x = 0; x < 96; x++) for (let y = 0; y < 32; y++) if (g[y * 96 + x] === 7) { cs.push(x); break; } return cs; });
  ok(charcas.some(x => x < 48) && charcas.some(x => x >= 48), 'con una charca en cada mitad (columnas ' + charcas.join(',') + ')');

  // un mundo "de los de antes": 48 de ancho, con una casa de ladrillo reconocible, dos cerditos, una vista y diez estrellas
  const viejo = await p.evaluate(() => { const A = 48, g = new Array(A * 32).fill(0); let h = 20;
    for (let x = 0; x < A; x++) { h = 19 + ((x * 7) % 3); for (let y = h; y < 32; y++) g[y * A + x] = y === h ? 1 : y < h + 3 ? 2 : 3; }
    for (let x = 20; x < 25; x++) for (let y = 14; y < 19; y++) g[y * A + x] = (x + y) % 2 ? 8 : 10; g[5 * A + 0] = 9; g[5 * A + 47] = 9; // y un cristal en cada esquina de arriba
    const d = { mundo: 0, mundos: [{ grid: g, pigs: [[10, 18], [30, 18]], night: true, camC: 12.5, camR: 9, t: Date.now() }, null, null], stars: 10, base: 4, niv: { suma: [5, 0] }, huevos: 1 };
    localStorage.setItem('bloques2', JSON.stringify(d)); return g; });
  await p.reload(); await p.waitForTimeout(700);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const nuevo = await p.evaluate(() => window.__juego.grid().slice());
  ok(nuevo.length === 96 * 32, 'al cargarlo pasa a medir 96 × 32');
  let igual = true; for (let y = 0; y < 32 && igual; y++) for (let x = 0; x < 48; x++) if (nuevo[y * 96 + x + 24] !== viejo[y * 48 + x]) { igual = false; break; }
  ok(igual, 'lo que había queda en el centro, bloque a bloque (también la casa y los cristales de las esquinas)');
  const top = x => { let y = 0; while (y < 32 && (!nuevo[y * 96 + x] || [4, 5, 7, 9, 11].includes(nuevo[y * 96 + x]))) y++; return y; };
  let hueco = -1, salto = 0; for (let x = 0; x < 96; x++) { if (top(x) >= 32) hueco = x; if (x && (x < 24 || x > 72) ) salto = Math.max(salto, Math.abs(top(x) - top(x - 1))); }
  ok(hueco < 0, 'los lados nuevos tienen suelo en todas las columnas');
  ok(Math.abs(top(23) - top(24)) <= 1 && Math.abs(top(72) - top(71)) <= 1 && salto <= 2, `el terreno nuevo empalma con el viejo (escalón máximo en los lados: ${salto})`);
  const lados = { arboles: 0, flores: 0, agua: 0 }; for (let x = 0; x < 96; x++) if (x < 24 || x >= 72) for (let y = 0; y < 32; y++) { const v = nuevo[y * 96 + x]; if (v === 4) lados.arboles++; if (v === 11) lados.flores++; if (v === 7) lados.agua++; }
  ok(lados.arboles > 0 && lados.agua > 0, `y trae árboles (${lados.arboles} maderas), flores (${lados.flores}) y agua (${lados.agua})`);
  const e = await p.evaluate(() => ({ pigs: window.__juego.pigs().map(q => Math.round(q.x)), cam: window.__juego.cam().camC, estrellas: +document.getElementById('starN').textContent, huevos: window.__juego.huevos() }));
  ok(e.pigs.join(',') === '34,54' && Math.abs(e.cam - 36.5) < .01, `los cerditos y la vista se mueven con el mundo (cerditos en ${e.pigs.join(' y ')}, vista en ${e.cam})`);
  ok(e.estrellas === 10 && e.huevos === 1, 'las estrellas y los huevos no cambian');
  await p.screenshot({ path: `${L.CAP}/ensanche.png` });
  const c = await L.cam(p); await p.click('#tDig'); await p.mouse.click(c.left + 300, c.top + 80); await p.waitForTimeout(400);
  ok((await p.evaluate(() => window.__dicho)).some(t => /Tu mundo es ahora más grande/.test(t)), 'al primer toque la voz cuenta que el mundo es más grande');
  await p.click('#tPut'); await p.click('#tNight'); await p.waitForTimeout(200); // cualquier cambio guarda
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('bloques2')).mundos[0].grid.length) === 96 * 32, 'y a partir de ahí se guarda ya con el ancho nuevo');
  await p.reload(); await p.waitForTimeout(600);
  ok(await p.evaluate(g => JSON.stringify(window.__juego.grid().slice(0, 96 * 14)) === JSON.stringify(g.slice(0, 96 * 14)), nuevo), 'recargar no lo vuelve a ensanchar ni lo cambia');
  // importar una copia antigua (versión 2, mundo de 48)
  const copia = JSON.stringify({ formato: 'mundobloque', version: 2, exportado: new Date().toISOString(), juego: { mundo: 0, mundos: [{ grid: viejo, pigs: [[10, 18]], night: false, camC: 5 }, null, null], stars: 3, base: 0, niv: {}, huevos: 0 } });
  const r = await p.evaluate(t => Guardado.importar(t, true), copia); ok(r.ok && r.resumen.mundos === 1, 'una copia antigua (versión 2) se importa');
  await p.reload(); await p.waitForTimeout(600);
  ok(await p.evaluate(() => window.__juego.grid().length) === 96 * 32 && await L.starsN(p) === 3, 'y su mundo de 48 se ensancha al arrancar');
  ok(await p.evaluate(() => Guardado.VERSION) === 3 && JSON.parse(await p.evaluate(() => Guardado.exportar())).version === 3, 'las copias nuevas salen como versión 3');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
