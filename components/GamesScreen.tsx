import React from 'react';
import { ArrowRightIcon, GamesIcon } from './icons';

interface GamesScreenProps {
    onBack: () => void;
}

const GamesScreen: React.FC<GamesScreenProps> = ({ onBack }) => {
    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                {/* Header */}
                <header className="relative flex items-center justify-center py-2 mb-4">
                    <h1 className="text-2xl font-bold text-white">ألعاب</h1>
                    <button onClick={onBack} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white" aria-label="عودة">
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                </header>

                {/* Body */}
                <div className="flex-grow flex flex-col items-center justify-center text-center rounded-2xl p-6 min-h-[300px]">
                     <GamesIcon className="text-8xl text-[#FFC107] mb-6 opacity-50" />
                     <h2 className="text-2xl font-bold text-white mb-2">قريباً...</h2>
                     <p className="text-white text-lg max-w-xs">نحن نعمل بجد لإضافة ألعاب مثيرة وممتعة. ترقبوا التحديثات القادمة!</p>
                </div>
            </div>
        </div>
    );
};

export default GamesScreen;