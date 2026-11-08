# JSB Construcción — sitio web

Sitio one-page para **JSB SpA**, marca comercial **JSB Construcción**, empresa de remodelaciones, puertas, ventanas, pintura, hojalatería y muebles a medida en Temuco y alrededores.

Es un sitio estático, sin build ni dependencias de producción: HTML, CSS y JavaScript nativo. Las tipografías, ilustraciones e imágenes sociales están alojadas localmente.

El proyecto de video con **Remotion** vive en `remotion/`; el reel renderizado se publica en `assets/reel/` y se integra en la sección Confianza del sitio.

La **ubicación** tiene una sección propia dentro de la página principal, con la dirección y el acceso para coordinar una visita.

## Cómo verlo

Abre `index.html` directamente en el navegador o levanta un servidor local:

```powershell
python -m http.server 4173
```

Luego visita <http://127.0.0.1:4173/>.

## Video con Remotion

```powershell
cd remotion
pnpm install
pnpm studio
```

La composición incluida es **JSBIntro** (1920 × 1080, 30 fps, 6 s) y el **JSBReel** que se usa en la web (18 s, 1440 × 810). También puedes ejecutar:

```powershell
pnpm compositions
pnpm still:reel
pnpm render:reel
```

Más detalles en [remotion/README.md](remotion/README.md). Los renders se guardan en `remotion/out/`; la versión publicada en el sitio está en `assets/reel/`.

## Asistente guiado

El botón flotante de **WhatsApp** abre un diálogo accesible con tres preguntas: servicio, comuna e idea. Al final arma un mensaje y lo abre en WhatsApp.

- No usa IA ni backend.
- No guarda datos en el navegador.
- Incluye un enlace de **WhatsApp directo** para quien prefiera saltarse la guía.
- Funciona con teclado, `Escape`, foco atrapado por `dialog` y `prefers-reduced-motion`.

## QR de opinión

La sección **Confianza** incluye un QR para que un cliente cuente su experiencia.

- Abre WhatsApp con el mensaje de opinión ya preparado.
- **No es una reseña pública de Google**: es feedback privado por WhatsApp.
- Incluye una tarjeta imprimible en `assets/qr-opinion-card.png`.
- Si más adelante tienes ficha de Google Business y un enlace de reseña, se reemplaza la URL y se regenera el QR.

## Ubicación

La sección **Ubicación** muestra la dirección **Montgolfier 0494, Temuco, 4811161** y la invitación a coordinar visitas por WhatsApp. No incluye mapa, Waze ni enlaces de Google Maps. La dirección también está en el footer, el JSON-LD (`PostalAddress`) y `llms.txt`.

## Tipografía y color

La remodelación usa **Manrope 750** para los titulares principales y reserva **Instrument Serif** para las cursivas de énfasis. La paleta se movió a un azul profundo, crema cálida, terracota y teal, manteniendo intactas todas las secciones y el fondo JSB de Visítanos.

## Repositorio y despliegue

El proyecto ya está preparado para GitHub Pages:

- `.gitignore` excluye dependencias, cachés, `.tmp`, logs y `.zip`.
- `.gitattributes` fija LF y marca binarios.
- `.nojekyll` evita el procesamiento de Jekyll.
- [DEPLOY.md](DEPLOY.md) contiene los pasos de publicación y el reemplazo de dominio.

Antes de publicar, reemplaza `https://jsbconstruccion.cl` por la URL real en `index.html`, `sitemap.xml`, `robots.txt` y `llms.txt`.

## SEO, AEO y GEO

Informe de auditoría y bloqueos: [SEO-AUDIT.md](SEO-AUDIT.md).

- **Canonical y Open Graph absolutos** con dominio de trabajo `https://jsbconstruccion.cl/`.
- **JSON-LD `@graph`** con `WebSite`, `GeneralContractor`/`HomeAndConstructionBusiness`, `WebPage`, `ImageObject`, `VideoObject`, seis `Service`, `OfferCatalog` y `FAQPage`.
- **`sitemap.xml`** con imagen y video; **`robots.txt`** con sitemap y acceso para bots generativos; **`llms.txt`** con servicios, cobertura, FAQ y contacto.
- **Datos de contacto** y dirección en la página, footer, JSON-LD y llms.
- **FAQ visible y schema** con las mismas preguntas y respuestas.

