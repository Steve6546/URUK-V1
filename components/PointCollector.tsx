import React from 'react';
import { CoinIcon } from './icons';

interface PointCollectorProps {
    onCollect: () => void;
}

const PointCollector: React.FC<PointCollectorProps> = ({ onCollect }) => {
    return (
        <div className="bg-black/30 rounded-2xl shadow-lg p-6 flex flex-col justify-center items-center backdrop-blur-sm border border-gray-700/50 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">جامع النقاط</h2>
            <p className="text-[#BEBEBE] mb-6">انقر على الزر لكسب النقاط اللازمة لشراء العداد.</p>
            <button
                onClick={onCollect}
                className="group relative w-48 h-48 rounded-full bg-gradient-to-br from-gray-800 to-black text-[#FFC107] font-bold text-xl shadow-lg hover:shadow-[#FFC107]/20 transform transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center justify-center"
            >
                <CoinIcon className="w-16 h-16 mb-2 text-[#FFC107] transition-transform duration-300 group-hover:rotate-12" />
                اجمع النقاط
                 <div className="absolute inset-0 rounded-full border-2 border-[#FFC107]/50 animate-ping-slow opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
        </div>
    );
};

// Add keyframes for custom animation if needed in index.html or with a style tag.
// For simplicity, we'll rely on existing Tailwind animations or add a simple one here.
// In a real project, this would go into a CSS file.
const style = document.createElement('style');
style.innerHTML = `
@keyframes ping-slow {
  75%, 100% {
    transform: scale(1.5);
    opacity: 0;
  }
}
.animate-ping-slow {
  animation: ping-slow 2s cubic-bezier(0, 0, 0.2, 1) infinite;
}
`;
document.head.appendChild(style);


export default PointCollector;