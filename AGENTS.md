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
- `landing-pages/` — (vacío) para landing pages de clientes
- `recursos/` — (vacío) assets/imágenes
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
