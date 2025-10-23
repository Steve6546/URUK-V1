
import React, { useEffect, useState, useRef } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import Header from './components/Header';
import CounterStore from './components/CounterStore';
import MainCounter from './components/MainCounter';
import PointCollector from './components/PointCollector';
import Store from './components/Store';
import PackagesStore from './components/PackagesStore';
import NotificationsPanel from './components/NotificationsPanel';
import Auth from './components/Auth';
import GiftCounter from './components/GiftCounter';
import SendPoints from './components/SendPoints';
import AccountVerification from './components/AccountVerification';
import Chat from './components/Chat';
import CreateRoomModal from './components/CreateRoomModal';
import RoomView from './components/RoomView';
import GamesScreen from './components/GamesScreen';
import WithdrawScreen from './components/WithdrawScreen';
import SocialLinks from './components/SocialLinks';
import JewelsStore from './components/JewelsStore';
import PurchaseHistory from './components/PurchaseHistory';
import { Counter, Notification, User, ChatRoom, ChatMessage, LotteryResult, Transaction } from './types';
import { UserIcon, UsersIcon, ArrowLeftIcon, ArrowRightIcon, CameraIcon, PencilIcon, PhoneIcon, MailIcon, ReferralIcon, CheckIcon, LockIcon, ShieldCheckIcon, DocumentIcon, BellIcon, HeadsetIcon, ExitIcon, LogoutIcon, IdIcon, XIcon, ShieldExclamationIcon, ClockIcon, GamesIcon, WithdrawIcon, ChatIcon, CopyIcon } from './components/icons';

const COUNTER_COST = 1000;
const COOLDOWN_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const BASE_JEWEL_REWARD_PER_CYCLE = 500;
const BASE_POINT_REWARD_PER_CYCLE = 0;
const NAME_CHANGE_COST = 5000;
const MAX_FREE_CHANGES = 2;
const PIC_CHANGE_COST = 5000;
const MAX_FREE_PIC_CHANGES = 2;
const BANNER_CHANGE_COST = 5000;
const MAX_FREE_BANNER_CHANGES = 2;
const POINTS_PER_DOLLAR = 5000;
const POINTS_PER_JEWEL = 0.5;

const lotteryPrizes = [
    { 
        name: 'iPhone 15 Pro Max', 
        description: 'أحدث إصدار من آبل مع كاميرا مذهلة وأداء فائق.', 
        image: 'https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-7inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845699793' 
    },
    { 
        name: 'PlayStation 5', 
        description: 'تجربة لعب من الجيل القادم مع رسوميات خيالية وسرعة فائقة.', 
        image: 'https://gmedia.playstation.com/is/image/gmedia/playstation-5-console-render-product-shot-01-en-24jul23?$native$' 
    },
    { 
        name: 'Samsung Galaxy S24 Ultra', 
        description: 'قوة الذكاء الاصطناعي بين يديك مع كاميرا تتحدى المستحيل.', 
        image: 'https://images.samsung.com/is/image/samsung/p6pim/levant/2401/gallery/levant-galaxy-s24-ultra-sm-s928bztqmea-539316335?$650_519_PNG$'
    }
];


const App: React.FC = () => {
    const [currentUser, setCurrentUser] = useLocalStorage<User | null>('currentUser', null);
    const [allUsers, setAllUsers] = useLocalStorage<User[]>('users', []);

    // Per-user data keys now based on the unique userId
    const userDataKey = (key: string) => currentUser ? `${key}_${currentUser.userId}` : key;
    const globalDataKey = (key: string) => key;

    const [dollars, setDollars] = useLocalStorage<number>(userDataKey('dollars'), 0);
    const [points, setPoints] = useLocalStorage<number>(userDataKey('points'), 0);
    const [jewels, setJewels] = useLocalStorage<number>(userDataKey('jewels'), 0);
    const [hasCounter, setHasCounter] = useLocalStorage<boolean>(userDataKey('hasCounter'), true);
    const [activationStartTime, setActivationStartTime] = useLocalStorage<number | null>(userDataKey('activationStartTime'), null);
    const [userCounters, setUserCounters] = useLocalStorage<Counter[]>(userDataKey('userCounters'), []);
    const [notifications, setNotifications] = useLocalStorage<Notification[]>(userDataKey('notifications'), []);
    const [purchaseHistory, setPurchaseHistory] = useLocalStorage<Transaction[]>(userDataKey('purchaseHistory'), []);
    
    // Profile State
    const [profileName, setProfileName] = useLocalStorage<string>(userDataKey('profileName'), 'Moody Hey');
    const [profilePicture, setProfilePicture] = useLocalStorage<string | null>(userDataKey('profilePicture'), null);
    const [profileBanner, setProfileBanner] = useLocalStorage<string | null>(userDataKey('profileBanner'), null);
    const [profileEmail, setProfileEmail] = useLocalStorage<string>(userDataKey('profileEmail'), 'heymoody785@gmail.com');
    const [profilePhone, setProfilePhone] = useLocalStorage<string>(userDataKey('profilePhone'), 'غير متوفر');


    const [showStore, setShowStore] = useState(false);
    const [showPackagesStore, setShowPackagesStore] = useState(false);
    const [showGiftCounterScreen, setShowGiftCounterScreen] = useState(false);
    const [showSendPointsScreen, setShowSendPointsScreen] = useState(false);
    const [showNotificationsPanel, setShowNotificationsPanel] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [showUserProfile, setShowUserProfile] = useState(false);
    const [showNotificationsLogScreen, setShowNotificationsLogScreen] = useState(false);
    const [activeNotificationCategory, setActiveNotificationCategory] = useState<Notification['category']>('counter');
    const [showVerification, setShowVerification] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [showGamesScreen, setShowGamesScreen] = useState(false);
    const [showWithdrawScreen, setShowWithdrawScreen] = useState(false);
    const [showJewelsStore, setShowJewelsStore] = useState(false);
    const [showPurchaseHistory, setShowPurchaseHistory] = useState(false);
    
    // Chat state
    const [showChat, setShowChat] = useState(false);
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const [chatRooms, setChatRooms] = useLocalStorage<ChatRoom[]>(globalDataKey('chatRooms'), []);
    const [activeRoom, setActiveRoom] = useState<ChatRoom | null>(null);
    const [messages, setMessages] = useLocalStorage<{ [key: string]: ChatMessage[] }>(globalDataKey('chatMessages'), {});

    // Lottery State
    const [lotteryParticipants, setLotteryParticipants] = useLocalStorage<string[]>(globalDataKey('lotteryParticipants'), []);
    const [lotteryPot, setLotteryPot] = useLocalStorage<number>(globalDataKey('lotteryPot'), 0);
    const [lotteryPrizeName, setLotteryPrizeName] = useLocalStorage<string>(globalDataKey('lotteryPrizeName'), lotteryPrizes[0].name);
    const [lotteryPrizeDescription, setLotteryPrizeDescription] = useLocalStorage<string>(globalDataKey('lotteryPrizeDescription'), lotteryPrizes[0].description);
    const [lotteryPrizeImage, setLotteryPrizeImage] = useLocalStorage<string | null>(globalDataKey('lotteryPrizeImage'), lotteryPrizes[0].image);
    const [lotteryHistory, setLotteryHistory] = useLocalStorage<LotteryResult[]>(globalDataKey('lotteryHistory'), []);


    const [tempProfilePhone, setTempProfilePhone] = useState(profilePhone);
    const [isEditingPhone, setIsEditingPhone] = useState(false);
    const [copied, setCopied] = useState(false);
    
    const [showNameChangeModal, setShowNameChangeModal] = useState(false);
    const [showPicChangeModal, setShowPicChangeModal] = useState(false);
    const [newProfilePicData, setNewProfilePicData] = useState<string | null>(null);
    const [showBannerChangeModal, setShowBannerChangeModal] = useState(false);
    const [newProfileBannerData, setNewProfileBannerData] = useState<string | null>(null);
    
    // New states for profile picture menu
    const [showProfilePictureMenu, setShowProfilePictureMenu] = useState(false);
    const [showPhotoViewer, setShowPhotoViewer] = useState(false);
    const [showRemovePicConfirm, setShowRemovePicConfirm] = useState(false);


    const fileInputRef = useRef<HTMLInputElement>(null);
    const bannerFileInputRef = useRef<HTMLInputElement>(null);


    // Effect to initialize user data on login
    useEffect(() => {
        if (currentUser) {
            setProfileName(currentUser.name);
            setProfileEmail(currentUser.email || 'غير مسجل');
            setProfilePhone(currentUser.phone || 'غير متوفر');
            // Reset temp fields on user change
            setTempProfilePhone(currentUser.phone || profilePhone);
        }
    }, [currentUser]);
    
    useEffect(() => {
        // One-time migration for old notifications without a category
        if (notifications.length > 0 && notifications.some(n => !n.category)) {
            setNotifications(prev => prev.map(n => {
                if (n.category) return n; // Already has category
                const msg = n.message;
                let cat: Notification['category'] = 'general';
                if ((msg.includes('جوهرة') || msg.includes('نقطة')) && msg.includes('إلى رصيدك')) {
                    cat = 'counter';
                } else if (msg.includes('أهديت') || msg.includes('تلقيت هدية')) {
                    cat = 'transactions';
                } else if (msg.includes('غرفة') || msg.includes('دخلت') || msg.includes('غادر')) {
                    cat = 'chat';
                }
                return { ...n, category: cat };
            }));
        }
    }, []); // Run only once

    // Lottery Winner Effect
    useEffect(() => {
        if (lotteryParticipants.length >= 500) {
            const winnerId = lotteryParticipants[Math.floor(Math.random() * lotteryParticipants.length)];
            const winner = allUsers.find(u => u.userId === winnerId);

            if (winner) {
                // Award prize to winner
                const winnerDollarsKey = `dollars_${winner.userId}`;
                const storedDollars = localStorage.getItem(winnerDollarsKey);
                const winnerDollars: number = storedDollars ? JSON.parse(storedDollars) : 0;
                localStorage.setItem(winnerDollarsKey, JSON.stringify(winnerDollars + lotteryPot));

                // Notify winner
                const winnerNotificationsKey = `notifications_${winner.userId}`;
                const storedNotifications = localStorage.getItem(winnerNotificationsKey);
                const winnerNotifications: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
                const newNotification: Notification = {
                    id: new Date().toISOString() + Math.random(),
                    message: `تهانينا! لقد فزت بـ ${lotteryPrizeName} في القرعة الكبرى وربحت ${lotteryPot.toLocaleString('de-DE')}$!`,
                    timestamp: Date.now(),
                    read: false,
                    category: 'games',
                };
                localStorage.setItem(winnerNotificationsKey, JSON.stringify([newNotification, ...winnerNotifications]));

                 // Log transaction for winner
                const winnerTransactionsKey = `purchaseHistory_${winner.userId}`;
                const storedTransactions = localStorage.getItem(winnerTransactionsKey);
                const winnerTransactions: Transaction[] = storedTransactions ? JSON.parse(storedTransactions) : [];
                const newTransaction: Transaction = {
                    id: new Date().toISOString() + Math.random(),
                    type: 'lottery_win',
                    description: `الفوز بالقرعة: ${lotteryPrizeName}`,
                    amount: lotteryPot,
                    currency: 'dollars',
                    timestamp: Date.now(),
                    isDebit: false,
                };
                localStorage.setItem(winnerTransactionsKey, JSON.stringify([newTransaction, ...winnerTransactions]));


                // Add to history
                const newResult: LotteryResult = {
                    winnerId: winner.userId,
                    winnerName: winner.name,
                    prizeName: lotteryPrizeName,
                    pot: lotteryPot,
                    timestamp: Date.now(),
                };
                setLotteryHistory(prev => [newResult, ...prev]);

                // Notify current user if they are not the winner
                if (currentUser?.userId !== winner.userId) {
                    addNotification(`انتهت القرعة على ${lotteryPrizeName}! الفائز هو ${winner.name} وقد ربح ${lotteryPot.toLocaleString('de-DE')}$.`, 'games');
                }
            }
            
            // Reset lottery for next round
            setLotteryPot(0);
            setLotteryParticipants([]);
            
            // Set up next prize
            const currentPrizeIndex = lotteryPrizes.findIndex(p => p.name === lotteryPrizeName);
            const nextPrize = lotteryPrizes[(currentPrizeIndex + 1) % lotteryPrizes.length];
            setLotteryPrizeName(nextPrize.name);
            setLotteryPrizeDescription(nextPrize.description);
            setLotteryPrizeImage(nextPrize.image);
        }
    }, [lotteryParticipants.length]);


    const pointRewardPerCycle = userCounters.reduce((sum, counter) => sum + (counter.points || 0), BASE_POINT_REWARD_PER_CYCLE);
    const jewelRewardPerCycle = userCounters.reduce((sum, counter) => sum + (counter.jewels || 0), BASE_JEWEL_REWARD_PER_CYCLE);
    
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

    const addNotification = (message: string, category: Notification['category']) => {
        const newNotification: Notification = {
            id: new Date().toISOString() + Math.random(),
            message,
            timestamp: Date.now(),
            read: false,
            category,
        };
        setNotifications(prev => [newNotification, ...prev]);
    };

    const logTransaction = (
        type: Transaction['type'], 
        description: string, 
        amount: number, 
        currency: Transaction['currency'],
        isDebit: boolean
    ) => {
        const newTransaction: Transaction = {
            id: new Date().toISOString() + Math.random(),
            type,
            description,
            amount,
            currency,
            timestamp: Date.now(),
            isDebit,
        };
        setPurchaseHistory(prev => [newTransaction, ...prev]);
    };

    useEffect(() => {
        if (currentUser && !notifications.some(n => n.message.includes("مرحباً بك"))) {
            addNotification(`مرحباً بك ${currentUser.name}`, 'general');
        }
    }, [currentUser]);

    useEffect(() => {
        if (activationStartTime) {
            const timeSinceActivation = Date.now() - activationStartTime;
            if (timeSinceActivation >= COOLDOWN_PERIOD) {
                const message = `تم إضافة ${jewelRewardPerCycle} جوهرة`;
                addNotification(message, 'counter');
                setJewels(prev => prev + jewelRewardPerCycle);
                setPoints(prev => prev + pointRewardPerCycle);
                setActivationStartTime(null); 
            }
        }
    }, [activationStartTime, setJewels, setPoints, setActivationStartTime, pointRewardPerCycle, jewelRewardPerCycle]);

    const handleCollectPoints = () => {
        setPoints(prevPoints => prevPoints + 10);
    };

    const handleBuyCounter = () => {
        if (points >= COUNTER_COST) {
            setPoints(prevPoints => prevPoints - COUNTER_COST);
            setHasCounter(true);
        }
    };

    const handleActivateCounter = () => {
        if (!activationStartTime) {
            const timeSinceLastActivation = activationStartTime ? Date.now() - activationStartTime : COOLDOWN_PERIOD;
            if (timeSinceLastActivation >= COOLDOWN_PERIOD) {
                setActivationStartTime(Date.now());
            }
        }
    };

    const handlePurchaseCounter = (counter: Counter) => {
        if (counter.priceCurrency === 'points') {
            if (points >= counter.price) {
                setPoints(prevPoints => prevPoints - counter.price);
                setUserCounters(prevCounters => [...prevCounters, counter]);
                 logTransaction('purchase_counter', `شراء ${counter.name}`, counter.price, counter.priceCurrency, true);
            }
        } else if (counter.priceCurrency === 'jewels') {
            if (jewels >= counter.price) {
                setJewels(prevJewels => prevJewels - counter.price);
                setUserCounters(prevCounters => [...prevCounters, counter]);
                logTransaction('purchase_counter', `شراء ${counter.name}`, counter.price, counter.priceCurrency, true);
            }
        }
    };
    
    const handleBuyPointsPackage = (pointsAmount: number, jewelsCost: number): { success: boolean; message: string } => {
        if (jewels < jewelsCost) {
            return { success: false, message: 'ليس لديك جواهر كافية' };
        }
        setJewels(j => j - jewelsCost);
        setPoints(p => p + pointsAmount);
        addNotification(`تم شراء ${pointsAmount.toLocaleString('de-DE')} نقطة بنجاح`, 'transactions');
        logTransaction('purchase_points', `شراء ${pointsAmount.toLocaleString('de-DE')} نقطة`, jewelsCost, 'jewels', true);
        return { success: true, message: 'تم الشراء بنجاح!' };
    };

    const handleBuyJewelsPackage = (jewelsAmount: number, pointsCost: number): { success: boolean; message: string } => {
        if (points < pointsCost) {
            return { success: false, message: 'ليس لديك نقاط كافية' };
        }
        setPoints(p => p - pointsCost);
        setJewels(j => j + jewelsAmount);
        addNotification(`تم شراء ${jewelsAmount.toLocaleString('de-DE')} جوهرة بنجاح`, 'transactions');
        logTransaction('purchase_jewels', `شراء ${jewelsAmount.toLocaleString('de-DE')} جوهرة`, pointsCost, 'points', true);
        return { success: true, message: 'تم الشراء بنجاح!' };
    };


    const handleGiftCounter = (recipientId: string, counter: Counter): { success: boolean; message: string } => {
        const recipient = allUsers.find(u => u.userId === recipientId);

        if (!recipient) {
            return { success: false, message: 'المستخدم غير موجود' };
        }
        if (recipient.userId === currentUser!.userId) {
            return { success: false, message: 'لا يمكنك إهداء نفسك' };
        }
        if (counter.priceCurrency === 'points' && points < counter.price) {
            return { success: false, message: 'ليس لديك نقاط كافية' };
        }
        if (counter.priceCurrency === 'jewels' && jewels < counter.price) {
            return { success: false, message: 'ليس لديك جواهر كافية' };
        }

        if (counter.priceCurrency === 'points') {
            setPoints(p => p - counter.price);
        } else {
            setJewels(j => j - counter.price);
        }

        logTransaction('gift_counter', `إهداء ${counter.name} إلى ${recipient.name}`, counter.price, counter.priceCurrency, true);

        const recipientCountersKey = `userCounters_${recipient.userId}`;
        const storedCounters = localStorage.getItem(recipientCountersKey);
        const recipientCounters: Counter[] = storedCounters ? JSON.parse(storedCounters) : [];
        localStorage.setItem(recipientCountersKey, JSON.stringify([...recipientCounters, counter]));

        const recipientNotificationsKey = `notifications_${recipient.userId}`;
        const storedNotifications = localStorage.getItem(recipientNotificationsKey);
        const recipientNotifications: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
        const newNotification: Notification = {
            id: new Date().toISOString() + Math.random(),
            message: `لقد تلقيت هدية! أهداك ${currentUser!.name} (${counter.name})`,
            timestamp: Date.now(),
            read: false,
            category: 'transactions',
        };
        localStorage.setItem(recipientNotificationsKey, JSON.stringify([newNotification, ...recipientNotifications]));

        addNotification(`لقد أهديت ${recipient.name} (${counter.name}) بنجاح`, 'transactions');
        
        return { success: true, message: 'تم إرسال الهدية بنجاح!' };
    };

    const handleSendPoints = (recipientId: string, amount: number): { success: boolean; message: string } => {
        const recipient = allUsers.find(u => u.userId === recipientId);

        if (!recipient) {
            return { success: false, message: 'المستخدم غير موجود' };
        }
        if (recipient.userId === currentUser!.userId) {
            return { success: false, message: 'لا يمكنك إرسال النقاط لنفسك' };
        }
        if (amount < 10000) {
             return { success: false, message: 'الحد الأدنى للإرسال هو 10,000 نقطة' };
        }
        if (points < amount) {
            return { success: false, message: 'ليس لديك نقاط كافية' };
        }

        // Deduct from sender
        setPoints(p => p - amount);
        logTransaction('send_points', `إرسال نقاط إلى ${recipient.name}`, amount, 'points', true);


        // Add to recipient
        const recipientPointsKey = `points_${recipient.userId}`;
        const storedPoints = localStorage.getItem(recipientPointsKey);
        const recipientPoints: number = storedPoints ? JSON.parse(storedPoints) : 0;
        localStorage.setItem(recipientPointsKey, JSON.stringify(recipientPoints + amount));

        // Notify recipient
        const recipientNotificationsKey = `notifications_${recipient.userId}`;
        const storedNotifications = localStorage.getItem(recipientNotificationsKey);
        const recipientNotifications: Notification[] = storedNotifications ? JSON.parse(storedNotifications) : [];
        const newNotification: Notification = {
            id: new Date().toISOString() + Math.random(),
            message: `لقد تلقيت هدية! أرسل لك ${currentUser!.name} ${amount.toLocaleString('de-DE')} نقطة`,
            timestamp: Date.now(),
            read: false,
            category: 'transactions',
        };
        localStorage.setItem(recipientNotificationsKey, JSON.stringify([newNotification, ...recipientNotifications]));

        // Notify sender
        addNotification(`لقد أرسلت ${amount.toLocaleString('de-DE')} نقطة إلى ${recipient.name} بنجاح`, 'transactions');
        
        return { success: true, message: 'تم إرسال النقاط بنجاح!' };
    };
    
    const handleToggleNotifications = () => {
        setShowNotificationsPanel(prev => !prev);
        if (!showNotificationsPanel) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const handleClearNotifications = () => {
        setNotifications([]);
    };

    const handleMenuClick = () => {
        setShowMenu(true);
    };

    const handleBackToMain = () => {
        setShowMenu(false);
        setShowUserProfile(false); 
        setShowNotificationsLogScreen(false);
    };

    const handleOpenUserProfile = () => {
        setShowUserProfile(true);
    };
    
    const handleOpenNotificationsLogScreen = () => {
        setShowNotificationsLogScreen(true);
        setNotifications(prev => prev.map(n => ({...n, read: true})));
    };

    const handleBackToMenu = () => {
        setShowUserProfile(false);
    };

    const handleOpenVerification = () => {
        setShowUserProfile(false);
        setShowVerification(true);
    };

    const handleBackFromVerification = () => {
        setShowVerification(false);
        setShowUserProfile(true);
    };

    const handleVerificationSuccess = (verifiedPhone: string) => {
        const updatedUser = { ...currentUser!, phone: verifiedPhone, isVerified: true };
        setCurrentUser(updatedUser);
        setAllUsers(prevUsers => prevUsers.map(u => u.userId === currentUser!.userId ? updatedUser : u));
        setProfilePhone(verifiedPhone);
        setTempProfilePhone(verifiedPhone);
        setShowVerification(false);
        setShowUserProfile(true);
        addNotification('تهانينا! تم توثيق حسابك بنجاح', 'general');
    };

    // Profile Screen Handlers
    const handleProfileBannerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfileBannerData(reader.result as string);
                setShowBannerChangeModal(true);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };

    const handleConfirmBannerChange = (): { success: boolean; message: string } => {
        const currentChangeCount = currentUser?.profileBannerChangeCount ?? 0;
        const isPaid = currentChangeCount >= MAX_FREE_BANNER_CHANGES;

        if (isPaid && points < BANNER_CHANGE_COST) {
            return {
                success: false,
                message: `رصيدك غير كافٍ. تحتاج ${BANNER_CHANGE_COST.toLocaleString('de-DE')} نقطة`
            };
        }

        if (isPaid) {
            setPoints(p => p - BANNER_CHANGE_COST);
        }

        setProfileBanner(newProfileBannerData);

        const updatedUser = {
            ...currentUser!,
            profileBannerChangeCount: currentChangeCount + 1,
        };

        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.userId === currentUser!.userId ? updatedUser : u));

        const notifMessage = isPaid
            ? `تم تغيير صورة الخلفية بنجاح مقابل ${BANNER_CHANGE_COST.toLocaleString('de-DE')} نقطة`
            : `تم تغيير صورة الخلفية بنجاح`;
        addNotification(notifMessage, 'general');
        
        setShowBannerChangeModal(false);
        setNewProfileBannerData(null);

        return { success: true, message: 'Success' };
    };

    const triggerBannerFileInput = () => {
        bannerFileInputRef.current?.click();
    };

    const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setNewProfilePicData(reader.result as string);
                setShowPicChangeModal(true);
            };
            reader.readAsDataURL(file);
            event.target.value = '';
        }
    };
    
    const handleConfirmPicChange = (): { success: boolean; message: string } => {
        const currentChangeCount = currentUser?.profilePictureChangeCount ?? 0;
        const isPaid = currentChangeCount >= MAX_FREE_PIC_CHANGES;

        if (isPaid && points < PIC_CHANGE_COST) {
            return {
                success: false,
                message: `رصيدك غير كافٍ لتغيير صورة الملف الشخصي. تحتاج ${PIC_CHANGE_COST.toLocaleString('de-DE')} نقطة`
            };
        }

        if (isPaid) {
            setPoints(p => p - PIC_CHANGE_COST);
        }

        setProfilePicture(newProfilePicData);

        const updatedUser = {
            ...currentUser!,
            profilePictureChangeCount: currentChangeCount + 1,
        };

        setCurrentUser(updatedUser);
        setAllUsers(prev => prev.map(u => u.userId === currentUser!.userId ? updatedUser : u));

        const notifMessage = isPaid
            ? `تم تغيير صورة الملف الشخصي بنجاح مقابل ${PIC_CHANGE_COST.toLocaleString('de-DE')} نقطة`
            : `تم تغيير صورة الملف الشخصي بنجاح`;
        addNotification(notifMessage, 'general');
        
        setShowPicChangeModal(false);
        setNewProfilePicData(null);

        return { success: true, message: 'Success' };
    };

    const handleProfilePictureClick = () => {
        setShowProfilePictureMenu(true);
    };

    const triggerFileInput = () => {
        setShowProfilePictureMenu(false);
        fileInputRef.current?.click();
    };

    const handleRemoveProfilePicture = () => {
        setProfilePicture(null);
        addNotification('تمت إزالة صورة الملف الشخصي بنجاح', 'general');
        setShowRemovePicConfirm(false);
    };


    const handleConfirmNameChange = (newName: string): { success: boolean; message: string } => {
        const currentChangeCount = currentUser?.nameChangeCount ?? 0;
        
        const performUpdate = (isPaid: boolean) => {
            const updatedUser = { 
                ...currentUser!, 
                name: newName, 
                ...(!isPaid && { nameChangeCount: currentChangeCount + 1 })
            };
            
            if(isPaid) {
                setPoints(p => p - NAME_CHANGE_COST);
            }

            setCurrentUser(updatedUser);
            setAllUsers(prev => prev.map(u => u.userId === currentUser!.userId ? updatedUser : u));
            setProfileName(newName);
            
            const notifMessage = isPaid 
                ? `تم تغيير اسمك بنجاح إلى ${newName} مقابل ${NAME_CHANGE_COST.toLocaleString('de-DE')} نقطة`
                : `تم تغيير اسمك بنجاح إلى ${newName}`;
            addNotification(notifMessage, 'general');
            setShowNameChangeModal(false);
        };
    
        if (currentChangeCount < MAX_FREE_CHANGES) {
            performUpdate(false);
            return { success: true, message: 'Success' };
        } else {
            if (points >= NAME_CHANGE_COST) {
                performUpdate(true);
                return { success: true, message: 'Success' };
            } else {
                return { success: false, message: 'رصيد النقاط غير كافٍ لتغيير الاسم' };
            }
        }
    };
    
    const handleSavePhone = () => {
        const updatedUser = { ...currentUser!, phone: tempProfilePhone };
        setCurrentUser(updatedUser);
        setAllUsers(prevUsers => prevUsers.map(u => u.userId === currentUser!.userId ? updatedUser : u));
        setProfilePhone(tempProfilePhone);
        setIsEditingPhone(false);
    };

    const handleCancelEditPhone = () => {
        setIsEditingPhone(false);
        setTempProfilePhone(profilePhone);
    };
    
    const handleCopyUserId = () => {
        if (currentUser?.userId) {
            navigator.clipboard.writeText(currentUser.userId);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setCurrentUser(null);
        setShowLogoutConfirm(false);
        setShowMenu(false);
        setShowUserProfile(false);
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    // Chat handlers
    const handleOpenChat = () => setShowChat(true);
    const handleCloseChat = () => {
        setShowChat(false);
        setShowCreateRoomModal(false);
        setActiveRoom(null); // Ensure room is cleared when leaving chat section
    };
    const handleOpenCreateRoomModal = () => setShowCreateRoomModal(true);
    const handleCloseCreateRoomModal = () => setShowCreateRoomModal(false);
    const handleCreateRoom = (roomDetails: Omit<ChatRoom, 'id' | 'members' | 'creatorId'>) => {
        const newRoom: ChatRoom = {
            ...roomDetails,
            id: `R${Math.floor(1000 + Math.random() * 9000)}`,
            members: [currentUser!.userId], // Creator is the first member
            creatorId: currentUser!.userId
        };
        setChatRooms(prev => [...prev, newRoom]);
        handleCloseCreateRoomModal();
        addNotification(`تم إنشاء غرفة ${newRoom.name} بنجاح`, 'chat');
    };
    
    const handleJoinRoom = (roomId: string) => {
        const room = chatRooms.find(r => r.id === roomId);
        if (!room) {
            alert('الغرفة غير موجودة');
            return;
        }

        const isMember = room.members && room.members.includes(currentUser!.userId);

        // If user is already a member, just open the room
        if (isMember) {
            setActiveRoom(room);
            addNotification(`لقد دخلت غرفة ${room.name}`, 'chat');
            return;
        }
    
        // If not a member, handle joining logic
        // Check for entry fees for rooms
        if (room.entryFee) {
            if (room.feeCurrency === 'points') {
                if (points < room.entryFee) {
                    alert('ليس لديك نقاط كافية لدخول هذه الغرفة');
                    return;
                }
                setPoints(p => p - room.entryFee!);
            } else if (room.feeCurrency === 'jewels') {
                if (jewels < room.entryFee) {
                    alert('ليس لديك جواهر كافية لدخول هذه الغرفة');
                    return;
                }
                setJewels(j => j - room.entryFee!);
            }
        }
        
        // Add user to members list and post join message
        setChatRooms(prevRooms => prevRooms.map(r => 
            r.id === roomId 
            ? { ...r, members: [...(r.members || []), currentUser!.userId] } 
            : r
        ));
        
        const joinMessage: ChatMessage = {
            id: new Date().toISOString() + Math.random(),
            roomId: room.id,
            senderId: 'system',
            senderName: 'System',
            text: `${currentUser!.name} دخل الغرفة`,
            timestamp: Date.now(),
            type: 'notification',
        };
        
        setMessages(prev => ({
            ...prev,
            [room.id]: [...(prev[room.id] || []), joinMessage]
        }));
    
        addNotification(`لقد دخلت غرفة ${room.name} بنجاح`, 'chat');
        setActiveRoom(room);
    };

    const handleLeaveRoom = () => {
        if (activeRoom) {
            const leaveMessage: ChatMessage = {
                id: new Date().toISOString() + Math.random(),
                roomId: activeRoom.id,
                senderId: 'system',
                senderName: 'System',
                text: `${currentUser!.name} غادر الغرفة`,
                timestamp: Date.now(),
                type: 'notification',
            };
    
            setMessages(prev => ({
                ...prev,
                [activeRoom.id]: [...(prev[activeRoom.id] || []), leaveMessage]
            }));
        }
        setActiveRoom(null);
    };

    const handleSendMessage = (roomId: string, text: string) => {
        if (!text.trim() || !currentUser) return;
    
        const newMessage: ChatMessage = {
            id: new Date().toISOString() + Math.random(),
            roomId: roomId,
            senderId: currentUser.userId,
            senderName: currentUser.name,
            text: text.trim(),
            timestamp: Date.now(),
            type: 'message',
        };
    
        setMessages(prev => ({
            ...prev,
            [roomId]: [...(prev[roomId] || []), newMessage]
        }));
    };

    const handleWithdraw = (pointsToWithdraw: number): { success: boolean; message: string } => {
        if (points < pointsToWithdraw) {
            return { success: false, message: 'رصيد نقاطك غير كافٍ' };
        }

        const grossDollars = pointsToWithdraw / POINTS_PER_DOLLAR;
        const fee = grossDollars * 0.10;
        const netDollarsGained = grossDollars - fee;

        setPoints(prev => prev - pointsToWithdraw);
        setDollars(prev => prev + netDollarsGained);

        const successMessage = `تم تحويل ${pointsToWithdraw.toLocaleString('de-DE')} نقطة. لقد استلمت ${netDollarsGained.toFixed(2)}$ بعد خصم رسوم 10%.`;
        addNotification(successMessage, 'transactions');
        logTransaction('withdraw_points', `تحويل ${pointsToWithdraw.toLocaleString('de-DE')} نقطة`, pointsToWithdraw, 'points', true);
        logTransaction('withdraw_points', `استلام ${netDollarsGained.toFixed(2)}$ (بعد الرسوم)`, netDollarsGained, 'dollars', false);
        
        return { success: true, message: 'تم التحويل بنجاح!' };
    };
    
    const handleConvertPointsToJewels = (pointsToConvert: number): { success: boolean; message: string } => {
        if (points < pointsToConvert) {
            return { success: false, message: 'رصيد نقاطك غير كافٍ' };
        }
         if (pointsToConvert < POINTS_PER_JEWEL) {
             return { success: false, message: `الحد الأدنى للتحويل هو ${POINTS_PER_JEWEL} نقطة` };
        }

        const jewelsGained = Math.floor(pointsToConvert / POINTS_PER_JEWEL);

        setPoints(prev => prev - pointsToConvert);
        setJewels(prev => prev + jewelsGained);

        const successMessage = `تم تحويل ${pointsToConvert.toLocaleString('de-DE')} نقطة إلى ${jewelsGained.toLocaleString('de-DE')} جوهرة بنجاح!`;
        addNotification(successMessage, 'transactions');
        logTransaction('convert_points_jewels', `تحويل إلى جواهر`, pointsToConvert, 'points', true);
        logTransaction('convert_points_jewels', `استلام ${jewelsGained.toLocaleString('de-DE')} جوهرة`, jewelsGained, 'jewels', false);

        
        return { success: true, message: 'تم التحويل بنجاح!' };
    };

    const handleJoinLottery = (): { success: boolean; message: string } => {
        if (lotteryParticipants.length >= 500) {
            return { success: false, message: 'القرعة مكتملة حالياً' };
        }
        if (lotteryParticipants.includes(currentUser!.userId)) {
            return { success: false, message: 'لقد شاركت في هذه القرعة بالفعل' };
        }
        if (dollars < 1) {
            return { success: false, message: 'رصيدك غير كافٍ. تحتاج إلى 1 دولار للمشاركة' };
        }

        setDollars(d => d - 1);
        setLotteryPot(p => p + 1);
        setLotteryParticipants(prev => [...prev, currentUser!.userId]);
        addNotification('لقد انضممت إلى القرعة بنجاح! حظاً موفقاً', 'games');
        logTransaction('lottery_join', 'شراء تذكرة قرعة', 1, 'dollars', true);
        
        return { success: true, message: 'تم الانضمام بنجاح!' };
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const ProfileBannerChangeModalComponent = () => {
        const [error, setError] = useState('');
        
        const currentChangeCount = currentUser?.profileBannerChangeCount ?? 0;
        const isFree = currentChangeCount < MAX_FREE_BANNER_CHANGES;
        const remainingFreeChanges = Math.max(0, MAX_FREE_BANNER_CHANGES - currentChangeCount);
        const cost = isFree ? 'مجاني' : `${BANNER_CHANGE_COST.toLocaleString('de-DE')} نقطة`;

        const handleSubmit = () => {
            setError('');
            const result = handleConfirmBannerChange();
            if (!result.success) {
                setError(result.message);
            }
        };

        const handleCancel = () => {
            setShowBannerChangeModal(false);
            setNewProfileBannerData(null);
        };

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                <div className="w-full max-w-sm bg-black/60 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center text-white">
                    <h2 className="text-xl font-bold mb-4">تأكيد تغيير الخلفية</h2>
                    
                    <div className="w-full aspect-video rounded-lg border-4 border-[#FFC107] mb-4 overflow-hidden bg-gray-800">
                        <img src={newProfileBannerData!} alt="خلفية الملف الشخصي الجديدة" className="w-full h-full object-cover" />
                    </div>

                    <div className="text-sm text-[#BEBEBE] mb-4 bg-black/30 p-3 rounded-lg text-right leading-relaxed">
                        <p>يمكنك تغيير صورة الخلفية مجانًا مرتين. بعد ذلك، ستكون التكلفة 5000 نقطة لكل تغيير</p>
                    </div>

                    <div className="w-full text-right bg-black/30 p-3 rounded-lg mb-4">
                        <p className="font-semibold text-white">
                            التكلفة: <span className={`font-bold ${isFree ? 'text-green-400' : 'text-[#FFC107]'}`}>{cost}</span>
                        </p>
                        {isFree && <p className="text-xs text-white">({`متبقٍ ${remainingFreeChanges} ${remainingFreeChanges === 1 ? 'محاولة مجانية' : 'محاولات مجانية'}`})</p>}
                    </div>

                    {error && <p className="w-full text-right bg-red-500/20 text-red-300 text-sm py-2 px-3 rounded-md mt-2 mb-4">{error}</p>}

                    <div className="w-full flex items-center gap-4 mt-2">
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] transition-colors"
                        >
                            تأكيد
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const ProfilePictureChangeModalComponent = () => {
        const [error, setError] = useState('');
        
        const currentChangeCount = currentUser?.profilePictureChangeCount ?? 0;
        const isFree = currentChangeCount < MAX_FREE_PIC_CHANGES;
        const remainingFreeChanges = Math.max(0, MAX_FREE_PIC_CHANGES - currentChangeCount);
        const cost = isFree ? 'مجاني' : `${PIC_CHANGE_COST.toLocaleString('de-DE')} نقطة`;

        const handleSubmit = () => {
            setError('');
            const result = handleConfirmPicChange();
            if (!result.success) {
                setError(result.message);
            }
        };

        const handleCancel = () => {
            setShowPicChangeModal(false);
            setNewProfilePicData(null);
        };

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                <div className="w-full max-w-sm bg-black/60 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center text-white">
                    <h2 className="text-xl font-bold mb-4">تأكيد تغيير الصورة</h2>
                    
                    <div className="w-32 h-32 rounded-full border-4 border-[#FFC107] mb-4 overflow-hidden">
                        <img src={newProfilePicData!} alt="صورة الملف الشخصي الجديدة" className="w-full h-full object-cover" />
                    </div>

                    <div className="text-sm text-[#BEBEBE] mb-4 bg-black/30 p-3 rounded-lg text-right leading-relaxed">
                        <p>يمكنك تغيير صورة ملفك الشخصي مجانًا مرتين. بعد ذلك، ستكون التكلفة 5000 نقطة لكل تغيير</p>
                    </div>

                    <div className="w-full text-right bg-black/30 p-3 rounded-lg mb-4">
                        <p className="font-semibold text-white">
                            التكلفة: <span className={`font-bold ${isFree ? 'text-green-400' : 'text-[#FFC107]'}`}>{cost}</span>
                        </p>
                        {isFree && <p className="text-xs text-white">({`متبقٍ ${remainingFreeChanges} ${remainingFreeChanges === 1 ? 'محاولة مجانية' : 'محاولات مجانية'}`})</p>}
                    </div>

                    {error && <p className="w-full text-right bg-red-500/20 text-red-300 text-sm py-2 px-3 rounded-md mt-2 mb-4">{error}</p>}

                    <div className="w-full flex items-center gap-4 mt-2">
                        <button
                            onClick={handleCancel}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] transition-colors"
                        >
                            تأكيد
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const NameChangeModalComponent = () => {
        const [newName, setNewName] = useState(profileName);
        const [error, setError] = useState('');
        
        const currentChangeCount = currentUser?.nameChangeCount ?? 0;
        const isFree = currentChangeCount < MAX_FREE_CHANGES;
        const remainingFreeChanges = MAX_FREE_CHANGES - currentChangeCount;
        const cost = isFree ? 'مجاني' : `${NAME_CHANGE_COST.toLocaleString('de-DE')} نقطة`;

        const handleSubmit = () => {
            setError('');
            if (!newName.trim()) {
                setError('لا يمكن أن يكون الاسم فارغًا');
                return;
            }
            if (newName.trim() === profileName) {
                setError('الرجاء إدخال اسم جديد');
                return;
            }

            const result = handleConfirmNameChange(newName.trim());

            if (!result.success) {
                setError(result.message);
            }
        }

        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                <div className="w-full max-w-sm bg-black/60 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center text-white">
                    <h2 className="text-xl font-bold mb-4">تغيير اسم المستخدم</h2>
                    <div className="text-sm text-[#BEBEBE] mb-4 bg-black/30 p-3 rounded-lg text-right leading-relaxed">
                        <p>يمكنك تغيير اسمك مجانًا مرتين فقط. بعد استنفاد المحاولتين، يمكنك تغيير الاسم مقابل 5000 نقطة من رصيدك</p>
                    </div>

                    <div className="w-full text-right bg-black/30 p-3 rounded-lg mb-4">
                        <p className="font-semibold text-white">
                            التكلفة: <span className={`font-bold ${isFree ? 'text-green-400' : 'text-[#FFC107]'}`}>{cost}</span>
                        </p>
                        {isFree && <p className="text-xs text-white">({`متبقٍ ${remainingFreeChanges} ${remainingFreeChanges === 1 ? 'محاولة مجانية' : 'محاولات مجانية'}`})</p>}
                    </div>

                    <input
                        type="text"
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        placeholder="أدخل الاسم الجديد"
                        className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-right"
                        autoFocus
                    />

                    {error && <p className="w-full text-right bg-red-500/20 text-red-300 text-sm py-2 px-3 rounded-md mt-4">{error}</p>}

                    <div className="w-full flex items-center gap-4 mt-6">
                        <button
                            onClick={() => setShowNameChangeModal(false)}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] transition-colors disabled:bg-[#FFC107]/50 disabled:cursor-not-allowed"
                            disabled={!newName.trim() || newName.trim() === profileName}
                        >
                            تأكيد
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const logoutConfirmModal = showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="w-full max-w-sm bg-black/50 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-white mb-4">تأكيد تسجيل الخروج</h2>
                <p className="text-[#BEBEBE] mb-6">هل أنت متأكد أنك تريد تسجيل الخروج</p>
                <div className="w-full flex items-center gap-4">
                    <button
                        onClick={cancelLogout}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={confirmLogout}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                    >
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );

    const ProfilePictureMenuComponent = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast" onClick={() => setShowProfilePictureMenu(false)}>
            <div className="w-full max-w-xs bg-black/60 border border-gray-700/50 rounded-2xl shadow-lg p-4 flex flex-col gap-2 text-white" onClick={(e) => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-center mb-3">تعديل الصور</h3>
                
                {/* Profile Picture Section */}
                <div className="border-b border-gray-700 pb-3 mb-2">
                    <h4 className="font-semibold text-right text-[#BEBEBE] px-3 pb-2">صورة الملف الشخصي</h4>
                    <button
                        onClick={() => { if(profilePicture) { setShowPhotoViewer(true); setShowProfilePictureMenu(false); } }}
                        disabled={!profilePicture}
                        className="w-full text-right p-3 rounded-lg hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        عرض الصورة
                    </button>
                    <button
                        onClick={triggerFileInput}
                        className="w-full text-right p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        تحميل صورة جديدة
                    </button>
                    <button
                        onClick={() => { setShowRemovePicConfirm(true); setShowProfilePictureMenu(false); }}
                        disabled={!profilePicture}
                        className="w-full text-right p-3 rounded-lg text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        إزالة الصورة الحالية
                    </button>
                </div>
    
                {/* Banner Section */}
                <div>
                     <h4 className="font-semibold text-right text-[#BEBEBE] px-3 pb-2">صورة الخلفية</h4>
                     <button
                        onClick={() => {
                            triggerBannerFileInput();
                            setShowProfilePictureMenu(false);
                        }}
                        className="w-full text-right p-3 rounded-lg hover:bg-white/10 transition-colors"
                    >
                        تغيير صورة الخلفية
                    </button>
                </div>
    
                <div className="border-t border-gray-700 mt-3 mb-1"></div>
                <button
                    onClick={() => setShowProfilePictureMenu(false)}
                    className="w-full text-center p-3 rounded-lg bg-gray-600 hover:bg-gray-500 transition-colors"
                >
                    إغلاق
                </button>
            </div>
        </div>
    );

    const PhotoViewerComponent = () => (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-lg z-50 flex flex-col items-center justify-center p-4 animate-fade-in-fast" onClick={() => setShowPhotoViewer(false)}>
            <button onClick={() => setShowPhotoViewer(false)} className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full z-10">
                <XIcon className="w-8 h-8"/>
            </button>
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                <img src={profilePicture!} alt="صورة الملف الشخصي" className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"/>
            </div>
        </div>
    );

    const RemovePictureConfirmComponent = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="w-full max-w-sm bg-black/50 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
                <h2 className="text-xl font-bold text-white mb-4">تأكيد الإزالة</h2>
                <p className="text-[#BEBEBE] mb-6">هل أنت متأكد أنك تريد إزالة صورة ملفك الشخصي؟</p>
                <div className="w-full flex items-center gap-4">
                    <button
                        onClick={() => setShowRemovePicConfirm(false)}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                    >
                        إلغاء
                    </button>
                    <button
                        onClick={handleRemoveProfilePicture}
                        className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-red-600/80 text-white hover:bg-red-600 transition-colors"
                    >
                        تأكيد
                    </button>
                </div>
            </div>
        </div>
    );


    if (!currentUser) {
        return <Auth onLoginSuccess={setCurrentUser} />;
    }

    if (showVerification) {
        return (
            <AccountVerification
                currentUser={currentUser}
                onBack={handleBackFromVerification}
                onVerified={handleVerificationSuccess}
            />
        );
    }

    if (showGamesScreen) {
        return <GamesScreen onBack={() => setShowGamesScreen(false)} />;
    }
    
    if (showWithdrawScreen) {
        return <WithdrawScreen 
            onBack={() => setShowWithdrawScreen(false)} 
            points={points}
            jewels={jewels}
            profilePicture={profilePicture}
            onWithdraw={handleWithdraw}
            pointsPerDollar={POINTS_PER_DOLLAR}
            onConvertPointsToJewels={handleConvertPointsToJewels}
            pointsPerJewel={POINTS_PER_JEWEL}
        />;
    }

    if (showJewelsStore) {
        return <JewelsStore 
            onBack={() => setShowJewelsStore(false)}
        />;
    }

    if (showPurchaseHistory) {
        return <PurchaseHistory
            onBack={() => setShowPurchaseHistory(false)}
            transactions={purchaseHistory}
        />;
    }

    if (showChat) {
        if (activeRoom) {
            return (
                <RoomView
                    room={activeRoom}
                    currentUser={currentUser}
                    messages={messages[activeRoom.id] || []}
                    onBack={handleLeaveRoom}
                    onSendMessage={handleSendMessage}
                />
            );
        }

        return (
            <>
                <Chat
                    rooms={chatRooms}
                    onBack={handleCloseChat}
                    onOpenCreateRoom={handleOpenCreateRoomModal}
                    onJoinRoom={handleJoinRoom}
                />
                {showCreateRoomModal && (
                    <CreateRoomModal
                        onClose={handleCloseCreateRoomModal}
                        onCreate={handleCreateRoom}
                    />
                )}
            </>
        );
    }

    if (showMenu) {
        if (showUserProfile) {
            // USER PROFILE SCREEN - NEW DESIGN WITH BANNER
            return (
                 <>
                    <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
                        <input
                            type="file"
                            ref={bannerFileInputRef}
                            onChange={handleProfileBannerChange}
                            accept="image/*"
                            className="hidden"
                        />
                         <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleProfilePictureChange}
                            accept="image/*"
                            className="hidden"
                        />

                        <div className="container mx-auto max-w-lg min-h-screen flex flex-col text-[#BEBEBE]">
                           
                            {/* Banner Section */}
                            <section className="relative h-80 rounded-b-2xl overflow-hidden shadow-lg bg-gray-800">
                                <div
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{ backgroundImage: profileBanner ? `url(${profileBanner})` : 'none' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                
                                <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 text-white">
                                    <button onClick={handleBackToMenu} className="p-1.5 rounded-full hover:bg-black/30 transition-colors" aria-label="عودة">
                                        <ArrowRightIcon className="w-6 h-6" />
                                    </button>
                                    <h1 className="text-xl font-bold" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.7)'}}>الملف الشخصي</h1>
                                    <div className="w-9 h-9"></div> {/* Spacer for centering title */}
                                </header>
                                
                            </section>

                            {/* Profile Summary */}
                            <section className="relative px-4 -mt-14 z-10">
                                <div className="flex gap-4 h-28">
                                    <div className="flex-grow self-end mb-5">
                                        <h2 className="text-3xl font-bold text-white" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.4)'}}>{profileName}</h2>
                                    </div>
                                    <div className="relative flex-shrink-0 self-end">
                                        <button onClick={handleProfilePictureClick} className="w-28 h-28 rounded-full border-4 border-[#FFC107] shadow-lg bg-gray-700 flex items-center justify-center overflow-hidden" aria-label="خيارات الصورة الرمزية">
                                            {profilePicture ? (
                                                <img src={profilePicture} alt="صورة الملف الشخصي" className="w-full h-full object-cover" />
                                            ) : (
                                                <UserIcon className="w-16 h-16 text-[#FFC107]" />
                                            )}
                                        </button>
                                        <div onClick={handleProfilePictureClick} className="absolute bottom-1 left-1 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-slate-800 border-2 border-[#FFC107] cursor-pointer">
                                            <PencilIcon className="w-5 h-5"/>
                                        </div>
                                    </div>
                                </div>
                            </section>
                            
                            <div className="p-4 pt-0">
                                {/* Personal Information */}
                                <section className="mt-4">
                                    <div className="flex items-center gap-3 mb-3 pr-2">
                                        <div className="w-1 h-5 bg-[#A37C00] rounded-full"></div>
                                        <h3 className="text-xl font-bold text-[#FFC107]">المعلومات الشخصية</h3>
                                    </div>
                                    <div className="bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg p-4 backdrop-blur-sm">
                                        {/* Full Name */}
                                        <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                            <div className="text-right flex-grow flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                    <UserIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">الاسم الكامل</p>
                                                    <p className="text-[#BEBEBE]">{profileName}</p>
                                                </div>
                                            </div>
                                            <button onClick={() => setShowNameChangeModal(true)} className="p-2 text-[#BEBEBE] hover:text-white">
                                                <PencilIcon className="w-5 h-5" />
                                            </button>
                                        </div>
                                        {/* Phone Number */}
                                        <div className="py-3 border-b border-gray-700">
                                            {isEditingPhone && !currentUser.isVerified ? (
                                                // EDITING VIEW
                                                <div className="animate-fade-in-fast">
                                                    <p className="font-semibold text-white text-right mb-2">رقم الهاتف</p>
                                                    <div className="flex items-center gap-3">
                                                        {/* Input on the right */}
                                                        <div className="relative flex-grow">
                                                            <input
                                                                type="text"
                                                                value={tempProfilePhone}
                                                                onChange={(e) => setTempProfilePhone(e.target.value)}
                                                                className="w-full bg-black/50 border border-[#A37C00] rounded-lg py-3 pr-11 pl-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-left"
                                                                style={{direction: 'ltr'}}
                                                                autoFocus
                                                            />
                                                            <PhoneIcon className="w-6 h-6 text-[#BEBEBE] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                                        </div>
                                                        {/* Actions on the left */}
                                                        <div className="flex items-center gap-1 flex-shrink-0">
                                                            <button onClick={handleCancelEditPhone} className="p-2 text-red-400 hover:bg-red-500/20 rounded-full transition-colors">
                                                                <XIcon className="w-6 h-6" />
                                                            </button>
                                                            <button onClick={handleSavePhone} className="p-2 text-green-400 hover:bg-green-500/20 rounded-full transition-colors">
                                                                <CheckIcon className="w-6 h-6" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                // DISPLAY VIEW
                                                <div className="flex items-center justify-between">
                                                    <div className="text-right flex-grow flex items-center gap-3">
                                                        <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                            <PhoneIcon className="w-6 h-6 text-white" />
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold text-white">رقم الهاتف</p>
                                                            <p className="text-[#BEBEBE]">{profilePhone}</p>
                                                        </div>
                                                    </div>
                                                    <button onClick={() => setIsEditingPhone(true)} className="p-2 text-[#BEBEBE] hover:text-white" disabled={currentUser.isVerified}>
                                                        <PencilIcon className={`w-5 h-5 ${currentUser.isVerified && 'opacity-50'}`} />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                        {/* Email */}
                                        <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                            <div className="text-right flex-grow flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                    <MailIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">البريد الإلكتروني</p>
                                                    <p className="text-[#BEBEBE]">{profileEmail}</p>
                                                </div>
                                            </div>
                                            <div className="w-10 h-10"></div> {/* Spacer */}
                                        </div>
                                        {/* User ID */}
                                        <div className="flex items-center justify-between py-3">
                                            <div className="text-right flex-grow flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                    <IdIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-white">معرّف المستخدم</p>
                                                    <p className="text-[#BEBEBE] tracking-wider">{currentUser.userId}</p>
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <button onClick={handleCopyUserId} className="p-2 text-[#BEBEBE] hover:text-white transition-colors">
                                                    <CopyIcon className="w-6 h-6" />
                                                </button>
                                                {copied && <span className="absolute -top-6 -right-5 text-xs bg-slate-800 text-white px-2 py-0.5 rounded whitespace-nowrap">تم النسخ!</span>}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                
                                {/* Security Section */}
                                <section className="mt-8">
                                    <div className="flex items-center gap-3 mb-3 pr-2">
                                        <div className="w-1 h-5 bg-[#A37C00] rounded-full"></div>
                                        <h3 className="text-xl font-bold text-[#FFC107]">الأمان</h3>
                                    </div>
                                    <div className="bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg p-4 backdrop-blur-sm">
                                        <div className="flex items-center justify-between py-2">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                    <LockIcon className="w-6 h-6 text-[#FFC107]" />
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-white">كلمة المرور</p>
                                                    <p className="text-[#BEBEBE] text-sm">غير متاحة لحسابات google</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                {/* Settings Section */}
                                <section className="mt-8">
                                    <div className="flex items-center gap-3 mb-3 pr-2">
                                        <div className="w-1 h-5 bg-[#A37C00] rounded-full"></div>
                                        <h3 className="text-xl font-bold text-[#FFC107]">الإعدادات</h3>
                                    </div>
                                    <div className="bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg p-4 backdrop-blur-sm">
                                        {/* Account Verification */}
                                        <div className="flex items-center justify-between py-3 border-b border-gray-700">
                                            {currentUser.isVerified ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                        <ShieldCheckIcon className="w-6 h-6 text-green-500" />
                                                    </div>
                                                    <div className="text-right flex-grow">
                                                        <p className="font-semibold text-white">الحساب موثق</p>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button 
                                                    onClick={handleOpenVerification}
                                                    className="w-full flex items-center justify-between text-right"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                            <ShieldExclamationIcon className="w-6 h-6 text-red-500" />
                                                        </div>
                                                        <p className="font-semibold text-white">توثيق الحساب</p>
                                                    </div>
                                                </button>
                                            )}
                                        </div>
                                        {/* Terms of Use */}
                                        <div className="flex items-center justify-between py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 flex items-center justify-center bg-black/30 rounded-full">
                                                    <DocumentIcon className="w-6 h-6 text-white" />
                                                </div>
                                                <p className="font-semibold text-white">شروط الاستخدام</p>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                        </div>
                    </div>
                    {showNameChangeModal && <NameChangeModalComponent />}
                    {showPicChangeModal && <ProfilePictureChangeModalComponent />}
                    {showBannerChangeModal && <ProfileBannerChangeModalComponent />}
                    {logoutConfirmModal}
                    {showProfilePictureMenu && <ProfilePictureMenuComponent />}
                    {showPhotoViewer && profilePicture && <PhotoViewerComponent />}
                    {showRemovePicConfirm && <RemovePictureConfirmComponent />}
                </>
            );
        }

        if (showNotificationsLogScreen) {
            const categories = [
                { key: 'chat', label: 'غرفة دردشة', icon: <ChatIcon className="w-5 h-5" /> },
                { key: 'games', label: 'ألعاب', icon: <GamesIcon className="text-xl" /> },
                { key: 'transactions', label: 'تحويلات', icon: <WithdrawIcon className="w-5 h-5" /> },
                { key: 'counter', label: 'عداد', icon: <ClockIcon className="w-5 h-5" /> },
            ] as const;

            const filteredNotifications = notifications.filter(n => n.category === activeNotificationCategory);

            return (
                <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
                    <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                        {/* Header */}
                        <header className="relative flex items-center justify-center py-2 mb-4">
                            <h1 className="text-2xl font-bold text-white">سجل الإشعارات</h1>
                            <button onClick={() => setShowNotificationsLogScreen(false)} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white" aria-label="عودة">
                                <ArrowRightIcon className="w-7 h-7" />
                            </button>
                        </header>

                        {/* Category Tabs */}
                        <div className="bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg p-1.5 backdrop-blur-sm mb-4 flex flex-row-reverse justify-start gap-1">
                            {categories.map(cat => (
                                <button
                                    key={cat.key}
                                    onClick={() => setActiveNotificationCategory(cat.key)}
                                    className={`flex-1 py-2 px-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all duration-300 ${activeNotificationCategory === cat.key ? 'bg-[#FFC107] text-slate-900 shadow-md' : 'text-[#BEBEBE] hover:bg-black/50'}`}
                                >
                                    {cat.icon}
                                    <span>{cat.label}</span>
                                </button>
                            ))}
                        </div>

                        {/* Body */}
                        <div className="flex-grow">
                            {filteredNotifications.length > 0 ? (
                                <ul className="space-y-3">
                                    {filteredNotifications.map(n => (
                                        <li key={n.id} className="bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg p-3 text-right backdrop-blur-sm">
                                            <p className="text-white font-medium">{n.message}</p>
                                            <p className="text-xs text-white mt-1">{formatTimeAgo(n.timestamp)}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-[#BEBEBE] pt-16">
                                    <BellIcon className="w-20 h-20 mb-4 opacity-50" />
                                    <p className="text-lg font-semibold">لا توجد إشعارات في هذا القسم</p>
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="mt-6">
                                <button
                                    onClick={handleClearNotifications}
                                    className="w-full py-3 px-4 rounded-lg font-semibold text-white bg-red-600/80 hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    مسح جميع الإشعارات
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        // MAIN MENU (SETTINGS) SCREEN - NEW DESIGN
        return (
            <>
                <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
                    <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8">
                        {/* Header */}
                        <header className="relative flex items-center justify-center py-2">
                            <h1 className="text-2xl font-bold text-white">إعدادات</h1>
                            <button onClick={handleBackToMain} className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-white" aria-label="عودة">
                                <ArrowRightIcon className="w-7 h-7" />
                            </button>
                        </header>

                        {/* User Info Display */}
                        <div className="flex flex-row items-center justify-between py-4">
                            <p className="text-2xl font-bold text-white">{profileName}</p>
                            <div className="w-20 h-20 rounded-full border-4 border-[#FFC107] shadow-lg bg-black/20">
                                {profilePicture ? (
                                    <img src={profilePicture} alt="صورة الملف الشخصي" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                                        <UserIcon className="w-10 h-10 text-[#FFC107]" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Main card */}
                        <div className="bg-gray-900/50 border border-gray-700/80 rounded-2xl shadow-lg p-3 space-y-2 mt-8">
                            {/* Menu Items */}
                            <div className="bg-gray-800/60 rounded-lg text-white">
                                 <button 
                                    onClick={handleOpenUserProfile}
                                    className="w-full flex items-center justify-between text-right p-4 hover:bg-gray-700/60 transition-colors border-b border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <UsersIcon className="w-6 h-6 text-[#FFC107]" />
                                        <span className="font-semibold">ملف المستخدم</span>
                                    </div>
                                </button>
                                <button 
                                    onClick={handleOpenNotificationsLogScreen}
                                    className="w-full flex items-center justify-between text-right p-4 hover:bg-gray-700/60 transition-colors border-b border-white/10"
                                >
                                    <div className="flex items-center gap-3">
                                        <BellIcon className="w-6 h-6 text-[#FFC107]" />
                                        <span className="font-semibold">سجل الإشعارات</span>
                                    </div>
                                </button>
                                <button 
                                    onClick={() => alert('سيتم تفعيل هذه الميزة قريباً!')}
                                    className="w-full flex items-center justify-between text-right p-4 hover:bg-gray-700/60 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <HeadsetIcon className="w-6 h-6 text-[#FFC107]" />
                                        <span className="font-semibold">تواصل مع دعم الفني</span>
                                    </div>
                                </button>
                            </div>
                            
                             <div className="bg-gray-800/60 rounded-lg text-white">
                                <button 
                                    onClick={handleLogoutClick}
                                    className="w-full flex items-center justify-between text-right p-4 hover:bg-gray-700/60 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <LogoutIcon className="w-6 h-6 text-red-400" />
                                        <span className="font-semibold text-red-300">تسجيل الخروج</span>
                                    </div>
                                </button>
                             </div>
                        </div>

                        <SocialLinks />
                    </div>
                </div>
                {logoutConfirmModal}
            </>
        );
    }

    const renderContent = () => {
        if (showStore) {
            return <Store 
                onBack={() => setShowStore(false)} 
                onPurchase={handlePurchaseCounter}
                userPoints={points}
                userJewels={jewels}
            />;
        }

        if (showPackagesStore) {
            return <PackagesStore
                onBack={() => setShowPackagesStore(false)}
                userPoints={points}
                userJewels={jewels}
                onBuyPoints={handleBuyPointsPackage}
                onBuyJewels={handleBuyJewelsPackage}
                dollars={dollars}
                currentUser={currentUser!}
                lotteryParticipants={lotteryParticipants}
                onJoinLottery={handleJoinLottery}
                lotteryPrizeName={lotteryPrizeName}
                lotteryPrizeDescription={lotteryPrizeDescription}
                lotteryPrizeImage={lotteryPrizeImage}
                lotteryHistory={lotteryHistory}
                onOpenJewelsStore={() => setShowJewelsStore(true)}
                onOpenPurchaseHistory={() => setShowPurchaseHistory(true)}
            />;
        }
        
        if (showGiftCounterScreen) {
            return <GiftCounter
                onBack={() => setShowGiftCounterScreen(false)}
                onGift={handleGiftCounter}
                allUsers={allUsers}
                currentUserPoints={points}
                currentUserJewels={jewels}
            />;
        }

        if (showSendPointsScreen) {
            return <SendPoints
                onBack={() => setShowSendPointsScreen(false)}
                onSend={handleSendPoints}
                allUsers={allUsers}
                currentUserPoints={points}
            />;
        }
        
        if (!hasCounter) {
            return (
                <div className="flex flex-col gap-6">
                    <PointCollector onCollect={handleCollectPoints} />
                    <CounterStore points={points} onBuy={handleBuyCounter} cost={COUNTER_COST} />
                </div>
            );
        }

        return (
            <MainCounter
                activationStartTime={activationStartTime}
                onActivate={handleActivateCounter}
                cooldownPeriod={COOLDOWN_PERIOD}
                jewelRewardPerCycle={jewelRewardPerCycle}
                pointReward={pointRewardPerCycle}
                onOpenStore={() => setShowStore(true)}
                onOpenPackagesStore={() => setShowPackagesStore(true)}
                onOpenGiftCounterScreen={() => setShowGiftCounterScreen(true)}
                onOpenSendPointsScreen={() => setShowSendPointsScreen(true)}
                onOpenChat={handleOpenChat}
                onOpenGames={() => setShowGamesScreen(true)}
                onOpenWithdraw={() => setShowWithdrawScreen(true)}
            />
        );
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#FFC107]/40">
            {showNotificationsPanel && (
                <NotificationsPanel 
                    notifications={notifications}
                    onClose={handleToggleNotifications}
                />
            )}
            {logoutConfirmModal}
            <div className="w-full max-w-md mx-auto">
                {!showStore && !showGiftCounterScreen && !showSendPointsScreen && !showPackagesStore && (
                    <Header 
                        dollars={dollars} 
                        points={points} 
                        jewels={jewels}
                        onToggleNotifications={handleToggleNotifications}
                        unreadCount={unreadCount}
                        onMenuClick={handleMenuClick}
                    />
                )}
                <main className={showStore || showPackagesStore || showGiftCounterScreen || showSendPointsScreen ? '' : 'mt-4'}>
                    {renderContent()}
                </main>
            </div>
        </div>
    );
};

export default App;
