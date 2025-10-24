# 03 – State Management Strategy

URUK relies on React hooks and a single persistence abstraction to keep the frontend and backend in sync. This document spells out how state flows across the app.

## Guiding Principles
1. **Single source of truth** – All user-facing data ultimately lives in the backend storage JSON file.
2. **Local-first UX** – Changes appear immediately in the UI, then sync to the backend in the background.
3. **Fault tolerance** – Missing keys or transient network issues should not crash the UI. Default values keep components stable.

## Core Hook: `useLocalStorage`

Located at `hooks/useLocalStorage.ts`, this hook wraps a React state value with three behaviours:
1. **Initial load** – On mount it calls `getStorageValue(key, defaultValue)` from `apiClient`. If the backend returns `404` or `null`, the default is used and persisted.
2. **Optimistic updates** – Updates the React state immediately, then sends `setStorageValue` asynchronously.
3. **Reset** – The `clearValue` callback removes the key via `deleteStorageValue` and resets the local state to its default.

The hook keeps track of `isLoaded` to avoid double-saving during the initial fetch.

## Namespacing Keys
`App.tsx` defines two helpers:
- `userDataKey(key)` – prefixes keys with the current `userId` (e.g. `points_12345`), isolating per-user data.
- `globalDataKey(key)` – returns raw keys for shared resources like `chatRooms`.

This pattern ensures features such as counters, notifications, and purchase history do not bleed across accounts.

## React State Usage
- Top-level booleans (e.g. `showChat`, `showStore`) control the visible section.
- Derived values such as `unreadCount` are computed from persisted arrays (notifications) each render.
- `useRef` is used for timers (connection toast), active DOM references, and storing the latest keys.

## Handling Connectivity
`App.tsx` polls `pingApi` every seven seconds:
- Updates `isConnected` state.
- Triggers a toast message when connectivity changes.
- Guards against stale intervals by clearing timers on unmount.

Components that depend on critical data can watch `isConnected` to disable actions when the backend is offline.

## Storage Shapes
- Every stored key resolves to `{ value, updatedAt }`.
- Default arrays exist for keys like `users`, `chatRooms`, `chatMessages`, `notifications`, `lottery*`, `userCounters`, and `purchaseHistory`.
- Custom keys (e.g. `profileName_<userId>`) are created on demand.

## Error Handling
- Failures inside `useLocalStorage` are logged to the console but do not break rendering.
- The API client throws a typed `HttpError`, giving access to the HTTP status for finer-grained handling if needed.

This setup keeps code simple: components only import the hook and interact with plain React state, while the hook abstracts away the backend calls and persistence format.
