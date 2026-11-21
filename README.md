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
- **Tocar se nota.** El bloque que se pone entra con un saltito (nace algo más pequeño, se pasa un pelín y se asienta en menos de dos décimas de segundo) y el que se pica se parte en trozos de su propio dibujo. Cada material suena a lo que es: un golpe sordo la tierra, un toc la madera, un clac la piedra, un plop el agua, un tin el cristal, un clin el oro. La casa se levanta fila a fila.
- **El mundo hace cosas solo.** La nieve que tiene una antorcha pegada se derrite y queda agua; la tierra con aire encima y agua al lado se cubre de hierba; y en la hierba junto al agua acaba saliendo alguna flor. Nadie lo explica de antemano: se descubre jugando, y la voz lo cuenta las dos primeras veces. Con un reto abierto no pasa nada de esto, para no cambiar lo que se está contando o copiando.
- **Semillas (🌱 en el inventario).** Plantada sobre tierra o hierba, la semilla crece un paso cada vez que amanece: primero un arbolito y, a la noche siguiente, un árbol de verdad con su tronco y su copa. Amanece al pasar de 🌙 a ☀️ con el botón, y también cuenta como noche volver a un mundo que lleva más de seis horas sin tocarse ("mientras no estabas, tus plantas han crecido"). El árbol solo ocupa huecos vacíos; si no tiene sitio encima, espera.
- **El cerdito músico (🎵).** Un cerdito recorre de izquierda a derecha lo que se ve en pantalla, saltando de columna en columna, y cada una suena al caer en ella: más aguda cuanto más alta, en una escala de cinco notas en la que nada desafina, y con el timbre del bloque de arriba (campanita el cristal y el oro, gota el agua, caja la madera y la piedra). Las columnas se leen en el momento, así que se puede construir por delante de él y oír el cambio: una escalera es una escala. Tocar 🎵 otra vez lo para. Con un reto abierto no suena, para no tapar la voz.
- **Cerditos con vida.** Parpadean, se giran y dan un saltito cuando se pone o se pica un bloque cerca, y se paran a oler las flores. El cerdito músico lleva un gorro de fiesta para distinguirlo.
- **Vida en el mundo.** De día revolotean mariposas sobre las flores (más flores, más mariposas, hasta cuatro) y de vez en cuando cruza un pájaro; de noche hay luciérnagas. Al pasar de día a noche el horizonte se tiñe de naranja. Es solo decorado: no toca los bloques ni los retos.
- **Foto (📷).** Hace una foto de lo que se ve en ese momento, con su destello y su clic, y la enseña en un marco. Guardarla o enviarla es cosa del adulto: el botón 💾 pide la multiplicación y entonces sale la imagen para guardarla (en iPad y iPhone, dedo mantenido sobre ella y «Guardar en Fotos»; en otros aparatos, descargar o compartir).
- **Navidad.** Del 1 de diciembre al 6 de enero nieva, los árboles llevan luces de colores y una estrella en la punta, y los cerditos, gorro rojo. Es solo decorado: no cambia nada de lo construido.
- **Cumpleaños.** En ajustes (🗣️) el adulto pone el día y el mes. Ese día suben globos por el cielo, los cerditos llevan gorro de fiesta y, con el primer toque, la voz felicita, suena «Cumpleaños feliz» y hay fuegos artificiales. La fecha se guarda en el aparato (y va en la copia de seguridad); en el código no hay ninguna.
- **El inventario se ve entero.** Si los catorce bloques no caben en una fila pasan a dos filas de siete (móvil o tableta en vertical); con el móvil tumbado, a una fila de bloques algo más pequeños. Nunca hay que deslizar para encontrar un bloque.
- **Lo que ya está puesto no se cambia de un toque.** Si el hueco está ocupado suena un golpe sordo y la voz recuerda que para quitarlo está el pico (que se ilumina). Si lo ocupa un cerdito, salta y gruñe.
- **Tres mundos (🌍).** El botón abre tres huecos con su miniatura; tocar uno entra en él y, si está vacío, lo crea. Cada mundo guarda por separado sus bloques, sus cerditos, su hora y su vista; las estrellas y los niveles son del niño y valen en todos. Cambiar un mundo ya hecho por uno nuevo (🔄) pide la multiplicación del adulto, para que ningún toque suelto borre nada.
- **Tres tamaños de bloque (🔍).** La lupa de la columna izquierda pasa de bloques medianos a grandes, de grandes a pequeños y vuelta; también se cambia pellizcando con dos dedos (un paso por gesto). Los puntos bajo la lupa indican el tamaño actual y se recuerda en cada aparato. Si un reto no cabe en la pantalla, el juego aleja la vista él solo y, al cerrar el reto, vuelve al tamaño elegido.
- **Deshacer (↩️).** Devuelve el mundo a como estaba justo antes del último cambio: un bloque, un picotazo o una casa. Tocarlo otra vez lo rehace, así que por mucho que se pulse nunca se pierde más de un paso.
- **El mundo es grande: 96 bloques de ancho por 32 de alto.** (Al principio medía 48 de ancho: los mundos guardados de entonces se ensanchan solos al abrirlos; quedan en el centro, intactos, con terreno nuevo a los dos lados.) El suelo queda hacia la mitad: por encima hay cielo de sobra para construir alto y por debajo, tierra y piedra para picar hondo, con oro escondido (más cuanto más abajo).
- **Arrastrar mueve el mundo**, no pinta: deslizar el dedo desplaza el paisaje a los lados y también arriba y abajo. Mientras la vista se mueve aparecen dos deslizadores (abajo el de izquierda-derecha, a la derecha el de arriba-abajo) que indican en qué parte del mundo estás; al parar se apagan solos. Cuando empieza un reto, la vista va sola hasta él. No hay flechas ni botones de desplazamiento.

