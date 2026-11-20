// El juego tiene que funcionar en un iPad con iOS 12: nada de sintaxis posterior a ES2018 en index.html, guardado.js ni sw.js.
// Necesita acorn (npm install acorn, en cualquier carpeta que Node encuentre). También comprueba que las llaves del CSS cuadran.
const fs = require('fs'), path = require('path'), raiz = path.join(__dirname, '..');
let acorn; try { acorn = require('acorn'); } catch (e) { console.log('  (sin acorn: instálalo con "npm install acorn" para comprobar la sintaxis)'); process.exit(0); }
let mal = 0; const mira = (nombre, codigo) => { try { acorn.parse(codigo, { ecmaVersion: 2018 }); console.log('  ok   ' + nombre + ': ES2018'); } catch (e) { mal++; console.log('  FALLO ' + nombre + ': ' + e.message); } };
const h = fs.readFileSync(path.join(raiz, 'index.html'), 'utf8');
[...h.matchAll(/<script>([\s\S]*?)<\/script>/g)].forEach((m, i) => mira('index.html (script ' + (i + 1) + ')', m[1]));
['guardado.js', 'sw.js'].forEach(f => mira(f, fs.readFileSync(path.join(raiz, f), 'utf8')));
const css = [...h.matchAll(/<style>([\s\S]*?)<\/style>/g)].map(m => m[1]).join(''), a = (css.match(/{/g) || []).length, c = (css.match(/}/g) || []).length;
console.log((a === c ? '  ok   ' : '  FALLO ') + 'CSS: ' + a + ' llaves abiertas y ' + c + ' cerradas'); if (a !== c) mal++;
if (/localStorage/.test(h)) { mal++; console.log('  FALLO index.html toca localStorage: el guardado va por guardado.js'); } else console.log('  ok   index.html no toca el almacenamiento directamente');
process.exitCode = mal ? 1 : 0;
