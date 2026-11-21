// Letras trabajadas en clase: sin palabra de la semana, los retos de letras salen solo de la lista que el adulto pone en ajustes.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  p.on('dialog', async d => { const m = /(\d+) × (\d+)/.exec(d.message()); if (m) await d.accept(String(m[1] * m[2])); else await d.accept(); });
  const cuenta = n => p.evaluate(n => { const c = {}; let rep = 0, ant = ''; for (let k = 0; k < n; k++) { const l = window.__juego.letraSuelta(); c[l] = (c[l] || 0) + 1; if (l === ant) rep++; ant = l; } return { c, rep }; }, n);
  ok(await p.evaluate(() => window.__juego.letras()) === 'AEIOUMPLSD', 'de partida, las letras de clase son A E I O U M P L S D');
  let s = await cuenta(3000); const fuera = Object.keys(s.c).filter(l => !'AEIOUMPLSD'.includes(l));
  ok(fuera.length === 0 && Object.keys(s.c).length === 10, 'en 3000 sorteos salen las diez y ninguna otra: ' + Object.keys(s.c).sort().join(''));
  ok(s.rep === 0, 'nunca la misma dos veces seguidas');
  const rec = (s.c.L + s.c.S + s.c.D) / 3, resto = (3000 - s.c.L - s.c.S - s.c.D) / 7;
  ok(rec > resto * 1.5, `las tres más recientes (L, S, D) salen más: unas ${Math.round(rec)} veces cada una frente a ${Math.round(resto)} las demás`);
  // el reto de verdad: se pide varias veces el de letras y se mira qué letra trae
  const pide = async (kind, ultimo) => { const ks = L.KINDS.filter(k => k !== ultimo), i = ks.indexOf(kind); await p.evaluate(v => { const o = Math.random; Math.random = () => { Math.random = o; return v; }; document.getElementById('tReto').click(); }, (i + .5) / ks.length); await p.waitForTimeout(300); return p.evaluate(() => { const r = window.__juego.retoFull(); return { kind: r.kind, L: r.L, pal: r.pal }; }); };
  const vistas = []; let ultimo = '';
  for (let k = 0; k < 8; k++) { let r = await pide('letra', ultimo); ultimo = r.kind; if (r.kind === 'letra') vistas.push(r.L); await p.click('#rClose'); await p.waitForTimeout(150); r = await pide('pon', ultimo); ultimo = r.kind; await p.click('#rClose'); await p.waitForTimeout(150); }
  ok(vistas.length >= 6 && vistas.every(l => 'AEIOUMPLSD'.includes(l)), 'los retos de letras piden letras de la lista: ' + vistas.join(' '));
  await p.screenshot({ path: `${L.CAP}/letras-reto.png` });
  // el adulto cambia la lista en ajustes
  await p.click('#vozBtn'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('letIn').value) === 'AEIOUMPLSD', 'en ajustes se ve la lista');
  await p.fill('#letIn', 'a e i, o u m p l s d t á 3 ?'); await p.click('#letOk'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => window.__juego.letras()) === 'AEIOUMPLSDT' && await p.evaluate(() => JSON.parse(localStorage.getItem('bloquesPalabra')).letras) === 'AEIOUMPLSDT', 'al añadir la T se guarda limpia y sin repetir: AEIOUMPLSDT');
  await p.screenshot({ path: `${L.CAP}/letras-ajustes.png` });
  s = await cuenta(1500); ok(s.c.T > 0 && (s.c.T + s.c.D + s.c.S) / 3 > (1500 - s.c.T - s.c.D - s.c.S) / 8 * 1.5, 'la T entra en el sorteo y pasa a ser de las recientes');
  await p.click('#vozClose'); await p.reload(); await p.waitForTimeout(500);
  ok(await p.evaluate(() => window.__juego.letras()) === 'AEIOUMPLSDT', 'al recargar se acuerda');
  ok(/"letras":"AEIOUMPLSDT"/.test(await p.evaluate(() => Guardado.exportar())), 'y va en la copia de seguridad');
  // lista vacía: vuelve a salir de todas, según el nivel (en fácil, las vocales)
  await p.click('#vozBtn'); await p.waitForTimeout(300); await p.fill('#letIn', ''); await p.click('#letOk'); await p.waitForTimeout(200); await p.click('#vozClose');
  s = await cuenta(400); ok(await p.evaluate(() => window.__juego.letras()) === '' && Object.keys(s.c).every(l => 'AEIOU'.includes(l)), 'con la lista vacía salen las del nivel: ' + Object.keys(s.c).sort().join(''));
  // la palabra de la semana manda sobre la lista
  await p.evaluate(() => localStorage.setItem('bloquesPalabra', JSON.stringify({ txt: 'ZOO', i: 0, letras: 'AEIOUMPLSD' }))); await p.reload(); await p.waitForTimeout(500);
  const r = await pide('letra', ''); ok(r.kind === 'letra' && r.L === 'Z' && r.pal === 'ZOO', 'con palabra de la semana, sus letras mandan aunque no estén en la lista (Z de ZOO)');
  await p.click('#rClose');
  // un guardado de antes, sin lista: se queda con la de partida
  await p.evaluate(() => localStorage.setItem('bloquesPalabra', JSON.stringify({ txt: '', i: 0 }))); await p.reload(); await p.waitForTimeout(500);
  ok(await p.evaluate(() => window.__juego.letras()) === 'AEIOUMPLSD', 'un guardado anterior, sin lista, toma la de partida');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
