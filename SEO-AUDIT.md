# Auditoría SEO / AEO / GEO y calidad Awwwards

**Proyecto:** JSB SpA (marca JSB Construcción), Temuco  
**Fecha:** 2026-11-07  
**Alcance:** `index.html`, `styles.css`, `script.js`, `sitemap.xml`, `robots.txt`, `llms.txt`, assets y sitio en `http://127.0.0.1:4173/`.

## Veredicto

- **SEO/AEO/GEO:** base técnica implementada y validada; **no listo para publicar** por un P0 externo: dominio canónico inexistente.
- **Awwwards:** **6,0/10** en la auditoría adversarial de diseño. No es Site of the Day. Puede aspirar a Honorable Mention si se curan portafolio, hero, recorrido y prueba social real.
- **Funcionalidad:** comparador táctil, foco, formulario, anclas, menú, galería, FAQ, asistente y enlaces verificados.

## Implementado

### SEO técnico

- `canonical`, `hreflang`, Open Graph y Twitter absolutos.
- `robots` con `max-image-preview:large`, `max-snippet:-1` y `max-video-preview:-1`.
- Geo meta, coordenadas, datos de contacto y `business:contact_data`.
- `sitemap.xml` con la página, **18 imágenes** de galería/campaña y el video del reel.
- `robots.txt` con sitemap y acceso para GPTBot, OAI-SearchBot, ClaudeBot, PerplexityBot, Google-Extended, CCBot y Applebot-Extended.
- `llms.txt` con resumen de entidad, servicios, cobertura, contacto, FAQ y enlaces internos.

### Datos estructurados

Un único `@graph` JSON-LD con:

- `WebSite`
- `GeneralContractor` + `HomeAndConstructionBusiness`
- `WebPage` con `speakable`
- `ImageObject` (hero y OG)
- `VideoObject` del reel
- 6 `Service` con `ServiceChannel`
- `OfferCatalog`
- `HowTo` de evaluación en terreno
- `FAQPage` con las 6 preguntas visibles

Validación local: 14 nodos, 0 `@id` sin resolver, FAQ del schema = FAQ visible, video de 18 s.

### AEO / GEO

- FAQ visible y schema idéntico.
- Resumen de entidad y servicios en `llms.txt`.
- Lenguaje claro, cobertura, dirección, teléfono y enlaces de WhatsApp/Instagram.
- Sin reseñas, ratings ni precios inventados.

### Conversión y accesibilidad

- Top bar fija con taller, horario, ubicación y teléfono.
- Diagnóstico en terreno con 3 datos y mensaje de WhatsApp.
- Validación de espacios en blanco con error visible.
- Anclas con compensación de header + top bar.
- Comparador con `touch-action: pan-y`.
- Foco de alto contraste en superficies claras.
- `#cotizar` con `scroll-margin`.
- Imágenes del comparador con `loading="lazy"`.
- `noscript` para el formulario.
- 0 violaciones de Axe en 1440 y 390; sin overflow; sin errores de consola.

## P0 — Bloqueador externo

1. **Dominio canónico inexistente.** `jsbconstruccion.cl` no resuelve (NXDOMAIN). Canonical, OG, sitemap, robots, JSON-LD y `llms.txt` usan ese host. Si el dominio final es otro, hay que reemplazar la base URL en todos los archivos. Sin esto, Google y las tarjetas sociales no pueden validar el sitio.

## Resuelto

- **Dirección/NAP:** el sitio, footer, schema y `llms.txt` usan **Montgolfier 0494, Temuco, 4811161**. No se muestran mapa, Waze ni enlaces de Google Maps. Falta actualizar la ficha de Google Business desde la cuenta del negocio.
- **Teléfono:** el cliente confirmó **+56 9 6675 3502** como número público; no se cambia en el sitio. La ficha de Google debe corregirse si allí aparece otro número.

## P1 — Calidad y confianza

