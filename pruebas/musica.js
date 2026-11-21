// El cerdito músico: una nota por columna, más aguda cuanto más alta.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 2 });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  ok(await p.evaluate(() => document.querySelectorAll('#tools .tool').length) === 8, 'hay 8 herramientas (con la música)');
  // paisaje a medida en lo que se ve: llano, luego una escalera que sube de uno en uno con materiales distintos, y llano otra vez
  const c = await L.cam(p), x0 = Math.ceil(c.camC), x1 = Math.floor(c.camC + c.W / c.S) - 1;
  await p.evaluate(([x0, x1]) => { const g = window.__juego.grid(); window.__juego.pigs().length = 1;
    for (let x = x0 - 1; x <= x1 + 1; x++) for (let y = 0; y < 32; y++) g[y * 96 + x] = y < 21 ? 0 : y === 21 ? 1 : y < 25 ? 2 : 3;
    const mat = [4, 3, 9, 10, 7, 8, 12, 6]; for (let k = 0; k < 8; k++) for (let j = 0; j <= k; j++) g[(20 - j) * 96 + x0 + 4 + k] = mat[k]; }, [x0, x1]);
  await p.click('#tMusic'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('tMusic').getAttribute('aria-pressed')) === 'true', 'el botón queda marcado mientras suena');
  const m = await p.evaluate(() => window.__juego.musica()); ok(m && m.x0 === x0 && m.x1 === x1, `va de la columna ${x0} a la ${x1} (lo que se ve)`);
  await p.waitForTimeout(700 + 270 * 8.4 - 300); await p.screenshot({ path: `${L.CAP}/musica.png` });
  let salto = 0; for (let k = 0; k < 12 && !salto; k++) { salto = await p.evaluate(() => window.__juego.pops()); await p.waitForTimeout(40); }
  ok(salto >= 1, 'el bloque de la cima da un saltito al sonar');
  await p.waitForTimeout(270 * (x1 - x0 + 1 - 8.4) + 900);
  ok(await p.evaluate(() => window.__juego.musica()) === null, 'termina sola al llegar al borde derecho');
  ok(await p.evaluate(() => document.getElementById('tMusic').getAttribute('aria-pressed')) === 'false', 'y el botón se apaga');
  const notas = await p.evaluate(() => window.__juego.ultNotas());
  ok(notas.length === x1 - x0 + 1, `una nota por columna: ${notas.length}`);
  console.log('         notas (Hz):', notas.join(' '));
  const esc = notas.slice(4, 12); ok(esc.every((f, k) => k === 0 || f > esc[k - 1]), 'la escalera suena cada vez más aguda: ' + esc.join(' < '));
  ok(notas.slice(0, 4).every(f => f === notas[0]) && notas[0] < esc[0], 'el llano suena siempre igual y más grave');
  const PENTA = [0, 2, 4, 7, 9], validas = []; for (let o = 0; o < 4; o++) PENTA.forEach(s => validas.push(Math.round(261.63 * Math.pow(2, (o * 12 + s) / 12))));
  ok(notas.every(f => validas.includes(f)), 'todas las notas son de la escala de cinco');
  ok((await p.evaluate(() => window.__dicho)).includes('¡Música!'), 'la voz dice ¡Música!');
  // parar a mitad
  await p.click('#tMusic'); await p.waitForTimeout(1500); await p.click('#tMusic'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => window.__juego.musica()) === null, 'tocar otra vez la para');
  const n2 = (await p.evaluate(() => window.__juego.ultNotas())).length; ok(n2 >= 2 && n2 <= 4, `se quedó a medias (${n2} notas)`);
  // con un reto abierto no suena
  await L.startKind(p, 'pon'); await p.waitForTimeout(400); await p.click('#tMusic'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => window.__juego.musica()) === null, 'con un reto abierto no arranca');
  ok((await p.evaluate(() => window.__dicho)).some(t => /Cuando acabes el reto/.test(t)), 'y la voz dice por qué');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
