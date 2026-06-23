const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'agenxy.db');
const SEED_PATH = path.join(__dirname, 'seed.json');

const app = express();
app.use(express.json());

// CORS — permite Vercel, local y cualquier origen que el usuario necesite
app.use((req, res, next) => {
const origin = req.headers.origin || '*';
res.setHeader('Access-Control-Allow-Origin', origin);
res.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
if (req.method === 'OPTIONS') return res.sendStatus(204);
next();
});

// ============================================================
// DB INIT
// ============================================================
let db;

function initDB() {
db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
CREATE TABLE IF NOT EXISTS negocios (
id TEXT PRIMARY KEY,
name TEXT NOT NULL,
cat TEXT NOT NULL DEFAULT '',
addr TEXT NOT NULL DEFAULT '',
phone TEXT NOT NULL DEFAULT '',
phoneClean TEXT NOT NULL DEFAULT '',
webType TEXT NOT NULL DEFAULT 'no-web',
webUrl TEXT NOT NULL DEFAULT '',
webLabel TEXT NOT NULL DEFAULT '',
status TEXT NOT NULL DEFAULT 'pendiente',
priority TEXT NOT NULL DEFAULT 'warm',
notes TEXT NOT NULL DEFAULT '[]',
deleted INTEGER NOT NULL DEFAULT 0,
created_at TEXT NOT NULL DEFAULT (datetime('now'))
)
`);
}

// ============================================================
// SEED DATA
// ============================================================
function seedDB() {
const count = db.prepare('SELECT COUNT(*) as c FROM negocios').get().c;
if (count > 0) return;

let negocios;
if (fs.existsSync(SEED_PATH)) {
negocios = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
} else {
negocios = [];
}

const insert = db.prepare(`
INSERT OR IGNORE INTO negocios (id, name, cat, addr, phone, phoneClean, webType, webUrl, webLabel)
VALUES (@id, @name, @cat, @addr, @phone, @phoneClean, @webType, @webUrl, @webLabel)
`);

const tx = db.transaction(() => {
for (const n of negocios) insert.run(n);
});

tx();
console.log(`Seed: ${negocios.length} negocios insertados`);
}

// ============================================================
// API ROUTES
// ============================================================

// GET /api/negocios — listar todos
app.get('/api/negocios', (req, res) => {
try {
const rows = db.prepare('SELECT * FROM negocios ORDER BY id').all();
res.json({ ok: true, data: rows });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// GET /api/negocios/:id — uno solo
app.get('/api/negocios/:id', (req, res) => {
try {
const row = db.prepare('SELECT * FROM negocios WHERE id = ?').get(req.params.id);
if (!row) return res.status(404).json({ ok: false, error: 'no encontrado' });
res.json({ ok: true, data: row });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// POST /api/negocios — agregar uno o varios
app.post('/api/negocios', (req, res) => {
try {
const items = Array.isArray(req.body) ? req.body : [req.body];
const insert = db.prepare(`
INSERT OR REPLACE INTO negocios (id, name, cat, addr, phone, phoneClean, webType, webUrl, webLabel)
VALUES (@id, @name, @cat, @addr, @phone, @phoneClean, @webType, @webUrl, @webLabel)
`);
const tx = db.transaction(() => {
for (const n of items) insert.run(n);
});
tx();
res.json({ ok: true, inserted: items.length });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// PUT /api/negocios/:id/status
app.put('/api/negocios/:id/status', (req, res) => {
try {
const { status } = req.body;
const valid = ['pendiente', 'contactado', 'convertido', 'rechazado'];
if (!valid.includes(status)) return res.status(400).json({ ok: false, error: 'status invalido' });
db.prepare('UPDATE negocios SET status = ? WHERE id = ?').run(status, req.params.id);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// PUT /api/negocios/:id/priority
app.put('/api/negocios/:id/priority', (req, res) => {
try {
const { priority } = req.body;
const valid = ['hot', 'warm', 'cold'];
if (!valid.includes(priority)) return res.status(400).json({ ok: false, error: 'priority invalido' });
db.prepare('UPDATE negocios SET priority = ? WHERE id = ?').run(priority, req.params.id);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// PUT /api/negocios/:id/notes — agregar nota al array
app.put('/api/negocios/:id/notes', (req, res) => {
try {
const { note } = req.body;
if (!note) return res.status(400).json({ ok: false, error: 'note requerido' });
const row = db.prepare('SELECT notes FROM negocios WHERE id = ?').get(req.params.id);
if (!row) return res.status(404).json({ ok: false, error: 'no encontrado' });
const notes = JSON.parse(row.notes);
const now = new Date();
const ts = now.toLocaleDateString('es-CO', {day:'2-digit',month:'2-digit',year:'2-digit'}) + ' ' + now.toLocaleTimeString('es-CO', {hour:'2-digit',minute:'2-digit'});
notes.push({ ts, text: note });
db.prepare('UPDATE negocios SET notes = ? WHERE id = ?').run(JSON.stringify(notes), req.params.id);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// PUT /api/negocios/:id/notes-full — reemplazar array completo
app.put('/api/negocios/:id/notes-full', (req, res) => {
try {
const { notes } = req.body;
if (!Array.isArray(notes)) return res.status(400).json({ ok: false, error: 'notes debe ser un array' });
db.prepare('UPDATE negocios SET notes = ? WHERE id = ?').run(JSON.stringify(notes), req.params.id);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// DELETE /api/negocios/:id — soft delete
app.delete('/api/negocios/:id', (req, res) => {
try {
db.prepare('UPDATE negocios SET deleted = 1 WHERE id = ?').run(req.params.id);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// POST /api/negocios/:id/restore
app.post('/api/negocios/:id/restore', (req, res) => {
try {
db.prepare('UPDATE negocios SET deleted = 0 WHERE id = ?').run(req.params.id);
res.json({ ok: true });
} catch (e) {
res.status(500).json({ ok: false, error: e.message });
}
});

// Health check
app.get('/api/health', (req, res) => {
res.json({ ok: true, time: new Date().toISOString(), negocios: db.prepare('SELECT COUNT(*) as c FROM negocios').get().c });
});

// ============================================================
// START
// ============================================================
initDB();
seedDB();

app.listen(PORT, '0.0.0.0', () => {
console.log(`agenxy API running on port ${PORT}`);
});
