# 🚀 Guía de Migración y Conexión con Gemini Spark

Esta guía te explica paso a paso cómo migrar tu sistema de prospección de Bogotá para que funcione de forma autónoma con **Gemini Spark** y **Google Sheets**.

---

## 📂 Archivos generados para la migración
- `gemini-spark/leads_para_sheets.csv` — Los 154 negocios actuales ya formateados para Google Sheets.
- `gemini-spark/PROMPT_GEMINI_SPARK.md` — Instrucciones completas y rol para el agente de Gemini Spark.
- `gemini-spark/google-apps-script.js` — Código backend para que Google Sheets funcione como API web y se sincronice con el dashboard.

---

## 📝 Paso 1: Crear la Base de Datos en Google Sheets

1. Abre [Google Sheets](https://sheets.new) en tu cuenta de Google donde tienes Gemini Spark.
2. Nombra el documento: **`CRM Prospección Bogotá - Agency`**.
3. Cambia el nombre de la primera pestaña a **`Leads`**.
4. Ve a **Archivo > Importar > Subir** y selecciona el archivo `gemini-spark/leads_para_sheets.csv`.
5. En la opción de importación elige: **"Reemplazar la hoja actual"**.
6. ¡Listo! Ya tienes tus 154 negocios cargados con todas sus columnas (ID, Nombre, Teléfono, Redes, Estado, etc.).

---

## ⚡ Paso 2: Activar la API de Google Apps Script (Para sincronizar con el Dashboard)

1. En tu hoja de Google Sheets, ve a **Extensiones > Apps Script**.
2. Borra el código por defecto y pega el contenido completo de `gemini-spark/google-apps-script.js`.
3. Haz clic en el botón **Guardar** (icono de disquete).
4. Haz clic en **Implementar > Nueva implementación**.
5. En el engranaje de configuración elige: **Aplicación web**.
6. Configura:
   - **Descripción**: `API Leads Agency`
   - **Ejecutar como**: `Yo (tu correo)`
   - **Quién tiene acceso**: `Cualquier usuario` *(Anyone)*.
7. Haz clic en **Implementar** y autoriza los permisos en tu cuenta de Google.
8. **Copia la URL de la aplicación web** (la usaremos en el frontend `index.html`).

---

## 🤖 Paso 3: Configurar el Agente en Gemini Spark

1. Abre tu interfaz de **Gemini Spark**.
2. Crea un nuevo agente o tarea automatizada (ej: *"Prospector Bogotá"*).
3. Conecta el agente a tu Google Drive / Workspace y dale acceso a la hoja **`CRM Prospección Bogotá - Agency`**.
4. Copia y pega el contenido de **`gemini-spark/PROMPT_GEMINI_SPARK.md`** en las instrucciones del agente.
5. ¡Spark comenzará a investigar negocios en segundo plano, añadirlos al Sheet y preparar pitches de WhatsApp!

---

## 🖥️ Paso 4 (Opcional): Conectar tu Dashboard `busqueda/index.html` con Google Sheets

Si quieres que tu interfaz visual rápida `busqueda/index.html` lea y escriba directamente en tu Google Sheet en lugar del servidor local/SQLite:

1. Abre `busqueda/index.html`.
2. Busca la línea donde se define `API_URL` al inicio del script:
   ```javascript
   var API_URL = 'https://script.google.com/macros/s/TU_SCRIPT_ID/exec?format=dashboard';
   ```
3. Pega la URL de tu Web App de Google Apps Script.
4. Ahora, cualquier cambio que haga Gemini Spark en Google Sheets aparecerá en tu dashboard visual, y viceversa.
