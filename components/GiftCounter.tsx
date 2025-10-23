import React, { useState } from 'react';
import { User, Counter } from '../types';
import { UserIcon, SearchIcon, ArrowRightIcon } from './icons';

const countersForSale: Counter[] = [
    { id: 1, name: 'عداد 500 نقطة', points: 500, price: 75000, priceCurrency: 'points' },
    { id: 2, name: 'عداد 1000 نقطة', points: 1000, price: 180000, priceCurrency: 'points' },
    { id: 3, name: 'عداد 5000 نقطة', points: 5000, price: 750000, priceCurrency: 'points' },
    { id: 4, name: 'عداد 10000 نقطة', points: 10000, price: 1500000, priceCurrency: 'points' },
    { id: 5, name: 'عداد 500 جوهرة', jewels: 500, price: 80000, priceCurrency: 'jewels' },
];

interface GiftCounterProps {
    onBack: () => void;
    onGift: (recipientId: string, counter: Counter) => { success: boolean; message: string };
    allUsers: User[];
    currentUserPoints: number;
    currentUserJewels: number;
}

const GiftCounter: React.FC<GiftCounterProps> = ({ onBack, onGift, allUsers, currentUserPoints, currentUserJewels }) => {
    const [recipientIdInput, setRecipientIdInput] = useState('');
    const [foundUser, setFoundUser] = useState<User & { profilePicture?: string | null } | null>(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const resetSearch = () => {
        setFoundUser(null);
        setRecipientIdInput('');
        setError('');
        setSuccessMessage('');
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
    
    const handleGiftPurchase = (counter: Counter) => {
        if (!foundUser) return;
        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        const result = onGift(foundUser.userId, counter);
        
        setTimeout(() => {
            if (result.success) {
                setSuccessMessage(result.message);
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
        <div className="bg-black/30 border border-gray-700/50 rounded-2xl shadow-lg p-4 flex flex-col justify-center items-center backdrop-blur-sm text-center animate-fade-in w-full -mt-16">
            {/* Header */}
            <div className="relative w-full flex items-center justify-center mb-4">
                <h2 className="text-xl font-bold text-white text-center truncate">
                    إهداء عداد لصديق
                </h2>
                <button 
                    onClick={foundUser ? resetSearch : onBack} 
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
                    aria-label="عودة"
                >
                    <ArrowRightIcon className="w-7 h-7" />
                </button>
            </div>
            
            {!foundUser ? (
                <div className="animate-fade-in-fast w-full">
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
                </div>
            ) : (
                <div className="w-full animate-fade-in-fast">
                    {/* Recipient Info */}
                    <div className="flex flex-col items-center my-4">
                        <div className="w-28 h-28 rounded-full border-4 border-[#FFC107] p-1 bg-gray-900 flex items-center justify-center">
                            {foundUser.profilePicture ? (
                                <img src={foundUser.profilePicture} alt="صورة الملف الشخصي" className="w-full h-full rounded-full object-cover" />
                            ) : (
                                <div className="w-full h-full rounded-full bg-slate-800 flex items-center justify-center">
                                    <UserIcon className="w-16 h-16 text-slate-500" />
                                </div>
                            )}
                        </div>
                        <p className="text-xl font-bold text-white mt-3">{foundUser.name}</p>
                    </div>

                    <div className="h-6 mb-2">
                        {successMessage && <p className="bg-green-500/20 text-green-300 text-sm py-1 px-4 rounded-md text-center">{successMessage}</p>}
                        {error && <p className="bg-red-500/20 text-red-300 text-sm py-1 px-4 rounded-md text-center">{error}</p>}
                    </div>

                    {/* List of counters */}
                    <div className="w-full flex flex-col gap-3 my-2 max-h-[40vh] overflow-y-auto pr-2">
                        {countersForSale.map((counter) => {
                            const canAfford = counter.priceCurrency === 'points'
                                ? currentUserPoints >= counter.price
                                : currentUserJewels >= counter.price;
                            return (
                                <div key={counter.id} className="w-full bg-black/30 border border-gray-700 rounded-lg p-3 flex items-center justify-between text-right">
                                    <div>
                                        <p className="font-bold text-white text-base">{counter.name}</p>
                                        <p className="font-semibold text-sm text-[#FFC107] mt-1">{counter.price.toLocaleString('de-DE')}</p>
                                    </div>
                                    <button 
                                        onClick={() => handleGiftPurchase(counter)}
                                        disabled={!canAfford || isLoading}
                                        className="px-5 py-2 rounded-md text-sm font-bold bg-[#3E4147] text-white transition-colors hover:bg-gray-500 disabled:bg-gray-700/50 disabled:cursor-wait"
                                    >
                                        {isLoading ? '...' : 'إهداء'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GiftCounter;