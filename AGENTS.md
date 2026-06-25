# Reglas

- Siempre hablar en español.

# Proyecto: Agency — Prospección Local Bogotá

## Objetivo
Construir herramientas de prospección para ofrecer servicios de desarrollo web a negocios locales en Bogotá. Identificar negocios sin página web (o con presencia web deficiente), contactarlos y ofrecerles landing pages o sitios completos.

## Flujo de trabajo
1. **Buscar datos** → scraper `compass/google-maps-extractor` de Apify (Google Maps) con categorías como "restaurante", "tienda", "taller", etc.
2. **Procesar** → filtrar solo negocios con teléfono, categorizar por tipo de presencia web
3. **Prospectar** → desde la herramienta HTML, contactar vía WhatsApp/teléfono, registrar estado, prioridad y notas
4. **Cerrar** → cuando un lead acepta, ofrecer landing page o desarrollo web completo

## Herramienta construida: `busqueda/index.html`

### Qué hace
- Prospector autónomo de negocios locales en Bogotá
- Funciona 100% offline (file:// protocol), sin servidor
- Busca, filtra y gestiona leads con historial de notas

### Funcionalidades
- Búsqueda por nombre/dirección
- Filtros por categoría, estado, prioridad y tipo de web
- Tarjetas con: nombre, categoría, dirección, teléfono, presencia web
- Botones de acción: WhatsApp (📲), Llamada (📞), Maps (📍), Sitio web (🌐)
- Estados de lead: Pendiente → Contactado → Convertido → Rechazado
- Prioridad: 🔥 Caliente / 💤 Tibio / ❄️ Frío
- Botones de nota rápida con timestamp: 📵(no contesta), 💬(dejó msj), 👍(interesado), 💰(presupuesto), ⏰(llamar luego), 👎(no interesado)
- Historial completo de notas (scroll)
- Eliminación lógica con restaurar
- Dashboard con stats (totales, contactados, convertidos)
- Exportación: JSON, CSV, Reporte de texto
- Importación JSON (para respaldos/transferencia)
- Persistencia automática en localStorage
- Mensaje adaptativo: "no tienes página web" vs "ideas para mejorar tu sitio"

### Arquitectura
- Datos incrustados en `var DATA = [...]` dentro del HTML (funciona sin servidor)
- Estado de usuario en localStorage bajo clave `prospeccion_bogota`
- `datos.json` es espejo de DATA para respaldo manual
- No requiere build steps, ni npm, ni servidor

## Datos actuales: 64 negocios

| Tipo | Sin web | Solo redes | Con web | Total |
|------|---------|------------|---------|-------|
| Restaurantes / Comida | 9 | 4 | 16 | 29 |
| Tiendas ropa / textil / accesorios | 1 | 11 | 0 | 12 |
| Tiendas alimentación | 7 | 0 | 0 | 7 |
| Tienda regalos | 1 | 0 | 0 | 1 |
| Alquiler trajes / vestidos / boutiques | 0 | 1 | 13 | 14 |
| Otros (paellas, lechona, café, etc.) | 0 | 0 | 3 | 3 |
| **Total** | **18** | **16** | **32** | **66** |

> Columnas reales: Sin web **18**, Solo redes **17**, Con web **29**, Total **64** (la tabla por categoría es aproximada)

- IDs activos: b1-b25, b30-b34, b36-b41, b50-b77
- IDs eliminados (gimnasios): b26-b29, b35, b42-b45
- IDs libres (nunca usados): b46-b49
- Talleres eliminados y reemplazados en sesión 6: b9, b10, b18, b20, b21, b22, b24, b25, b33, b38, b39, b40, b41

## Archivos del proyecto

- `busqueda/index.html` — herramienta principal de prospección
- `busqueda/datos.json` — respaldo JSON de los datos
- `landing-pages/` — landing pages de clientes (auto-contenidas, un HTML cada una)
  - `sarta-bguest.html` — Sarta & Bguest
  - `paola-dimaya.html` — Paola Dimaya Alta Costura
  - `stacia-store.html` — Stacia Store (Luxury Brand, Armenia)
- `recursos/` — assets/imágenes (vacío, usamos CDN)
- `opencode.json` — config MCP de Apify
- `AGENTS.md` — este archivo

## Historial de sesiones

### Sesión 1 (2026-06-22)
- Creación de `busqueda/index.html` con funcionalidad completa de prospección
- Datos originales Apify: 60 lugares scrapeados, 45 con teléfono
- Se incluyeron restaurantes, talleres, tiendas y gimnasios

### Sesión 2 (2026-06-22)
- Se eliminaron los 9 gimnasios de DATA (b26-b29, b35, b42-b45)
- Se agregaron 14 nuevos restaurantes/negocios de comida CON sitio web desde búsqueda web manual
- Nuevos: ZeQueda Paellas, Lechonería La Exquisita, Naguara Lunch, Café Monstruo, Pizzardi Artigianale, Diestro Restaurante, La Churrasquería Beef & Wine, Don Jediondo Sopitas y Parrilla, La Puerta de la Catedral, Tamalechona, El Rey de la Lechona, Roerik Café y Pizzería, Bella Suiza Panadería y Pastelería, XL Gourmet
- Total pasó de 45 a 50 negocios
- Se actualizó `datos.json` para reflejar cambios

### Sesión 3 (2026-06-22)
- Se desplegó `busqueda/` en Vercel via GitHub (`https://github.com/nube50/negocios`)
- Se documentó herramienta Open Design (`https://opendesigner.io/es`) para diseñar landing pages
- Open Design clonado en `/media/th/DATOS/PROYECTOS/opendesign` (pendiente de clonar)
- Próximas ciudades a prospectar: Medellín y Cali (cuando el usuario avise)

### Sesión 4 (2026-06-22)
- Se creó servidor backend Node.js + Express + SQLite en Oracle Cloud ARM (`root@xray.culturavpn.pro:3001`)
- Servidor en `/root/agenxy/` con PM2, auto-arranque, 50 negocios seedeados
- API REST: GET /api/negocios, PUT status/priority/notes, DELETE soft, POST restore
- `index.html` modificado para modo dual: API_URL vacío = offline (localStorage), API_URL configurado = servidor central
- Sincronización bidireccional: las mutaciones van al servidor + localStorage como caché
- Config variable `API_KEY` para autenticación opcional
- CORS configurado para origins dinámicos (Vercel y local)
- Dark mode persistente añadido en sesión 3
- Se agregó `seed.json` con los 50 negocios para poblar la DB
- Se agregó `package.json` con dependencias express + better-sqlite3

### Sesión 5 (2026-06-22)
- Se detectaron y corrigieron 4 bugs de sintaxis JS introducidos al generar el modo dual en sesión 4:
  - `exportCSV`: `\n` partido en 2 líneas literales → JS inválido
  - `renderDashboard`: patrón `\''` → `\'` en stats (faltaba comilla de cierre)
  - Varios onclick: `\''` → `\'` en `setStatus`, `addNote`, `deleteBusiness`, `restoreBusiness`, `setPriority`
  - `onfocus`: `\'\'` → `''` perdió escapes en textarea
- Se verificó con `node --check` que el script completo compila sin errores
- Se subió a GitHub → Vercel auto-desplegó la corrección
- Se confirmó que la página funciona con datos centralizados vía API

### Sesión 6 (2026-06-22)
- Se eliminaron los 13 talleres de DATA (b9, b10, b18, b20, b21, b22, b24, b25, b33, b38, b39, b40, b41)
- Se reemplazaron por 13 tiendas de ropa/textil/accesorios con redes sociales (11 social-only, 1 no-web, 1 con web)
- Nuevas: Vestidos de Baño Bogotá, Fajas y Moda, AKA, Shaloom Boutique, Seventh, Maria Mulata, Stacia Store, Somo Ilius, Gothic Store, Violeta Inesperada, Avril Boutique, Amatita Bisutería, Inrya - Ropa Hindú
- Balance mejorado: Sin web 18, Solo redes 16, Con web 16 (antes era 22/5/23)
- Se actualizó `datos.json`, `seed.json` y `DATA_FALLBACK` en `index.html`

### Sesión 7 (2026-06-23) — Redes sociales con iconos
- Se agregó campo `social` (array de `{platform, url, label}`) a todos los negocios en `datos.json`, `seed.json`, `DATA_FALLBACK` y DB
- Cada negocio tiene al menos WhatsApp generado desde `phoneClean`
- Negocios con URLs sociales conocidas: migración automática detectando plataforma (Instagram, Facebook, WhatsApp)
- Se agregaron iconos visuales por plataforma en las tarjetas (Instagram rosa, Facebook azul, WhatsApp verde, TikTok negro, YouTube rojo)
- CSS con colores de marca oficiales, dark mode compatible
- CSV export incluye columna "Redes Sociales"
- Servidor reseedeado con nueva columna `social` y `JSON.stringify` antes de insertar
- Datos migrados: 10 negocios con redes sociales + WhatsApp para todos (50/50)
- Bugs corregidos: `phoneClean` y `webLabel` faltantes en DATA_FALLBACK (modo offline)

### Sesión 8 (2026-06-23) — Expansión: Alquiler de trajes, vestidos, boutiques
- Se investigaron y agregaron 14 nuevos negocios de alquiler de trajes/smoking, vestidos de novia, boutiques y ropa mujer con sitio web
- Nuevos: Gustavo Parra Design, Elegance Sastrería, BeneFit Ropa Tallas Grandes, Jenne Riveros Designer, Alquiler Smoking Bogotá, Click2Dress, Paola Dimaya Alta Costura, Sarta & Bguest (IG), Cherie Boutique, By Caicedo, Karissa Moda, Alison Ropa Tejida, Zigzag Design For Men, Bettina Spitz
- Nuevos IDs: b64-b77
- Totales actualizados: Sin web 18, Solo redes 17, Con web 29, Total **64**
- Balance mejorado: ahora hay **14 negocios en alquiler de trajes/vestidos/boutiques** con presencia web

### Sesión 9 (2026-06-23) — Fix: preservación de datos de usuario
- **CRÍTICO**: se corrigió el proceso para NUNCA perder datos de usuario al agregar/quitar negocios
- Servidor: `seedDB()` reemplazado por `syncSeed()` que solo hace `INSERT OR IGNORE` de IDs NUEVOS, **nunca borra ni sobreescribe datos existentes**
- Servidor: `POST /api/negocios` cambió de `INSERT OR REPLACE` a `INSERT OR IGNORE`
- Servidor: nuevo endpoint `PUT /api/negocios/bulk-state` para restaurar estado desde localStorage
- Frontend: al cargar desde servidor **preserva** el estado existente en localStorage (status, priority, notes, deleted) y solo actualiza datos del negocio
- Frontend: nuevo botón `⇧ Server` en la toolbar para enviar estado local al servidor
- Frontend: merge de `_deleted` preserva eliminaciones locales aunque el servidor no las tenga
- Se actualizó `AGENTS.md` con las nuevas instrucciones de operación segura

### Sesión 10 (2026-06-23) — Landing page Sarta & Bguest + campo propuesta
- Se creó skill `landing-page-designer` en `.opencode/skills/` y `~/.config/opencode/skills/`
- Se diseñó landing page profesional para Sarta & Bguest en `landing-pages/sarta-bguest.html`
- Se desplegó en Vercel como proyecto independiente: `https://lp-sarta-bguest.vercel.app`
- Se agregó campo `propuesta` a la DB (columna SQLite), API y frontend
- Frontend muestra badge "Propuesta" en la tarjeta si el negocio tiene LP asignada
- Sarta & Bguest (b71) tiene su propuesta vinculada a la LP desplegada
- Se actualizó `server.js`, `seed.json`, `datos.json` y `DATA_FALLBACK`

### Sesión 11 (2026-06-23) — Landing page Paola Dimaya Alta Costura

### Sesión 12 (2026-06-23) — Hero con video background + correcciones visuales
- Se reemplazó imagen estática del hero por video background (Mixkit 51225, mujer probándose vestido de novia)
- **Bug corregido**: el video no se veía porque `opacity:0.35` + `brightness(0.5)` lo ocultaban — se eliminaron los filtros
- Overlay del hero se aclaró (`0.7→0.25→0.1` en vez de `0.95→0.6→0.3`) para que el video sea protagonista
- Se agregó gradient inferior en el hero para transición suave a negro
- Video en 720p (3MB) con fallback a 1080p para carga rápida
- `preload="auto"` para inicio inmediato
- Desplegado en `https://lp-paola-dimaya.vercel.app`
- Se diseñó y desplegó LP profesional para Paola Dimaya: `https://lp-paola-dimaya.vercel.app`
- Stack LP definitivo: **GSAP + ScrollTrigger** (animaciones avanzadas), **Font Awesome** (iconos CDN), **Google Fonts** (Playfair Display + Inter), **Unsplash** (imágenes CDN)
- Dark theme editorial con acentos dorados, adaptado al nicho de alta costura/lujo
- Secciones: Hero (split text GSAP), Stats (contador animado), Sobre Mí, Servicios, Galería (lightbox), Precios, Cobertura, Testimonios (carrusel), CTA, Contacto, Footer
- Despliegue via servidor Oracle Cloud: SCP el HTML al server, luego `vercel deploy --prod` desde `/root/`
- Al crear LP nueva, **subir a Vercel como proyecto independiente** (ej: `lp-nombre-negocio.vercel.app`)
- Lección aprendida: Vercel ya no acepta single-file deployments → crear directorio con `index.html` + `vercel.json` si es necesario
- Corregido: cambio de imagen "Sobre Mí" por foto de mujer (no abstract/diamantes), eliminación de imágenes irrelevantes (zapatos, etc), CTAs cambiados de "agendar cita" a "invitar al showroom / WhatsApp"

### Sesión 13 (2026-06-24) — Landing page Stacia Store + bugs
- Se diseñó y desplegó LP para Stacia Store (`landing-pages/stacia-store.html`) en `https://lp-stacia-store.vercel.app`
- Se ejecutó scraper Instagram `api-empire/instagram-post-scraper`: 12 posts extraídos de @stacia_store
- Stats reales del perfil: 31.3K seguidores, 857 posts, 535 seguidos
- Galería con 5 embeds oficiales de Instagram (no hotlinking de CDN de IG — bloqueado por 403)
- Ubicación corregida: Armenia, Quindío (Calle 22 #14-53) — NO Bogotá
- **Bugs encontrados y corregidos**:
  - `--white` no definido en CSS → botón Instagram con texto invisible sobre el gradiente
  - `</div>` faltante en sección Location → estructura HTML rota, anidamiento incorrecto
  - GSAP `.from()` causaba flash de botones (el navegador pinta el primer frame con opacity:1 antes de que GSAP los ponga en 0)
  - `preload="none"` + lazy load JS rompía el autoplay del video
  - WhatsApp float no se renderizaba (insertado via JS al final + `!important` en CSS)
  - Mixkit preview URLs devolvían 403; se usó direct download URL (assets.mixkit.co/videos/8908/8908-720.mp4)
- Hero padding cambiado a `padding-top: 14vh` en vez de centrado vertical
- Scroll indicator "Descubre" con chevrones dorados (animación float + arrowBounce, similar Paola Dimaya)
- Fallback 3s por si GSAP CDN falla (revela hero elements manualmente)

### Sesión 14 (2026-06-24) — PWA: Gestión Negocios instalable
- Se agregó soporte PWA a `busqueda/index.html`:
  - `manifest.json` — nombre "Gestión Negocios", display standalone, icono SVG con lupa dorada
  - `icon.svg` — icono vectorial 512×512, fondo oscuro + lupa dorada (#c9a96e)
  - `sw.js` — Service Worker con estrategia Cache First: cachea index.html + assets en install
  - Meta tags apple-mobile-web-app para iOS
  - Auto-registro del SW al cargar la página
- La app ahora se puede instalar desde el navegador (Chrome "Agregar a pantalla de inicio", Safari "Compartir → Agregar a Inicio")
- Funciona 100% offline una vez cacheada (los datos están embebidos + localStorage)

### Lecciones aprendidas para futuras LPs (evitar estos errores)
| Error | Solución |
|---|---|
| Botón IG invisible por `--white` no definido | Definir TODAS las variables CSS en `:root` antes de usarlas. Hacer un checklist de vars |
| HTML anidado mal (div sin cerrar) | Verificar con validador HTML (ej: `node --check` o validador W3C) antes de deployar |
| GSAP `.from()` = flash de contenido | Usar CSS `opacity: 0` inicial + `.to()` en GSAP. NO usar `.from()` |
| `preload="none"` rompe autoplay | Usar `preload="auto"` siempre en videos del hero |
| WhatsApp float no se ve | Insertar via JS al final del body (no confiar en posición estática). Usar `!important` en CSS |
| CDN de Instagram (scontent-lax, fna.fbcdn) da 403 | No hotlinkear. Usar embed oficial (`<blockquote>` + embed.js) o bajar imágenes manualmente |
| Mixkit preview URL da 403 | Usar direct download: `assets.mixkit.co/videos/{id}/{id}-720.mp4`. Mixkit free = solo personal use |
| Coverr hotlinking funcional con CDN | `cdn.coverr.co/videos/{slug}/1080p.mp4`. Licencia comercial gratuita |
| Vercel single-file deprecated | Siempre crear un directorio con `index.html` |
| Sin fallback si GSAP CDN falla | Agregar `setTimeout` 3s que revele hero elements con `style.opacity='1'` |

## Metodología Landing Pages

### Stack estándar (para TODAS las LPs)
| Herramienta | Uso |
|---|---|
| **GSAP + ScrollTrigger** | Animaciones avanzadas: split text, parallax, stagger, magnetic hover, counter animation, timelines |
| **Font Awesome 6 CDN** | Iconos profesionales vectoriales por CDN |
| **Google Fonts** | Playfair Display (serif elegante) + Inter (sans limpio) |
| **Unsplash** | Imágenes de alta calidad CDN (gratis) |
| **HTML auto-contenido** | Un solo archivo, sin build steps, sin dependencias |

### Secciones tipo por nicho
- **Moda/Lujo/Alta Costura**: Hero editorial oscuro, galería con lightbox, testimonios, cobertura, contacto
- **Restaurantes/Comida**: Hero cálido, menú, galería de platos, horarios, ubicación, reservas WhatsApp
- **Tiendas/Ropa**: Hero moderno, catálogo productos, tallas, envíos, redes sociales, WhatsApp

### Lo que NO debe tener una LP
- Imágenes irrelevantes al negocio (cada foto debe ser del rubro del negocio)
- "Agendar cita" si el negocio no requiere agenda (usar "Escríbenos" / "Visítanos" / WhatsApp directo)
- Información genérica sin personalizar
- **Sección de Precios** (esta LP es una propuesta, no un ecommerce — los precios se negocian directo con el cliente)

### Lo que DEBE tener cada LP
- Información real del negocio (dirección exacta, teléfono, horarios)
- Testimonios reales (de Google Maps, website del negocio, redes sociales)
- WhatsApp directo al número del negocio en cada CTA
- Diseño acorde al tipo de negocio (colores, tipografía, tono visual)
- Imágenes relevantes: del nicho, preferiblemente del rubro (ej: vestidos de novia para una boutique nupcial)
- Mapa de Google Maps con la ubicación exacta
- Adaptabilidad mobile-first
- Imagen real de la dueña/diseñadora en el "Sobre Mí" si es posible; si no, foto de una diseñadora/dueña de negocio (NO una modelo/novia/cliente genérica)

### Patrón LP para Alta Costura / Moda / Novias (basado en Paola Dimaya)
Este es el template mental para crear una LP de este nicho rápidamente:

| Elemento | Qué poner |
|---|---|
| **Paleta** | Fondo negro/dark (#0a0a0a, #121212), dorados (#c9a96e, #d4af37), texto marfil (#f5f0eb) |
| **Tipografía** | Playfair Display (serif, títulos elegantes) + Inter (sans, legible) |
| **Hero** | Foto gran angular del taller/showroom o vestido; título "Nombre + Alta Costura"; subtítulo "Alta Costura · Bogotá"; CTA "Escribir ahora" (WhatsApp) + "Ver servicios" |
| **Stats bar** | 3 columnas: años de experiencia / clientas atendidas / % satisfacción. Animación contadora GSAP |
| **Sobre Mí** | Grid 2 cols: imagen de la diseñadora (con marco decorativo dorado) + texto con historia del negocio, técnica, materiales. Firma itálica al final |
| **Servicios** | Grid 2x2. Cada card: icono FA + título + descripción real + precio "Desde $X.XXX.XXX". Sin sección de precios aparte |
| **Galería** | Grid 3 cols con 6 fotos de vestidos/modelos. Lightbox al hacer clic. Imágenes de Unsplash de vestidos de novia |
| **Cobertura** | 4 columnas con zonas de atención (Chapinero, Usaquén, Zona Rosa, etc) |
| **Testimonios** | Carrusel con 3 slides, quotes reales del negocio, autor + rol. Autoplay 5s |
| **CTA final** | "¿Lista para tu vestido ideal?" + 2 botones: WhatsApp + "Cómo llegar" |
| **Contacto** | Dirección, teléfono, email, horarios + Google Maps embed en grayscale |
| **Footer** | Logo, tagline, iconos sociales (WhatsApp, Instagram, Facebook), copyright |
| **WhatsApp float** | Botón flotante verde en toda la página |

**Para replicar esta LP**: buscar en `datos.json` un negocio del mismo nicho (cat: "Alquiler Trajes de Etiqueta", "Alquiler de Vestidos", "Boutique / Ropa Mujer"), extraer su info, y producir el HTML con los mismos patrones de secciones, animaciones y paleta.

### Workflow de despliegue Vercel
```
1. Crear HTML en landing-pages/nombre-negocio.html
2. SCP al servidor: cat archivo.html | ssh root@xray.culturavpn.pro "cat > /root/lp-nombre/index.html"
3. SSH al servidor:
   ssh root@xray.culturavpn.pro
   export PATH=$PATH:/root/.npm-global/bin
   cd /root/lp-nombre
   vercel deploy --prod --yes .
4. La URL será: https://lp-nombre-negocio.vercel.app
5. Actualizar propuesta en datos — ver abajo
```
- El servidor Oracle Cloud (`xray.culturavpn.pro`) tiene Vercel CLI instalado en `/root/.npm-global/bin/`
- Cada LP es un proyecto independiente en Vercel (bajo team `nube50s-projects`)
- No usar single-file deployments (obsoleto) — siempre crear un directorio con `index.html`

### Regla: actualizar propuesta al crear una LP
**Siempre** que se despliegue una LP, hay que actualizar el campo `propuesta` del negocio en **los 4 lugares**:

1. `busqueda/index.html` — añadir `propuesta:"https://lp-nombre.vercel.app"` en el objeto DATA del negocio
2. `busqueda/datos.json` — cambiar `"propuesta": ""` → `"propuesta": "https://lp-nombre.vercel.app"`
3. `busqueda/seed.json` — igual que datos.json
4. Servidor DB: `sqlite3 /root/agenxy/agenxy.db "UPDATE negocios SET propuesta='URL' WHERE id='ID';"`

Esto hace que en la herramienta de prospección aparezca el badge **Propuesta** en la tarjeta del negocio, con link directo a la LP.

## Metodología de Recolección de Datos (REGLAS OBLIGATORIAS)

### 🔴 REGLA #1: Cruzar información de TODAS las fuentes disponibles

**Siempre** que se busque/agregue un negocio al sistema, se debe obtener información de **múltiples fuentes**, no solo de Google Maps:

| Fuente | Qué buscar |
|---|---|
| **Google Maps** | Nombre, dirección, teléfono, categoría, horarios, rating, sitio web |
| **Sitio web del negocio** | Teléfono(s), dirección(es), email, horarios, redes sociales, productos/servicios |
| **Redes sociales (Instagram, Facebook, TikTok, etc.)** | Teléfono actualizado, ubicación, historias/destacados, información de perfil, enlaces |
| **Directorios (Páginas Amarillas, UENI, etc.)** | Teléfonos alternativos, direcciones adicionales, datos de registro |

### 🔴 REGLA #2: Conservar TODA la información, aunque sea contradictoria

- Si Google Maps muestra un teléfono y el sitio web/red social muestra otro **diferente**: guardar AMBOS
- Si hay múltiples direcciones (sucursales): guardar TODAS
- El campo `phone` debe contener el principal, pero las alternativas deben registrarse en `social` como `phone-alt` o en notas
- Estructura sugerida para múltiples teléfonos: usar el principal en `phone` y agregar entries extra en `social` con platform `"phone-alt"` y label descriptivo
- Para múltiples direcciones: usar `addr` principal y agregar las demás en `notes` o campo `addrAlt`

### 🔴 REGLA #3: Determinar el webType correcto según TODAS las fuentes

- `no-web`: sin sitio web ni redes sociales
- `social-only`: tiene Instagram/Facebook/TikTok pero NO sitio web propio
- `has-web`: tiene sitio web propio (aunque sea simple como UENI, Wix, etc.)

Si Google Maps dice "sin web" pero encuentras un perfil de Instagram + sitio UENI → es `has-web`
Si Google Maps dice "sin web" pero encuentras Instagram → es `social-only`

### 🔴 REGLA #4: Investigar redes sociales siempre

- Buscar Instagram, Facebook, TikTok, YouTube del negocio aunque Google Maps no los muestre
- Usar el nombre del negocio + "Instagram", "Facebook", etc. en búsqueda web
- Las redes sociales suelen tener la información más actualizada del negocio
- Agregar TODAS las encontradas al array `social` del negocio

### 🔴 REGLA #5: Actualizar datos existentes

- Si un negocio ya existe en el sistema pero se encuentra información nueva/actualizada: **actualizar**
- No crear duplicados — verificar siempre si el negocio ya existe (por nombre, dirección, teléfono)
- Si hay datos contradictorios entre fuentes, dar prioridad a: Redes Sociales > Sitio Web > Google Maps

## Pendiente / Próximos pasos
- [x] Configurar Nginx reverse proxy para `agy.culturavpn.pro` con SSL (hecho por el usuario via NPM)
- [x] Poner API_URL en index.html apuntando a `https://agy.culturavpn.pro/api`
- [x] Redes sociales con iconos por plataforma en tarjetas (Instagram, Facebook, WhatsApp, TikTok, YouTube)
- [ ] Apify MCP no disponible sin token; buscar fuente alternativa de datos si se quieren más negocios SIN web
- [ ] En el futuro: expandir prospección a Medellín y Cali
- [ ] Diseñar landing pages con Open Design cuando haya clientes

## Notas técnicas
- Al agregar nuevos IDs, usar b64+ para no chocar con IDs existentes
- El estado del usuario (localStorage) sobrevive a cambios en DATA porque usa los IDs; si se elimina un negocio, su estado queda huérfano pero no causa errores
- Los mensajes de contacto se adaptan automáticamente: "no tienes página web" para no-web y social-only, "mejorar tu sitio" para has-web
- **Dual mode**: `API_URL` vacío = offline clásico (embedded DATA + localStorage). `API_URL` configurado = servidor central (el frontend fetchea datos del servidor al cargar, escribe en localStorage como caché, y envía mutaciones al servidor)
- **Schema social**: cada negocio tiene `social: [{platform, url, label}]`. Plataformas soportadas: `instagram`, `facebook`, `whatsapp`, `tiktok`, `youtube`. Se renderizan como iconos circulares con color de marca en las tarjetas.
- **API key**: configurar `API_KEY` en index.html. El servidor valida via header `Authorization: Bearer <key>`. Si está vacío, no hay autenticación.
- **Server credenciales**: root@xray.culturavpn.pro (puerto 22), password: Mathias4520@4520
- **Server directorio**: /root/agenxy/
- **PM2**: `pm2 start server.js --name agenxy -- -p 3001`, `pm2 save`
- **Seed**: 64 negocios en `seed.json`. El servidor corre `syncSeed()` en cada arranque: solo INSERT OR IGNORE negocios nuevos. **NUNCA borra datos de usuario.**
- **DB file**: /root/agenxy/agenxy.db (SQLite, WAL mode)
- **Agregar nuevos negocios**: editar `seed.json` (agregar los nuevos al final), copiar al server y `pm2 restart agenxy`. El `syncSeed()` inserta solo los IDs nuevos. **NO borrar la DB.**
- **Recuperar estado desde localStorage**: si los datos del servidor se pierden, abre la herramienta (los datos locales sobreviven si no recargaste). Usa el botón `⇧ Server` para restaurar priorities, estados y notas al servidor vía `/api/negocios/bulk-state`.
- **Frontend merge**: al cargar desde el servidor, el frontend **preserva** el estado existente de localStorage (status, priority, notes) y solo actualiza los datos del negocio (nombre, categoría, web, etc.).
