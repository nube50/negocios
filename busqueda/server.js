const express = require('express');
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'agenxy.db');
const SEED_PATH = path.join(__dirname, 'seed.json');

const app = express();
app.use(express.json({ limit: '5mb' }));

// CORS
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
      social TEXT NOT NULL DEFAULT '[]',
      status TEXT NOT NULL DEFAULT 'pendiente',
      priority TEXT NOT NULL DEFAULT 'warm',
      notes TEXT NOT NULL DEFAULT '[]',
      deleted INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);
}

// ============================================================
// SEED — solo INSERT OR IGNORE (NUNCA borra datos de usuario)
// ============================================================
function syncSeed() {
  let negocios;
  if (fs.existsSync(SEED_PATH)) {
    negocios = JSON.parse(fs.readFileSync(SEED_PATH, 'utf-8'));
  } else {
    negocios = [];
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO negocios (id, name, cat, addr, phone, phoneClean, webType, webUrl, webLabel, social)
    VALUES (@id, @name, @cat, @addr, @phone, @phoneClean, @webType, @webUrl, @webLabel, @social)
  `);

  let inserted = 0;
  for (const n of negocios) {
    if (n.social && typeof n.social !== 'string') n.social = JSON.stringify(n.social);
    const result = insert.run(n);
    if (result.changes > 0) inserted++;
  }

  if (inserted > 0) console.log(`SyncSeed: ${inserted} nuevos negocios agregados`);
}

// ============================================================
// API ROUTES
// ============================================================

// GET /api/negocios
app.get('/api/negocios', (req, res) => {
  try {
    const rows = db.prepare('SELECT * FROM negocios ORDER BY id').all();
    res.json({ ok: true, data: rows });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// GET /api/negocios/:id
app.get('/api/negocios/:id', (req, res) => {
  try {
    const row = db.prepare('SELECT * FROM negocios WHERE id = ?').get(req.params.id);
    if (!row) return res.status(404).json({ ok: false, error: 'no encontrado' });
    res.json({ ok: true, data: row });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// POST /api/negocios — agregar solo negocios NUEVOS (nunca sobreescribe estado de usuario)
app.post('/api/negocios', (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const insert = db.prepare(`
      INSERT OR IGNORE INTO negocios (id, name, cat, addr, phone, phoneClean, webType, webUrl, webLabel, social)
      VALUES (@id, @name, @cat, @addr, @phone, @phoneClean, @webType, @webUrl, @webLabel, @social)
    `);
    let inserted = 0;
    for (const n of items) {
      if (n.social && typeof n.social !== 'string') n.social = JSON.stringify(n.social);
      const result = insert.run(n);
      if (result.changes > 0) inserted++;
    }
    res.json({ ok: true, inserted });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// PUT /api/negocios/sync — igual que POST pero solo para sincronización desde seed externo
app.put('/api/negocios/sync', (req, res) => {
  try {
    const items = Array.isArray(req.body) ? req.body : [req.body];
    const insert = db.prepare(`
      INSERT OR IGNORE INTO negocios (id, name, cat, addr, phone, phoneClean, webType, webUrl, webLabel, social)
      VALUES (@id, @name, @cat, @addr, @phone, @phoneClean, @webType, @webUrl, @webLabel, @social)
    `);
    let inserted = 0;
    for (const n of items) {
      if (n.social && typeof n.social !== 'string') n.social = JSON.stringify(n.social);
      const result = insert.run(n);
      if (result.changes > 0) inserted++;
    }
    res.json({ ok: true, inserted });
  } catch (e) {
    res.status(500).json({ ok: false, error: e.message });
  }
});

// PUT /api/negocios/bulk-state — restaurar estado completo desde localStorage
app.put('/api/negocios/bulk-state', (req, res) => {
  try {
    const stateMap = req.body; // { id: { status, priority, notes, deleted? }, ... }
    const updateStatus = db.prepare('UPDATE negocios SET status = ? WHERE id = ?');
    const updatePriority = db.prepare('UPDATE negocios SET priority = ? WHERE id = ?');
    const updateNotes = db.prepare('UPDATE negocios SET notes = ? WHERE id = ?');
    const updateDeleted = db.prepare('UPDATE negocios SET deleted = ? WHERE id = ?');

    let updated = 0;
    for (const [id, state] of Object.entries(stateMap)) {
      if (!id || !state) continue;
      if (state.status) updateStatus.run(state.status, id);
      if (state.priority) updatePriority.run(state.priority, id);
      if (state.notes) updateNotes.run(typeof state.notes === 'string' ? state.notes : JSON.stringify(state.notes), id);
      if (state.deleted !== undefined) updateDeleted.run(state.deleted ? 1 : 0, id);
      updated++;
    }
    res.json({ ok: true, updated });
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

// PUT /api/negocios/:id/notes
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

// PUT /api/negocios/:id/notes-full
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

// DELETE /api/negocios/:id
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
syncSeed();

app.listen(PORT, '0.0.0.0', () => {
  console.log(`agenxy API running on port ${PORT}`);
});
