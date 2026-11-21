// El mundo hace cosas solo: semillas que crecen al amanecer y reacciones entre bloques.
const L = require('./lib');
const COLS = 96, ROWS = 32;
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 2 });
  await L.fresh(p);
  await p.evaluate(() => window.__juego.irA(13.76)); // la zona de trabajo de esta prueba está a la izquierda del mundo
  const dichos = () => p.evaluate(() => window.__dicho || []);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const G = () => p.evaluate(() => window.__juego.grid().slice());
  const pon = (cells) => p.evaluate(cs => { const g = window.__juego.grid(); cs.forEach(([x, y, v]) => { g[y * 96 + x] = v; }); }, cells);
  ok(await p.evaluate(() => document.querySelectorAll('#blocks .slot').length) === 14, 'el inventario tiene 14 bloques (con la semilla)');
  ok(await p.evaluate(() => document.getElementById('b14').getAttribute('aria-label')) === 'Semilla', 'el botón nuevo se llama Semilla');

  // un trozo de mundo limpio y plano para trabajar: columnas 16..30, suelo de hierba en la fila 20
  await p.evaluate(() => { const g = window.__juego.grid(); window.__juego.pigs().length = 0;
    for (let x = 8; x <= 38; x++) for (let y = 0; y < 32; y++) g[y * 96 + x] = y < 20 ? 0 : y === 20 ? 1 : y < 24 ? 2 : 3; }); // con margen, para que no haya agua del mundo generado pegada a la zona
  await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('bloques2')); }); 
  // 1. plantar con el dedo
  await p.click('#b14'); await p.waitForTimeout(100);
  const c = await L.cam(p); const toca = async (x, y) => { const c2 = await L.cam(p); await p.mouse.click(c2.left + (x - c2.camC + .5) * c2.S, c2.top + (y + .5) * c2.S + c2.offY); await p.waitForTimeout(120); };
  await p.evaluate(() => { window.__camAntes = window.__juego.cam(); });
  await toca(18, 20); // tocar la hierba pone la semilla encima
  let g = await G(); ok(g[19 * COLS + 18] === 14, 'tocar la hierba planta la semilla encima');
  await p.waitForTimeout(300);
  ok((await dichos()).some(t => /Cuando pase la noche/.test(t)), 'la voz explica que crecerá al pasar la noche: ' + (await dichos()).slice(-2).join(' | '));
  await pon([[22, 20, 3]]); await toca(22, 20); await p.waitForTimeout(300); // semilla sobre piedra
  g = await G(); ok(g[19 * COLS + 22] === 14, 'se puede poner sobre piedra...');
  ok((await dichos()).some(t => /necesita tierra/.test(t)), '...y la voz avisa de que necesita tierra');
  await p.screenshot({ path: `${L.CAP}/semilla-1.png`, clip: { x: (16 - c.camC) * c.S, y: (13 + c.offY / c.S) * c.S, width: 9 * c.S, height: 9 * c.S } });

  // 2. amanecer con el botón de la luna
  await p.click('#tNight'); await p.waitForTimeout(400); await p.click('#tNight'); await p.waitForTimeout(2300);
  g = await G(); ok(g[19 * COLS + 18] === 15, 'tras una noche, la semilla es un arbolito');
  ok(g[19 * COLS + 22] === 14, 'la de la piedra sigue siendo semilla');
  ok((await dichos()).some(t => /ha brotado/.test(t)), 'la voz lo cuenta');
  await p.screenshot({ path: `${L.CAP}/semilla-2.png`, clip: { x: (16 - c.camC) * c.S, y: (13 + c.offY / c.S) * c.S, width: 9 * c.S, height: 9 * c.S } });
  await p.click('#tNight'); await p.waitForTimeout(400); await p.click('#tNight'); await p.waitForTimeout(2600);
  g = await G();
  ok([19, 18, 17].every(y => g[y * COLS + 18] === 4), 'tras otra noche hay un tronco de tres maderas');
  ok([16, 15].every(y => [17, 18, 19].every(x => g[y * COLS + x] === 5)), 'y una copa de 3×2 hojas');
  await p.screenshot({ path: `${L.CAP}/semilla-3.png`, clip: { x: (16 - c.camC) * c.S, y: (13 + c.offY / c.S) * c.S, width: 9 * c.S, height: 9 * c.S } });

  // 3. sin sitio encima, el arbolito espera
  await pon([[26, 19, 15], [26, 18, 3]]);
  ok(await p.evaluate(() => window.__juego.amanece(true)) === 0, 'un arbolito con un bloque encima no crece');
  await pon([[26, 18, 0]]);
  ok(await p.evaluate(() => window.__juego.amanece(true)) === 1, 'al quitar el bloque, crece');

  // 4. reacciones: antorcha y nieve, agua y tierra, flores
  await pon([[29, 19, 12], [30, 19, 13], [29, 17, 12]]); // nieve pegada a una antorcha, y otra lejos
  await pon([[15, 20, 7], [16, 20, 2], [14, 20, 2]]);   // agua con tierra a los lados
  await p.evaluate(() => window.__juego.reac(40000));
  g = await G();
  ok(g[19 * COLS + 29] === 7, 'la nieve junto a la antorcha se derrite en agua');
  ok(g[17 * COLS + 29] === 12, 'la nieve que está lejos sigue ahí');
  ok(g[20 * COLS + 16] === 1 && g[20 * COLS + 14] === 1, 'la tierra junto al agua se cubre de hierba');
  await p.evaluate(() => window.__juego.reac(1500000));
  g = await G(); const flores = []; for (let x = 14; x <= 32; x++) if (g[19 * COLS + x] === 11) flores.push(x);
  ok(flores.length >= 1 && flores.every(x => Math.abs(x - 15) <= 1 || Math.abs(x - 29) <= 1), 'salen flores solo junto al agua: columnas ' + flores.join(','));
  ok(flores.every((x, k) => k === 0 || x - flores[k - 1] > 2), 'y nunca dos pegadas');
  await p.screenshot({ path: `${L.CAP}/reacciones.png` });

  // 5. con un reto abierto no pasa nada
  await pon([[20, 19, 12], [21, 19, 13], [24, 19, 14]]);
  await p.evaluate(() => window.__juego.reacOn(true));
  await L.startKind(p, 'pon'); await p.waitForTimeout(1500);
  g = await G(); ok(g[19 * COLS + 20] === 12, 'con un reto abierto la nieve no se derrite');
  ok(await p.evaluate(() => window.__juego.amanece(true)) === 0, 'ni crecen las semillas');
  await p.click('#rClose'); const t0 = Date.now(); let seg = -1;
  for (let k = 0; k < 40 && seg < 0; k++) { await p.waitForTimeout(250); if ((await G())[19 * COLS + 20] === 7) seg = (Date.now() - t0) / 1000; }
  ok(seg >= 0, 'al cerrar el reto, se derrite sola (ha tardado ' + seg.toFixed(1) + ' s)');
  await p.evaluate(() => window.__juego.reacOn(false));

  // 6. volver horas después: lo plantado ha crecido sin ruido y la voz lo cuenta al primer toque en el mundo
  await p.evaluate(() => { const g = window.__juego.grid(); g[19 * 96 + 24] = 14; });
  await toca(31, 15); // un cambio cualquiera para que se guarde
  await p.evaluate(() => { const d = JSON.parse(localStorage.getItem('bloques2')); d.mundos[d.mundo].t = Date.now() - 7 * 36e5; localStorage.setItem('bloques2', JSON.stringify(d)); });
  await p.reload(); await p.waitForTimeout(1500);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  g = await G(); ok(g[19 * COLS + 24] === 15, 'al volver siete horas después, la semilla ya es arbolito');
  ok(await p.evaluate(() => window.__juego.pops()) === 0, 'sin saltitos (ya estaba así)');
  await p.click('#tDig'); await toca(31, 15); await p.waitForTimeout(400);
  ok((await dichos()).some(t => /Mientras no estabas/.test(t)), 'la voz lo cuenta al tocar el mundo: ' + (await dichos()).join(' | '));
  await p.reload(); await p.waitForTimeout(1500);
  g = await G(); ok(g[19 * COLS + 24] === 15, 'recargar enseguida no la hace crecer otra vez');

  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
