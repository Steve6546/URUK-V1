import React, { useState, useEffect } from 'react';
import { useCountdown } from '../hooks/useCountdown';
import { StoreIcon, GamesIcon, ChatIcon, WithdrawIcon, AnonymousMaskIcon, SendIcon, ShoppingBagIcon, GiftIcon } from './icons';
import AdCarousel from './AdCarousel';

interface MainCounterProps {
    activationStartTime: number | null;
    onActivate: () => void;
    cooldownPeriod: number;
    jewelRewardPerCycle: number;
    pointReward: number;
    onOpenStore: () => void;
    onOpenPackagesStore: () => void;
    onOpenGiftCounterScreen: () => void;
    onOpenSendPointsScreen: () => void;
    onOpenChat: () => void;
    onOpenGames: () => void;
    onOpenWithdraw: () => void;
}

const MatrixEffect: React.FC = () => {
    const [text, setText] = useState('');
    const chars = 'アァカサタナハマヤャラワガザダバパイィキミヒリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789';

    useEffect(() => {
        const intervalId = setInterval(() => {
            let newText = '';
            for (let i = 0; i < 1200; i++) {
                newText += chars.charAt(Math.floor(Math.random() * chars.length)) + ' ';
            }
            setText(newText);
        }, 150);
        return () => clearInterval(intervalId);
    }, [chars]);

    return <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
        <p className="font-mono text-center text-green-500/50 text-xs leading-5 break-all opacity-50">
            {text}
        </p>
    </div>;
}


