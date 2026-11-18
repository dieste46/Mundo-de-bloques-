# Mundo de Bloques

Juego de construcción con bloques para niños de 4–6 años: un mundo pixelado para poner y picar bloques, soltar cerditos y casas, hacer de noche… y retos por voz que trabajan conteo, sumas y restas, series, copia de modelos y primeros pasos de programación.

Sin registro, sin anuncios, sin dependencias ni build: un solo `index.html`. Se instala como app en la tablet o el móvil (PWA) y funciona sin conexión.

## Principios

- **No hace falta saber leer.** Todo son iconos y las instrucciones se dicen en voz alta (Web Speech API, voz es-ES). El botón 🔊 repite el reto.
- **Sin cronómetro ni penalización.** Un fallo no quita nada: se explica qué ha pasado y, al segundo fallo, aparece una pista para que nunca se quede atascado.
- **El nivel se ajusta solo, y por separado para cada tipo de reto** (contar, series, sumas, restas, comparar, copiar, programar). Un reto resuelto sin necesitar la pista sube un peldaño; dos tropiezos seguidos en el mismo tipo (ganar con pista o dejarlo a medias) bajan dos. En ajustes (🗣️) el adulto elige el nivel de partida: fácil, medio o difícil.
- **Cantidad y cifra juntas.** En los retos de contar, sumar y restar la cabecera muestra la cifra pedida junto a las casillas, y cada número que dice la voz sube flotando desde el bloque recién puesto.
- **Los ajustes son para el adulto.** El panel 🗣️ es lo único con texto, así que se abre con una multiplicación (como la zona de padres de Mini Juegos) para que el niño no cambie la voz o el nivel sin querer. La voz se elige sola: la mejor española instalada. Ahí está también el sonido: **todo**, **solo retos** (la voz deja de nombrar cada bloque y herramienta que se toca, pero sigue explicando los retos) o **silencio** (ni voz ni efectos; el botón de ajustes pasa a 🔇 para que se vea).

## Cómo se toca

- **Un toque = un bloque.** Con 🧱 un toque pone un bloque en un hueco vacío; con ⛏️ quita uno. De uno en uno, que además es como se cuentan en los retos.
- **Tocar un bloque que tiene hueco encima pone el nuevo encima.** Así se construye sobre el suelo y se apila sin tener que acertar el hueco (el dedo suele caer un poco por debajo de donde se apunta).
- **Lo que ya está puesto no se cambia de un toque.** Si el hueco está ocupado suena un golpe sordo y la voz recuerda que para quitarlo está el pico (que se ilumina). Si lo ocupa un cerdito, salta y gruñe.
- **Tres mundos (🌍).** El botón abre tres huecos con su miniatura; tocar uno entra en él y, si está vacío, lo crea. Cada mundo guarda por separado sus bloques, sus cerditos, su hora y su vista; las estrellas y los niveles son del niño y valen en todos. Cambiar un mundo ya hecho por uno nuevo (🔄) pide la multiplicación del adulto, para que ningún toque suelto borre nada.
- **Tres tamaños de bloque (🔍).** La lupa de la columna izquierda pasa de bloques medianos a grandes, de grandes a pequeños y vuelta; también se cambia pellizcando con dos dedos (un paso por gesto). Los puntos bajo la lupa indican el tamaño actual y se recuerda en cada aparato. Si un reto no cabe en la pantalla, el juego aleja la vista él solo y, al cerrar el reto, vuelve al tamaño elegido.
- **Deshacer (↩️).** Devuelve el mundo a como estaba justo antes del último cambio: un bloque, un picotazo o una casa. Tocarlo otra vez lo rehace, así que por mucho que se pulse nunca se pierde más de un paso.
- **El mundo es grande: 48 bloques de ancho por 32 de alto.** El suelo queda hacia la mitad: por encima hay cielo de sobra para construir alto y por debajo, tierra y piedra para picar hondo, con oro escondido (más cuanto más abajo).
- **Arrastrar mueve el mundo**, no pinta: deslizar el dedo desplaza el paisaje a los lados y también arriba y abajo. Mientras la vista se mueve aparecen dos deslizadores (abajo el de izquierda-derecha, a la derecha el de arriba-abajo) que indican en qué parte del mundo estás; al parar se apagan solos. Cuando empieza un reto, la vista va sola hasta él. No hay flechas ni botones de desplazamiento.

## Retos (botón ⭐)

