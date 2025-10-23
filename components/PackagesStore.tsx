

import React, { useState } from 'react';
import { ArrowRightIcon, CoinIcon, DiamondIcon, ShoppingBagIcon, ShoppingCartIcon, ClipboardListIcon, LotteryIcon, BazaarIcon } from './icons';
import { User, LotteryResult } from '../types';

// Define package types
interface PointsPackage {
    id: number;
    points: number;
    cost: number;
}

// Packages for sale
const pointsPackages: PointsPackage[] = [
    { id: 1, points: 5000, cost: 2500 },
    { id: 2, points: 12000, cost: 5000 },
    { id: 3, points: 30000, cost: 10000 },
];

interface PackagesStoreProps {
    onBack: () => void;
    userPoints: number;
    userJewels: number;
    onBuyPoints: (points: number, cost: number) => { success: boolean; message: string };
    onBuyJewels: (jewels: number, cost: number) => { success: boolean; message: string };
    dollars: number;
    currentUser: User;
    lotteryParticipants: string[];
    onJoinLottery: () => { success: boolean; message: string };
    lotteryPrizeName: string;
    lotteryPrizeDescription: string;
    lotteryPrizeImage: string | null;
    lotteryHistory: LotteryResult[];
    onOpenJewelsStore: () => void;
    onOpenPurchaseHistory: () => void;
}

