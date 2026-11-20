// "Cómo juega": que se cuenta lo que se hace, que se guarda y que el panel lo enseña.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 2 });
  await L.fresh(p);
  p.on('dialog', async d => { const m = /(\d+) × (\d+)/.exec(d.message()); if (m) await d.accept(String(m[1] * m[2])); else await d.accept(); });
  const U = () => p.evaluate(() => JSON.parse(JSON.stringify(window.__juego.uso())));
  let u = await U(); ok(u.v === 1 && Object.keys(u.r).length === 0, 'empieza vacío');
  // construir: tres bloques, un picotazo, noche
  const hs = await L.huecos(p, 3, 1);
  await p.click('#b10'); await L.tapCell(p, null, null, hs[0][0], hs[0][1]); await L.tapCell(p, null, null, hs[1][0], hs[1][1]);
  await p.click('#b8'); await L.tapCell(p, null, null, hs[2][0], hs[2][1]);
  await p.click('#tDig'); await L.tapCell(p, null, null, hs[2][0], hs[2][1]);
  await p.click('#tNight'); await p.click('#tNight'); await p.click('#tPut');
  u = await U(); ok(u.pon['10'] === 2 && u.pon['8'] === 1, 'cuenta los bloques puestos por tipo: ' + JSON.stringify(u.pon));
  ok(u.f.pica === 1 && u.f.noche === 2, 'y las herramientas: ' + JSON.stringify(u.f));
  // un reto conseguido y otro cerrado sin intentar
  await L.startKind(p, 'pon'); await L.quieta(p);
  const r = await p.evaluate(() => { const q = window.__juego.retoFull(); return { k: q.kind, b: q.b, n: q.n }; });
  await p.click('#b' + r.b); for (const hq of await L.huecos(p, r.n, 1)) await L.tapCell(p, null, null, hq[0], hq[1]);
  await p.waitForTimeout(500);
  u = await U(); ok(r.k === 'pon' && u.r.pon.n === 1 && u.r.pon.ok === 1 && u.r.pon.s >= 0, `reto conseguido (poner ${r.n}): ` + JSON.stringify(u.r.pon));
  await p.waitForTimeout(4600);
  await p.click('#tReto'); await p.waitForTimeout(400); const k2 = await p.evaluate(() => window.__juego.retoFull().kind);
  await p.click('#rSay'); await p.waitForTimeout(100); await p.click('#rClose'); await p.waitForTimeout(200);
  u = await U(); ok(u.r[k2].n === 1 && u.r[k2].v === 1 && u.r[k2].rep === 1, `reto cerrado sin intentar (${k2}), tras pedir que lo repita: ` + JSON.stringify(u.r[k2]));
  // aventura (en un terreno llano: un reto puede haber dejado una torre, y las torres cortan el paso)
  await p.evaluate(() => { const g = window.__juego.grid(); for (let x = 0; x < 48; x++) for (let y = 0; y < 32; y++) g[y * 48 + x] = y < 20 ? 0 : y === 20 ? 1 : y < 24 ? 2 : 3; window.__juego.pigs().length = 0; });
  await p.click('#jugarBtn'); await p.waitForTimeout(200); await p.click('#persCard .pers:nth-child(5)'); await p.waitForTimeout(300);
  await p.keyboard.down('ArrowRight'); const t0 = Date.now(); while (Date.now() - t0 < 30000 && !(await p.evaluate(() => window.__juego.av().fin))) { await p.waitForTimeout(300); await p.keyboard.press('Space'); } await p.keyboard.up('ArrowRight');
  u = await U(); ok(u.a.n === 1 && u.a.fin === 1 && u.a.pers[4] === 1 && u.a.manz >= 4, 'la aventura: ' + JSON.stringify(u.a));
  const hoy = Object.values(u.dias)[0]; ok(hoy && hoy.t > 10 && hoy.r > 0 && hoy.a > 5 && hoy.s === 1, 'el tiempo de hoy, repartido: ' + JSON.stringify(hoy, (k, v) => typeof v === 'number' ? +v.toFixed(1) : v));
  await p.waitForTimeout(6500);
  // el panel
  await p.click('#vozBtn'); await p.waitForTimeout(300); await p.click('#usoBtn'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => !document.getElementById('uso').hidden), 'Ajustes > Cómo juega abre el panel');
  ok(JSON.parse(await p.evaluate(() => localStorage.getItem('bloquesUso'))).r.pon.ok === 1, 'y los datos están guardados en el aparato');
  const txt = await p.evaluate(() => document.getElementById('usoTxt').innerText);
  ok(/Poner bloques: 1 empezado · 1 conseguido /.test(txt) && /1 cerrado sin intentar/.test(txt) && /Carreras: 1/.test(txt) && /oro \(2\)/.test(txt), 'el panel enseña retos, aventura y bloques');
  await p.click('#usoCopia'); await p.waitForTimeout(200);
  const area = await p.evaluate(() => { const a = document.getElementById('usoArea'); return { h: a.hidden, v: a.value }; });
  ok(!area.h && /RESUMEN/.test(area.v) && /RETOS/.test(area.v), 'Copiar deja el resumen en texto: ' + area.v.split('\n').length + ' líneas');
  // con datos de varias semanas (inventados) para ver el panel lleno
  await p.evaluate(() => { const dias = {}, hoy = Date.now(), f = d => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    [14, 12, 11, 9, 6, 5, 4, 2, 1, 0].forEach((k, i) => { const t = [900, 1500, 600, 1320, 1800, 480, 1140, 1560, 720, 1080][i]; dias[f(new Date(hoy - k * 864e5))] = { t, r: t * .28, a: t * .2, s: 1 + (i % 2) }; });
    window.__juego.usoPon({ v: 1, desde: f(new Date(hoy - 14 * 864e5)), dias, f: { pica: 212, casa: 31, cerdo: 18, noche: 44, musica: 23, deshacer: 9, zoom: 12, mundo: 6 }, pon: { 10: 140, 8: 122, 1: 60, 13: 51, 9: 40, 12: 22, 14: 12 },
      r: { cerdos: { n: 14, ok: 13, x: 0, v: 1, e: 1, s: 290, rep: 2 }, pon: { n: 12, ok: 11, x: 1, v: 0, e: 1, s: 360, rep: 1 }, torre: { n: 9, ok: 8, x: 1, v: 0, e: 2, s: 400, rep: 0 }, suma: { n: 10, ok: 7, x: 2, v: 1, e: 3, s: 560, rep: 6 },
        resta: { n: 6, ok: 2, x: 3, v: 1, e: 3, s: 190, rep: 5 }, serie: { n: 8, ok: 6, x: 1, v: 1, e: 2, s: 300, rep: 1 }, copia: { n: 7, ok: 5, x: 1, v: 1, e: 2, s: 610, rep: 0 }, programa: { n: 5, ok: 1, x: 1, v: 3, e: 1, s: 95, rep: 4 }, letra: { n: 2, ok: 2, x: 0, v: 0, e: 0, s: 80, rep: 0 } },
      a: { n: 11, fin: 8, todas: 2, manz: 45, muro: 13, pers: [1, 2, 0, 1, 1, 6] } }); });
  await p.click('#usoClose'); await p.click('#usoBtn'); await p.waitForTimeout(300);
  await (await p.$('#usoCard')).screenshot({ path: `${L.CAP}/uso-panel.png` });
  await p.evaluate(() => { document.getElementById('usoCard').scrollTop = 99999; }); await p.waitForTimeout(200);
  await (await p.$('#usoCard')).screenshot({ path: `${L.CAP}/uso-panel-2.png` });
  console.log(await p.evaluate(() => window.__juego.usoResumen().map(s => '    [' + s[0] + ']\n' + s[1].map(l => '      ' + l).join('\n')).join('\n')));
  await p.click('#usoBorra'); await p.waitForTimeout(300);
  u = await U(); ok(Object.keys(u.r).length === 0 && u.a.n === 0, 'Borrar datos lo deja a cero');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('bloques2')).stars) >= 1, 'sin tocar las estrellas ni el mundo');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
