# Mundo de Bloques

Juego de construcción con bloques para niños de 4–6 años: un mundo pixelado para poner y picar bloques, soltar cerditos y casas, hacer de noche… y retos por voz que trabajan conteo, sumas y restas, series, copia de modelos y primeros pasos de programación.

Sin registro, sin anuncios, sin dependencias ni build: un solo `index.html`. Se instala como app en la tablet o el móvil (PWA) y funciona sin conexión.

## Principios

- **No hace falta saber leer.** Todo son iconos y las instrucciones se dicen en voz alta (Web Speech API, voz es-ES). El botón 🔊 repite el reto.
- **Sin cronómetro ni penalización.** Un fallo no quita nada: se explica qué ha pasado y, al segundo fallo, aparece una pista para que nunca se quede atascado.
- **El nivel sube solo**, una estrella cada vez. En ajustes (🗣️) el adulto elige de dónde parten los retos: fácil, medio o difícil.

## Retos (botón ⭐)

| Reto | Qué trabaja | Fallo y pista |
|---|---|---|
| 🧱 Pon N bloques · 🗼 torre · ⛏️ pica · 🐷 cerditos | Conteo hasta 10 | Cuenta en voz alta según avanza |
| ➡️ Sigue la serie | Patrones AB, AAB, ABB, ABC | Repite la serie; a la segunda marca el bloque |
| ➕ Que haya N · ➖ Deja solo N | Sumas y restas hasta 10 | Dice cuántos hay y cuántos faltan |
| 🗼 Una torre más alta | Comparar cantidades | — |
| 👀 Copia el modelo | Orientación espacial, atención | Dice qué bloque ha puesto; a la segunda marca el que toca y lo hace parpadear en el modelo |
| 🐷 Programa al cerdito | Secuencias (tipo Bee-Bot), izquierda/derecha | Explica por qué no ha llegado (choque, faltan pasos); a la segunda marca las flechas del camino |

En **Copia el modelo** aparece una construcción en un marco y hay que hacerla igual en el cuadro amarillo de al lado; el modelo no se puede tocar. En **Programa al cerdito** la barra de bloques se cambia por flechas: se colocan en fila, se toca el botón verde y el cerdito las sigue una a una hasta la manzana.

Dificultad por tramos (nivel 0–3 fácil, 4–7 medio, 8+ difícil): modelos de 3–4 bloques → con huecos → de 6–8 bloques y tres tipos; tableros en línea recta → con una esquina y una piedra → más grandes con varias piedras.

## Estructura

```
index.html            todo el juego (HTML + CSS + JS)
sw.js                 service worker: precarga y caché para jugar sin conexión
manifest.json         PWA
icon.svg, *.png       iconos (los PNG salen del SVG)
fonts/                Press Start 2P alojada en el repo (licencia OFL en fonts/OFL.txt)
```

El progreso (mundo, estrellas, nivel, voz) se guarda solo en el dispositivo (`localStorage`).

Un tipo de reto nuevo se añade en cuatro sitios de `index.html`: `startReto` (lo prepara), `phrase` (lo que dice la voz), `progress` (cuánto lleva) y `winText` (lo que dice al ganar).

Si se añade un archivo al juego, hay que ponerlo en `ASSETS` de `sw.js` y subir el número de `CACHE`.

## Probar en local

```bash
python3 -m http.server 8000
# abre http://localhost:8000
```

El service worker solo funciona en `localhost` o por HTTPS.

## Publicar

El workflow `.github/workflows/pages.yml` publica en GitHub Pages en cada push a `main`. En el repo: *Settings → Pages → Source: GitHub Actions*.

## iPhone / iPad

- La voz y el sonido solo arrancan tras el primer toque. Si no suena, revisar el interruptor de silencio.
- Si la voz suena a robot: Ajustes → Accesibilidad → Contenido leído → Voces → Español, descargar una mejor y elegirla en 🗣️.
- Compartir → "Añadir a pantalla de inicio" para jugar a pantalla completa.
