# 04 – Data Persistence & Storage API

The backend exposes a lightweight storage service on top of a JSON file. This document walks through how data is structured, which endpoints are available, and how the frontend consumes them.

## Storage File
- Location: `server/data/storage.json`
- Format: top-level object where each property is a storage key.
- Value shape:
  ```json
  {
    "someKey": {
      "value": { /* arbitrary JSON */ },
      "updatedAt": "2025-10-24T14:52:15.321Z"
    }
  }
  ```
- `updatedAt` is set by the server whenever the entry is created or mutated.
- Default keys (arrays) are seeded on boot: `users`, `notifications`, `chatRooms`, `chatMessages`, `userCounters`, `lotteryParticipants`, `lotteryHistory`, `purchaseHistory`.

## Service Logic (`server/services/storageService.js`)
- **Normalization**: Existing primitives are wrapped into `{ value, updatedAt }`.
- **Fallbacks**: Missing keys return `{ value: null, updatedAt: <timestamp> }` unless a default array is defined, in which case an empty array is created and persisted.
- **Bulk operations**: `bulkGet(keys[])` returns a map of `{ key: entry }`, guaranteeing every requested key has a structured response.
- **Deletion**: Removes the key if it exists, otherwise no-op. Always safe to call.

## REST API (`/api/storage/*`)

| Method | Path | Body | Response | Notes |
| ------ | ---- | ---- | -------- | ----- |
| `GET` | `/api/storage/:key` | – | `{ value, updatedAt }` | Never 404s; defaults to empty array or `null`. |
| `PUT` | `/api/storage/:key` | `{ value: any }` | `{ value, updatedAt }` | `updatedAt` refreshed server-side. |
| `DELETE` | `/api/storage/:key` | – | `204 No Content` | Idempotent. |
| `POST` | `/api/storage/bulk` | `{ keys: string[] }` | `{ [key]: { value, updatedAt } }` | Missing keys filled with defaults. |

All routes live in `server/routes/storageRoutes.js` and are handled by `storageController.js`.

## Client Consumption (`api/apiClient.ts`)
- `getStorageValue(key, defaultValue)` – unwraps the server response and falls back to the provided default when the stored `value` is `null` or `undefined`.
- `setStorageValue(key, value)` – POST-style wrapper via `PUT`.
- `deleteStorageValue(key)` – removes the key.
- `bulkGetStorageValues(keys)` – mirrors the backend bulk endpoint.
- `pingApi()` – simple `/api/test` call, used for connection status.

Fetch requests include `credentials: 'include'` and JSON headers by default.

## Key Naming Conventions
- Global collections: `users`, `chatRooms`, `chatMessages`, etc.
- Per-user collections: `points_<userId>`, `notifications_<userId>`, `purchaseHistory_<userId>`, etc.
- Ad-hoc keys created by features follow the pattern defined in `App.tsx` (`userDataKey` / `globalDataKey` helpers).

## Persistence Guarantees
- Writes are queued to avoid race conditions (`writeQueue` Promise chain).
- Storage is cached in memory to minimize disk reads.
- Restarting the server keeps previous data; the service migrates existing items into the normalized shape on load.

## Maintaining the Store
- Back up `storage.json` before resetting environments.
- To clear everything, stop the server, delete the file, then restart. Defaults will be regenerated.
- To inspect current state, open the JSON file while the backend is stopped or use the REST API for read-only access.

With this setup, the frontend behaves much like a single-page app backed by a database, while the underlying implementation stays simple and file-based.
