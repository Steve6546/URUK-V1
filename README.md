# URUK Platform

URUK is now a fully wired system that pairs a Vite + React frontend with a live Express backend. The backend runs locally on port `3001` and is exposed to the internet through a Cloudflare Tunnel so the Vercel-hosted UI can talk to it in real time. All features—authentication, counters, notifications, chat, lottery, and purchase history—read and write via the shared REST storage API.

## How Everything Fits Together
- **Frontend**: Vite + React (TypeScript) app in the project root. It communicates with the backend through `api/apiClient.ts`, which is configured by `VITE_API_BASE_URL`.
- **Backend**: Express server in `server/`. It stores state inside `server/data/storage.json`, returning entries shaped as `{ value, updatedAt }` for every key.
- **Tunnel**: Cloudflare quick tunnel forwards `https://*.trycloudflare.com` to `http://localhost:3001`. Update the Vercel environment variable whenever the tunnel host changes.
- **Scripts**: PowerShell helpers in `scripts/` start and stop both the backend and tunnel while capturing logs and PID metadata.

## Quick Start (Local)
1. Install dependencies in both workspaces:
   ```bash
   npm install           # root (frontend)
   cd server && npm install
   ```
2. Copy environment templates and adjust as needed:
   ```bash
   cp .env.example .env
   cd server && cp .env.example .env
   ```
3. Launch services (recommended):
   ```powershell
   pwsh scripts/start-services.ps1
   ```
   The script starts `node index.js` and `cloudflared`, writing logs to `server-stdout.log`, `server-stderr.log`, and `cloudflared.log`.
4. Start the Vite dev server in another terminal:
   ```bash
   npm run dev
   ```
5. Visit `http://localhost:5173`. The connection badge in the header should show `Connected ✅` when the tunnel and backend are reachable.

### Manual start commands
```powershell
pwsh scripts/start-services.ps1 -UseNpmDev   # start backend with nodemon
pwsh scripts/stop-services.ps1               # stops backend & cloudflared
```

## Deploying with Vercel + Cloudflare Tunnel
1. Start the backend locally (use the script above or `npm run dev` inside `server/`).
2. Run the tunnel:
   ```powershell
   cloudflared tunnel --url http://localhost:3001 --logfile cloudflared.log --no-autoupdate
   ```
   Note the generated hostname, e.g. `https://graham-printed-dreams-swimming.trycloudflare.com`.
3. On Vercel, set `VITE_API_BASE_URL=https://<tunnel-host>/api` and redeploy. Repeat whenever the tunnel host changes.
4. The frontend uses `fetch` with credentials enabled, so keep the tunnel alive for as long as Vercel should reach your backend.

## Environment Variables
### Root `.env`
| Variable | Description |
| -------- | ----------- |
| `VITE_API_BASE_URL` | Base URL for the storage API. Defaults to `http://localhost:3001/api` when not set. |
| `GEMINI_API_KEY` | Example placeholder exposed via `vite.config.ts` (optional). |

### `server/.env`
| Variable | Description |
| -------- | ----------- |
| `PORT` | Backend port (defaults to `3001`). |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed origins; supports wildcards like `https://*.trycloudflare.com`. |

## API Surface
All endpoints are prefixed with `/api`:

| Method | Path | Description |
| ------ | ---- | ----------- |
| `GET` | `/api/test` | Health check used by the frontend connection badge. |
| `GET` | `/api/storage/:key` | Returns `{ value, updatedAt }` for the given key. |
| `PUT` | `/api/storage/:key` | Upserts `{ value, updatedAt }` (server adds/updates `updatedAt`). |
| `DELETE` | `/api/storage/:key` | Removes a key. Returns `204` even if the key was missing. |
| `POST` | `/api/storage/bulk` | Accepts `{ keys: string[] }` and returns an object of entries. |

The storage file `server/data/storage.json` mirrors this shape. Default array keys (users, notifications, chat rooms, chat messages, counters, lottery data, purchase history) are created on first load to avoid 404s.

## Feature Highlights
- **Authentication**: Email or phone signup/login with SHA-256 hashing before storage.
- **User data**: Each user gets dedicated keys (e.g. `points_<userId>`). The `useLocalStorage` hook synchronizes with the backend transparently.
- **Counters & Stores**: Purchasing counters, points, or jewels logs transactions and sends notifications.
- **Send Points / Gift Counter**: Reads current balances, applies business rules, persists outcomes.
- **Notifications**: Stored per user, surfaced via real-time badge and panel.
- **Chat**: Global rooms and message logs stored under `chatRooms` and `chatMessages`; join/leave events raise notifications.
- **Lottery**: Pot, participants, history, and rewards persisted in storage.
- **Connectivity UX**: Header badge plus toast messages reflect tunnel availability using the `/api/test` ping.

## Development Tooling
- **Vite 6 + React 19 + TypeScript 5.8** for the SPA.
- **Tailwind-inspired utility classes** baked into component styles.
- **Express 5** backend with `cors`, `dotenv`, `morgan`.
- **Cloudflare Tunnel** for secure, temporary public access.
- **PowerShell scripts** (`scripts/start-services.ps1`, `scripts/stop-services.ps1`) to manage long-running processes on Windows.
- **npm scripts**: `npm run dev`, `npm run build`, `npm run preview` (frontend) and `npm run dev`, `npm start` (server).

## Logs and Diagnostics
- `server-stdout.log` / `server-stderr.log`: backend output redirected by the start script.
- `cloudflared.log`: tunnel logs, including the generated hostname.
- `server/data/storage.json`: inspect to confirm persistence after smoke tests.

## Smoke Test Checklist
1. Visit the deployed Vercel site while the tunnel is active.
2. Sign up a user, log in, and confirm user data appears in storage.
3. Open a chat room and send a message; verify `chatMessages` updates.
4. Trigger counters or send points and watch the corresponding notifications and transaction history update.
5. Check the connection badge and toast behavior by stopping/starting the backend.

URUK is now production-ready once you convert the temporary Cloudflare tunnel into a named tunnel or deploy the backend to a permanent host.
