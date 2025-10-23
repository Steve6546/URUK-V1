import React from 'react';
import { BellIcon, ArrowRightIcon } from './icons';
import { Notification } from '../types';

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

interface NotificationsPanelProps {
    notifications: Notification[];
    onClose: () => void;
}

const NotificationsPanel: React.FC<NotificationsPanelProps> = ({ notifications, onClose }) => {
    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
        >
            <div className="w-full max-w-md bg-black/50 border border-gray-700/50 rounded-2xl shadow-lg flex flex-col text-center animate-fade-in-fast">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-700/50">
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700/50 transition-colors" aria-label="إغلاق الإشعارات">
                        <ArrowRightIcon className="w-6 h-6 text-white" />
                    </button>
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <BellIcon className="w-6 h-6 text-[#FFC107]" />
                        <span>الإشعارات</span>
                    </h2>
                     <div style={{ width: '40px' }}></div> {/* Spacer */}
                </div>

                {/* Body */}
                <div className="flex-grow p-4 overflow-y-auto max-h-[60vh]">
                    {notifications.length > 0 ? (
                        <ul className="space-y-3 text-right">
                            {notifications.map(n => (
                                <li key={n.id} className="bg-black/40 p-3 rounded-lg">
                                    <p className="text-white">{n.message}</p>
                                    <p className="text-xs text-white mt-1">{formatTimeAgo(n.timestamp)}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#BEBEBE] py-8">لا توجد إشعارات جديدة.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const style = document.createElement('style');
style.innerHTML = `
@keyframes fade-in-fast {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
}
.animate-fade-in-fast {
    animation: fade-in-fast 0.2s ease-out forwards;
}
`;
document.head.appendChild(style);


export default NotificationsPanel;