## Aventura (botón 🎮)

Recorrer el propio mundo con un personaje, de izquierda a derecha, hasta una bandera.

- **Se elige personaje** cada vez: cerdito, gato, conejo, gallina, rana o dinosaurio (dibujos propios de 16×16).
- **La barra se cambia por un mando:** ⬅️ ➡️ para andar (es una sola pieza: el dedo puede deslizar de un lado a otro sin levantarse) y ⬆️ para saltar. Tocar el mundo también salta. Con teclado, flechas y espacio.
- **Hay ocho manzanas** repartidas por el camino; la voz las va contando y se encienden en el mando. Una de cada tres queda en el aire: hay que saltar para cogerla. Llegar a la bandera con las ocho da una estrella; con menos, la voz dice cuántas de ocho y anima a repetir.
- **Potenciadores.** Por el camino flotan tres objetos (cada carrera, tres de los cuatro que hay). Al cogerlos, durante diez segundos: ⚡ el **rayo** hace correr mucho más; la **pluma**, saltar casi el doble de alto; la **poción** lo vuelve gigante (sube solo los escalones de dos, alcanza las manzanas altas sin saltar y al caer hace temblar el suelo y brincar a los cerditos); y el **imán** atrae las manzanas cercanas. Encima de la cabeza se ve cuál lleva y una barrita con lo que le queda; parpadea antes de acabarse. Son para divertirse: no hacen falta para llegar ni para la estrella, y se acaban sin castigo.
- **Pensado para cinco años:** un escalón de un bloque se sube solo, con un salto se suben dos, y no hay enemigos ni forma de perder. Los troncos de los árboles y las casas del botón 🏠 son decorado: se pasa por delante.
- **Lo que mide tres bloques o más corta el paso.** La voz lo dice y entonces se toca 🎮 para salir, se construye una escalera (o se quita lo que estorba) y al volver a entrar se sigue donde se estaba, con las mismas manzanas. Es la gracia del modo: construir, probar y cambiar.
- El terreno que genera el juego nunca corta el paso (comprobado recorriendo cientos de mundos recién creados).

El movimiento del personaje va por reloj (bloques por segundo), así que corre igual en un iPad viejo que en uno nuevo. Las constantes están juntas: `ANDA`, `GRAV`, `SALTO` y `NMANZ`. Para añadir un personaje basta otro dibujo en `PERS`; para otro potenciador, una entrada en `POTS` (dibujo, color y frase) y su efecto en `avPaso`.

### El recorrido largo (🏁)

En el panel de personajes se elige dónde jugar: 🌍 en su mundo, o 🏁 un recorrido largo que hace el juego. El recorrido son tres tramos seguidos (prado, playa y nieve), cada uno de 48 bloques de largo (la mitad que un mundo): al llegar a la flecha del final de un tramo se pasa al siguiente, y en el tercero está la bandera.

