
export interface Counter {
  id: number;
  name: string;
  points?: number;
  jewels?: number;
  price: number;
  priceCurrency: 'points' | 'jewels';
}

export interface Notification {
  id: string;
  message: string;
  timestamp: number;
  read: boolean;
  category: 'counter' | 'transactions' | 'games' | 'chat' | 'general';
}

export interface User {
  userId: string;
  name: string;
  email?: string;
  phone?: string;
  hashedPassword?: string; // Stored hashed, not plaintext
  isVerified?: boolean;
  nameChangeCount?: number;
  profilePictureChangeCount?: number;
  profileBannerChangeCount?: number;
}

export interface ChatRoom {
  id: string;
  name: string;
  type: 'public' | 'private';
  icon: string | null;
  members: string[];
  entryFee?: number;
  feeCurrency?: 'points' | 'jewels';
  creatorId: string;
}

export interface ChatMessage {
    id: string;
    roomId: string;
    senderId: string;
    senderName: string;
    text: string;
    timestamp: number;
    type: 'message' | 'notification';
}

export interface LotteryResult {
  winnerId: string;
  winnerName: string;
  prizeName: string;
  pot: number;
  timestamp: number;
}

export interface Transaction {
  id: string;
  type: 'purchase_counter' | 'purchase_points' | 'purchase_jewels' | 'gift_counter' | 'send_points' | 'withdraw_points' | 'convert_points_jewels' | 'lottery_win' | 'lottery_join';
  description: string;
  amount: number;
  currency: 'points' | 'jewels' | 'dollars' | 'ticket';
  timestamp: number;
  isDebit: boolean; // true if it's a cost/debit, false if it's a gain/credit
}
