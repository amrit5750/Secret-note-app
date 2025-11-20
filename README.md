# Secure Note Sharing App

A self‑hosted web app to create one‑off, shareable notes. Users compose a note, get a unique link, and share it. Notes can be encrypted and auto‑expire.

---

## Features

- ✍️ **Create note** in a rich text editor (TipTap)
- 🔗 **Share link** like `http://<host>/view/<id>`
- 📋 **Copy link** button with **HTTP-safe fallback**
- ⏳ **Auto-expiration** of notes via cron
- 🔐 **Optional AES encryption** of note payloads
- 🌐 **Reverse proxy**: `/api/*` → backend, everything else → frontend
- 🐳 **Dockerized**: frontend, backend, MongoDB, Caddy

---

## Architecture

```
[ Client ]
   |
   v
[Caddy  :80]  ---->  /api/*  ----> [Backend (Hapi, :4000)] ----> [MongoDB]
   |
   └-------------------------> [Frontend (Next.js, :3000)]
```

**Runtime network:** one Docker network `appnet`, containers discover each other by name (`frontend`, `backend`, `mongo`).

---

## Tech Stack

- **Frontend:** Next.js 15 (App Router), React 19, TipTap, Tailwind classes, Axios
- **Backend:** Node.js 20, @hapi/hapi, Mongoose, node-cron
- **DB:** MongoDB 6
- **Proxy:** Caddy v2
- **Packaging:** Docker, Docker Compose v2

---

## Repo Layout

```
secret-note-app/
  apps/
    frontend/      # Next.js app
    backend/       # Hapi API, cron, models
  Caddyfile
  docker-compose.yml
```

---

## Environment Variables

### Backend (`apps/backend/.env` or compose)
```ini
PORT=4000
MONGO_URI=mongodb://mongo:27017/secret-notes
# Until you have a domain, use your server's IP over HTTP:
CORS_ORIGIN=http://185.9.17.217
ENCRYPTION_ENABLED=true
AES_SECRET=CHANGE_ME_BASE64_32B_MIN
```

### Frontend (`apps/frontend/.env` or compose)
```ini
PORT=3000
# When Caddy is in front, the API is at /api
NEXT_PUBLIC_API_BASE_URL=http://185.9.17.217/api
```

> **When you add a domain:**  
> - `CORS_ORIGIN=https://your-domain.com`  
> - `NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api`

---

## Caddyfile (works with stock `caddy:2`)

```caddyfile
:80 {
  @api path /api*
  handle @api {
    reverse_proxy backend:4000
  }

  handle {
    reverse_proxy frontend:3000
  }

  # Stock encoders; the 'single_field' encoder is not available in caddy:2
  log {
    output stdout
    format console
    level INFO
  }
}
```

> When you have a domain, replace `:80` with `your-domain.com` (Caddy will fetch TLS certs).

---

## Dockerfiles (final)

### Backend — `apps/backend/Dockerfile`
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 4000
CMD ["npm","start"]
```

### Frontend — `apps/frontend/Dockerfile`
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:20-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package*.json ./
EXPOSE 3000
CMD ["npm","start"]
```

### Next config — `apps/frontend/next.config.mjs`
```js
/** @type {import('next').NextConfig} */
const nextConfig = {};
export default nextConfig;
```

---

## Deployment

> Server: `185.9.17.217` (SSH port **2292**)

1) **Copy project to server**
```bash
scp -P 2292 -r ./secret-note-app root@185.9.17.217:/apps/
```

2) **Build & run**
```bash
cd /apps/secret-note-app
docker compose build --pull
docker compose up -d
```

3) **Check logs**
```bash
docker compose logs -f backend
docker compose logs -f frontend
docker compose logs -f caddy
```

4) **Open the app**
- UI: `http://185.9.17.217/`
- API (through proxy): `http://185.9.17.217/api`

---

## Database Access

- Shell into Mongo:
  ```bash
  docker exec -it secret-note-app-mongo-1 mongosh mongodb://localhost:27017/secret-notes
  ```

- Handy commands:
  ```js
  show collections
  db.notes.find().limit(5)
  db.notes.countDocuments()
  ```

- Data on host: `/apps/secret-note-data/mongo`