- **Qué hay:** escalones de uno (se suben solos) y de dos (hay que saltar), charcos (se saltan; si se cae dentro, se sale saltando) y plataformas en el aire con manzanas encima. No hay nada que construir ni forma de perder.
- **Cosas que se mueven:** en algún charco ancho, una **balsa** que va y viene de orilla a orilla (y si se cae al agua, se cruza andando y se sale saltando); **ascensores**, tablas que suben solas con quien esté encima hasta una manzana alta y vuelven a bajar; y **muelles**, que al pisarlos lanzan hasta la manzana que tienen arriba. Las tablas solo sostienen desde arriba: por debajo y por los lados se atraviesan, así que nunca cortan el paso ni aplastan.
- **Un potenciador por tramo**, distinto en cada uno de los tres.
- **Manzanas:** cinco por tramo, quince en total; la voz sigue la cuenta de un tramo a otro. Llegar al final da una estrella; con las quince, dos (para alguna hay que subir en ascensor o pisar un muelle).
- **Su mundo espera aparte** mientras dura el recorrido y vuelve tal como estaba; lo que se guarda nunca es el recorrido.
- Cada recorrido es distinto (`generaTramo`). Una prueba recorre más de cien para comprobar que siempre se puede llegar al final.

### El huevo de las estrellas

Por cada cinco estrellas aparece un huevo en el mundo. Se abre tocándolo, mientras la voz cuenta los toques (tres el primero, uno más cada vez), y de él sale un personaje nuevo para la aventura: pato, perro, oveja, pingüino y unicornio, por ese orden. Con un reto abierto o durante la aventura, el huevo espera escondido.

## Retos (botón ⭐)

Al cerrar un reto, ganado o no, **el mundo se queda como lo tenía el niño**: se retira la ficha del reto (lo que plantó el juego y lo que él puso dentro de ella) con una nubecilla de trocitos. Lo que construye por su cuenta, como sus torres, no se toca.

| Reto | Qué trabaja | Fallo y pista |
|---|---|---|
| 🧱 Pon N bloques · 🗼 torre · ⛏️ pica · 🐷 cerditos | Conteo hasta 10 | Cuenta en voz alta según avanza |
| ➡️ Sigue la serie | Patrones AB, AAB, ABB, ABC | Repite la serie; a la segunda marca el bloque |
| ➕ Que haya N · ➖ Deja solo N | Sumas y restas hasta 10, con la cuenta escrita en la cabecera (3 + ? = 7, 8 - ? = 5) | Dice cuántos hay y cuántos faltan |
| ➕ Junta | Sumar dos grupos: aparecen dos torres (3 + 2 = ?) y se toca el número. Fácil hasta 5, medio de 4 a 8, difícil de 6 a 10 | Se puede contar tocando cada bloque. Al primer fallo dice qué número ha tocado y anima a contar; al segundo, el juego cuenta los bloques con él en voz alta y marca el número |
| 🗼 Una torre más alta | Comparar cantidades | — |
| 🔤 Rellena la letra | Letras en mayúscula, como en infantil: la letra aparece en el cielo como huecos punteados (como las de repasar) y se rellena con los bloques que quiera. Qué letras salen va por niveles (ver abajo). Al terminar: "Has hecho la pe. Pe, de pato" | No hay fallo posible: vale cualquier bloque |
| 🖼️ ¿Con qué letra empieza? | Sonido inicial: sale un dibujo (pato, sol, luna, manzana, iglú…), la voz dice su nombre y se toca su primera letra entre tres | Al primer fallo dice qué letra ha tocado y repite la palabra; al segundo dice la respuesta y la marca |
| 🔤 Sílabas | Leer y escribir sílabas directas: la voz dice «ma» y se tocan sus dos letras, por orden, entre cuatro | Si empieza por la vocal: «esa va después»; a la segunda marca la que toca |
| 🔢 Decenas | Números hasta 100, como en clase: filas de diez bloques y unos sueltos; se toca cuántos hay en total (fácil hasta 29, medio hasta 49, difícil hasta 69). Al acertar: «Tres dieces y cuatro: treinta y cuatro» | Las opciones falsas son las confusiones típicas (43 por 34, uno más, diez menos). Al primer fallo recuerda cómo se cuentan (primero las filas llenas, de diez en diez); al segundo las cuenta con él y marca el número |
| 🌉 Un puente para el cerdito | Conteo con historia: se abre una zanja con agua en su mundo y hay que taparla con N bloques para que el cerdito llegue a la manzana | Los huecos están marcados; vale cualquier bloque |
| 📶 Una escalera para el cerdito | Series que crecen (1, 2, 3…): la manzana está en alto y se construye la escalera, un bloque, luego dos, luego tres | Los huecos están marcados; al terminar el cerdito sube a por ella |
| 👀 Copia el modelo | Orientación espacial, atención | Dice qué bloque ha puesto; a la segunda marca el que toca y lo hace parpadear en el modelo |
| 🐷 Programa al cerdito | Secuencias (tipo Bee-Bot), izquierda/derecha | Explica por qué no ha llegado (choque, faltan pasos); a la segunda marca las flechas del camino |

