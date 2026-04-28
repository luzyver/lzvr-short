# CF-URL-SHORTENER

URL shortener berbasis `Bun`, `Hono`, dan `Redis`.

## Stack

- Bun untuk runtime JavaScript
- Hono untuk routing HTTP
- Redis untuk penyimpanan link dan session
- DevCycle untuk remote app config dan feature flags
- Docker Compose untuk menjalankan app + Redis

## Features

- Short link generator
- Custom slug
- Expiration TTL untuk link
- Click tracking
- Admin panel dengan API key
- Cloudflare Turnstile support
- Turnstile verification per slug selama 1 jam
- Session fallback via cookie, query param, dan header
- Dockerized app runtime

## Project Structure

```text
src/
├── env.js
├── handlers.js
├── index.js
├── kv.js
├── turnstile.js
├── utils.js
└── html/
    ├── 404.js
    ├── admin.js
    ├── home.js
    └── turnstile.js
```

## Configuration

Copy `.env.example` ke `.env`, lalu isi sesuai kebutuhan.
Env hanya dipakai untuk bootstrap runtime/infrastruktur. Config app dibaca dari DevCycle.

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | No | Port internal app. Default `3000` |
| `REDIS_URL` | Yes | URL Redis |
| `DEVCYCLE_SERVER_SDK_KEY` | Yes | Server SDK key DevCycle |

### DevCycle Variables

Buat variable berikut di DevCycle. Key harus sama persis:

| Variable Key | Type | Default | Description |
|--------------|------|---------|-------------|
| `admin-api-key` | String | `""` | API key untuk endpoint admin |
| `turnstile-enabled` | Boolean | `false` | Enable/disable Cloudflare Turnstile |
| `turnstile-site-key` | String | `""` | Site key Turnstile |
| `turnstile-secret-key` | String | `""` | Secret key Turnstile |

Jika DevCycle belum terkonfigurasi atau variable belum tersedia, app memakai safe defaults:
admin API tidak bisa dipakai dan Turnstile nonaktif.

## Local Run

Install dependency:

```bash
bun install
```

Jalankan Redis terlebih dahulu, lalu start app:

```bash
bun src/index.js
```

Atau mode watch:

```bash
bun --watch src/index.js
```

App berjalan di `http://localhost:3000`.

## Docker Compose

`docker-compose.yml` saat ini memakai:

- external network `nginx_default`
- `app` dengan `expose: 3000`
- bind mount Redis ke `./redis-data`

Pastikan network sudah ada:

```bash
docker network create nginx_default
```

Jalankan service:

```bash
docker compose up -d --build
```

## API Endpoints

### Public

`POST /api/shorten`

Request:

```json
{
  "url": "https://example.com/long-url",
  "customSlug": "my-slug",
  "expiresIn": 86400
}
```

Response:

```json
{
  "success": true,
  "slug": "abc123",
  "shortUrl": "https://your-domain.com/abc123",
  "originalUrl": "https://example.com/long-url",
  "createdAt": "2026-04-24T00:00:00.000Z",
  "expiresAt": "2026-04-25T00:00:00.000Z"
}
```

`GET /:slug`

Redirect ke URL tujuan dan menambah click counter.

Perilaku Turnstile untuk short link:

- setiap slug punya status verify sendiri
- slug yang sudah diverifikasi bisa diakses ulang tanpa challenge selama 1 jam
- slug lain tetap harus verify terpisah
- crawler preview yang dikenal tetap dibypass

`POST /api/turnstile/verify`

Request:

```json
{
  "token": "turnstile-response-token",
  "redirect": "/"
}
```

### Admin

Semua endpoint admin memerlukan header:

```http
X-API-Key: your-admin-api-key
```

Available endpoints:

- `GET /admin`
- `GET /api/links`
- `GET /api/stats/:slug`
- `DELETE /api/delete/:slug`

## Storage Model

Redis key yang dipakai:

- `link:{slug}` untuk data short link
- `session:{id}` untuk session Turnstile

TTL link mengikuti `expiresIn` jika diberikan. Session Turnstile default 1 jam.

## Notes

- Workflow deploy Cloudflare lama sudah dihapus dari repo.
- `wrangler.toml` tidak lagi dipakai.
- README ini mengikuti status migrasi repo saat ini, bukan versi Workers lama.

## License

MIT
