/**
 * GOOGLE APPS SCRIPT: Backend API para Gemini Spark y Dashboard de Prospección
 * 
 * Instrucciones:
 * 1. Crea una nueva hoja de cálculo en Google Sheets: "CRM Prospección Bogotá - Agency"
 * 2. Ve a Extensiones > Apps Script.
 * 3. Borra el código existente y pega todo este contenido.
 * 4. Haz clic en "Implementar" (Deploy) > "Nueva implementación" (New deployment).
 * 5. Selecciona Tipo: "Aplicación web" (Web App).
 * 6. Configura:
 *    - Ejecutar como: "Yo" (tu cuenta de Google)
 *    - Quién tiene acceso: "Cualquier usuario" (Anyone) -> Importante para que el dashboard y Spark puedan leer/escribir.
 * 7. Copia la URL de la aplicación web resultante.
 */

const SHEET_NAME = "Leads";

const HEADERS = [
  "ID",
  "Nombre",
  "Categoria",
  "Direccion",
  "Telefono",
  "WhatsApp_Clean",
  "Tipo_Web",
  "URL_Web",
  "Redes_Sociales",
  "Propuesta_LP",
  "Estado",
  "Prioridad",
  "Pitch_Personalizado",
  "Historial_Notas",
  "Fecha_Registro"
];

/**
 * Configura la hoja inicial con encabezados y formato si está vacía
 */
function setupSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setBackground("#1e293b");
    headerRange.setFontColor("#f8fafc");
    headerRange.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

/**
 * GET: Obtiene todos los negocios o filtra por estado/categoría
 */
function doGet(e) {
  try {
    setupSheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    const data = sheet.getDataRange().getValues();
    
    if (data.length <= 1) {
      return jsonResponse({ success: true, count: 0, data: [] });
    }
    
    const headers = data[0];
    const rows = data.slice(1);
    
    const leads = rows.map((row, index) => {
      const obj = { rowIndex: index + 2 };
      headers.forEach((h, i) => {
        obj[h] = row[i];
      });
      return obj;
    });

    // Formato compatible con el dashboard index.html si se solicita con ?format=dashboard
    const format = e && e.parameter && e.parameter.format;
    if (format === "dashboard") {
      const dashboardFormat = leads.map(l => ({
        id: l.ID || `b${l.rowIndex}`,
        name: l.Nombre,
        cat: l.Categoria,
        addr: l.Direccion,
        phone: l.Telefono,
        phoneClean: String(l.WhatsApp_Clean || "").replace(/\D/g, ""),
        webType: l.Tipo_Web || "no-web",
        webUrl: l.URL_Web || "",
        webLabel: l.URL_Web ? l.URL_Web.replace(/^https?:\/\//, '').replace(/\/.*$/, '') : "",
        social: parseSocial(l.Redes_Sociales, l.WhatsApp_Clean),
        propuesta: l.Propuesta_LP || "",
        status: l.Estado || "Pendiente",
        priority: l.Prioridad || "Tibio",
        notes: l.Historial_Notas ? l.Historial_Notas.split("\n---\n").filter(Boolean) : [],
        pitch: l.Pitch_Personalizado || ""
      }));
      return jsonResponse({ success: true, count: dashboardFormat.length, data: dashboardFormat });
    }
    
    return jsonResponse({ success: true, count: leads.length, data: leads });
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, 500);
  }
}

/**
 * POST: Añade nuevos leads o actualiza existentes
 */
function doPost(e) {
  try {
    setupSheet();
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const sheet = ss.getSheetByName(SHEET_NAME);
    
    const body = JSON.parse(e.postData.contents);
    const action = body.action || "add_lead";
    
    if (action === "add_lead") {
      // Agregar nuevo lead (usado por Gemini Spark o scraper)
      const lead = body.lead;
      if (!lead || !lead.Nombre || !lead.Telefono) {
        return jsonResponse({ success: false, error: "Nombre y Teléfono son requeridos" }, 400);
      }
      
      const nextId = lead.ID || `b${sheet.getLastRow() + 1}`;
      const phoneClean = String(lead.WhatsApp_Clean || lead.Telefono || "").replace(/\D/g, "");
      const now = new Date().toISOString().split("T")[0];
      
      const newRow = [
        nextId,
        lead.Nombre,
        lead.Categoria || "General",
        lead.Direccion || "Bogotá, Colombia",
        lead.Telefono,
        phoneClean,
        lead.Tipo_Web || "no-web",
        lead.URL_Web || "",
        lead.Redes_Sociales || "",
        lead.Propuesta_LP || "",
        lead.Estado || "Pendiente",
        lead.Prioridad || "Tibio",
        lead.Pitch_Personalizado || "",
        lead.Historial_Notas || "",
        now
      ];
      
      sheet.appendRow(newRow);
      return jsonResponse({ success: true, message: "Lead agregado con éxito", id: nextId });
    }
    
    if (action === "update_lead") {
      // Actualizar estado, notas, prioridad o pitch de un lead por ID
      const id = body.id;
      const updates = body.updates || {};
      
      const data = sheet.getDataRange().getValues();
      const headers = data[0];
      const idCol = headers.indexOf("ID");
      
      let targetRowIndex = -1;
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idCol]) === String(id)) {
          targetRowIndex = i + 1;
          break;
        }
      }
      
      if (targetRowIndex === -1) {
        return jsonResponse({ success: false, error: "Lead no encontrado con ID: " + id }, 404);
      }
      
      Object.keys(updates).forEach(key => {
        const colIndex = headers.indexOf(key);
        if (colIndex !== -1) {
          sheet.getRange(targetRowIndex, colIndex + 1).setValue(updates[key]);
        }
      });
      
      return jsonResponse({ success: true, message: "Lead actualizado correctamente" });
    }
    
    return jsonResponse({ success: false, error: "Acción desconocida" }, 400);
  } catch (error) {
    return jsonResponse({ success: false, error: error.toString() }, 500);
  }
}

function parseSocial(socialStr, phoneClean) {
  const result = [];
  if (phoneClean) {
    result.push({
      platform: "whatsapp",
      url: "https://wa.me/" + phoneClean,
      label: "WhatsApp"
    });
  }
  if (!socialStr) return result;
  
  const parts = String(socialStr).split("|");
  parts.forEach(p => {
    const trimmed = p.trim();
    if (trimmed.toLowerCase().includes("instagram.com")) {
      result.push({ platform: "instagram", url: trimmed.replace(/^.*: /, ''), label: "Instagram" });
    } else if (trimmed.toLowerCase().includes("facebook.com")) {
      result.push({ platform: "facebook", url: trimmed.replace(/^.*: /, ''), label: "Facebook" });
    }
  });
  return result;
}

function jsonResponse(obj, statusCode) {
  const output = ContentService.createTextOutput(JSON.stringify(obj));
  output.setMimeType(ContentService.MimeType.JSON);
  return output;
}