const MainCounter: React.FC<MainCounterProps> = ({ activationStartTime, onActivate, cooldownPeriod, jewelRewardPerCycle, pointReward, onOpenStore, onOpenPackagesStore, onOpenChat, onOpenGames, onOpenWithdraw, onOpenGiftCounterScreen, onOpenSendPointsScreen }) => {
    const targetTime = activationStartTime ? activationStartTime + cooldownPeriod : null;
    const { hours, minutes, seconds } = useCountdown(targetTime);

    const [currentCycleJewels, setCurrentCycleJewels] = useState(0);

    useEffect(() => {
        if (!activationStartTime) {
            setCurrentCycleJewels(0);
            return;
        }

        const intervalId = setInterval(() => {
            const elapsedTime = Date.now() - activationStartTime;
            if (elapsedTime >= cooldownPeriod) {
                setCurrentCycleJewels(jewelRewardPerCycle);
                clearInterval(intervalId);
            } else {
                const progress = elapsedTime / cooldownPeriod;
                setCurrentCycleJewels(progress * jewelRewardPerCycle);
            }
        }, 100); // Faster interval for a smooth "live" counter effect

        return () => clearInterval(intervalId);
    }, [activationStartTime, cooldownPeriod, jewelRewardPerCycle]);


    const CountdownButton: React.FC = () => (
         <button 
            onClick={onActivate}
            disabled={!!activationStartTime}
            className="w-full flex items-center justify-center bg-black border border-[#FFC107]/50 backdrop-blur-md rounded-full p-2.5 shadow-lg text-lg font-bold disabled:opacity-70 disabled:cursor-not-allowed transition-colors hover:bg-gray-900"
        >
            {!activationStartTime ? (
                <span className="text-[#FFC107]">تفعيل</span>
            ) : (
                <span className="font-mono text-white tracking-wider">
                    {String(hours).padStart(2, '0')}:{String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                </span>
            )}
        </button>
    );

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Central Square */}
            <div className="relative w-full h-64 sm:h-72 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-black/30 p-2">
                    <div className="w-full h-full rounded-2xl border-4 border-[#FFC107] shadow-[0_0_20px_#FFC107] animate-pulse"></div>
                </div>
                <div className="absolute inset-4 rounded-2xl bg-black/40 p-2">
                    <div className="w-full h-full rounded-2xl border-4 border-green-500 shadow-[0_0_20px_theme(colors.green.500)] animate-pulse"></div>
                </div>
                <div className="absolute inset-10 rounded-2xl bg-black/70 overflow-hidden flex items-center justify-center">
                    <MatrixEffect />
                    <AnonymousMaskIcon className="absolute w-3/4 h-3/4 text-black opacity-25" />
                </div>
                <div className="relative z-10 bg-gray-900/80 border border-white/20 rounded-2xl px-6 py-3 text-center shadow-2xl backdrop-blur-sm min-w-[170px]">
                    <p className="text-[#BEBEBE] text-sm">الرصيد اليومي</p>
                    <p className="font-bold font-mono text-[#FFD54F] text-2xl tracking-wider">{currentCycleJewels.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm">جوهرة</span></p>
                </div>
            </div>
            
            {/* Activate Button */}
            <div className="w-full">
                <CountdownButton />
            </div>

            {/* Action Buttons */}
            <div className="w-full grid grid-cols-2 gap-3">
                <button onClick={onOpenStore} className="flex items-center justify-center gap-2 bg-black border border-gray-700 backdrop-blur-md rounded-full py-3 px-2 shadow-lg text-sm text-[#FFC107] font-bold transition-colors hover:bg-gray-900">
                    <StoreIcon className="w-5 h-5" />
                    <span>متجر العدادات</span>
                </button>
                <button onClick={onOpenPackagesStore} className="flex items-center justify-center gap-2 bg-black border border-gray-700 backdrop-blur-md rounded-full py-3 px-2 shadow-lg text-sm text-[#FFC107] font-bold transition-colors hover:bg-gray-900">
                    <ShoppingBagIcon className="w-5 h-5" />
                    <span>متجر الحزم</span>
                </button>
                <button onClick={onOpenGiftCounterScreen} className="flex items-center justify-center gap-2 bg-black border border-gray-700 backdrop-blur-md rounded-full py-3 px-2 shadow-lg text-sm text-[#FFC107] font-bold transition-colors hover:bg-gray-900">
                    <GiftIcon className="w-5 h-5" />
                    <span>إهداء عداد</span>
                </button>
                <button onClick={onOpenSendPointsScreen} className="flex items-center justify-center gap-2 bg-black border border-gray-700 backdrop-blur-md rounded-full py-3 px-2 shadow-lg text-sm text-[#FFC107] font-bold transition-colors hover:bg-gray-900">
                    <SendIcon className="w-5 h-5" />
                    <span>إرسال نقاط</span>
                </button>
            </div>

            {/* Rewards Info Box */}
            <div className="w-full bg-black/30 border border-gray-700/50 backdrop-blur-md rounded-lg p-2 shadow-lg">
                <div className="bg-black/20 rounded-t-md px-4 py-1 text-center font-semibold text-sm text-[#FFD44C]">
                    ما تحصل عليه من العداد حالياً
                </div>
                <div className="flex flex-col gap-1 p-2">
                     <div className="bg-black/20 rounded p-3 text-center text-[#BEBEBE] font-semibold">
                        تتحصل يوميا على ({jewelRewardPerCycle.toLocaleString('de-DE')}) جوهرة من العداد
                    </div>
                     <div className="bg-black/20 rounded p-3 text-center text-[#BEBEBE] font-semibold">
                        تتحصل يوميا على ({pointReward.toLocaleString('de-DE')}) نقطة من العداد
                    </div>
                </div>
            </div>

            <AdCarousel />

            {/* New Clean Card Menu */}
            <div className="w-full mt-2">
                <div className="flex gap-3">
                    <button
                        onClick={onOpenGames}
                        className="group flex-1 aspect-square bg-black/30 border border-gray-700/50 backdrop-blur-md rounded-lg shadow-lg flex flex-col items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
                        aria-label="العاب"
                    >
                        <GamesIcon className="text-5xl text-[#FFC107] transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-base mt-1.5 transition-colors duration-200 group-hover:text-[#FFC107]">العاب</span>
                    </button>
                     <button
                        onClick={onOpenChat}
                        className="group flex-1 aspect-square bg-black/30 border border-gray-700/50 backdrop-blur-md rounded-lg shadow-lg flex flex-col items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
                        aria-label="دردشة"
                    >
                        <ChatIcon className="w-12 h-12 text-[#FFC107] transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-base mt-1.5 transition-colors duration-200 group-hover:text-[#FFC107]">دردشة</span>
                    </button>
                     <button
                        onClick={onOpenWithdraw}
                        className="group flex-1 aspect-square bg-black/30 border border-gray-700/50 backdrop-blur-md rounded-lg shadow-lg flex flex-col items-center justify-center text-white hover:bg-black/50 transition-all duration-200"
                        aria-label="سحب الأموال"
                    >
                        <WithdrawIcon className="w-12 h-12 text-[#FFC107] transition-transform duration-200 group-hover:scale-110" />
                        <span className="text-base mt-1.5 transition-colors duration-200 group-hover:text-[#FFC107]">سحب الأموال</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MainCounter;