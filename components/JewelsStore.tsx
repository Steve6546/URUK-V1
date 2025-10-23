
import React from 'react';
import { ArrowRightIcon, ShoppingCartIcon } from './icons';

interface JewelsStoreProps {
    onBack: () => void;
}

const JewelsStore: React.FC<JewelsStoreProps> = ({ onBack }) => {
    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                <header className="relative flex items-center justify-center py-2 mb-4">
                    <h1 className="text-2xl font-bold text-white flex items-center gap-2"><ShoppingCartIcon className="w-8 h-8 text-[#FFC107]" /> السلة</h1>
                    <button onClick={onBack} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white" aria-label="عودة">
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                </header>

                <main className="flex-grow flex flex-col items-center justify-center text-center p-6">
                    <ShoppingCartIcon className="w-24 h-24 text-gray-600 mb-4" />
                    <p className="text-2xl font-bold text-gray-400">السلة فارغة</p>
                    <p className="text-base text-gray-500 mt-2">لم يتم إضافة أي عناصر إلى السلة بعد.</p>
                </main>
            </div>
        </div>
    );
};

export default JewelsStore;