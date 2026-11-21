// Encargos del cerdito: un puente sobre el agua y una escalera hasta la manzana, en el propio mundo, que al acabar queda como estaba.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const dicho = () => p.evaluate(() => window.__dicho);
  // un mundo llano en el centro, para que haya sitio seguro
  await p.evaluate(() => { const g = window.__juego.grid(), C = window.__juego.COLS; for (let x = 30; x < 66; x++) for (let y = 0; y < 32; y++) g[y * C + x] = y < 20 ? 0 : y === 20 ? 1 : y < 24 ? 2 : 3; window.__juego.pigs().length = 0; });
  const G = () => p.evaluate(() => window.__juego.grid().slice());
  const dif = (a, c) => a.reduce((n, v, i) => n + (v !== c[i] ? 1 : 0), 0);
  const antes = await G();

  // el puente
  let r = await L.pide(p, 'puente', ''); await L.quieta(p);
  ok(r.kind === 'puente' && r.ghost.length === r.n && r.n >= 2, `puente: una zanja de ${r.n} con agua`);
  let g = await G(); const C = 96;
  ok(r.ghost.every(q => g[q.y * C + q.x] === 0 && g[(q.y + 1) * C + q.x] === 7), 'el juego abre la zanja: aire a ras de suelo y agua debajo');
  ok((await dicho()).some(t => /Hazle un puente: tapa el agua con/.test(t)), 'la voz: ' + (await dicho()).pop());
  await p.screenshot({ path: `${L.CAP}/encargo-puente-1.png` });
  await p.click('#b4'); for (const q of r.ghost) await L.tapCell(p, null, null, q.x, q.y + 1); // tocando el agua: el bloque queda encima, a ras de suelo
  await p.waitForTimeout(500); g = await G();
  ok(r.ghost.every(q => g[q.y * C + q.x] === 4), 'tocando el agua, los bloques tapan la zanja a ras de suelo');
  ok(await L.starsN(p) === 1 && (await dicho()).some(t => /Un puente de .+ bloques\. ¡El cerdito ya puede cruzar!/.test(t)), 'gana: ' + (await dicho()).filter(t => /Lo has conseguido/.test(t)).pop());
  await p.waitForTimeout(900); await p.screenshot({ path: `${L.CAP}/encargo-puente-2.png` });
  await p.waitForTimeout(3800); ok(dif(antes, await G()) === 0, 'al cerrarse, el mundo queda como estaba: ni zanja ni puente');

  // la escalera
  r = await L.pide(p, 'escalera', 'puente'); await L.quieta(p);
  ok(r.kind === 'escalera' && r.k === 2 && r.ghost.length === 3, `escalera de ${r.k} escalones: ${r.ghost.length} bloques (uno y dos)`);
  ok((await dicho()).some(t => /Hazle una escalera: un bloque, luego dos\./.test(t)), 'la voz: ' + (await dicho()).pop());
  await p.click('#b8'); for (const q of r.ghost.slice().sort((a, c) => c.y - a.y)) await L.tapCell(p, null, null, q.x, q.y); // de abajo arriba
  await p.waitForTimeout(500);
  ok(await L.starsN(p) === 2 && (await dicho()).some(t => /Una escalera de dos escalones: uno, dos\./.test(t)), 'gana: ' + (await dicho()).filter(t => /escalones/.test(t)).pop());
  await p.waitForTimeout(700); await p.screenshot({ path: `${L.CAP}/encargo-escalera.png` });
  await p.waitForTimeout(4000); ok(dif(antes, await G()) === 0, 'y el mundo vuelve a quedar como estaba');
  // sin sitio llano no sale el encargo: sale otro reto, sin errores
  await p.evaluate(() => { const g = window.__juego.grid(), C = window.__juego.COLS; for (let x = 0; x < C; x++) { let y = 0; while (y < 32 && !g[y * C + x]) y++; if (y > 2 && x % 2) g[(y - 1) * C + x] = 3; } });
  r = await L.pide(p, 'puente', 'escalera'); ok(r && r.kind !== 'puente', `si no hay un llano libre, sale otro reto en su lugar (${r && r.kind})`);
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
