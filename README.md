# My Personal Website

A site in the style of old Geocities websites

## Features

- **Music Player** — Drop audio files into `./music/` and they auto-populate in the player. Supports mp3, ogg, wav, flac, m4a, aac, opus, and wma. Includes play/pause, prev/next, shuffle, progress seeking, and volume control with a reactive visualizer.
- **Guestbook** — Visitors can sign and leave messages. Entries persist in `./data/guestbook.json`.
- **Visitor Counter** — Counts unique visitors (by IP, debounced per 24h). Persists in `./data/counter.json`.
- **Three-Column Layout** — Left sidebar (nav, about), center (posts), right sidebar (music, counter, guestbook).

## Quick Start

### With Docker

```bash
docker compose up -d
```

The site runs on port 3000. Mount `./data/` and `./music/` as volumes for persistence.

### Without Docker

```bash
npm install
node server.js
```

### Adding Music

Drop audio files into the `./music/` directory. The player picks them up automatically — no restart needed. The filename (minus extension) becomes the track title, with dashes and underscores converted to spaces.

## File Structure

```
sparklesite/
├── server.js           # Express backend (counter, guestbook, music APIs)
├── package.json
├── Dockerfile
├── docker-compose.yml
├── public/             # Static files served to visitors
│   ├── index.html      # Main page
│   ├── about.html      # Placeholder pages...
│   ├── art.html
│   ├── blog.html
├── data/               # Persistent data (auto-created)
│   ├── counter.json
│   ├── guestbook.json
│   └── seen_ips.json
└── music/              # Drop audio files here
```

## API Endpoints

| Method | Path             | Description                     |
|--------|------------------|---------------------------------|
| POST   | `/api/visit`     | Increment & return visitor count|
| GET    | `/api/counter`   | Get current visitor count       |
| GET    | `/api/guestbook` | List guestbook entries          |
| POST   | `/api/guestbook` | Add a guestbook entry           |
| GET    | `/api/music`     | List available tracks           |