Las **letras trabajadas en clase** también se ponen en ajustes (🗣️), por el orden en que las van dando; de partida son las vocales y M, P, L, S, D. Los retos de letras van **por niveles** a partir de esa lista: en fácil salen solo las de clase; al subir a medio se añaden las tres siguientes del orden habitual de enseñanza (`ORDEN`: … T, N, F, R, B, G, C, H, J, V, Z, Q, Y, K, X, W), y en difícil, las ocho siguientes. Así lo conocido da seguridad y lo nuevo va entrando poco a poco, al ritmo que él marca. Nunca sale la misma letra dos veces seguidas, y las tres últimas de clase (las más recientes) salen el doble. Cuando en el cole den una letra nueva, basta añadirla al final. Con la lista vacía salen todas las del nivel (vocales; vocales y consonantes frecuentes; todo el abecedario).

**Palabras con sus letras.** Sin palabra de la semana, la mitad de las veces el reto de letras propone una palabra corta que se escribe solo con las letras que ya le tocan (SOL, OSO, PALA, MESA, LUPA…; la lista es `PALABRAS`) y la va haciendo letra a letra, igual que la de la semana.

La **palabra de la semana** se escribe en ajustes (🗣️). Mientras haya una, el reto de letras va sacando sus letras por orden ("La palabra de esta semana es camión. Vamos a hacer la ce, de camión") y la cabecera enseña la palabra con la letra que toca resaltada; al terminar una letra, la siguiente vez toca la siguiente. Se guarda con sus tildes para que la voz la diga bien; la letra se dibuja sin tilde. Vacía, salen letras sueltas según el nivel.

En **Copia el modelo** aparece una construcción en un marco y hay que hacerla igual en el cuadro amarillo de al lado; el modelo no se puede tocar. En **Programa al cerdito** la barra de bloques se cambia por flechas: se colocan en fila, se toca el botón verde y el cerdito las sigue una a una hasta la manzana.

Dificultad por tramos (nivel 0–3 fácil, 4–7 medio, 8+ difícil): modelos de 3–4 bloques → con huecos → de 6–8 bloques y tres tipos; tableros en línea recta → con una esquina y una piedra → más grandes con varias piedras.

## Copia de seguridad (Ajustes > 💾)

- **Exportar** deja en un cuadro de texto la copia completa: los tres mundos, las estrellas, los niveles, la palabra de la semana (con las letras de clase y el cumpleaños) y los contadores de «Cómo juega» (los ajustes de voz no, que son de cada aparato). Se puede copiar y, donde el navegador lo permite, guardar como archivo `mundobloque-AAAA-MM-DD.json`. En iOS 12 solo copiar.
- **Importar** acepta la copia pegada o su archivo, comprueba que es válida, dice de cuándo es y qué trae, y pide confirmación: sustituye todo lo guardado en ese aparato. Después el juego se recarga con lo importado.
- La copia es un JSON con `formato: "mundobloque"` y `version` (ahora la 3: la 2 añadió los huevos de estrellas abiertos y la 3, los mundos de 96 de ancho; las copias anteriores se importan igual y el juego las pone al día). Una copia de una versión más nueva que el juego se rechaza con un aviso.
- Está en los ajustes, detrás de la multiplicación, para que el niño no llegue por accidente.

