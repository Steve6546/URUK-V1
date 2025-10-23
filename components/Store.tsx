import React, { useState } from 'react';
import { ArrowRightIcon, ShoppingBagIcon, DiamondIcon, CoinIcon, BazaarIcon } from './icons';
import { Counter } from '../types';

interface StoreProps {
    onBack: () => void;
    onPurchase: (counter: Counter) => void;
    userPoints: number;
    userJewels: number;
}

const countersForSale: Counter[] = [
    { id: 1, name: 'عداد 500 نقطة', points: 500, price: 75000, priceCurrency: 'points' },
    { id: 2, name: 'عداد 1000 نقطة', points: 1000, price: 180000, priceCurrency: 'points' },
    { id: 3, name: 'عداد 5000 نقطة', points: 5000, price: 750000, priceCurrency: 'points' },
    { id: 4, name: 'عداد 10000 نقطة', points: 10000, price: 1500000, priceCurrency: 'points' },
    { id: 5, name: 'عداد 500 جوهرة', jewels: 500, price: 80000, priceCurrency: 'jewels' },
];

const Store: React.FC<StoreProps> = ({ onBack, onPurchase, userPoints, userJewels }) => {
    const [activeTab, setActiveTab] = useState<'buy' | 'sell'>('buy');

    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                {/* Header */}
                <header className="relative flex items-center justify-center py-2 mb-6">
                    <button
                        onClick={onBack}
                        className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white"
                        aria-label="عودة"
                    >
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                    
                    <div className="flex items-center gap-3 text-white">
                        <ShoppingBagIcon className="w-8 h-8 text-[#FFC107]" />
                        <h1 className="text-2xl font-bold">متجر العدادات</h1>
                    </div>
                </header>

                {/* Tab Switcher */}
                <div className="w-full flex justify-center bg-black/50 p-1 rounded-lg mb-6">
                    <button onClick={() => setActiveTab('buy')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'buy' ? 'bg-[#FFC107] text-slate-900' : 'text-[#BEBEBE]'}`}>
                        <ShoppingBagIcon className="w-6 h-6" /> <span>شراء العدادات</span>
                    </button>
                    <button onClick={() => setActiveTab('sell')} className={`w-1/2 py-2 rounded-md font-semibold transition-colors flex items-center justify-center gap-2 ${activeTab === 'sell' ? 'bg-[#FFC107] text-slate-900' : 'text-[#BEBEBE]'}`}>
                        <ShoppingBagIcon className="w-6 h-6" /> <span>بيع العدادات</span>
                    </button>
                </div>

                {/* Body */}
                <div className="flex-grow">
                    {activeTab === 'buy' ? (
                        <div className="w-full flex flex-col gap-4 animate-fade-in-fast">
                            {countersForSale.map((counter) => {
                                const canAfford = counter.priceCurrency === 'points'
                                    ? userPoints >= counter.price
                                    : userJewels >= counter.price;
                                return (
                                    <div key={counter.id} className="bg-gradient-to-br from-gray-800 via-gray-900 to-black p-0.5 rounded-2xl shadow-lg">
                                        <div className="bg-black/60 rounded-[15px] p-4 w-full flex items-center justify-between backdrop-blur-sm">
                                            {/* Right side (RTL): Info */}
                                            <div className="flex items-center gap-4 text-right">
                                                <div className="w-14 h-14 flex-shrink-0 bg-black/40 rounded-full flex items-center justify-center border-2 border-gray-700">
                                                    {counter.points ? <CoinIcon className="w-8 h-8 text-[#FFC107]" /> : <DiamondIcon className="text-3xl text-cyan-400" />}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-lg">{counter.name}</p>
                                                    <div className="text-sm text-[#BEBEBE] mt-1">
                                                        <span>
                                                            {counter.points ? counter.points.toLocaleString('de-DE') : counter.jewels.toLocaleString('de-DE')}
                                                            {counter.points ? ' نقطة' : ' جوهرة'}
                                                        </span>
                                                        <span className="text-xs text-white/80"> / يومياً</span>
                                                    </div>
                                                    <p className="text-xs text-white/60 mt-0.5">اشتراك سنوي</p>
                                                </div>
                                            </div>

                                            {/* Left side (RTL): Price and Button */}
                                            <div className="flex flex-col items-center gap-2 flex-shrink-0">
                                                <div className="flex items-center gap-2 font-bold text-lg">
                                                    <span className={counter.priceCurrency === 'points' ? 'text-[#FFC107]' : 'text-cyan-400'}>
                                                        {counter.price.toLocaleString('de-DE')}
                                                    </span>
                                                    {counter.priceCurrency === 'points' ? <CoinIcon className="w-5 h-5 text-[#FFC107]" /> : <DiamondIcon className="text-xl text-cyan-400" />}
                                                </div>
                                                <button 
                                                    onClick={() => onPurchase(counter)}
                                                    disabled={!canAfford}
                                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 transform hover:scale-105
                                                    ${canAfford 
                                                        ? 'bg-[#FFC107] text-slate-900 shadow-md hover:bg-[#ffca28]' 
                                                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                                                    }`}
                                                >
                                                    شراء
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                         <div className="flex flex-col items-center justify-center h-full text-[#BEBEBE] pt-16 text-center animate-fade-in-fast">
                            <BazaarIcon className="w-20 h-20 mb-4 opacity-50" />
                            <h2 className="text-2xl font-bold text-white mb-2">قريباً...</h2>
                            <p className="text-white/80 text-lg max-w-xs">سيتم تفعيل ميزة بيع العدادات في التحديثات القادمة.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Store;