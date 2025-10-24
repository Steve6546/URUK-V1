# 07 – Chat System

The chat experience is fully backed by the storage API so that rooms, membership, and messages survive refreshes. This document covers architecture, data shapes, and workflows.

## Data Model
- **Rooms (`chatRooms`)**
  ```json
  {
    "id": "room-1",
    "name": "Lobby",
    "type": "public",
    "icon": null,
    "members": ["10001", "10002"],
    "entryFee": 0,
    "feeCurrency": "points",
    "creatorId": "10001"
  }
  ```
- **Messages (`chatMessages`)**
  ```json
  {
    "room-1": [
      {
        "id": "msg-123",
        "roomId": "room-1",
        "senderId": "10001",
        "senderName": "Moody",
        "text": "Hello!",
        "timestamp": 1761318000000,
        "type": "message"
      }
    ]
  }
  ```
- System notifications inside rooms use `type: 'notification'`.

## Components
- `Chat.tsx` – room list, join actions, and top-level layout.
- `CreateRoomModal.tsx` – collects room metadata and writes to `chatRooms`.
- `RoomView.tsx` – renders message history and input controls.

## Joining a Room
1. `handleJoinRoom` checks room membership and entry fees.
2. Balances are debited if needed (`points_<userId>` or `jewels_<userId>`).
3. The room's `members` array is updated to include the user.
4. A `ChatMessage` with `type: 'notification'` announces the join event.
5. `notifications_<userId>` receives a summary message.

## Leaving a Room
1. `handleLeaveRoom` removes the user ID from `members`.
2. Adds a system message marking the departure.
3. Active room state is cleared so the UI returns to the room list.

## Sending Messages
1. Messages are pushed to `chatMessages[roomId]`.
2. The storage hook persists automatically once the state updates.
3. Room view scrolls to the newest message using refs.

## Creating Rooms
1. Creator defines name, type (public/private), optional icon, and entry fee.
2. Room is appended to `chatRooms`.
3. Creator is added to the `members` list by default.

## Notifications
- Joins/leaves produce user notifications (`notifications_<userId>`).
- Additional push notifications could be added by watching `chatMessages` changes.

## Persistence Guarantees
- Because storage normalizes responses, the UI never crashes on empty data.
- Bulk fetches (`bulkGetStorageValues`) can load rooms and messages together if needed.

## Future Enhancements
- Real-time updates via WebSockets (current version requires manual refresh or poll).
- Moderation tools (kick, ban) can extend the room schema.
- Attachments could be stored by expanding the message payload.

At present the chat is functionally complete for asynchronous collaboration: data is shared via the backend storage file and accessible through the Cloudflare tunnel to remote clients.
