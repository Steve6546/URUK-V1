import React from 'react';
import { CoinIcon, DiamondIcon, BellIcon, MenuIcon } from './icons';

interface HeaderProps {
    dollars: number;
    points: number;
    jewels: number;
    onToggleNotifications: () => void;
    unreadCount: number;
    onMenuClick: () => void;
    isConnected: boolean;
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number; }> = ({ icon, label, value }) => (
    <div className="flex-1 bg-black/50 border border-gray-500/30 rounded-xl p-2.5 shadow-lg flex items-center gap-3 backdrop-blur-sm">
        <div className="flex-shrink-0">
            {icon}
        </div>
        <div className="flex-grow text-right">
            <div className="text-xs text-[#BEBEBE]">{label}</div>
            <div className="text-lg font-bold text-white">{value.toLocaleString('de-DE')}</div>
        </div>
    </div>
);


const Header: React.FC<HeaderProps> = ({ dollars, points, jewels, onToggleNotifications, unreadCount, onMenuClick, isConnected }) => {
    return (
        <div className="w-full flex flex-col items-center gap-3">
            <div className="w-full flex justify-end">
                <span
                    className={`flex items-center gap-2 text-sm font-semibold px-3 py-1 rounded-lg border backdrop-blur-sm ${
                        isConnected
                            ? 'text-green-200 border-green-400/60 bg-green-500/10'
                            : 'text-red-200 border-red-400/60 bg-red-500/10'
                    }`}
                    aria-live="polite"
                >
                    <span
                        className={`w-2 h-2 rounded-full ${
                            isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                        }`}
                    />
                    {isConnected ? 'Connected ✅' : 'Disconnected ❌'}
                </span>
            </div>
             <div className="w-full relative flex justify-center items-center">
                <button 
                    onClick={onToggleNotifications} 
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[58px] h-[58px] flex-shrink-0 p-2.5 flex items-center justify-center rounded-full bg-black/30 border border-gray-700/50 backdrop-blur-sm transition-colors hover:bg-black/50"
                    aria-label={`لديك ${unreadCount} إشعارات جديدة`}
                >
                    <BellIcon className="w-7 h-7 text-[#FFC107]" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 text-xs font-bold text-white bg-red-500 rounded-full">
                            {unreadCount > 99 ? '99+' : unreadCount}
                        </span>
                    )}
                </button>
                <div className="bg-black/50 border border-gray-500/30 backdrop-blur-sm rounded-xl p-2.5 shadow-lg flex flex-col items-center min-w-[150px]">
                    <div className="text-xs text-[#BEBEBE]">الرصيد بالدولار</div>
                    <div className="text-2xl font-bold text-white">{dollars.toFixed(2)}</div>
                </div>
                <button 
                    onClick={onMenuClick}
                    className="absolute right-0 top-1/2 -translate-y-1/2 w-[58px] h-[58px] flex-shrink-0 p-2.5 flex items-center justify-center rounded-full bg-black/30 border border-gray-700/50 backdrop-blur-sm transition-colors hover:bg-black/50"
                    aria-label="القائمة"
                >
                    <MenuIcon className="w-7 h-7 text-[#FFC107]" />
                </button>
            </div>
            <div className="w-full flex items-center gap-3">
                <div className="flex-grow flex items-center gap-3">
                    <StatCard 
                        icon={<DiamondIcon className="w-7 h-7 text-cyan-400" />} 
                        label="مجموع المجوهرات" 
                        value={jewels} 
                    />
                    <StatCard 
                        icon={<CoinIcon className="text-[#FFC107] w-7 h-7" />} 
                        label="مجموع النقاط" 
                        value={points} 
                    />
                </div>
            </div>
        </div>
    );
};

export default Header;
