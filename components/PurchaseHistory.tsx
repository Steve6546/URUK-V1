
import React from 'react';
import { Transaction } from '../types';
import { ArrowRightIcon, ClipboardListIcon, CoinIcon, DiamondIcon, DollarIcon, GiftIcon, SendIcon, StoreIcon, WithdrawIcon, LotteryIcon } from './icons';

interface PurchaseHistoryProps {
    onBack: () => void;
    transactions: Transaction[];
}

const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const seconds = Math.floor((now - timestamp) / 1000);
    if (seconds < 60) return `الآن`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    const days = Math.floor(hours / 24);
    return `منذ ${days} يوم`;
};

const getTransactionIcon = (type: Transaction['type']) => {
    switch (type) {
        case 'purchase_counter':
            return <StoreIcon className="w-6 h-6 text-[#FFC107]" />;
        case 'purchase_points':
        case 'convert_points_jewels':
             return <CoinIcon className="w-6 h-6 text-[#FFC107]" />;
        case 'purchase_jewels':
            return <DiamondIcon className="text-2xl text-cyan-400" />;
        case 'gift_counter':
            return <GiftIcon className="w-6 h-6 text-pink-400" />;
        case 'send_points':
            return <SendIcon className="w-6 h-6 text-blue-400" />;
        case 'withdraw_points':
            return <WithdrawIcon className="w-6 h-6 text-green-400" />;
        case 'lottery_join':
        case 'lottery_win':
            return <LotteryIcon className="w-6 h-6 text-purple-400" />;
        default:
            return <ClipboardListIcon className="w-6 h-6 text-gray-400" />;
    }
}

const getCurrencyIcon = (currency: Transaction['currency'], colorClass: string) => {
    const className = `w-4 h-4 ml-1 inline-block ${colorClass}`;
    switch(currency) {
        case 'points': return <CoinIcon className={className} />;
        case 'jewels': return <DiamondIcon className={`text-sm ${className}`} />;
        case 'dollars': return <span className="ml-1">$</span>;
        case 'ticket': return null;
        default: return null;
    }
}


const PurchaseHistory: React.FC<PurchaseHistoryProps> = ({ onBack, transactions }) => {
    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                <header className="relative flex items-center justify-center py-2 mb-4">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ClipboardListIcon className="w-7 h-7 text-[#FFC107]" /> سجل المعاملات</h1>
                    <button onClick={onBack} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white" aria-label="عودة">
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                </header>

                <main className="flex-grow">
                    {transactions.length > 0 ? (
                        <ul className="space-y-3">
                            {transactions.map(tx => {
                                const colorClass = tx.isDebit ? 'text-red-400' : 'text-green-400';
                                return (
                                    <li key={tx.id} className="bg-black/40 border border-gray-700/50 rounded-lg p-3 flex items-center justify-between gap-3 text-right">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 flex items-center justify-center bg-black/30 rounded-full flex-shrink-0">
                                                {getTransactionIcon(tx.type)}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{tx.description}</p>
                                                <p className="text-xs text-[#BEBEBE] mt-1">{formatTimeAgo(tx.timestamp)}</p>
                                            </div>
                                        </div>
                                        <div className={`font-bold text-lg whitespace-nowrap flex items-center ${colorClass}`}>
                                            <span>{tx.isDebit ? '-' : '+'} {tx.amount.toLocaleString('de-DE')}</span>
                                            {getCurrencyIcon(tx.currency, colorClass)}
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-[#BEBEBE] pt-16">
                            <ClipboardListIcon className="w-20 h-20 mb-4 opacity-50" />
                            <p className="text-lg font-semibold">لا يوجد معاملات لعرضها</p>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default PurchaseHistory;