| Reto | Qué trabaja | Fallo y pista |
|---|---|---|
| 🧱 Pon N bloques · 🗼 torre · ⛏️ pica · 🐷 cerditos | Conteo hasta 10 | Cuenta en voz alta según avanza |
| ➡️ Sigue la serie | Patrones AB, AAB, ABB, ABC | Repite la serie; a la segunda marca el bloque |
| ➕ Que haya N · ➖ Deja solo N | Sumas y restas hasta 10, con la cuenta escrita en la cabecera (3 + ? = 7, 8 - ? = 5) | Dice cuántos hay y cuántos faltan |
| ➕ Junta | Sumar dos grupos: aparecen dos torres (3 + 2 = ?) y se toca el número. Fácil hasta 5, medio de 4 a 8, difícil de 6 a 10 | Se puede contar tocando cada bloque. Al primer fallo dice qué número ha tocado y anima a contar; al segundo, el juego cuenta los bloques con él en voz alta y marca el número |
| 🗼 Una torre más alta | Comparar cantidades | — |
| 🔤 Rellena la letra | Letras en mayúscula, como en infantil: la letra aparece en el cielo como huecos punteados (como las de repasar) y se rellena con los bloques que quiera. Fácil: vocales; medio: vocales y M P L S T N D; difícil: todo el abecedario con Ñ. Al terminar: "Has hecho la pe. Pe, de pato" | No hay fallo posible: vale cualquier bloque |
| 👀 Copia el modelo | Orientación espacial, atención | Dice qué bloque ha puesto; a la segunda marca el que toca y lo hace parpadear en el modelo |
| 🐷 Programa al cerdito | Secuencias (tipo Bee-Bot), izquierda/derecha | Explica por qué no ha llegado (choque, faltan pasos); a la segunda marca las flechas del camino |

La **palabra de la semana** se escribe en ajustes (🗣️). Mientras haya una, el reto de letras va sacando sus letras por orden ("La palabra de esta semana es camión. Vamos a hacer la ce, de camión") y la cabecera enseña la palabra con la letra que toca resaltada; al terminar una letra, la siguiente vez toca la siguiente. Se guarda con sus tildes para que la voz la diga bien; la letra se dibuja sin tilde. Vacía, salen letras sueltas según el nivel.

En **Copia el modelo** aparece una construcción en un marco y hay que hacerla igual en el cuadro amarillo de al lado; el modelo no se puede tocar. En **Programa al cerdito** la barra de bloques se cambia por flechas: se colocan en fila, se toca el botón verde y el cerdito las sigue una a una hasta la manzana.

Dificultad por tramos (nivel 0–3 fácil, 4–7 medio, 8+ difícil): modelos de 3–4 bloques → con huecos → de 6–8 bloques y tres tipos; tableros en línea recta → con una esquina y una piedra → más grandes con varias piedras.

## Estructura

```
index.html            todo el juego (HTML + CSS + JS)
sw.js                 service worker: precarga y caché para jugar sin conexión
manifest.json         PWA
*.png                 iconos: una B hecha con bloques del juego (los genera un script con las mismas texturas)
fonts/                Press Start 2P alojada en el repo (licencia OFL en fonts/OFL.txt)
```

Los gráficos no son imágenes: las texturas de los bloques (16×16), el cerdito (16×12), la flor, la antorcha y la manzana se dibujan por código al arrancar, en la sección "texturas pixeladas generadas" de `index.html`. Los que tienen forma se escriben como dibujos de letras, una letra por color.

El progreso (los tres mundos, estrellas, niveles, voz) se guarda solo en el dispositivo (`localStorage`), con cada cambio. Ojo: Safari puede borrar los datos de una web que lleva días sin abrirse; instalada en la pantalla de inicio no le pasa.

De noche las antorchas dan luz: abren un claro en la oscuridad con un resplandor cálido, la llama parpadea y suelta alguna chispa. El cristal también brilla.

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

## Dispositivos antiguos

El juego está escrito para funcionar desde iOS 12 (un iPad Air de 1.ª generación), aunque en ese sistema solo está probado en simulación:

- Sin eventos de puntero (antes de iOS 13) los toques sobre el mundo usan eventos táctiles.
- Sin `gap` en flex (antes de iOS 14.5) el script lo detecta y separa botones y casillas con márgenes (`.sin-gap`).
- La resolución de dibujo baja sola si el aparato no llega a unos 28 fotogramas por segundo; al ser pixelado apenas se nota.
- El código no usa sintaxis posterior a ES2018.

## iPhone / iPad

- La voz y el sonido solo arrancan tras el primer toque. Si no suena, revisar el interruptor de silencio.
- Si la voz suena a robot: Ajustes → Accesibilidad → Contenido leído → Voces → Español, descargar una mejor y elegirla en 🗣️.
- Compartir → "Añadir a pantalla de inicio" para jugar a pantalla completa.
