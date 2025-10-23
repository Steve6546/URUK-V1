import React from 'react';
import { CoinIcon, StoreIcon } from './icons';

interface CounterStoreProps {
    points: number;
    onBuy: () => void;
    cost: number;
}

const CounterStore: React.FC<CounterStoreProps> = ({ points, onBuy, cost }) => {
    const canAfford = points >= cost;

    return (
        <div className="bg-black/30 border border-gray-700/50 rounded-2xl shadow-lg p-8 flex flex-col justify-center items-center backdrop-blur-sm text-center mt-10">
            <StoreIcon className="w-20 h-20 mx-auto text-[#FFC107] mb-4" />
            <h2 className="text-3xl font-bold text-white mb-2">شراء العداد</h2>
            <p className="text-[#BEBEBE] mb-6">قم بشراء العداد لبدء كسب النقاط والمجوهرات يومياً.</p>

            <div className="flex justify-center items-center space-x-2 text-3xl font-bold text-[#FFC107] mb-8">
                <CoinIcon className="w-8 h-8" />
                <span>{cost.toLocaleString('de-DE')}</span>
            </div>

            <button
                onClick={onBuy}
                disabled={!canAfford}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform shadow-[0_0_15px_rgba(0,0,0,0.5)]
                ${canAfford
                    ? 'bg-gradient-to-br from-gray-800 to-black text-[#FFC107] border-t border-gray-600 hover:shadow-[#FFC107]/20 hover:scale-105'
                    : 'bg-gray-800/50 text-gray-500 cursor-not-allowed border-t border-gray-700'
                }`}
            >
                {canAfford ? 'شراء الآن' : 'نقاط غير كافية'}
            </button>
        </div>
    );
};

export default CounterStore;