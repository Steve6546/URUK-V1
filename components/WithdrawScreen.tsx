
import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, UserIcon, WithdrawIcon, DiamondIcon, CoinIcon, MasterCardIcon, ZainCashIconSimple, FabIcon } from './icons';

interface WithdrawScreenProps {
    onBack: () => void;
    points: number;
    jewels: number;
    profilePicture: string | null;
    pointsPerDollar: number;
    onWithdraw: (pointsToWithdraw: number) => { success: boolean; message: string };
    pointsPerJewel: number;
    onConvertPointsToJewels: (pointsToConvert: number) => { success: boolean; message: string };
}

const WithdrawScreen: React.FC<WithdrawScreenProps> = ({ onBack, points, profilePicture, pointsPerDollar, onWithdraw, jewels, pointsPerJewel, onConvertPointsToJewels }) => {
    const [activeTab, setActiveTab] = useState<'cash' | 'jewels'>('cash');

    // State for cash conversion
    const [conversionType, setConversionType] = useState('points');
    const [dollarAmount, setDollarAmount] = useState('');
    const [pointsAmount, setPointsAmount] = useState('');

    // State for jewel conversion
    const [pointsToConvert, setPointsToConvert] = useState('');
    const [jewelsToReceive, setJewelsToReceive] = useState('');

    // Modal and loading states
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);


    useEffect(() => {
        if (activeTab === 'cash') {
            if (conversionType === 'points') {
                const pointsValue = parseFloat(pointsAmount);
                if (!isNaN(pointsValue) && pointsValue > 0) {
                    setDollarAmount((pointsValue / pointsPerDollar).toFixed(2));
                } else {
                    setDollarAmount('');
                }
            } else { // conversionType === 'dollars'
                const dollarValue = parseFloat(dollarAmount);
                if (!isNaN(dollarValue) && dollarValue > 0) {
                    setPointsAmount(Math.ceil(dollarValue * pointsPerDollar).toString());
                } else {
                    setPointsAmount('');
                }
            }
        } else { // activeTab === 'jewels'
            const pointsValue = parseFloat(pointsToConvert);
            if (!isNaN(pointsValue) && pointsValue > 0) {
                setJewelsToReceive(Math.floor(pointsValue / pointsPerJewel).toString());
            } else {
                setJewelsToReceive('');
            }
        }
    }, [dollarAmount, pointsAmount, conversionType, pointsToConvert, activeTab, pointsPerDollar, pointsPerJewel]);

    const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConversionType('points');
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPointsAmount(value);
    };

    const handleDollarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setConversionType('dollars');
        const value = e.target.value.replace(/[^0-9.]/g, '');
        setDollarAmount(value);
    };

    const handlePointsToConvertChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        setPointsToConvert(value);
    };

    const resetInputs = () => {
        setDollarAmount('');
        setPointsAmount('');
        setPointsToConvert('');
        setJewelsToReceive('');
        setError('');
        setSuccess('');
    }

    const handleTabChange = (tab: 'cash' | 'jewels') => {
        setActiveTab(tab);
        resetInputs();
    }

    const handleSubmit = () => {
        setError('');
        setSuccess('');
        setIsLoading(false);

        if (activeTab === 'cash') {
            const dollarsToReceive = parseFloat(dollarAmount);
            if (isNaN(dollarsToReceive) || dollarsToReceive < 10) {
                setError('الحد الأدنى للسحب هو 10$.');
                return;
            }
            setShowConfirmModal(true);
        } else {
            const pointsValue = parseInt(pointsToConvert, 10);
            if (isNaN(pointsValue) || pointsValue <= 0) {
                setError('الرجاء إدخال مبلغ صحيح للتحويل.');
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            const result = onConvertPointsToJewels(pointsValue);
            setTimeout(() => {
                if (result.success) {
                    setSuccess(result.message);
                    resetInputs();
                    setTimeout(() => setSuccess(''), 3000);
                } else {
                    setError(result.message);
                }
                setIsLoading(false);
            }, 500);
        }
    };
    
    const isSubmitDisabled = isLoading || (activeTab === 'cash' && !pointsAmount) || (activeTab === 'jewels' && !pointsToConvert);

    const ConfirmWithdrawalModal = () => {
        const grossAmount = parseFloat(dollarAmount);
        const fee = grossAmount * 0.10;
        const netAmount = grossAmount - fee;
    
        return (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                <div className="w-full max-w-sm bg-black/50 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col items-center text-center">
                    <h2 className="text-xl font-bold text-white mb-4">تأكيد السحب</h2>
                    <p className="text-[#BEBEBE] mb-3 text-lg" dir="rtl">
                        هل أنت متأكد أنك تريد تحويل <span className="font-bold text-[#FFC107]">{parseInt(pointsAmount).toLocaleString('de-DE')}</span> نقطة إلى <span className="font-bold text-green-400">{grossAmount.toFixed(2)}$</span>؟
                    </p>
                    <p className="text-[#BEBEBE] text-sm mb-1">
                        سيتم خصم رسوم تحويل بنسبة 10%.
                    </p>
                    <p className="text-white text-base font-semibold mb-6">
                        المبلغ الصافي الذي ستستلمه: <span className="font-bold text-green-400">{netAmount.toFixed(2)}$</span>
                    </p>
                    <div className="w-full flex items-center gap-4">
                        <button
                            onClick={() => setShowConfirmModal(false)}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={() => {
                                setShowConfirmModal(false);
                                setShowPaymentModal(true);
                            }}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                            موافقة
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    const PaymentInfoModal = () => {
        const [paymentMethod, setPaymentMethod] = useState<'mastercard' | 'zaincash' | 'fab'>('mastercard');
        const [modalError, setModalError] = useState('');
        const [accountNumber, setAccountNumber] = useState('');
        const [cardName, setCardName] = useState('');
        const [cardNumber, setCardNumber] = useState('');
    
        const handleFinalSubmit = () => {
            setModalError('');
            setIsLoading(true);
    
            let paymentDetailsString = '';
    
            if (paymentMethod === 'mastercard') {
                if (!cardName.trim() || !cardNumber.trim()) {
                    setModalError('يرجى ملء جميع تفاصيل البطاقة.');
                    setIsLoading(false);
                    return;
                }
                if (cardNumber.replace(/\s/g, '').length < 16) {
                    setModalError('رقم البطاقة غير صالح.');
                    setIsLoading(false);
                    return;
                }
                paymentDetailsString = `MasterCard (${cardName}, **** ${cardNumber.slice(-4)})`;
            } else {
                if (!accountNumber.trim()) {
                    setModalError(`الرجاء إدخال رقم حساب ${paymentMethod === 'fab' ? 'FAB' : 'زين كاش'}.`);
                    setIsLoading(false);
                    return;
                }
                paymentDetailsString = `${paymentMethod === 'fab' ? 'FAB' : 'زين كاش'}: ${accountNumber}`;
            }
    
            const pointsToWithdraw = parseInt(pointsAmount, 10);
            const grossAmount = parseFloat(dollarAmount);
            const netAmount = grossAmount - (grossAmount * 0.10);
    
            setTimeout(() => {
                const result = onWithdraw(pointsToWithdraw);
                if (result.success) {
                    setSuccess(`تم إرسال طلب سحب. ستستلم ${netAmount.toFixed(2)}$ إلى ${paymentDetailsString} قريباً.`);
                    setShowPaymentModal(false);
                    resetInputs();
                    setTimeout(() => setSuccess(''), 5000);
                } else {
                    setModalError(result.message);
                }
                setIsLoading(false);
            }, 1000);
        };

        const PaymentMethodOption: React.FC<{method: 'mastercard' | 'zaincash' | 'fab', label: string, icon: React.ReactNode}> = ({method, label, icon}) => (
            <button
                onClick={() => setPaymentMethod(method)}
                className={`w-full flex items-center justify-between p-3 rounded-lg border-2 transition-all ${paymentMethod === method ? 'border-[#FFC107] bg-[#FFC107]/10' : 'border-gray-600 bg-black/30'}`}
            >
                <div className="flex items-center gap-3">
                    {icon}
                    <span className="font-semibold">{label}</span>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method ? 'border-[#FFC107]' : 'border-gray-500'}`}>
                    {paymentMethod === method && <div className="w-2.5 h-2.5 rounded-full bg-[#FFC107]"></div>}
                </div>
            </button>
        );
    
        return (
             <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
                <div className="w-full max-w-sm bg-black/60 border border-gray-700/50 rounded-2xl shadow-lg p-6 flex flex-col text-white">
                    <h2 className="text-xl font-bold mb-2 text-center">معلومات الدفع</h2>
                    <p className="text-[#BEBEBE] mb-6 text-center text-sm">اختر طريقة الدفع لإستلام المبلغ.</p>
                    
                    <div className="space-y-3 mb-6">
                        <PaymentMethodOption method="mastercard" label="MasterCard" icon={<MasterCardIcon className="w-12 h-auto"/>} />
                        <PaymentMethodOption method="zaincash" label="Zain Cash" icon={<ZainCashIconSimple className="w-12 h-12"/>} />
                        <PaymentMethodOption method="fab" label="FAB" icon={<FabIcon className="w-12 h-12"/>} />
                    </div>
    
                    <div className="animate-fade-in-fast min-h-[116px]">
                        {paymentMethod === 'mastercard' && (
                            <div className="space-y-4">
                                 <input
                                    type="text"
                                    placeholder="الإسم على البطاقة"
                                    value={cardName}
                                    onChange={(e) => setCardName(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-right"
                                />
                                 <input
                                    type="text"
                                    placeholder="رقم البطاقة"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        const formatted = e.target.value.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
                                        setCardNumber(formatted);
                                    }}
                                    className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-left"
                                    style={{direction: 'ltr'}}
                                    maxLength={19}
                                />
                            </div>
                        )}
    
                        {(paymentMethod === 'zaincash' || paymentMethod === 'fab') && (
                            <input
                                type="text"
                                placeholder={paymentMethod === 'zaincash' ? "رقم حساب زين كاش" : "رقم حساب FAB"}
                                value={accountNumber}
                                onChange={(e) => setAccountNumber(e.target.value)}
                                className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-4 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-center"
                            />
                        )}
                    </div>
    
                    {modalError && <p className="w-full text-center bg-red-500/20 text-red-300 text-sm py-2 px-3 rounded-md my-4">{modalError}</p>}
    
                    <div className="w-full flex items-center gap-4 mt-6">
                        <button
                            onClick={() => setShowPaymentModal(false)}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-gray-600 text-white hover:bg-gray-500 transition-colors"
                            disabled={isLoading}
                        >
                            إلغاء
                        </button>
                        <button
                            onClick={handleFinalSubmit}
                            className="flex-1 py-2.5 px-4 rounded-lg font-semibold bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] transition-colors disabled:bg-[#FFC107]/50 disabled:cursor-wait"
                            disabled={isLoading}
                        >
                            {isLoading ? 'جار الإرسال...' : 'تأكيد وإرسال'}
                        </button>
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="relative mx-auto max-w-md min-h-full flex flex-col">
                
                <header className="flex items-center p-4 gap-3">
                    <div className="relative w-14 h-14 rounded-full border-2 border-white/80 shadow-md flex-shrink-0">
                        {profilePicture ? (
                            <img src={profilePicture} alt="Profile" className="w-full h-full rounded-full object-cover" />
                        ) : (
                             <div className="w-full h-full rounded-full bg-gray-800 flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-gray-500" />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={onBack}
                        className="bg-black/40 border border-gray-700 rounded-full py-1.5 px-5 flex-grow shadow-inner flex items-center justify-between"
                        aria-label="العودة وإظهار الرصيد"
                    >
                        <div className="w-6 h-6" /> {/* Spacer */}
                        <div className="flex flex-col items-center">
                            <span className="text-lg font-bold text-white">0</span>
                        </div>
                        <ArrowRightIcon className="w-6 h-6 text-[#BEBEBE]" />
                    </button>
                </header>

                <main className="flex-grow flex flex-col bg-[#000000]">
                    <div className="relative text-white pt-8 pb-16 px-4 text-center" style={{ backgroundColor: '#000000' }}>
                        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-[calc(100%+1.3px)] h-[75px]">
                                <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31.74,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" style={{ fill: '#000000' }}></path>
                            </svg>
                        </div>
                        
                        <div className="relative z-10 flex justify-center gap-2 mb-4 mt-16 bg-black/20 p-1 rounded-xl">
                            <button onClick={() => handleTabChange('cash')} className={`w-1/2 rounded-lg py-2.5 flex items-center justify-center gap-2 text-lg font-bold transition-colors ${activeTab === 'cash' ? 'bg-[#FFC107] text-slate-900' : 'bg-transparent text-gray-300'}`}>
                                <WithdrawIcon className="w-6 h-6" />
                                <span>كاش</span>
                            </button>
                             <button onClick={() => handleTabChange('jewels')} className={`w-1/2 rounded-lg py-2.5 flex items-center justify-center gap-2 text-lg font-bold transition-colors ${activeTab === 'jewels' ? 'bg-[#FFC107] text-slate-900' : 'bg-transparent text-gray-300'}`}>
                                <DiamondIcon className="text-xl" />
                                <span>مجوهرات</span>
                            </button>
                        </div>

                        <div className="text-[#BEBEBE] text-sm">
                            <p>{activeTab === 'cash' ? 'يمكنك تحويل النقاط إلى الكاش عن طريق وسائل الدفع المتاحة' : 'يمكنك تحويل نقاطك إلى مجوهرات'}</p>
                            {activeTab === 'cash' && <p className="mt-1">الحد الأدنى للسحب هو 10 دولار</p>}
                        </div>
                    </div>

                    <div className="flex-grow px-6 pb-8 -mt-8">
                         <div className="h-8 mb-4 text-center">
                            {error && <p className="text-red-400 font-semibold">{error}</p>}
                            {success && <p className="text-green-400 font-semibold">{success}</p>}
                        </div>
                        
                        {activeTab === 'cash' ? (
                            <div className="space-y-6 text-lg font-bold animate-fade-in-fast text-white">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">$</span>
                                    <input 
                                        type="text"
                                        placeholder="0.00"
                                        value={dollarAmount}
                                        onChange={handleDollarChange}
                                        className="flex-grow bg-transparent border-b-2 text-center focus:outline-none placeholder-gray-500 border-gray-600 focus:border-[#FFC107] transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <span>URUK</span>
                                    <input 
                                        type="text"
                                        placeholder="0"
                                        value={pointsAmount}
                                        onChange={handlePointsChange}
                                        className="flex-grow bg-transparent border-b-2 text-center focus:outline-none placeholder-gray-500 border-gray-600 focus:border-[#FFC107] transition-colors"
                                    />
                                </div>
                            </div>
                        ) : (
                             <div className="space-y-6 text-lg font-bold animate-fade-in-fast text-white">
                                <div className="flex items-center gap-4">
                                    <CoinIcon className="w-7 h-7 text-[#FFC107]" />
                                    <input 
                                        type="text"
                                        placeholder="0"
                                        value={pointsToConvert}
                                        onChange={handlePointsToConvertChange}
                                        className="flex-grow bg-transparent border-b-2 text-center focus:outline-none placeholder-gray-500 border-gray-600 focus:border-[#FFC107] transition-colors"
                                    />
                                </div>
                                <div className="flex items-center gap-4">
                                    <DiamondIcon className="text-2xl" />
                                    <input 
                                        type="text"
                                        placeholder="0"
                                        value={jewelsToReceive}
                                        readOnly
                                        className="flex-grow bg-transparent border-b-2 text-center focus:outline-none placeholder-gray-500 border-gray-600"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="mt-10">
                            <button 
                                onClick={handleSubmit}
                                disabled={isSubmitDisabled}
                                className="w-full bg-gray-800 text-white text-xl font-bold py-4 rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition hover:bg-gray-700" 
                            >
                                {isLoading ? 'جار المعالجة...' : 'موافق'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
            {showConfirmModal && <ConfirmWithdrawalModal />}
            {showPaymentModal && <PaymentInfoModal />}
        </div>
    );
};

export default WithdrawScreen;