---

## Clipboard (Copy Link) – HTTP-safe fallback

The Clipboard API requires a secure context (HTTPS). We include a fallback so it also works over plain HTTP/IP.

```ts
// apps/frontend/src/app/note-created/page.tsx
"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function NoteCreatedPage() {
  const params = useSearchParams();
  const link = params.get("link") || "";
  const [ok, setOk] = useState(false);

  const copyLink = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      } else {
        const ta = document.createElement("textarea");
        ta.value = link;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setOk(true);
      setTimeout(() => setOk(false), 2000);
    } catch (e) {
      console.error("copy failed", e);
    }
  };

  if (!link) return <p className="text-red-500">Invalid link</p>;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#121212] text-white">
      <div className="max-w-xl w-full border border-white bg-[#1e1e1e] rounded-xl p-6 shadow ring-1 ring-white space-y-4">
        <p className="text-white text-2xl font-bold">🔗 Your note link:</p>
        <a className="underline text-blue-400" href={link} target="_blank" rel="noreferrer">{link}</a>
        <button onClick={copyLink} className="bg-[#bb3e03] hover:bg-[#a13702] px-5 py-2 rounded-md text-sm">Copy Link</button>
        {ok && <div className="mt-2 text-green-400 text-sm">Link Copied</div>}
      </div>
    </div>
  );
}
```

---

## Troubleshooting (what we hit & how we fixed)

1. **`unpigz: zlib version less than 1.2.3` during docker build**  
   Remove host `pigz` so Docker uses its own gzip:
   ```bash
   sudo apt-get purge -y pigz
   sudo systemctl restart docker
   docker builder prune -af
   ```

2. **Next.js build: `module is not defined in ES module scope`**  
   Use ESM config file:
   ```js
   // apps/frontend/next.config.mjs
   export default {};
   ```

3. **Next.js standalone confusion**  
   We serve with `next start` and copy `.next` + `public`. No `standalone/server.js` required.

4. **Backend crash: `Cannot find module 'morgan'`**  
   Add dependency to `apps/backend/package.json` and re‑build:
   ```json
   "dependencies": {
     "morgan": "^1.10.0",
     "...": "..."
   }
   ```
   Ensure `package-lock.json` is updated; then `npm ci` works in Docker.

5. **Caddy error: `caddy.logging.encoders.single_field` not registered**  
   Stock image lacks that encoder. Use:
   ```caddyfile
   log {
     output stdout
     format console
     level INFO
   }
   ```

6. **CORS / Domain**  
   While using IP over HTTP, set:
   - Backend: `CORS_ORIGIN=http://185.9.17.217`
   - Frontend: `NEXT_PUBLIC_API_BASE_URL=http://185.9.17.217/api`

   Once you have a domain + TLS, switch both to `https://your-domain.com`.

---

## Operations

- **Rebuild one service**
  ```bash
  docker compose build frontend && docker compose up -d frontend
  ```
- **Tail logs**
  ```bash
  docker compose logs -f backend
  docker compose logs -f frontend
  docker compose logs -f caddy
  ```
- **Update env & restart**
  ```bash
  docker compose up -d --build
  ```
- **Back up data**
  ```bash
  sudo tar -czf mongo-backup-$(date +%F).tgz /apps/secret-note-data/mongo
  ```

---

## When you add a domain

1. Update envs:
   - `CORS_ORIGIN=https://your-domain.com`
   - `NEXT_PUBLIC_API_BASE_URL=https://your-domain.com/api`

2. Update Caddyfile host:
   ```caddyfile
   your-domain.com {
     @api path /api*
     handle @api { reverse_proxy backend:4000 }
     handle { reverse_proxy frontend:3000 }
     log {
       output stdout
       format console
       level INFO
     }
   }
   ```

3. Rebuild & run:
   ```bash
   docker compose up -d --build
   ```

---

## Security Notes

- Keep `AES_SECRET` long & random (32+ bytes; store base64)
- Restrict SSH to your IPs, non‑default port (currently **2292**), and key‑based auth
- Back up `/apps/secret-note-data/mongo` regularly
- Once you have TLS, consider enabling HSTS and stricter CORS