> El dominio `jsbconstruccion.cl` es el valor de trabajo. Reemplazarlo por el dominio real en canonical, OG, schema, sitemap y llms antes de publicar.
>
> La dirección pública confirmada es **Montgolfier 0494, Temuco, 4811161** y quedó en el footer, JSON-LD y llms.

## Capa de conversión

Se agregó una capa de captación sin quitar las secciones existentes:

- **Top bar fija** con taller/sala de muestras, horario, enlace a ubicación y teléfono.
- **Diagnóstico en terreno** con formulario de 3 datos (necesidad, comuna y nombre) que abre WhatsApp con el mensaje armado.
- **Barra de autoridad** con años de oficio, sectores y cobertura.
- **Problemas reales** (frío, filtraciones y plazos) como entrada al **Pack Hermeticidad & Eficiencia Invierno**.
- **FAQ técnico** ampliado con el pack y la visita técnica.

La dirección **Montgolfier 0494, Temuco, 4811161** quedó aplicada en el footer, JSON-LD y llms.txt.

## Archivos

```text
index.html              Estructura, contenido, metadatos y JSON-LD
styles.css              Sistema visual completo y responsive
script.js               Interacciones (menú, acordeón, galería, comparador, asistente y WhatsApp)
assets/favicon.png      Favicon oficial
assets/apple-touch-icon.png
assets/og-image.png     Imagen para compartir en redes (1200 × 630)
assets/logo-jsb.webp    Logotipo oficial completo
assets/logo-jsb-backdrop.webp  Logotipo sin fondo para las marcas de agua de las secciones
assets/logo-jsb-original.webp  Logotipo original con fondo blanco
assets/logo-jsb-blue.webp  Logotipo azul sobre blanco para el fondo de Visítanos
assets/logo-mark.webp   Isotipo oficial para el header
assets/logo-jsb.png     Respaldo PNG del logotipo
assets/logo-mark.png    Respaldo PNG del isotipo
assets/material-board.webp  Paleta material fotográfica del manifiesto
assets/antes.webp       Visualización del acceso "antes" (1200 × 800)
assets/despues.webp     Acceso terminado de la visualización (1200 × 800)
assets/antes-puerta.webp  Puerta de madera del comparador "antes"
assets/despues-puerta.webp  Puerta de madera con listones y vidrio del comparador "después"
assets/antes-casa.webp  Puerta antigua insertada en una casa clásica
assets/despues-casa.webp  Casa moderna de la galería para el comparador "después"
assets/qr-opinion.svg   QR vectorial para la sección Tu opinión
assets/qr-opinion.png   QR en PNG (1200 × 1200)
assets/qr-opinion-card.png  Tarjeta imprimible con el QR (1200 × 1500)
assets/noise.png        Textura sutil
assets/galeria/         Fotografías y piezas de producto proporcionadas por JSB, incluidas 5 piezas de campaña
assets/reel/            Video JSBReel (MP4) y póster para la web
assets/fonts/           Instrument Serif y Manrope + licencias OFL
sitemap.xml             Sitemap con imágenes y video
robots.txt              Indexación y acceso de bots
llms.txt                Resumen estructurado para asistentes y motores generativos
preview/                Capturas de referencia del hero, manifiesto, galería, comparador, reel, asistente y ubicación
remotion/               Proyecto aparte de video con Remotion
```

## Editar antes de publicar

1. **Galería y reel.** Las imágenes de `assets/galeria/` y `assets/reel/` fueron proporcionadas por JSB. Confirma la autorización de uso y que las referencias de fachadas representen trabajos propios antes de publicarlas como obra ejecutada. La sección se presenta como "registros y referencias".
2. **Comparador de puertas.** El "antes" y el "después" usan la misma casa moderna: puerta de madera antigua (insertada en la misma casa) a la derecha y acceso moderno de puerta oscura a la izquierda. Ambas imágenes miden 1200 × 800. Reemplazar las imágenes si cambia la referencia.
3. **Imagen social.** Cuando tengas dominio, cambia `og:image` por una URL absoluta (`https://tudominio.cl/assets/og-image.png`) y agrega `og:url` y `canonical`.
4. **Datos de contacto.** El teléfono está repetido en los enlaces de WhatsApp, en el footer y en el JSON-LD. Busca `56966753502` y `+56 9 6675 3502` para reemplazarlo. La dirección **Montgolfier 0494, Temuco, 4811161** se usa en el footer, el JSON-LD y `llms.txt`; verifica que sea la dirección pública antes de publicar.
5. **Número de WhatsApp del constructor de mensajes.** `script.js` genera el enlace con `https://wa.me/56966753502`; si cambia el número, actualízalo también allí.
6. **Redes.** El único perfil enlazado es <https://www.instagram.com/jsb_chile/>.
7. **Cobertura.** El texto dice Temuco y alrededores, Región de La Araucanía. Ajusta las FAQ si la cobertura cambia.

