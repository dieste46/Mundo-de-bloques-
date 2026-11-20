// Modo aventura: personaje, recorrido, manzanas, bandera, muros y mando táctil.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, ctx, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 2 });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const av = () => p.evaluate(() => { const a = window.__juego.av(); return { on: a.on, vivo: a.vivo, fin: a.fin, x: a.x, y: a.y, cog: a.cog, pers: a.pers, suelo: a.suelo, meta: a.meta, manz: a.manz.map(m => [m.x, m.y, m.c]) }; });
  const vis = id => p.evaluate(id => { const e = document.getElementById(id); return !e.hidden && e.getBoundingClientRect().height > 0; }, id);
  const dichos = () => p.evaluate(() => window.__dicho);
  const estrellas = () => p.evaluate(() => +document.getElementById('starN').textContent);

  // 1. elegir personaje
  await p.click('#jugarBtn'); await p.waitForTimeout(300);
  ok(await vis('pers'), 'el botón 🎮 abre el panel de personajes');
  ok(await p.evaluate(() => document.querySelectorAll('#persCard .pers').length) === 6, 'hay seis personajes');
  await p.screenshot({ path: `${L.CAP}/av-1-elegir.png` });
  await p.click('#persCard .pers:nth-child(4)'); await p.waitForTimeout(400);
  let a = await av(); ok(a.on && a.pers === 3, 'al elegir la gallina empieza la aventura');
  ok(await vis('mando') && !(await vis('blocks')) && !(await vis('tools')), 'la barra se cambia por el mando');
  ok(a.manz.length === 8 && a.x < 3, `sale por la izquierda (x=${a.x.toFixed(1)}) y hay 8 manzanas`);
  ok((await dichos()).some(t => /llega a la bandera/.test(t)), 'la voz explica qué hay que hacer');
  const h0 = await p.evaluate(() => document.getElementById('world').getBoundingClientRect().height);

  // 2. correr hasta la bandera manteniendo la flecha (el terreno natural no corta el paso: escalones de uno, charca, árboles)
  await p.keyboard.down('ArrowRight');
  await p.waitForTimeout(3000); await p.screenshot({ path: `${L.CAP}/av-2-corriendo.png` });
  let t0 = Date.now(); while (Date.now() - t0 < 30000) { a = await av(); if (a.fin) break; await p.waitForTimeout(300); if (Math.random() < .5) await p.keyboard.press('Space'); }
  await p.keyboard.up('ArrowRight');
  ok(a.fin, `llega a la bandera en ${((Date.now() - t0) / 1000 + 3).toFixed(0)} s (x=${a.x.toFixed(1)} de ${a.meta.x})`);
  ok(a.cog >= 4, `ha cogido manzanas por el camino: ${a.cog} de 8`);
  await p.waitForTimeout(600); await p.screenshot({ path: `${L.CAP}/av-3-bandera.png` });
  ok(await estrellas() === (a.cog === 8 ? 1 : 0), a.cog === 8 ? 'con las ocho manzanas gana una estrella' : `con ${a.cog} manzanas no hay estrella`);
  const d = await dichos(); ok(d.some(t => /Has llegado a la bandera/.test(t)), 'la voz lo celebra: ' + d.filter(t => /bandera!/.test(t)).pop());
  ok(d.includes('Una') && d.includes('Dos'), 'y fue contando las manzanas: ' + d.filter(t => /^(Una|Dos|Tres|Cuatro|Cinco|Seis|Siete|Ocho)$/.test(t)).join(', '));
  await p.waitForTimeout(6500);
  a = await av(); ok(!a.on && !a.vivo && await vis('blocks') && await vis('tools'), 'a los seis segundos vuelve sola a construir');
  ok(await p.evaluate(() => document.getElementById('world').getBoundingClientRect().height) === h0, 'el mundo mide lo mismo con mando que con barra');

  // 3. un muro de tres corta el paso; se sale, se arregla y se sigue donde se estaba
  await p.evaluate(() => { const g = window.__juego.grid(); for (let x = 0; x < 48; x++) for (let y = 0; y < 32; y++) g[y * 48 + x] = y < 20 ? 0 : y === 20 ? 1 : y < 24 ? 2 : 3; for (let k = 1; k <= 3; k++) g[(20 - k) * 48 + 8] = 8; for (let k = 1; k <= 2; k++) g[(20 - k) * 48 + 20] = 3; window.__juego.pigs().length = 0; });
  await p.click('#jugarBtn'); await p.waitForTimeout(200); await p.click('#persCard .pers:nth-child(6)'); await p.waitForTimeout(300);
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(4200);
  a = await av(); ok(a.x > 7 && a.x < 8, `el muro de tres ladrillos lo para (x=${a.x.toFixed(2)})`);
  await p.keyboard.press('Space'); await p.waitForTimeout(900); a = await av(); ok(a.x < 8, 'ni saltando lo pasa');
  ok((await dichos()).some(t => /Es muy alto/.test(t)), 'la voz propone construir una escalera');
  await p.keyboard.up('ArrowRight'); await p.screenshot({ path: `${L.CAP}/av-4-muro.png` });
  await p.click('#jugarBtn'); await p.waitForTimeout(300);
  ok(await vis('blocks') && (await av()).vivo, 'al salir vuelve la barra y el personaje se queda esperando');
  await p.evaluate(() => { const g = window.__juego.grid(); g[19 * 48 + 7] = 3; g[19 * 48 + 6] = 3; g[18 * 48 + 7] = 3; }); // una escalera: dos y uno... sube 1, 2 y salta al 3
  const x1 = (await av()).x;
  await p.click('#jugarBtn'); await p.waitForTimeout(200); await p.click('#persCard .pers:nth-child(2)'); await p.waitForTimeout(300);
  a = await av(); ok(Math.abs(a.x - x1) < .01 && a.pers === 1, 'al volver sigue donde estaba, con el personaje nuevo (gato)');
  await p.keyboard.down('ArrowLeft'); await p.waitForTimeout(700); await p.keyboard.up('ArrowLeft');
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(2500);
  a = await av(); ok(a.x > 8.5, `con la escalera pasa el muro (x=${a.x.toFixed(1)})`);
  // 4. un muro de dos: andando no, saltando sí
  await p.waitForTimeout(2600); a = await av(); ok(a.x > 19 && a.x < 20, `el muro de dos lo para si no salta (x=${a.x.toFixed(2)})`);
  await p.keyboard.press('Space'); await p.waitForTimeout(1500); a = await av(); ok(a.x > 20.5, `saltando lo pasa (x=${a.x.toFixed(1)})`);
  await p.keyboard.up('ArrowRight');
  // 5. con el dedo: el mando y tocar el mundo
  const cdp = await ctx.newCDPSession(p); const r = await p.evaluate(() => { const q = id => { const e = document.getElementById(id).getBoundingClientRect(); return [e.left, e.top, e.width, e.height]; }; return { pad: q('pad'), sal: q('salta'), cv: q('cv') }; });
  const toque = (tipo, pts) => cdp.send('Input.dispatchTouchEvent', { type: tipo, touchPoints: pts.map(([x, y, id]) => ({ x, y, id })) });
  let xa = (await av()).x; await toque('touchStart', [[r.pad[0] + r.pad[2] * .25, r.pad[1] + 40, 1]]); await p.waitForTimeout(600);
  ok((await av()).x < xa - 1, 'dedo en la mitad izquierda del mando: anda a la izquierda');
  ok(await p.evaluate(() => document.getElementById('padI').className) === 'on', 'y la flecha se ilumina');
  xa = (await av()).x; await toque('touchMove', [[r.pad[0] + r.pad[2] * .75, r.pad[1] + 40, 1]]); await p.waitForTimeout(600);
  ok((await av()).x > xa + 1, 'deslizando el dedo a la otra mitad, cambia de sentido sin levantarlo');
  let ya = (await av()).y; await toque('touchStart', [[r.pad[0] + r.pad[2] * .75, r.pad[1] + 40, 1], [r.sal[0] + 30, r.sal[1] + 40, 2]]); await p.waitForTimeout(250);
  ok((await av()).y < ya - .5, 'con otro dedo en ⬆️ salta mientras anda');
  await toque('touchEnd', []); await p.waitForTimeout(900);
  xa = (await av()).x; await p.waitForTimeout(300); ok(Math.abs((await av()).x - xa) < .01, 'al levantar los dedos se para');
  ya = (await av()).y; const antes = await p.evaluate(() => window.__juego.grid().filter(v => v).length);
  await p.mouse.click(r.cv[0] + 500, r.cv[1] + 200); await p.waitForTimeout(220);
  ok((await av()).y < ya - .5, 'tocar el mundo también salta');
  ok(await p.evaluate(() => window.__juego.grid().filter(v => v).length) === antes, 'y no pone ningún bloque');
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
