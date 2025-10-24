# 08 – How to Contribute

This guide outlines the workflow for contributing changes now that URUK ships with a full backend and tunnel setup.

## Prerequisites
- Node.js 22 (or newer) installed system-wide.
- npm (bundled with Node.js).
- PowerShell 7+ for running the helper scripts on Windows.
- Cloudflare Tunnel binary (`cloudflared`) available on your PATH.

## Development Workflow
1. **Fork / clone** the repository.
2. **Install dependencies**:
   ```bash
   npm install
   cd server && npm install
   ```
3. **Create a feature branch**:
   ```bash
   git checkout -b feature/<short-description>
   ```
4. **Start services** (choose one):
   - `pwsh scripts/start-services.ps1` (recommended).
   - or manually: `cd server && npm run dev`, plus `cloudflared tunnel --url http://localhost:3001`.
5. **Run the frontend**: `npm run dev`.
6. **Implement changes** with TypeScript and Express best practices.
7. **Run smoke tests** using the checklist in the README.
8. **Commit** with descriptive messages and open a pull request.

## Coding Standards
- Use existing hooks and API helpers instead of writing ad-hoc fetch calls.
- Keep components functional and prefer hooks (`useState`, `useEffect`, `useCallback`).
- Keep documentation (`docs/`) in sync with behaviour changes.
- Use ASCII characters in commits and documentation to avoid encoding issues.
- If you touch the storage service, back up `storage.json` first.

## Testing Expectations
- No automated tests yet; rely on manual smoke tests (login, chat, send points, etc.).
- Verify `storage.json` reflects your changes.
- Check `cloudflared.log` and `server-stdout.log` for errors.
- Ensure the connection badge displays correctly after backend changes.

## Updating Documentation
- Update `README.md` for high-level changes.
- Modify specific docs (`02-frontend-stack`, `04-data-persistence`, etc.) when altering corresponding areas.
- Maintain clarity and remove obsolete information.

## Deployment Checks
- Confirm the tunnel hostname and Vercel `VITE_API_BASE_URL` are aligned.
- Re-run `npm run build` to ensure there are no type or bundling errors.

## Scripts
- `scripts/start-services.ps1` and `scripts/stop-services.ps1` should remain idempotent. Update them when you add new background services.

## Pull Request Checklist
- [ ] Code compiles via `npm run build`.
- [ ] Storage writes and reads succeed.
- [ ] Documentation updates included.
- [ ] Tunnel hostname noted if relevant.
- [ ] No console errors or CORS issues observed.

Following this process keeps the repository healthy and makes onboarding new contributors easier as the platform evolves.
