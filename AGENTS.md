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

## Datos actuales: 50 negocios

| Tipo | Sin web | Solo redes | Con web | Total |
|------|---------|------------|---------|-------|
| Restaurantes / Comida | 9 | 4 | 16 | 29 |
| Talleres mecánicos | 5 | 1 | 4 | 10 |
| Tiendas alimentación | 7 | 0 | 0 | 7 |
| Tienda regalos | 1 | 0 | 0 | 1 |
| Otros (paellas, lechona, café, etc.) | 0 | 0 | 3 | 3 |
| **Total** | **22** | **5** | **23** | **50** |

- IDs activos: b1-b25 (no-web), b30-b34 (social-only), b36-b41 (has-web), b50-b63 (nuevos has-web)
- IDs eliminados (gimnasios): b26-b29, b35, b42-b45
- IDs libres (nunca usados): b46-b49

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

## Pendiente / Próximos pasos
- [x] Configurar Nginx reverse proxy para `agy.culturavpn.pro` con SSL (hecho por el usuario via NPM)
- [x] Poner API_URL en index.html apuntando a `https://agy.culturavpn.pro/api`
- [ ] Apify MCP no disponible sin token; buscar fuente alternativa de datos si se quieren más negocios SIN web
- [ ] Ideal: encontrar más restaurantes/tiendas/talleres sin web para balancear
- [ ] En el futuro: expandir prospección a Medellín y Cali
- [ ] Diseñar landing pages con Open Design cuando haya clientes

## Notas técnicas
- Al agregar nuevos IDs, usar b64+ para no chocar con IDs existentes
- El estado del usuario (localStorage) sobrevive a cambios en DATA porque usa los IDs; si se elimina un negocio, su estado queda huérfano pero no causa errores
- Los mensajes de contacto se adaptan automáticamente: "no tienes página web" para no-web y social-only, "mejorar tu sitio" para has-web
- **Dual mode**: `API_URL` vacío = offline clásico (embedded DATA + localStorage). `API_URL` configurado = servidor central (el frontend fetchea datos del servidor al cargar, escribe en localStorage como caché, y envía mutaciones al servidor)
- **API key**: configurar `API_KEY` en index.html. El servidor valida via header `Authorization: Bearer <key>`. Si está vacío, no hay autenticación.
- **Server credenciales**: root@xray.culturavpn.pro (puerto 22), password: Mathias4520@4520
- **Server directorio**: /root/agenxy/
- **PM2**: `pm2 start server.js --name agenxy -- -p 3001`, `pm2 save`
- **Seed**: 50 negocios en `seed.json`, se insertan en DB al primer arranque si la tabla está vacía
- **DB file**: /root/agenxy/agenxy.db (SQLite, WAL mode)
