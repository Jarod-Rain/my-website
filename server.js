const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

const DATA_DIR = path.join(__dirname, 'data');
const MUSIC_DIR = path.join(__dirname, 'music');
const COUNTER_FILE = path.join(DATA_DIR, 'counter.json');
const GUESTBOOK_FILE = path.join(DATA_DIR, 'guestbook.json');

// Ensure data files exist
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(COUNTER_FILE)) fs.writeFileSync(COUNTER_FILE, JSON.stringify({ count: 0 }));
if (!fs.existsSync(GUESTBOOK_FILE)) fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify({ entries: [] }));
if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/music', express.static(MUSIC_DIR));

// ── Visitor Counter ──────────────────────────────────────────────
// Track IPs so refreshes don't inflate the count within 24h
const SEEN_FILE = path.join(DATA_DIR, 'seen_ips.json');
if (!fs.existsSync(SEEN_FILE)) fs.writeFileSync(SEEN_FILE, JSON.stringify({}));

app.post('/api/visit', (req, res) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
    || req.socket.remoteAddress
    || 'unknown';

  const seen = JSON.parse(fs.readFileSync(SEEN_FILE, 'utf8'));
  const now = Date.now();
  const ONE_DAY = 24 * 60 * 60 * 1000;

  // Prune entries older than 24h
  for (const [key, timestamp] of Object.entries(seen)) {
    if (now - timestamp > ONE_DAY) delete seen[key];
  }

  const counter = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));

  if (!seen[ip]) {
    counter.count++;
    seen[ip] = now;
    fs.writeFileSync(COUNTER_FILE, JSON.stringify(counter));
    fs.writeFileSync(SEEN_FILE, JSON.stringify(seen));
  }

  res.json({ count: counter.count });
});

app.get('/api/counter', (_req, res) => {
  const counter = JSON.parse(fs.readFileSync(COUNTER_FILE, 'utf8'));
  res.json({ count: counter.count });
});

// ── Guestbook ────────────────────────────────────────────────────
app.get('/api/guestbook', (_req, res) => {
  const gb = JSON.parse(fs.readFileSync(GUESTBOOK_FILE, 'utf8'));
  // Return newest first
  res.json({ entries: gb.entries.slice().reverse() });
});

app.post('/api/guestbook', (req, res) => {
  const { name, message } = req.body;

  if (!name || !message) {
    return res.status(400).json({ error: 'name and message are required!!' });
  }

  // Basic sanitization
  const clean = (str, max) => str
    .replace(/[<>]/g, '')
    .trim()
    .slice(0, max);

  const entry = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    name: clean(name, 50),
    message: clean(message, 500),
    date: new Date().toISOString(),
  };

  const gb = JSON.parse(fs.readFileSync(GUESTBOOK_FILE, 'utf8'));
  gb.entries.push(entry);

  // Keep max 200 entries
  if (gb.entries.length > 200) gb.entries = gb.entries.slice(-200);

  fs.writeFileSync(GUESTBOOK_FILE, JSON.stringify(gb, null, 2));
  res.json({ success: true, entry });
});

// ── Music Playlist ───────────────────────────────────────────────
const AUDIO_EXTS = new Set(['.mp3', '.ogg', '.wav', '.flac', '.m4a', '.aac', '.opus', '.wma']);

app.get('/api/music', (_req, res) => {
  try {
    const files = fs.readdirSync(MUSIC_DIR)
      .filter(f => AUDIO_EXTS.has(path.extname(f).toLowerCase()))
      .map(f => ({
        filename: f,
        title: path.basename(f, path.extname(f))
          .replace(/[-_]/g, ' ')
          .replace(/\b\w/g, c => c.toUpperCase()),
        url: `/music/${encodeURIComponent(f)}`,
      }));
    res.json({ tracks: files });
  } catch {
    res.json({ tracks: [] });
  }
});

// ── Fallback to index.html for SPA-style nav ────────────────────
app.get('*', (req, res) => {
  const file = path.join(__dirname, 'public', req.path);
  if (fs.existsSync(file) && fs.statSync(file).isFile()) {
    return res.sendFile(file);
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ~*+xX R4iNb0w SpArKlE P4wZ Xx+*~`);
  console.log(`  Server running on http://0.0.0.0:${PORT}`);
  console.log(`  Put audio files in ./music/ to populate the player!\n`);
});
