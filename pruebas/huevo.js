// El huevo de las estrellas: aparece cada cinco estrellas, se abre contando toques y da un personaje nuevo para la aventura.
const L = require('./lib');
const ok = (c, m) => { console.log((c ? '  ok   ' : '  FALLO ') + m); if (!c) process.exitCode = 1; };
(async () => {
  const { b, p, errs } = await L.open({ width: 1024, height: 768 }, { dsf: 1 });
  await L.fresh(p);
  await p.evaluate(() => { window.__dicho = []; const s = window.speechSynthesis, o = s.speak.bind(s); s.speak = u => { window.__dicho.push(u.text); try { o(u); } catch (e) {} }; });
  const dichos = () => p.evaluate(() => window.__dicho);
  const H = () => p.evaluate(() => window.__juego.huevo());
  const toca = async (x, y) => { const c = await L.cam(p); await p.mouse.click(c.left + (x - c.camC + .5) * c.S, c.top + (y + .5) * c.S + c.offY); await p.waitForTimeout(150); };
  const espera = async () => { for (let k = 0; k < 40; k++) { const h = await H(); if (h) return h; await p.waitForTimeout(150); } return null; };

  await p.waitForTimeout(2200); ok(await H() === null, 'sin estrellas no hay huevo');
  await p.evaluate(() => window.__juego.estrellas(5)); let h = await espera();
  ok(h && h.visible && h.hacen === 3, `con cinco estrellas aparece un huevo (columna ${h && h.x}), que pide tres toques`);
  ok((await dichos()).some(t => /Has ganado un huevo/.test(t)), 'la voz lo anuncia');
  await p.screenshot({ path: `${L.CAP}/huevo-1.png` });
  const bloques = await p.evaluate(() => window.__juego.grid().filter(v => v).length);
  await toca(h.x, h.y); await toca(h.x, h.y + 1); // el segundo, en el suelo de debajo: también cuenta
  ok((await H()).n === 2 && (await dichos()).includes('Uno') && (await dichos()).includes('Dos'), 'cada toque cuenta en voz alta: uno, dos');
  await p.screenshot({ path: `${L.CAP}/huevo-2.png` });
  await toca(h.x, h.y); await p.waitForTimeout(300);
  ok(await H() === null && await p.evaluate(() => window.__juego.huevos()) === 1, 'al tercero se abre');
  const n = await p.evaluate(() => window.__juego.nacido()); ok(n && n.k === 6, 'y sale el pato');
  ok((await dichos()).some(t => /¡Tres! ¡Es un pato! Ya puedes jugar con él/.test(t)), 'la voz lo dice: ' + (await dichos()).filter(t => /Es un/.test(t)).pop());
  await p.screenshot({ path: `${L.CAP}/huevo-3.png` });
  ok(await p.evaluate(() => window.__juego.grid().filter(v => v).length) === bloques, 'tocar el huevo no pone bloques');
  ok(await p.evaluate(() => JSON.parse(localStorage.getItem('bloques2')).huevos) === 1, 'queda guardado');
  await p.waitForTimeout(6500); ok(await H() === null, 'con cinco estrellas no sale un segundo huevo');
  // el personaje nuevo está en el panel y se puede jugar con él
  await p.click('#jugarBtn'); await p.waitForTimeout(250);
  ok(await p.evaluate(() => [...document.querySelectorAll('#persCard .pers')].map(e => e.getAttribute('aria-label')).join(',')) === 'Cerdito,Gato,Conejo,Gallina,Rana,Dinosaurio,Pato', 'el panel de personajes tiene ahora siete, con el pato');
  await p.screenshot({ path: `${L.CAP}/huevo-panel.png` });
  await p.click('#persCard .pers:nth-child(7)'); await p.waitForTimeout(300);
  ok(await p.evaluate(() => window.__juego.av().on && window.__juego.av().pers === 6), 'y se juega con él');
  await p.keyboard.down('ArrowRight'); await p.waitForTimeout(900); await p.keyboard.up('ArrowRight'); await p.screenshot({ path: `${L.CAP}/huevo-pato.png` });
  await p.evaluate(() => window.__juego.estrellas(10)); await p.waitForTimeout(1800);
  ok(await H() === null || !(await H()).visible, 'durante la aventura el huevo siguiente no aparece');
  await p.click('#jugarBtn'); h = await espera();
  ok(h && h.hacen === 4, 'al volver, con diez estrellas, hay otro huevo, que pide cuatro toques');
  // con un reto abierto, el huevo se esconde y no cuenta toques
  await p.click('#tReto'); await p.waitForTimeout(400); ok((await H()).visible === false, 'con un reto abierto, el huevo espera escondido');
  await p.click('#rClose'); await p.waitForTimeout(300);
  h = await H(); for (let k = 0; k < 4; k++) await toca(h.x, h.y); await p.waitForTimeout(300);
  ok(await p.evaluate(() => window.__juego.huevos()) === 2 && (await p.evaluate(() => window.__juego.nacido())).k === 7 && (await dichos()).some(t => /¡Cuatro! ¡Es un perro!/.test(t)), 'el segundo huevo da el perro, al cuarto toque');
  await p.reload(); await p.waitForTimeout(600);
  ok(await p.evaluate(() => window.__juego.huevos()) === 2, 'al recargar se acuerda de los huevos abiertos');
  // hoja con los personajes nuevos, ampliados
  await p.evaluate(() => { const P = window.__juego.PERS, cv = document.createElement('canvas'); cv.width = 5 * 150 + 20; cv.height = 300; const c = cv.getContext('2d'); c.imageSmoothingEnabled = false; c.fillStyle = '#7ec0ee'; c.fillRect(0, 0, cv.width, cv.height); c.font = '15px system-ui'; c.fillStyle = '#123';
    [6, 7, 8, 9, 10].forEach((k, i) => { c.fillText(P[k].n, 20 + i * 150, 22); c.drawImage(P[k].der[0], 14 + i * 150, 30, 128, 128); c.drawImage(P[k].izq[1], 14 + i * 150, 160, 128, 128); });
    cv.id = 'hoja'; cv.style.cssText = 'position:fixed;left:0;top:0;z-index:99999'; document.body.appendChild(cv); });
  await (await p.$('#hoja')).screenshot({ path: `${L.CAP}/huevo-personajes.png` });
  ok(!errs.length, 'sin errores de consola' + (errs.length ? ': ' + errs.join(' | ') : ''));
  await b.close();
})();
