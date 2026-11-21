// Calendario (Navidad y cumpleaños) y foto del mundo.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  let acierta = true;
  p.on('dialog', async d => { const m = /(\d+) × (\d+)/.exec(d.message()); if (m) await d.accept(String(m[1] * m[2] + (acierta ? 0 : 1))); else await d.accept(); });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const dicho = () => p.evaluate(() => window.__dicho);
  const veces = async t => (await dicho()).filter(x => x.includes(t)).length;
  const toca = async () => { await p.mouse.click(700, 120); await p.waitForTimeout(250); };
  const fiesta = (d, m) => p.evaluate(([d, m]) => { window.__juego.fecha(d, m); return window.__juego.fiesta(); }, [d, m]);

  // 1. un día cualquiera no pasa nada
  let f = await fiesta(15, 6); await toca();
  ok(!f.nav && !f.cumple && (await p.evaluate(() => window.__juego.decorado())).copos === 0, 'un 15 de junio no hay fiesta ni nieve');
  // 2. Navidad: de diciembre a Reyes
  f = await fiesta(24, 12); ok(f.nav && !f.cumple, 'el 24 de diciembre es Navidad');
  await toca(); ok(await veces('¡Es Navidad! Está nevando en tu mundo.') === 1, 'con el primer toque la voz lo dice: ¡Es Navidad! Está nevando en tu mundo.');
  await p.waitForTimeout(600); ok((await p.evaluate(() => window.__juego.decorado())).copos > 30, 'y nieva');
  await p.evaluate(() => { const J = window.__juego, c = J.cam(); J.irA(Math.max(0, c.camC)); }); await p.screenshot({ path: `${L.CAP}/fiesta-navidad.png` });
  await fiesta(24, 12); await toca(); ok(await veces('¡Es Navidad!') === 1, 'el saludo es una vez al día: no se repite');
  await fiesta(25, 12); await toca(); ok(await veces('¡Es Navidad!') === 2, 'al día siguiente, otra vez');
  ok((await fiesta(1, 12)).nav && (await fiesta(6, 1)).nav && !(await fiesta(7, 1)).nav && !(await fiesta(30, 11)).nav, 'dura del 1 de diciembre al 6 de enero');

  // 3. cumpleaños: lo pone el adulto en Ajustes
  await fiesta(15, 6); await toca();
  await p.click('#vozBtn'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('cumD').options.length === 32 && document.getElementById('cumM').options.length === 13 && document.getElementById('cumD').value === ''), 'en Ajustes hay día y mes del cumpleaños, vacíos al principio');
  await p.selectOption('#cumD', '14'); await p.selectOption('#cumM', '9'); await p.waitForTimeout(200);
  ok(await p.evaluate(() => window.__juego.cumple()) === '14/9' && await veces('Cumpleaños: el 14 de septiembre.') === 1, 'al elegirlos se guarda y la voz lo confirma: Cumpleaños: el 14 de septiembre.');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('bloquesPalabra')).cumple) === '14/9', 'queda guardado en el aparato, con la palabra de la semana');
  await p.click('#vozClose'); await p.waitForTimeout(200);
  ok(!(await fiesta(13, 9)).cumple, 'la víspera no hay fiesta');
  f = await fiesta(14, 9); ok(f.cumple && !f.nav, 'el 14 de septiembre es su cumpleaños');
  await toca(); ok(await veces('¡Feliz cumpleaños! Hoy tu mundo está de fiesta.') === 1, 'con el primer toque: ¡Feliz cumpleaños! Hoy tu mundo está de fiesta.');
  await p.waitForTimeout(900); ok((await p.evaluate(() => window.__juego.decorado())).globos === 8, 'y suben ocho globos');
  await p.screenshot({ path: `${L.CAP}/fiesta-cumple.png` });
  await p.reload(); await p.waitForTimeout(500);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  ok(await p.evaluate(() => window.__juego.cumple()) === '14/9', 'tras recargar, el cumpleaños sigue puesto');
  await p.click('#vozBtn'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => document.getElementById('cumD').value + '/' + document.getElementById('cumM').value) === '14/9', 'y Ajustes lo enseña');
  await p.selectOption('#cumD', '29'); await p.selectOption('#cumM', '2'); await p.waitForTimeout(150);
  ok((await fiesta(28, 2)).cumple && !(await fiesta(1, 3)).cumple, 'un 29 de febrero se celebra el 28 los años que no lo hay');
  await p.selectOption('#cumD', ''); await p.waitForTimeout(150);
  ok(await p.evaluate(() => window.__juego.cumple()) === '' && await veces('Sin cumpleaños.') === 1 && !(await fiesta(28, 2)).cumple, 'quitando el día, se queda sin cumpleaños');
  await p.click('#vozClose'); await fiesta(15, 6); await p.waitForTimeout(200);

  // 4. la foto
  const vis = id => p.evaluate(id => { const e = document.getElementById(id); return !e.hidden && e.getBoundingClientRect().height > 0; }, id);
  ok(await vis('fotoBtn') && !(await vis('foto')), 'hay un botón 📷');
  await p.click('#fotoBtn'); await p.waitForTimeout(700);
  ok(await vis('foto') && await vis('fotoCv') && !(await vis('fotoAdulto')), 'al tocarlo aparece la foto en su marco');
  const foto = await p.evaluate(() => { const f = document.getElementById('fotoCv'), cv = document.getElementById('cv'), d = f.getContext('2d').getImageData(0, 0, f.width, f.height).data, col = new Set();
    for (let i = 0; i < d.length; i += 4 * 997) col.add(d[i] + ',' + d[i + 1] + ',' + d[i + 2]); return { w: f.width, h: f.height, cw: cv.width, ch: cv.height, colores: col.size }; });
  ok(foto.w === foto.cw && foto.h === foto.ch && foto.colores > 20, `la foto es lo que se veía (${foto.w}×${foto.h}, ${foto.colores} colores distintos en la muestra)`);
  ok(await veces('¡Foto!') === 1 && await p.evaluate(() => window.__juego.uso().f.foto) === 1, 'la voz dice «¡Foto!» y queda contada en «Cómo juega»');
  await p.screenshot({ path: `${L.CAP}/foto-1.png` });
  acierta = false; await p.click('#fotoGuardar'); await p.waitForTimeout(250);
  ok(!(await vis('fotoAdulto')), 'guardar es cosa del adulto: sin acertar la multiplicación no se abre');
  acierta = true; await p.click('#fotoGuardar'); await p.waitForTimeout(400);
  const img = await p.evaluate(() => { const i = document.getElementById('fotoImg'), a = document.getElementById('fotoBajar'); return { src: i.src.slice(0, 22), largo: i.src.length, baja: !a.hidden && a.href === i.src && a.download }; });
  ok(await vis('fotoAdulto') && img.src === 'data:image/jpeg;base64' && img.largo > 20000, `acertándola aparece la imagen para guardarla (${Math.round(img.largo * .75 / 1024)} KB)`);
  ok(img.baja === 'mundo-de-bloques.jpg', 'y, donde se puede, un botón para descargarla');
  await p.screenshot({ path: `${L.CAP}/foto-2-adulto.png` });
  await p.click('#fotoClose'); await p.waitForTimeout(200);
  ok(!(await vis('foto')) && await p.evaluate(() => !document.getElementById('fotoImg').getAttribute('src')), 'con ✖️ se cierra y la imagen se suelta');
  // en la aventura también se puede
  await p.evaluate(() => window.__juego.entra(1)); await p.waitForTimeout(300); await p.click('#fotoBtn'); await p.waitForTimeout(700);
  ok(await vis('foto'), 'también hace foto en plena aventura'); await p.click('#fotoClose'); await p.evaluate(() => window.__juego.sale());
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