Sirve para pasar la partida de un aparato a otro o de una dirección web a otra, y como copia por si Safari borra los datos.

## Cómo juega (Ajustes > 📊)

Un panel para el adulto con lo que el juego ha ido contando, para ver por dónde ayudar o qué potenciar:

- **Resumen:** días con juego, tiempo total, media por día, sesiones, minutos de los últimos siete días y cómo se reparte el tiempo entre construir, retos y aventura.
- **Retos, por tipo:** cuántos empieza, cuántos consigue, cuántos con tropiezo (necesitó la pista), cuántos deja a medias y cuántos cierra sin intentar, el tiempo medio y el nivel en el que está. Cada tipo lleva un color: 🟢 lo domina (consigue el 80 % o más casi sin tropiezos), 🔴 le cuesta (la mitad con tropiezo o a medias, o menos de la mitad conseguidos), 🟡 en su punto, ⚪ menos de tres jugados.
- **Lo que más usa:** bloques y herramientas (también las fotos hechas).
- **Aventura:** carreras, banderas, manzanas, veces que un muro le corta el paso, potenciadores cogidos y personaje favorito.
- **Ideas:** unas pocas frases sacadas de lo anterior con reglas sencillas (qué le cuesta, qué cierra sin intentar, qué domina, qué no le ha salido aún).

Los datos se guardan solo en el aparato (la parte `uso` de `guardado.js`) y este juego no los envía a ningún sitio. No se guarda qué hace en cada momento, solo sumas, y de los días se conservan los últimos 120. El tiempo solo cuenta si se ha tocado la pantalla en el último minuto. Desde el panel se pueden copiar como texto o borrar (borrar no toca el mundo, las estrellas ni los niveles). Cada aparato lleva su propia cuenta.

## Estructura

```
index.html            todo el juego (HTML + CSS + JS)
guardado.js           lo único que toca el almacenamiento: cargar, guardar, exportar e importar
pruebas/              pruebas automáticas (Playwright) y un servidor local que imita a Cloudflare Pages
CLAUDE.md             cómo está organizado, reglas y cómo probarlo, para quien toque el código
sw.js                 service worker: precarga y caché para jugar sin conexión
manifest.json         PWA
*.png                 iconos: una escena de su mundo (árbol, sol, flor y cerdito) hecha con las texturas del juego
herramientas/         el script que genera los iconos (node herramientas/iconos.js, con el servidor local en marcha)
fonts/                Press Start 2P alojada en el repo (licencia OFL en fonts/OFL.txt)
```

Los gráficos no son imágenes: las texturas de los bloques (16×16), el cerdito (16×12), la flor, la antorcha y la manzana se dibujan por código al arrancar, en la sección "texturas pixeladas generadas" de `index.html`. Los que tienen forma se escriben como dibujos de letras, una letra por color.

Cada bloque tiene varias versiones de su dibujo (`NVAR` dice cuántas; `pinta(id,k)` las hace): mismos colores y mismo motivo, con los detalles en otro sitio, para que una pared o un prado no se vean como un sello repetido. Qué versión toca en cada casilla lo decide `varMap` según la posición, así que no cambia de un día a otro ni hay que guardarlo. Los botones, las pistas y los modelos usan siempre la primera (`tex[id]`). Los fondos se pintan con manchas de 2×2 y pinceladas de uno o dos píxeles en pocos tonos, sin grano píxel a píxel. El agua son 16 fotogramas en los que las ondas se deslizan un píxel cada dos décimas de segundo, y donde tiene aire encima lleva una línea clara de superficie.

El progreso (los tres mundos, estrellas, niveles, voz) se guarda solo en el dispositivo, con cada cambio, a través de `guardado.js`. Va por dominio: lo jugado en una dirección no aparece en otra (para llevárselo está la copia de seguridad). Ojo: Safari puede borrar los datos de una web que lleva días sin abrirse; instalada en la pantalla de inicio no le pasa.

De noche las antorchas dan luz: abren un claro en la oscuridad con un resplandor cálido, la llama parpadea y suelta alguna chispa. El cristal también brilla. La oscuridad se pinta en un lienzo cuatro veces más pequeño que la pantalla y cada luz es una pegatina redonda hecha una sola vez (`luzSpr`) que se estampa en él: por muchas antorchas que haya, a pantalla completa solo se pinta una capa. No crear degradados nuevos en cada fotograma es lo que más se nota en un aparato viejo.

