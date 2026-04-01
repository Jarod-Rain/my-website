# ~*+xX R4iNb0w SpArKlE P4wZ Xx+*~

A mid-2000s scene furry sparkle-cat blog with working dynamic features.

## Features

- **Music Player** — Drop audio files into `./music/` and they auto-populate in the player. Supports mp3, ogg, wav, flac, m4a, aac, opus, and wma. Includes play/pause, prev/next, shuffle, progress seeking, and volume control with a reactive visualizer.
- **Guestbook** — Visitors can sign and leave messages. Entries persist in `./data/guestbook.json`.
- **Visitor Counter** — Counts unique visitors (by IP, debounced per 24h). Persists in `./data/counter.json`.
- **Sparkle Cursor Trail** — Stars, hearts, diamonds, and circles that follow the mouse.
- **Three-Column Layout** — Left sidebar (nav, about, blinkies, stamps, friends), center (blog posts), right sidebar (music, counter, guestbook).
- **All the classics** — Rainbow checkerboard background, scrolling marquee, blinking text, under-construction banners, 88x31 buttons, paw print trails, floating decorations.

## Quick Start

### With Docker (recommended for TrueNAS)

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

## Hosting on TrueNAS + Cloudflare

1. **TrueNAS**: Run as a Docker container (or in a jail). Map port 3000 to wherever you want.
2. **Tailscale** (if using): The container should be reachable via your Tailscale network.
3. **Cloudflare Tunnel**: Set up a `cloudflared` tunnel pointing to `http://localhost:3000` (or your Tailscale IP). This gives you HTTPS and keeps your home IP private.

   ```bash
   cloudflared tunnel --url http://localhost:3000
   ```

   Or configure a named tunnel in your Cloudflare dashboard for your domain.

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
│   ├── comments.html
│   ├── friends.html
│   ├── guestbook.html
│   ├── links.html
│   ├── ocs.html
│   └── shrines.html
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

---

*do NOT steal my art or i WILL cry*
