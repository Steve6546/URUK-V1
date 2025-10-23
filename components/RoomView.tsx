import React, { useState, useEffect, useRef } from 'react';
import { ChatRoom, User, ChatMessage } from '../types';
import { ArrowRightIcon, ChatIcon, SendIcon } from './icons';

interface RoomViewProps {
    room: ChatRoom;
    onBack: () => void;
    currentUser: User;
    messages: ChatMessage[];
    onSendMessage: (roomId: string, text: string) => void;
}

const RoomView: React.FC<RoomViewProps> = ({ room, onBack, currentUser, messages, onSendMessage }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(room.id, newMessage.trim());
            setNewMessage('');
        }
    };
    
    const formatMessageTime = (timestamp: number): string => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit', hour12: true });
    };

    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast flex flex-col" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-0 flex-grow flex flex-col p-4 text-white">
                {/* Header */}
                <header className="flex-shrink-0 flex items-center justify-between py-2 mb-4 text-white bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg px-4 backdrop-blur-sm">
                    <button onClick={onBack} className="p-2" aria-label="عودة">
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                    <div className="flex flex-col items-center text-center">
                         <h1 className="text-xl font-bold">{room.name}</h1>
                         <p className="text-xs font-medium text-[#BEBEBE]">ID: {room.id}</p>
                    </div>
                     <div className="w-12 h-12 rounded-lg bg-black/30 flex-shrink-0 flex items-center justify-center p-1">
                        {room.icon ? (
                            <img src={room.icon} alt={room.name} className="w-full h-full object-cover rounded-md" />
                        ) : (
                            <ChatIcon className="w-6 h-6 text-[#FFC107]" />
                        )}
                    </div>
                </header>

                {/* Chat Area */}
                <main className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4">
                    {messages.map(msg => {
                        if (msg.type === 'notification') {
                            return (
                                <div key={msg.id} className="text-center text-xs text-[#BEBEBE] my-2">
                                    <span className="bg-black/20 rounded-full px-3 py-1">{msg.text}</span>
                                </div>
                            );
                        }
                        
                        const isCurrentUser = msg.senderId === currentUser.userId;
                        return (
                             <div key={msg.id} className={`flex items-end gap-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-xs md:max-w-md p-3 rounded-2xl ${isCurrentUser ? 'bg-[#A37C00] text-white rounded-br-none' : 'bg-black/40 text-[#BEBEBE] rounded-bl-none'}`}>
                                    {!isCurrentUser && (
                                        <p className="font-bold text-[#FFC107] text-sm mb-1">{msg.senderName}</p>
                                    )}
                                    <p className="text-base whitespace-pre-wrap break-words">{msg.text}</p>
                                    <p className={`text-xs mt-1.5 opacity-70 text-white ${isCurrentUser ? 'text-left' : 'text-right'}`}>
                                        {formatMessageTime(msg.timestamp)}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                     <div ref={messagesEndRef} />
                </main>
                
                {/* Input Form */}
                <footer className="flex-shrink-0">
                    <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="اكتب رسالتك..."
                            className="flex-grow bg-black/40 border border-gray-700/50 rounded-full py-3 px-5 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] backdrop-blur-sm"
                        />
                        <button
                            type="submit"
                            className="w-12 h-12 flex-shrink-0 bg-[#FFC107] rounded-full flex items-center justify-center text-slate-900 hover:bg-[#ffca28] transition-colors disabled:bg-[#FFC107]/50 disabled:cursor-not-allowed"
                            disabled={!newMessage.trim()}
                            aria-label="إرسال"
                        >
                            <SendIcon className="w-5 h-5" />
                        </button>
                    </form>
                </footer>
            </div>
        </div>
    );
};

export default RoomView;