const PackagesStore: React.FC<PackagesStoreProps> = ({ 
    onBack, 
    userPoints, 
    userJewels, 
    onBuyPoints, 
    onBuyJewels, 
    dollars, 
    currentUser, 
    lotteryParticipants, 
    onJoinLottery,
    lotteryPrizeName,
    lotteryPrizeDescription,
    lotteryPrizeImage,
    lotteryHistory,
    onOpenJewelsStore,
    onOpenPurchaseHistory
}) => {
    const [activeTab, setActiveTab] = useState<'lottery' | 'bazaar'>('lottery');
    const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [loadingPackageId, setLoadingPackageId] = useState<number | null>(null);
    const [isLotteryLoading, setIsLotteryLoading] = useState(false);

    const latestWinner = lotteryHistory?.[0];

    const handleTabChange = (tab: 'lottery' | 'bazaar') => {
        setActiveTab(tab);
        setFeedback(null);
    };

    const handlePurchase = (pkg: PointsPackage) => {
        setLoadingPackageId(pkg.id);
        setFeedback(null);

        const result = onBuyPoints(pkg.points, pkg.cost);

        setTimeout(() => {
            if (result && result.success) {
                setFeedback({ type: 'success', message: result.message });
            } else if(result) {
                setFeedback({ type: 'error', message: result.message });
            }
            setLoadingPackageId(null);
            setTimeout(() => setFeedback(null), 3000);
        }, 500);
    };

    const handleJoinLotteryClick = () => {
        setIsLotteryLoading(true);
        setFeedback(null);

        const result = onJoinLottery();

        setTimeout(() => {
            if (result.success) {
                setFeedback({ type: 'success', message: result.message });
            } else {
                setFeedback({ type: 'error', message: result.message });
            }
            setIsLotteryLoading(false);
            setTimeout(() => setFeedback(null), 3000);
        }, 500);
    };

    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#0B0B0B' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                {/* Header */}
                <header className="relative flex items-center justify-center py-2 mb-4">
                    <button
                        onClick={onBack}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white"
                        aria-label="عودة"
                    >
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                    
                    <div className="flex items-center gap-3 text-white">
                        <ShoppingBagIcon className="w-8 h-8 text-[#FFC107]" />
                        <h1 className="text-2xl font-bold">متجر الحزم</h1>
                    </div>

                    <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center">
                        <button
                            onClick={onOpenPurchaseHistory}
                            className="p-2 text-white"
                            aria-label="قائمة المشتريات"
                        >
                            <ClipboardListIcon className="w-7 h-7" />
                        </button>
                         <button
                            onClick={onOpenJewelsStore}
                            className="p-2 text-white"
                            aria-label="شراء جواهر"
                        >
                            <ShoppingCartIcon className="w-7 h-7" />
                        </button>
                    </div>
                </header>

                {/* Main Content Body */}
                <div className="p-6 flex flex-col justify-center items-center text-center">
                    <div className="w-full flex justify-center bg-black/50 p-1 rounded-lg mb-4">
                        <button onClick={() => handleTabChange('lottery')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'lottery' ? 'bg-[#FFC107] text-slate-900' : 'text-[#BEBEBE]'}`}>
                            <LotteryIcon className="w-6 h-6" /> <span>القرعة</span>
                        </button>
                        <button onClick={() => handleTabChange('bazaar')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'bazaar' ? 'bg-[#FFC107] text-slate-900' : 'text-[#BEBEBE]'}`}>
                           <BazaarIcon className="w-6 h-6" /> <span>بازار</span>
                        </button>
                    </div>
                    
                    <div className="h-6 mb-2">
                        {feedback && (
                            <p className={`text-sm font-semibold ${feedback.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {feedback.message}
                            </p>
                        )}
                    </div>

                    <div className="w-full flex flex-col gap-4 max-h-[50vh] overflow-y-auto pr-1">
                        {activeTab === 'lottery' ? (
                             <div className="w-full flex flex-col items-center gap-4 animate-fade-in-fast">
                                {latestWinner && (
                                    <div className="w-full bg-green-900/50 border border-green-700 rounded-lg p-3 text-center mb-2 animate-fade-in-fast">
                                        <p className="text-sm text-green-200">
                                            الفائز الأخير بالقرعة على ({latestWinner.prizeName}) هو:
                                        </p>
                                        <p className="text-lg font-bold text-white mt-1">{latestWinner.winnerName}</p>
                                    </div>
                                )}
                                <div className="w-full h-48 bg-black/40 rounded-lg overflow-hidden border border-gray-700/60 shadow-lg">
                                    {lotteryPrizeImage ? (
                                        <img src={lotteryPrizeImage} alt={lotteryPrizeName} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[#BEBEBE]">
                                            <LotteryIcon className="w-16 h-16" />
                                        </div>
                                    )}
                                </div>
                    
                                <div className="text-center">
                                    <p className="text-lg text-[#BEBEBE]">القرعة الحالية على</p>
                                    <h3 className="text-3xl font-bold text-white -mt-1">{lotteryPrizeName}</h3>
                                    <p className="text-sm text-[#BEBEBE] mt-2 px-2">{lotteryPrizeDescription}</p>
                                </div>
                    
                                <div className="w-full bg-black/40 p-4 rounded-lg border border-gray-700/60">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-semibold text-white">المشاركون</span>
                                        <span className="font-bold text-[#FFC107]">{lotteryParticipants.length} / 500</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
                                        <div
                                            className="bg-gradient-to-r from-[#A37C00] to-[#FFC107] h-4 rounded-full transition-all duration-500"
                                            style={{ width: `${(lotteryParticipants.length / 500) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>
                    
                                {(() => {
                                    const hasJoined = lotteryParticipants.includes(currentUser.userId);
                                    const isFull = lotteryParticipants.length >= 500;
                                    const canAfford = dollars >= 1;
                    
                                    let buttonText = 'شراء التذكرة (1 دولار)';
                                    let buttonDisabled = isLotteryLoading;
                                    if (isFull) {
                                        buttonText = 'القرعة مكتملة';
                                        buttonDisabled = true;
                                    } else if (hasJoined) {
                                        buttonText = 'لقد شاركت بالفعل';
                                        buttonDisabled = true;
                                    } else if (!canAfford) {
                                        buttonText = 'رصيد غير كافٍ';
                                        buttonDisabled = true;
                                    }
                                    
                                    return (
                                        <button
                                            onClick={handleJoinLotteryClick}
                                            disabled={buttonDisabled}
                                            className="w-full py-3 mt-2 rounded-lg text-lg font-bold transition-all duration-200 transform hover:scale-105 bg-[#FFC107] text-slate-900 shadow-md hover:bg-[#ffca28] disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed disabled:scale-100"
                                        >
                                            {isLotteryLoading ? 'جار التحميل...' : buttonText}
                                        </button>
                                    );
                                })()}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-[#BEBEBE] pt-8 text-center animate-fade-in-fast">
                                <BazaarIcon className="w-20 h-20 mb-4 opacity-50" />
                                <h2 className="text-2xl font-bold text-white mb-2">قريباً...</h2>
                                <p className="text-white/80 text-lg max-w-xs">سيتم إضافة المزيد من الحزم والخيارات قريباً.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackagesStore;