import React from 'react';
import { TikTokIcon, TelegramIcon, InstagramIcon, WhatsAppIcon, FacebookIcon } from './icons';

interface SocialLinkProps {
    href: string;
    ariaLabel: string;
    bgColor: string;
    icon: React.ReactNode;
    label: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, ariaLabel, bgColor, icon, label }) => (
    <div className="flex flex-col items-center w-16 text-center">
        <a
            href={href}
            aria-label={ariaLabel}
            className={`w-12 h-12 p-2.5 flex items-center justify-center rounded-full text-white transition-transform hover:scale-110 ${bgColor}`}
            {...(href.startsWith('https') && { target: '_blank', rel: 'noopener noreferrer' })}
        >
            {icon}
        </a>
        <span className="text-xs text-[#BEBEBE] font-semibold mt-2">{label}</span>
    </div>
);

const SocialLinks: React.FC = () => {
    return (
        <div className="w-full text-center mt-56">
            <h3 className="text-xl font-bold text-white mb-6">اتصل بنا</h3>
            <div className="flex items-start justify-center gap-3">
                <SocialLink
                    href="https://wa.me/7500176204"
                    ariaLabel="WhatsApp"
                    bgColor="bg-green-500"
                    icon={<WhatsAppIcon className="w-full h-full" />}
                    label="واتساب"
                />
                <SocialLink
                    href="#"
                    ariaLabel="Telegram"
                    bgColor="bg-sky-500"
                    icon={<TelegramIcon className="w-full h-full" />}
                    label="تيليجرام"
                />
                <SocialLink
                    href="#"
                    ariaLabel="TikTok"
                    bgColor="bg-black"
                    icon={<TikTokIcon className="w-full h-full" />}
                    label="تيك توك"
                />
                <SocialLink
                    href="#"
                    ariaLabel="Instagram"
                    bgColor="bg-gradient-to-br from-yellow-400 via-red-500 to-purple-600"
                    icon={<InstagramIcon className="w-full h-full" />}
                    label="انستغرام"
                />
                <SocialLink
                    href="#"
                    ariaLabel="Facebook"
                    bgColor="bg-blue-600"
                    icon={<FacebookIcon className="w-full h-full" />}
                    label="فيسبوك"
                />
            </div>
        </div>
    );
};

export default SocialLinks;