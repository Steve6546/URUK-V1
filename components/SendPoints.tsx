import React, { useState } from 'react';
import { User } from '../types';
import { ArrowRightIcon, UserIcon, SearchIcon, UrukCoinIcon } from './icons';

interface SendPointsProps {
    onBack: () => void;
    onSend: (recipientId: string, amount: number) => { success: boolean; message: string };
    allUsers: User[];
    currentUserPoints: number;
}

const SendPoints: React.FC<SendPointsProps> = ({ onBack, onSend, allUsers, currentUserPoints }) => {
    const [recipientIdInput, setRecipientIdInput] = useState('');
    const [foundUser, setFoundUser] = useState<User & { profilePicture?: string | null } | null>(null);
    const [amount, setAmount] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const MIN_POINTS = 10000;

    const resetSearch = () => {
        setFoundUser(null);
        setRecipientIdInput('');
        setError('');
        setSuccessMessage('');
        setAmount('');
    };

    const handleSearch = () => {
        setError('');
        setSuccessMessage('');
        setFoundUser(null);
        if (!recipientIdInput.trim()) {
            setError('الرجاء إدخال معرّف المستخدم.');
            return;
        }

        const user = allUsers.find(u => u.userId === recipientIdInput.trim());
        if (user) {
            const profilePictureKey = `profilePicture_${user.userId}`;
            const storedValue = localStorage.getItem(profilePictureKey);
            const profilePicture = storedValue ? JSON.parse(storedValue) : null;
            setFoundUser({ ...user, profilePicture });
        } else {
            setError('لم يتم العثور على مستخدم بهذا المعرّف.');
        }
    };
    
    const handleSend = () => {
        if (!foundUser) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');
        const pointsAmount = parseInt(amount, 10);
        
        if (isNaN(pointsAmount) || pointsAmount < MIN_POINTS) {
            setError(`الحد الأدنى للإرسال هو ${MIN_POINTS.toLocaleString('de-DE')} نقطة`);
            setIsLoading(false);
            return;
        }

        const result = onSend(foundUser.userId, pointsAmount);
        
        setTimeout(() => {
            if (result.success) {
                setSuccessMessage(result.message);
                setAmount('');
                 setTimeout(() => {
                    setSuccessMessage('');
                 }, 3000);
            } else {
                setError(result.message);
            }
            setIsLoading(false);
        }, 500); 
    };
    
    return (
        <div className="bg-black/30 border border-gray-700/50 rounded-2xl shadow-lg p-4 flex flex-col justify-center items-center backdrop-blur-sm text-center animate-fade-in w-full -mt-20">
            <div className="relative w-full flex items-center justify-between mb-4">
                <button
                    onClick={foundUser ? resetSearch : onBack}
                    className="w-8 flex items-center justify-center p-1 text-white hover:opacity-75 transition-colors"
                    aria-label={foundUser ? 'بحث جديد' : 'عودة'}
                >
                    <ArrowRightIcon className="w-7 h-7" />
                </button>
                <h2 className="text-xl font-bold text-white text-center flex-grow truncate">
                     إرسال نقاط
                </h2>
                <div className="w-8" /> {/* Spacer for centering the title */}
            </div>
            
            {!foundUser ? (
                <>
                    <div className="w-full flex flex-col items-center">
                        <p className="text-[#BEBEBE] mb-4 text-center">أدخل معرّف المستخدم الخاص بصديقك للبحث عنه.</p>
                         <div className="w-full max-w-xs flex items-center gap-0 bg-black/40 border border-gray-700/50 rounded-xl p-0 overflow-hidden">
                            <input
                                type="text"
                                placeholder="أدخل معرّف المستخدم هنا..."
                                value={recipientIdInput}
                                onChange={(e) => setRecipientIdInput(e.target.value)}
                                onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                                className="flex-grow bg-transparent py-3 px-4 text-white placeholder-[#BEBEBE] focus:outline-none text-right"
                            />
                            <button
                                onClick={handleSearch}
                                className="bg-gray-700/50 text-white p-3 hover:bg-gray-600 transition-colors flex-shrink-0 self-stretch"
                                aria-label="بحث"
                            >
                                <SearchIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                    {error && <p className="bg-red-500/20 text-red-300 text-sm py-2 px-4 rounded-md mt-4 w-full">{error}</p>}
                </>
            ) : (
                <div className="w-full animate-fade-in-fast flex flex-col items-center">
                    {/* User Info */}
                    <div className="w-28 h-28 rounded-full border-4 border-[#FFC107] p-1 bg-gray-900 flex items-center justify-center my-4">
                        {foundUser.profilePicture ? (
                            <img src={foundUser.profilePicture} alt="صورة الملف الشخصي" className="w-full h-full rounded-full object-cover" />
                        ) : (
                            <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                                <UserIcon className="w-16 h-16 text-slate-500" />
                            </div>
                        )}
                    </div>
                    <p className="text-xl font-bold text-white mb-4">{foundUser.name}</p>

                     {/* Input Section */}
                    <div className="w-full bg-black p-4 rounded-xl border border-gray-800 mt-4">
                        <label className="font-semibold text-white text-right block mb-2">أدخل عدد النقاط</label>
                        <div className="relative">
                            <input 
                                type="text"
                                inputMode="numeric"
                                placeholder="10,000"
                                value={amount ? parseInt(amount, 10).toLocaleString('de-DE') : ''}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^0-9]/g, '');
                                    setAmount(val);
                                }}
                                className="w-full bg-black border border-gray-600 rounded-lg py-3 pl-12 pr-4 text-white text-2xl text-left focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                style={{ direction: 'ltr' }}
                            />
                             <UrukCoinIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none" />
                        </div>
                        <p className="text-sm text-white/70 text-right mt-2">نقاطك حاليا {currentUserPoints.toLocaleString('de-DE')}</p>
                    </div>

                    {/* Messages */}
                    <div className="h-6 my-4">
                        {successMessage && <p className="bg-green-500/20 text-green-300 text-sm py-1 px-4 rounded-md text-center">{successMessage}</p>}
                        {error && <p className="bg-red-500/20 text-red-300 text-sm py-1 px-4 rounded-md text-center">{error}</p>}
                    </div>
                    
                    {/* Button */}
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !amount}
                        className="w-full py-4 rounded-lg font-bold text-xl transition-all duration-200 bg-[#947200] text-black shadow-md hover:bg-[#a98200] disabled:bg-[#947200]/50 disabled:cursor-wait"
                    >
                        {isLoading ? 'جار الإرسال...' : 'إرسال النقاط'}
                    </button>
                </div>
            )}
        </div>
    );
};

export default SendPoints;