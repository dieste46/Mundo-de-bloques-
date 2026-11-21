// Aventura, fase 2: el recorrido largo. Que siempre se pueda terminar (muchos recorridos simulados), que el mundo del niño vuelva intacto,
// y el flujo completo desde el panel: elegir 🏁, pasar los tres tramos y llegar a la bandera.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  // 1. el generador: cada tramo trae cinco manzanas y sus escalones no pasan de dos
  const gen = await p.evaluate(() => { const J = window.__juego, out = { n: 0, mal: [] };
    for (let s = 1; s <= 150; s++) for (let n = 0; n < 3; n++) { const t = J.generaTramo(n, s); out.n++;
      const top = x => { let y = 0; while (y < 32 && (!t.g[y * 48 + x] || t.g[y * 48 + x] === 7 || t.g[y * 48 + x] === 11 || [4, 8, 9].includes(t.g[y * 48 + x]) && !t.g[(y + 1) * 48 + x])) y++; return y; };
      if (t.manz.length !== 5) out.mal.push(`semilla ${s} tramo ${n}: ${t.manz.length} manzanas`);
      for (let x = 1; x < 48; x++) if (Math.abs(top(x) - top(x - 1)) > 2) out.mal.push(`semilla ${s} tramo ${n}: escalón de ${Math.abs(top(x) - top(x - 1))} en la columna ${x}`); }
    return out; });
  ok(gen.mal.length === 0, `${gen.n} tramos generados: todos con cinco manzanas y sin escalones de más de dos` + (gen.mal.length ? ' — ' + gen.mal.slice(0, 3).join('; ') : ''));
  // 2. se pueden terminar: un niño que mantiene ➡️ y salta cuando deja de avanzar llega siempre al final
  const antes = await p.evaluate(() => JSON.stringify(window.__juego.grid()));
  const sim = await p.evaluate(() => { const J = window.__juego, out = { fin: 0, manz: 0, t: 0, atasco: [] }, N = 120;
    for (let k = 0; k < N; k++) { J.modo('curso'); J.entra(k % 6); const a = J.av(); a.kD = true; let t = 0, xa = a.x, q = 0;
      while (!a.fin && t < 150) { J.paso(1 / 60); t += 1 / 60; if (Math.abs(a.x - xa) < 1e-4) { q += 1 / 60; if (q > .35 && a.suelo) { a.salto = .15; q = 0; } } else q = 0; xa = a.x; }
      if (a.fin) { out.fin++; out.manz += a.cog; out.t += t; } else { const c = J.curso(), g = J.grid(), cx = Math.floor(a.x), cy = Math.floor(a.y), f = []; for (let y = cy - 5; y <= cy + 3; y++) { let s = ''; for (let x = cx - 4; x <= cx + 5; x++) s += (x === cx && y === cy - 1) ? '@' : (g[y * 48 + x] || 0).toString(16); f.push(s); } out.atasco.push({ sem: c.sem, tramo: c.tramo, x: +a.x.toFixed(1), mapa: f }); }
      J.sale(); }
    J.modo('mundo'); out.N = N; return out; });
  ok(sim.fin === sim.N, `llega al final en ${sim.fin} de ${sim.N} recorridos (media: ${(sim.t / Math.max(1, sim.fin)).toFixed(0)} s y ${(sim.manz / Math.max(1, sim.fin)).toFixed(1)} manzanas de 15 sin buscarlas)`);
  sim.atasco.slice(0, 3).forEach(a => console.log('         ATASCO semilla', a.sem, 'tramo', a.tramo, 'x', a.x, '\n           ' + a.mapa.join('\n           ')));
  ok(await p.evaluate(() => JSON.stringify(window.__juego.grid())) === antes, 'al salir de cada recorrido vuelve el mundo del niño, intacto');
  ok(await p.evaluate(a => JSON.stringify(JSON.parse(localStorage.getItem('bloques2')).mundos[0].grid) === a, antes), 'y lo guardado nunca fue el recorrido');
  await p.evaluate(() => window.__juego.estrellas(0)); await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });

  // 3. el flujo de verdad
  const cerditos = await p.evaluate(() => window.__juego.pigs().length);
  await p.click('#jugarBtn'); await p.waitForTimeout(250); await p.screenshot({ path: `${L.CAP}/recorrido-0-panel.png` });
  await p.click('#modoCurso'); await p.waitForTimeout(150);
  ok(await p.evaluate(() => document.getElementById('modoCurso').getAttribute('aria-pressed')) === 'true' && (await p.evaluate(() => window.__dicho)).includes('Un recorrido largo.'), 'en el panel se elige 🏁 y la voz dice qué es');
  await p.click('#persCard .pers:nth-child(3)'); await p.waitForTimeout(700);
  let c = await p.evaluate(() => window.__juego.curso()); ok(c && c.tramo === 0 && await p.evaluate(() => window.__juego.av().manz.length) === 5, 'empieza el primer tramo, con cinco manzanas');
  ok(await p.evaluate(() => window.__juego.pigs().length) === 0, 'los cerditos del mundo no están en el recorrido');
  const corre = async hasta => { await p.keyboard.down('ArrowRight'); const t0 = Date.now(); let n = 0; while (Date.now() - t0 < 45000) { const s = await p.evaluate(() => { const a = window.__juego.av(), q = window.__juego.curso(); return { fin: a.fin, tramo: q ? q.tramo : -1 }; }); if (s.fin || s.tramo >= hasta) break; await p.waitForTimeout(260); await p.keyboard.press('Space'); if (++n === 6) await p.screenshot({ path: `${L.CAP}/recorrido-tramo${hasta}.png` }); } await p.keyboard.up('ArrowRight'); };
  await corre(1); c = await p.evaluate(() => window.__juego.curso()); ok(c && c.tramo === 1, 'al llegar a la flecha pasa al segundo tramo');
  ok((await p.evaluate(() => window.__dicho)).includes('¡Muy bien! Seguimos.'), 'y la voz anima a seguir');
  await corre(2); c = await p.evaluate(() => window.__juego.curso()); ok(c && c.tramo === 2, 'y luego al tercero');
  await corre(3); await p.waitForTimeout(500);
  const fin = await p.evaluate(() => { const a = window.__juego.av(); return { fin: a.fin, cog: a.cog }; }); ok(fin.fin, `llega a la bandera del final con ${fin.cog} manzanas de 15`);
  await p.screenshot({ path: `${L.CAP}/recorrido-fin.png` });
  ok(await L.starsN(p) === (fin.cog === 15 ? 2 : 1), `gana ${fin.cog === 15 ? 'dos estrellas' : 'una estrella'}`);
  const d = await p.evaluate(() => window.__dicho); ok(d.some(t => /Has llegado al final del recorrido/.test(t)), 'la voz: ' + d.filter(t => /final del recorrido/.test(t)).pop());
  await p.waitForTimeout(6600);
  ok(await p.evaluate(() => !window.__juego.av().on && !window.__juego.curso()) && await p.evaluate(a => JSON.stringify(window.__juego.grid()) === a, antes) && await p.evaluate(() => window.__juego.pigs().length) === cerditos, 'después vuelve solo a su mundo, con sus bloques y sus cerditos');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
