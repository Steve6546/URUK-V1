# 02 – Frontend Stack

This guide captures how the Vite + React app is composed, and which libraries and patterns power each feature.

## Core Technologies
- **Vite 6** – development server and bundler with fast HMR.
- **React 19** – UI library (function components + hooks everywhere).
- **TypeScript 5.8** – type safety for components, hooks, and API helpers.
- **Tailwind-inspired utility classes** – styles are written inline as utility class strings (no external CSS framework required).

## Application Entry
- `index.tsx` bootstraps the React application.
- `App.tsx` contains the entire app shell, including routing-like conditional rendering, feature panels, toast notifications, and the connection badge.

## Data Access Layer
`api/apiClient.ts` centralizes HTTP interactions:
- Automatically prefixes requests with `VITE_API_BASE_URL` (falls back to `http://localhost:3001/api`).
- Adds JSON headers and `credentials: 'include'`.
- Normalizes storage responses (accepts `{ value, updatedAt }` or fallbacks).
- Exposes helper functions: `getStorageValue`, `setStorageValue`, `deleteStorageValue`, `bulkGetStorageValues`, and `pingApi`.

## Hooks
- **`useLocalStorage`** (custom) – Provides a React stateful value tied to a storage key. Reads from the backend on mount, persists on change, and offers a `clearValue` helper.
- Uses `useEffect`, `useCallback`, and `AbortSignal` support by virtue of fetch.

## Component Highlights
- **Header** – Displays balances, notification badge, menu toggle, and the new connectivity status (`Connected ✅` / `Disconnected ❌`).
- **Auth** – Handles signup/login with SHA-256 hashing using the Web Crypto API.
- **Chat, Store, Counters** – Each module lives in its own file under `components/` and reads/writes data via the hooks.
- **NotificationsPanel** – Modal overlay for viewing stored notifications.
- **CreateRoomModal, RoomView** – Manage chat rooms and messages.

## State & Routing Pattern
The app runs as a single page with conditional UI:
- Booleans like `showChat`, `showStore`, etc. determine which component tree to render.
- All feature toggles sit in `App.tsx`, making it simple to follow the UI flow.
- Derived state (e.g. unread counts, transaction logs) is computed locally but persisted through the storage API.

## Build & Deployment
- `npm run dev` – local development with Vite.
- `npm run build` – production build; artifacts land in `dist/`.
- `npm run preview` – serve a production build locally.
- Deployment on Vercel uses the build output; ensure `VITE_API_BASE_URL` points to the active tunnel or backend host.

## Testing Tips
- Watch the header badge—it's a quick signal that the backend is reachable.
- Inspect `server/data/storage.json` to confirm the frontend called the persistence API correctly.
- Use browser dev tools to monitor `fetch` calls to the tunnel host while running the deployed frontend.

The frontend stack is intentionally lightweight: hooks orchestrate state, components render sections, and the API client manages all remote persistence.
