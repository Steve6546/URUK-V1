# 09 – Backend Integration & Deployment

This document details how the Express backend operates, how the Cloudflare tunnel connects the stack, and the steps required to deploy via Vercel.

## Server Overview
- Entry point: `server/index.js`
- Stack: Express 5, `cors`, `dotenv`, `morgan`
- Port: `process.env.PORT` or `3001`
- Routes mounted under `/api`

### Middleware
1. **CORS** – Custom matcher supporting wildcard origins (`https://*.trycloudflare.com`, `https://*.cfargotunnel.com`, Vercel domains, localhost).
2. **JSON body parser** with `5mb` limit.
3. **morgan** logger in `dev` mode.
4. **Error handler** (`middleware/errorHandler.js`) returning JSON `{ error: message }`.

### Routes
- `/api/test` – simple health check returning `{ status: 'ok', message, timestamp }`.
- `/api/storage` – CRUD + bulk endpoints delegating to the storage service.

### Storage Service
- Normalizes entries to `{ value, updatedAt }`.
- Seed defaults for commonly used arrays.
- Queues file writes to avoid conflicts.
- Lives in `server/services/storageService.js`.

## Environment Configuration
Create `server/.env` from `.env.example`:
```
PORT=3001
CORS_ALLOWED_ORIGINS=https://*.trycloudflare.com,https://your-vercel-app.vercel.app,http://localhost:5173
```
You can append additional origins (comma-separated). Wildcards are supported.

Root `.env` (consumed by Vite):
```
VITE_API_BASE_URL=http://localhost:3001/api
GEMINI_API_KEY=<optional>
```
Vercel overrides `VITE_API_BASE_URL` with the tunnel URL.

## Cloudflare Tunnel
Launch manually or via script:
```powershell
cloudflared tunnel --url http://localhost:3001 --logfile cloudflared.log --no-autoupdate
```
The log prints the public hostname, e.g. `https://graham-printed-dreams-swimming.trycloudflare.com`.

### Scripted Start
```powershell
pwsh scripts/start-services.ps1
```
- Starts the backend (`node index.js` or `npm run dev` with `-UseNpmDev`).
- Launches `cloudflared` with the flags above.
- Saves PIDs in `scripts/runtime-pids.json`.

Stop everything with:
```powershell
pwsh scripts/stop-services.ps1
```

## Connecting Vercel
1. Run the backend locally.
2. Start the tunnel and capture the hostname.
3. On Vercel, set:
   - `VITE_API_BASE_URL=https://<cloudflared-host>/api`
4. Redeploy the Vercel project.
5. Open the Vercel site; the header badge should show `Connected ✅`.

Repeat steps 2–5 whenever you restart the tunnel (hostnames change for quick tunnels). For production, create a named tunnel or host the backend permanently.

## Smoke Tests (after Integration)
1. `curl https://<tunnel>/api/test` – confirm 200 health response.
2. `PUT https://<tunnel>/api/storage/testKey` with `{ "value": { "foo": "bar" } }` – expect `{ value: { "foo": "bar" }, updatedAt: ... }`.
3. Open the Vercel site:
   - Sign up or log in.
   - Create/join a chat room and send a message.
   - Send points or purchase a counter.
4. Inspect `server/data/storage.json` to verify mutations.

## Troubleshooting
| Symptom | Fix |
| ------- | ---- |
| CORS error from Vercel | Ensure `CORS_ALLOWED_ORIGINS` contains the Vercel domain and the tunnel host. Restart the backend after editing `.env`. |
| Tunnel 502 | Check if the backend process is running (`netstat` on port 3001). Restart via `scripts/start-services.ps1`. |
| Frontend shows `Disconnected ❌` | Confirm `/api/test` works locally; verify the tunnel log for reconnection attempts. |
| Storage resets unexpectedly | Avoid deleting `storage.json` while backend is running; stop the process first. |

## Deployment Roadmap
- **Short term**: Continue using quick tunnels for QA and demos.
- **Long term**: Create a Cloudflare named tunnel or deploy Express to a hosted environment (Render, Fly.io, etc.). Update Vercel env to the permanent backend URL.

With this integration in place, the frontend, backend, and tunnel operate as a single system that can be shared with remote stakeholders or teammates.
