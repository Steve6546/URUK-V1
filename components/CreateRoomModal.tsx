
import React, { useState, useRef } from 'react';
import { ChatRoom } from '../types';
import { XIcon, UploadIcon, CoinIcon, UserIcon, ChatIcon } from './icons';

interface CreateRoomModalProps {
    onClose: () => void;
    // Fix: Omit 'members' instead of the non-existent 'memberCount' to match the ChatRoom type and align with how `handleCreateRoom` in App.tsx is implemented.
    onCreate: (roomDetails: Omit<ChatRoom, 'id' | 'members' | 'creatorId'>) => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({ onClose, onCreate }) => {
    const [name, setName] = useState('');
    const [type, setType] = useState<'public' | 'private'>('public');
    const [icon, setIcon] = useState<string | null>(null);
    const [fee, setFee] = useState('');
    const [feeCurrency] = useState<'points' | 'jewels'>('points');
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleIconChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setIcon(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTypeChange = (newType: 'public' | 'private') => {
        setType(newType);
    };

    const handleSubmit = () => {
        setError('');
        if (!name.trim()) {
            setError('يجب إدخال اسم للغرفة.');
            return;
        }
        if (type === 'private' && (!fee || Number(fee) <= 0)) {
            setError('يجب تحديد سعر دخول صالح للغرف الخاصة.');
            return;
        }
        if (fee && Number(fee) <= 0) {
            setError('سعر الدخول يجب أن يكون أكبر من صفر.');
            return;
        }

        // Fix: The 'members' property was incorrectly included in the roomDetails object.
        // The type `Omit<ChatRoom, 'id' | 'members' | 'creatorId'>` explicitly excludes 'members'.
        // The parent component (`App.tsx`) is responsible for setting the initial members.
        const roomDetails: Omit<ChatRoom, 'id' | 'members' | 'creatorId'> = {
            name: name.trim(),
            type,
            icon,
            ...((fee && Number(fee) > 0) && {
                entryFee: Number(fee),
                feeCurrency,
            }),
        };

        onCreate(roomDetails);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="w-full max-w-sm bg-black/60 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col text-white">
                <div className="flex items-center justify-between mb-6">
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-700/50 transition-colors">
                        <XIcon className="w-6 h-6" />
                    </button>
                    <h2 className="text-xl font-bold">إنشاء غرفة جديدة</h2>
                    <div className="w-8 h-8" /> {/* Spacer to balance the close button */}
                </div>

                <div className="flex flex-col items-center gap-4 mb-6">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleIconChange}
                        className="hidden"
                    />
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-28 h-28 rounded-full bg-black/40 border-2 border-dashed border-gray-600 flex flex-col items-center justify-center text-[#BEBEBE] hover:border-[#FFC107] hover:text-[#FFC107] transition-colors"
                    >
                        {icon ? (
                            <img src={icon} alt="Room Icon Preview" className="w-full h-full object-cover rounded-full" />
                        ) : (
                            <>
                                <UploadIcon className="w-8 h-8 mb-1" />
                                <span className="text-xs font-semibold">صورة الغرفة</span>
                            </>
                        )}
                    </button>
                    <input
                        type="text"
                        placeholder="اسم الغرفة"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-right"
                    />
                </div>

                <div className="mb-4">
                    <label className="font-semibold mb-2 block text-right">نوع الغرفة</label>
                    <div className="flex bg-black/50 p-1 rounded-lg">
                        <button onClick={() => handleTypeChange('public')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${type === 'public' ? 'bg-[#FFC107] text-slate-900' : ''}`}>
                            عامة
                        </button>
                        <button onClick={() => handleTypeChange('private')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors ${type === 'private' ? 'bg-[#FFC107] text-slate-900' : ''}`}>
                            خاصة
                        </button>
                    </div>
                </div>

                <div className="transition-opacity duration-300 mb-4">
                    <label className="font-semibold mb-2 block text-right">سعر الدخول</label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="السعر"
                            value={fee}
                            onChange={(e) => setFee(e.target.value.replace(/\D/g, ''))}
                            className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-right"
                        />
                        <div className="flex-shrink-0 bg-black/50 border border-gray-600 rounded-lg flex items-center justify-center px-4">
                            <CoinIcon className="w-6 h-6 text-[#FFC107]" />
                        </div>
                    </div>
                </div>
                
                {error && <p className="bg-red-500/20 text-red-300 text-sm py-2 px-3 rounded-md mb-4 text-center">{error}</p>}

                <button
                    onClick={handleSubmit}
                    className="w-full py-3 mt-2 px-6 rounded-lg font-semibold text-lg bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] disabled:bg-[#FFC107]/50 disabled:cursor-not-allowed transition-colors"
                    disabled={!name.trim() || (type === 'private' && (!fee || Number(fee) <= 0))}
                >
                    إنشاء الغرفة
                </button>
            </div>
        </div>
    );
};

export default CreateRoomModal;