Los sonidos tampoco son archivos: `suena(id,romper)` los fabrica con un tono que cae y un poco de ruido filtrado, según el material de cada bloque (`MAT`).

Las animaciones cortas (el saltito de los bloques) van por reloj, no por fotogramas, para que duren lo mismo en cualquier aparato.

Las reacciones (`reacciona`) miran unas 1700 casillas al azar por segundo, también por reloj: a cada casilla le toca más o menos una vez por segundo. Para añadir una regla basta un caso más ahí. El crecimiento de lo plantado está en `amanece`; la semilla es el bloque 14 y el arbolito el 15, que no está en el inventario. Cada mundo guarda cuándo se tocó por última vez (`t`) para saber si ha pasado una noche de verdad.

Un tipo de reto nuevo se añade en cuatro sitios de `index.html`: `startReto` (lo prepara), `phrase` (lo que dice la voz), `progress` (cuánto lleva) y `winText` (lo que dice al ganar). Los de elegir entre opciones (letra inicial, sílabas, decenas, junta) dejan sus botones en `r.opts` y la respuesta se mira en `elige`. La lista de tipos está repetida en `pruebas/lib.js` (`KINDS`): hay que mantenerlas iguales.

Si se añade un archivo al juego, hay que ponerlo en `ASSETS` de `sw.js` y subir el número de `CACHE`.

## Probar en local

```bash
node pruebas/servidor.js
# abre http://localhost:8765
```

Sirve el juego desde la raíz, como Cloudflare Pages. `node pruebas/todas.js` pasa las pruebas automáticas (necesita Playwright; con `SIN_PUNTERO=1` simula un Safari de iOS 12). Más detalle en `CLAUDE.md`.

El service worker solo funciona en `localhost` o por HTTPS.

## Publicar

Cloudflare Pages, proyecto `mundobloque`, conectado al repositorio `dieste46/mundobloque`. Ajustes de compilación del proyecto: *Framework preset* «None», *Build command* vacío y *Build output directory* `/` (la raíz): no hay nada que compilar, se publican los archivos tal cual. La rama `main` se publica en `https://mundobloque.pages.dev` y cada otra rama tiene su vista previa en `https://<rama>.mundobloque.pages.dev`, con su propio guardado.

Nada depende de la ruta: todo son rutas relativas, y el manifest tiene `start_url` y `scope` en `./`. La página se precarga en el service worker como `./` y no como `index.html`, porque Cloudflare redirige `/index.html` a `/`.

La sincronización en la nube no está aquí: la hará un servicio aparte (mundo-api) que se enchufará en `guardado.js`.

## Dispositivos antiguos

El juego está escrito para funcionar desde iOS 12 y se juega en un iPad Air de 1.ª generación con iOS 12.5.8:

- Sin eventos de puntero (antes de iOS 13) los toques sobre el mundo usan eventos táctiles.
- Sin `gap` en flex (antes de iOS 14.5) el script lo detecta y separa botones y casillas con márgenes (`.sin-gap`).
- La resolución de dibujo baja sola si el aparato no llega a unos 28 fotogramas por segundo; al ser pixelado apenas se nota.
- Todo se mueve por reloj y no por fotogramas (cerditos, nubes, trocitos, la aventura, las animaciones): a 30 imágenes por segundo las cosas van a la misma velocidad real que a 60, solo que menos suaves.
- En los ajustes (🗣️), debajo de la versión, se ve a cuántas imágenes por segundo va el juego en ese aparato y con qué detalle está dibujando. Es la forma de comprobar en el aparato de verdad si un cambio gráfico le pesa: lo ideal es 60; por debajo de 30 se nota.
- El código no usa sintaxis posterior a ES2018.

## iPhone / iPad

- La voz y el sonido solo arrancan tras el primer toque. Si no suena, revisar el interruptor de silencio.
- Si la voz suena a robot: Ajustes → Accesibilidad → Contenido leído → Voces → Español, descargar una mejor y elegirla en 🗣️.
- Compartir → "Añadir a pantalla de inicio" para jugar a pantalla completa.
