import React from 'react';
import { ChatRoom } from '../types';
import { ArrowRightIcon, UsersIcon, LockIcon, CoinIcon, DiamondIcon, ChatIcon } from './icons';

interface ChatProps {
    rooms: ChatRoom[];
    onBack: () => void;
    onOpenCreateRoom: () => void;
    onJoinRoom: (roomId: string) => void;
}

const Chat: React.FC<ChatProps> = ({ rooms, onBack, onOpenCreateRoom, onJoinRoom }) => {

    const handleJoinClick = (room: ChatRoom) => {
        onJoinRoom(room.id);
    };

    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8 text-white">
                {/* Header */}
                <header className="flex items-center justify-between py-2 mb-4 text-white">
                    <button onClick={onBack} className="p-2" aria-label="عودة">
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                    <h1 className="text-2xl font-bold">غرف الدردشة</h1>
                    <button onClick={onOpenCreateRoom} className="p-2" aria-label="إنشاء غرفة جديدة">
                        <ChatIcon className="w-7 h-7" />
                    </button>
                </header>

                {/* Server Info */}
                <div className="bg-black/40 border border-gray-700/50 rounded-xl shadow-lg p-3 backdrop-blur-sm mb-6 flex justify-around text-center">
                    <div>
                        <p className="font-bold text-xl text-[#FFC107]">{rooms.length.toLocaleString('de-DE')}</p>
                        <p className="text-xs text-[#BEBEBE]">إجمالي الغرف</p>
                    </div>
                    <div>
                        <p className="font-bold text-xl text-[#FFC107]">{rooms.reduce((acc, room) => acc + (room.members?.length || 0), 0).toLocaleString('de-DE')}</p>
                        <p className="text-xs text-[#BEBEBE]">إجمالي المستخدمين</p>
                    </div>
                </div>

                {/* Rooms List */}
                <div className="flex-grow">
                    {rooms.length > 0 ? (
                        <ul className="space-y-3">
                            {rooms.map((room, index) => (
                                <li 
                                    key={room.id} 
                                    className={`bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg p-3 backdrop-blur-sm flex items-center gap-4 transition-colors hover:bg-black/60 ${index % 2 === 0 ? 'bg-opacity-40' : 'bg-opacity-50'}`}
                                >
                                    <div className="w-16 h-16 rounded-xl bg-black/30 flex-shrink-0 flex items-center justify-center">
                                        {room.icon ? (
                                            <img src={room.icon} alt={room.name} className="w-full h-full object-cover rounded-xl" />
                                        ) : (
                                            <ChatIcon className="w-8 h-8 text-[#FFC107]" />
                                        )}
                                    </div>
                                    <div className="flex-grow text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {room.type === 'private' && <LockIcon className="w-4 h-4 text-red-400" />}
                                            <p className="font-bold text-lg">{room.name}</p>
                                        </div>
                                        <div className="flex items-center justify-end gap-3 text-xs text-white/80 mt-1">
                                            <div className="flex items-center gap-1">
                                                <span>{(room.members || []).length.toLocaleString('de-DE')}</span>
                                                <UsersIcon className="w-4 h-4" />
                                            </div>
                                            <span>•</span>
                                            <p>ID: {room.id}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-center justify-center gap-1">
                                        <button 
                                            onClick={() => handleJoinClick(room)}
                                            className="bg-[#FFC107] text-slate-900 font-bold py-1.5 px-5 rounded-lg text-sm hover:bg-[#ffca28] transition-colors"
                                        >
                                            دخول
                                        </button>
                                        {room.type === 'private' && room.entryFee && (
                                            <div className="flex items-center gap-1 text-xs font-semibold">
                                                {room.feeCurrency === 'points' ? <CoinIcon className="w-3 h-3 text-[#FFC107]" /> : <DiamondIcon className="w-3 h-3 text-cyan-400" />}
                                                <span>{room.entryFee.toLocaleString('de-DE')}</span>
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[#BEBEBE] pt-16 text-center">
                            <ChatIcon className="w-20 h-20 mb-4 opacity-50" />
                            <p className="text-lg font-semibold">لا توجد غرف متاحة حالياً.</p>
                            <p className="text-sm mt-2">كن أول من ينشئ غرفة جديدة!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Chat;