- Portafolio mezcla 10 afiches promocionales con fotos de instalación. Conviene separar **Obras reales** y **Campañas**, y abrir con 4–6 obras instaladas.
- El hero usa un afiche de campaña como visual principal. Para Awwwards conviene una foto propia de obra/equipo con grading coherente.
- “+15 años”, “fabricación en taller propio”, “productos de marca” y `legalName: JSB SpA` no tienen prueba enlazada. Añadir año, marcas, certificaciones o retirar.
- No hay reseñas públicas ni GBP enlazada; el QR pide feedback privado.
- Performance: fuentes TTF (~306 KB), CSS (~106 KB) y LCP móvil estimado >4 s en Slow 4G. Pendiente WOFF2, minificación, Brotli/cache y `srcset`.
- El recorrido mide ~15,5 pantallas en desktop y ~19,7 en móvil; hay tres rutas de contacto compitiendo.

## P2 — Detalles

- `og-image.png` ajustado a ~209 KB (desde 383 KB); aún se puede pasar a JPEG/WebP.
- Microtype funcional por debajo de 11 px en varios labels.
- El sitemap incluye las 17 imágenes de galería/campaña; conviene curar antes de indexarlas.
- Añadir política de privacidad enlazada desde el formulario (nombre/comuna se envían por WhatsApp).
- Revisar numeración 02A/02B y el salto 07 → 09; el bloque Visítanos no tiene 08.

## Pruebas ejecutadas

- JSON-LD: parseo, nodos, referencias, FAQ y video.
- Sitemap XML y 18 imágenes; robots/llms servidos con 200.
- Axe: 0 violaciones en 1440×1000 y 390×844.
- Overflow: 0 en 320/390/768/1024/1440.
- Formulario diagnóstico: abre WhatsApp con mensaje correcto; espacios en blanco no abren y muestran error.
- Constructor de cotización: actualiza href.
- Comparador: teclado, rango, `aria-valuetext`, scroll táctil vertical.
- Galería: 17 piezas, contador y siguiente.
- Asistente: apertura, cierre con Escape y retorno de foco.
- Menú móvil: foco, inert, Escape.
- No-JS y `prefers-reduced-motion`: contenido visible, sin overflow.
- Cero errores de consola y de red en la carga principal.

## Próximo loop

1. Confirmar dominio y dirección; reemplazar todas las URL y NAP.
2. Curar portafolio y hero; separar campañas.
3. Añadir GBP/reseñas y prueba real.
4. WOFF2, minificado y cache.
5. Reducir recorrido y unificar la ruta de contacto.
6. Reauditar con Rich Results/PageSpeed reales y un viewport móvil físico.

**No se declara el objetivo completo:** faltan datos del cliente y contenido real que no se pueden inventar.


## Correcciones aplicadas tras la auditoría

- El **FAB verde ahora abre WhatsApp directo**, no el asistente. El asistente queda como enlace secundario “Prefiero que me guíen paso a paso”.
- Navegación reordenada para seguir el DOM: Problemas → Servicios → Solución.
- Numeración limpia: 00, 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11.
- Comparador sin bloqueo de scroll vertical (`touch-action: pan-y`).
- Foco de alto contraste en fondos claros y en inputs.
- Validación visible de nombre/comuna con espacios.
- `#cotizar` con compensación de header/top bar.
- Imágenes del comparador con lazy loading.
- `og-image` comprimido de ~383 KB a ~209 KB.
- Sitemap ampliado a 18 imágenes.
- `HowTo` sin `totalTime` inventado.
- Microtype funcional del formulario y top bar aumentado.

P0 sigue pendiente: dominio. Dirección y teléfono quedaron confirmados.

- Galería reordenada: las **7 instalaciones reales** quedan primero y las piezas de campaña al final.
- No se incluyen `hasMap`, `geo` ni enlaces de mapas; la dirección queda en el schema y el footer.
- `og-image` reducido a ~209 KB; sitemap con 18 imágenes.
