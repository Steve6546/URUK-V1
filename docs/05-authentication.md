# 05 – Authentication & Account Data

The authentication flow is fully client-driven but persists user records through the backend storage API. This document explains the mechanics and data shapes involved.

## User Model
Stored under the `users` key as an array of objects shaped like:
```json
{
  "userId": "10001",
  "name": "Test User",
  "email": "user@example.com",
  "phone": "+9647000000000",
  "hashedPassword": "e3b0c442... (SHA-256)",
  "isVerified": false,
  "nameChangeCount": 0,
  "profilePictureChangeCount": 0,
  "profileBannerChangeCount": 0
}
```
`userId` is generated client-side as a zero-padded numeric string and guaranteed unique.

## Signup Flow (`components/Auth.tsx`)
1. User chooses email or phone authentication.
2. Required fields validated locally.
3. Password hashed with `crypto.subtle.digest('SHA-256', ...)`.
4. New user object assembled and appended to the `users` collection via `useLocalStorage`.
5. User is logged in immediately (`currentUser` state persists the entire object).

## Login Flow
1. User selects email or phone.
2. Matching user is retrieved from the persisted `users` array.
3. Submitted password hashed and compared with the stored `hashedPassword`.
4. On success, `currentUser` is set and per-user keys (points, notifications, etc.) become active via `userDataKey`.

## Session Handling
- Session is purely client-based; `currentUser` is stored via `useLocalStorage`.
- Logging out clears `currentUser` and resets derived state.
- Future enhancements (server-side sessions) can hook into the same storage keys or swap out the persistence service.

## Verification & Profile Updates
- Users can toggle verification workflows in `AccountVerification.tsx`.
- Name, profile picture, and banner modifications track their counts (enforcing free change limits).
- These preferences are stored under keys like `profileName_<userId>` or `profilePicture_<userId>`.

## Security Considerations
- Passwords are hashed but not salted. For production use, add salt and migrate to server-side verification.
- Because storage.json sits on disk, treat it as sensitive. Restrict access or move to encrypted storage when deploying permanently.
- `credentials: 'include'` is enabled for future session cookie support; currently there is no cookie-based auth.

## Resetting Accounts
- Use the storage API to delete user-specific keys (`DELETE /api/storage/users`, `DELETE /api/storage/currentUser`, etc.).
- Alternatively, manually edit `storage.json` while the server is stopped.

By leaning on the storage API and the shared hook, the authentication system stays simple yet fully synchronized across devices accessing the same backend.