El sitio no incluye formulario con backend: los CTA abren WhatsApp con un mensaje precargado. El constructor de la sección de contacto y el asistente guiado no guardan datos.

## Interacciones incluidas

- Menú móvil con bloqueo de scroll, foco contenido y cierre con `Escape`.
- Acordeón de servicios con estados ARIA e `inert` en paneles cerrados.
- Comparador de puertas antes/después con puntero, touch y teclado.
- Marquesina con control de pausa y respeto por `prefers-reduced-motion`.
- Constructor de mensaje de WhatsApp con servicios, comuna e idea.
- Asistente guiado de tres preguntas que arma el mensaje y lo abre en WhatsApp, sin backend ni almacenamiento.
- QR de opinión que abre WhatsApp con un mensaje de feedback y una tarjeta descargable para imprimir.
- Enlace a la sección Ubicación desde Contacto y footer, con la dirección visible.
- Sin mapa ni botones de ruta.
- CTA **Visítanos** sin botón, con enlace de texto; el logotipo azul/blanco ocupa todo el fondo de la sección y el resto de secciones conserva una marca de agua suave.
- Galería horizontal con 17 piezas, flechas, teclado, touch y scroll-snap.
- El hero usa la pieza de campaña **Cotiza tu proyecto** en lugar del bloque de Instagram; las 5 piezas quedan también en la galería.
- Reel de obra Remotion con reproducción al entrar en pantalla, botón de pausa, transcripción y respeto por `prefers-reduced-motion`.
- Navegación activa según sección visible.
- Revelados al hacer scroll, parallax sutil y botones magnéticos.
- Respeto por `prefers-reduced-motion`.
- Fallback sin JavaScript: todo el contenido sigue visible y las secciones desplegables quedan abiertas.

## Accesibilidad y pruebas realizadas

- Axe Core: **0 violaciones** en escritorio, móvil y menú móvil.
- Contraste de texto revisado; los microtextos se mantienen por sobre 4.5:1 en fondos planos.
- Sin desbordamiento horizontal en 320, 360, 390, 768, 1024, 1180 y 1440 px.
- Navegación por teclado verificada en menú, acordeón, comparador y galería.
- Asistente verificado en escritorio y móvil: foco inicial, foco atrapado por `dialog`, cierre con `Escape` y retorno de foco al botón.
- Sin errores de consola ni solicitudes fallidas.
- Tipografías locales verificadas con `document.fonts`.
- Enlaces de WhatsApp verificados contra `+56 9 6675 3502`.
- Reel verificado en navegador: MP4 1440 × 810, 18 s, autoplay silencioso, pausa/reanudación y fallback con movimiento reducido.
- QR de opinión decodificado y verificado: abre WhatsApp con el mensaje de feedback al +56 9 6675 3502.
- Ubicación verificada en texto, footer, JSON-LD y llms; sin mapa embebido.
- Sin enlaces externos de mapas.
- CTA **Visítanos** probado sin botón y con fondo completo del logo azul/blanco: el enlace baja a `#ubicacion`, sin overflow en 320/390/1440 y con 0 violaciones de Axe.
- `prefers-reduced-motion` desactiva animaciones y deja todo el contenido visible.

## Despliegue

El sitio no necesita compilación. Publica el contenido de esta carpeta en cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages o un hosting tradicional). La raíz debe contener `index.html`.

Antes de publicar, define el dominio y actualiza las URL absolutas de Open Graph/canonical. Añade también una política de privacidad si el sitio empieza a recolectar datos por otro canal.

## Créditos

- Tipografías: **Instrument Serif** y **Manrope**, SIL Open Font License 1.1. Licencias en `assets/fonts/`.
- Icono de WhatsApp: **Bootstrap Icons**, licencia MIT.
- Ilustraciones, isotipo de la marca y composición: proporcionados o realizados para este proyecto.
- Fotografías y piezas de producto de la galería: proporcionadas por JSB.
