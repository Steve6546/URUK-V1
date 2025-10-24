# 06 – Core Features Overview

URUK combines several subsystems that previously lived only in local state. With the backend included, every feature now persists across sessions and users. This document summarises each area and the storage keys it uses.

## Balances & Counters
- **Dollars / Points / Jewels**: Stored per user as `dollars_<userId>`, `points_<userId>`, `jewels_<userId>`.
- **Counters owned**: `userCounters_<userId>` stores purchased counters.
- **Main counter activation**: `activationStartTime_<userId>` tracks cooldowns, and rewards are added to points/jewels automatically.
- Purchasing a counter or package logs a transaction (see below) and pushes a notification.

## Stores
- **CounterStore**, **PackagesStore**, **JewelsStore** – let users buy new counters or currency packages.
- Each purchase calls `setPurchaseHistory`, `setNotifications`, updates balances, and logs the action via `logTransaction`.

## Points Transfer & Gifts
- **SendPoints**: Sends points between users.
  - Deducts from sender (`points_<sender>`), credits receiver (`points_<receiver>`).
  - Injects notifications for both parties (`notifications_<id>`).
  - Adds transaction entries for auditing (`purchaseHistory_<id>`).
- **GiftCounter**: Transfers counters between users with similar persistence logic.

## Lottery
- `lotteryParticipants` – global array of user IDs.
- `lotteryPot` – numeric value storing the total pot.
- `lotteryPrize*` keys – name, description, image of the current prize.
- `lotteryHistory` – array of past `LotteryResult` objects whenever a draw completes.

## Chat
- `chatRooms` – array of room objects (`id`, `name`, `type`, `members`, etc.).
- `chatMessages` – dictionary keyed by room ID mapping to arrays of messages.
- Joining/leaving rooms emits notifications and updates `members`.

## Notifications
- Global notifications feed per user: `notifications_<userId>` array.
- Each entry includes `message`, `timestamp`, `category`, and `read` flag.
- The header badge counts unread items; viewing the panel can mark them as read (depending on UX requirements).

## Transactions & History
- `purchaseHistory_<userId>` – tracks every purchase, gift, conversion, or lottery event.
- Each record includes `type`, `description`, `amount`, `currency`, `timestamp`, and `isDebit`.
- Used by `PurchaseHistory.tsx` to render a timeline.

## Account Profile
- `profileName_<userId>`, `profileEmail_<userId>`, `profilePhone_<userId>`.
- `profilePicture_<userId>` and `profileBanner_<userId>` for media URLs.
- Change counters enforce cost after exceeding free edits.

## Notifications & Connection UX
- Header includes `Connected ✅ / Disconnected ❌` badge based on `/api/test`.
- Toasts surface whenever connectivity flips, ensuring users know when actions may fail.

## Error Tolerance
- The storage service guarantees each key returns `{ value, updatedAt }`, avoiding crashes from `404` responses.
- Hooks log failures to the console but keep rendering stable; repeated retries happen as long as the backend is reachable.

Understanding which keys power each feature makes debugging easy—watch the REST calls or inspect `storage.json` while interacting with the relevant screen.
