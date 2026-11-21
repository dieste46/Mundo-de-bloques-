// Mismo ritmo en un aparato lento, cerdito con vida (curiosidad, flores, parpadeo) y vida en el mundo (mariposas, luciérnagas, pájaro, atardecer).
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, ctx, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  await p.evaluate(() => window.__juego.irA(13.76)); // la zona de trabajo de esta prueba está a la izquierda del mundo
  const cdp = await ctx.newCDPSession(p);
  const llano = () => p.evaluate(() => { const J = window.__juego, g = J.grid(); for (let x = 0; x < 96; x++) for (let y = 0; y < 32; y++) g[y * 96 + x] = y < 20 ? 0 : y === 20 ? 1 : y < 24 ? 2 : 3; const ps = J.pigs(); ps.length = 1; Object.assign(ps[0], { x: 14, y: 19, vx: .015, vy: 0, mira: 0, flor: Date.now() + 1e9, curio: 0, joy: 0 }); });
  const cerdo = () => p.evaluate(() => { const q = window.__juego.pigs()[0]; return { x: q.x, y: q.y, vx: q.vx, vy: q.vy, mira: (q.mira || 0) - Date.now(), joy: q.joy, parp: q.parp || 0 }; });

  // 1. el cerdito anda igual de rápido aunque el aparato vaya a pocos fotogramas
  const anda = async freno => { await llano(); await cdp.send('Emulation.setCPUThrottlingRate', { rate: freno });
    await p.evaluate(() => { window.__r = Math.random; Math.random = () => .5; if (window.__n === undefined) { window.__n = 0; const cuenta = () => { window.__n++; requestAnimationFrame(cuenta); }; requestAnimationFrame(cuenta); } });
    await p.waitForTimeout(300); const a = await cerdo(), n0 = await p.evaluate(() => window.__n), t0 = Date.now(); await p.waitForTimeout(2500); const z = await cerdo(), n1 = await p.evaluate(() => window.__n), dt = (Date.now() - t0) / 1000;
    await p.evaluate(() => { Math.random = window.__r; }); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 });
    return { v: (z.x - a.x) / dt, fps: (n1 - n0) / dt }; };
  const rapido = await anda(1), lento = await anda(12);
  ok(lento.fps < rapido.fps * .9, `el aparato frenado va a ${lento.fps.toFixed(0)} imágenes por segundo (sin frenar, ${rapido.fps.toFixed(0)})`);
  // El juego no cuenta más de 50 ms por fotograma (para que nada dé saltos): por debajo de 20 imágenes por segundo va algo más despacio a propósito.
  const esperado = rapido.v * Math.min(1, lento.fps * .05);
  ok(Math.abs(lento.v - esperado) / esperado < .2, `y el cerdito anda igual: ${rapido.v.toFixed(2)} y ${lento.v.toFixed(2)} bloques por segundo` + (esperado < rapido.v * .99 ? ` (a ${lento.fps.toFixed(0)} imágenes por segundo se esperan ${esperado.toFixed(2)})` : ''));

  // 2. curiosidad: al poner un bloque cerca, se gira a mirarlo y da un saltito
  await llano(); await p.evaluate(() => { const q = window.__juego.pigs()[0]; q.vx = -.015; }); await p.waitForTimeout(200);
  await p.click('#b10'); let c = await cerdo(); const x = Math.round(c.x) + 2;
  await L.tapCell(p, null, null, x, 19); c = await cerdo();
  ok(c.mira > 300 && c.vx > 0 && (c.vy < 0 || c.y < 19), `al poner un bloque a su derecha se gira hacia él, se para y da un saltito (mira ${Math.round(c.mira)} ms)`);
  const xq = c.x; await p.waitForTimeout(500); c = await cerdo(); ok(Math.abs(c.x - xq) < .02, 'mientras mira no anda');
  await p.waitForTimeout(900); const xr = (await cerdo()).x; await p.waitForTimeout(600); ok(Math.abs((await cerdo()).x - xr) > .1, 'y luego sigue su camino');
  // flores: se para a olerlas
  await llano(); await p.evaluate(() => { const J = window.__juego; [12, 13, 15, 16].forEach(x => { J.grid()[19 * 96 + x] = 11; }); J.pigs()[0].flor = 0; }); // flores a los dos lados: a veces se da la vuelta
  let olio = false; for (let k = 0; k < 40 && !olio; k++) { await p.waitForTimeout(150); c = await cerdo(); olio = c.joy > 5 && c.mira > 0; }
  ok(olio, `al pasar por una flor se para a olerla (x=${c.x.toFixed(1)})`);
  ok((await cerdo()).parp > 0, 'y tiene programado su parpadeo');

  // 3. vida en el mundo
  const vida = () => p.evaluate(() => window.__juego.vida());
  await llano(); await p.evaluate(() => { const g = window.__juego.grid(); [15, 18, 21, 24, 27, 30].forEach(x => { g[19 * 96 + x] = 11; }); }); await p.waitForTimeout(1200);
  let v = await vida(); ok(v.mariposas >= 2 && v.mariposas <= 4 && v.luciernagas === 0, `de día, con seis flores: ${v.mariposas} mariposas y ninguna luciérnaga`);
  await p.screenshot({ path: `${L.CAP}/vida-dia.png` });
  await p.evaluate(() => window.__juego.pajaroYa()); await p.waitForTimeout(600); v = await vida(); ok(v.pajaro, 'un pájaro cruza el cielo');
  await p.screenshot({ path: `${L.CAP}/vida-pajaro.png`, clip: { x: 0, y: 0, width: 1024, height: 300 } });
  await p.click('#tNight'); await p.waitForTimeout(450); await p.screenshot({ path: `${L.CAP}/vida-atardecer.png` });
  await p.waitForTimeout(7000); v = await vida();
  ok(v.mariposas === 0 && v.luciernagas === 5, `de noche: ${v.mariposas} mariposas y ${v.luciernagas} luciérnagas`);
  await p.screenshot({ path: `${L.CAP}/vida-noche.png` });
  await p.click('#tNight'); await p.waitForTimeout(8000); v = await vida();
  ok(v.luciernagas === 0 && v.mariposas >= 2, `al amanecer vuelven las mariposas (${v.mariposas}) y se van las luciérnagas (${v.luciernagas})`);
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
