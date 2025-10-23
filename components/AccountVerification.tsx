import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { Country, countries } from '../data/countries';
import CountryCodePicker from './CountryCodePicker';
import { ArrowRightIcon, PhoneFilledIcon, ShieldCheckIcon, QuestionMarkIcon } from './icons';

interface AccountVerificationProps {
    onBack: () => void;
    onVerified: (phoneNumber: string) => void;
    currentUser: User;
}

const AccountVerification: React.FC<AccountVerificationProps> = ({ onBack, onVerified, currentUser }) => {
    const [step, setStep] = useState<'enterPhone' | 'enterCode'>('enterPhone');
    const [phone, setPhone] = useState('');
    const [country, setCountry] = useState<Country>(countries.find(c => c.code === 'IQ')!);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showHelpModal, setShowHelpModal] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(60);
    const [isResending, setIsResending] = useState(false);

    useEffect(() => {
        const initialPhone = currentUser.phone || '';
        const countryData = countries.find(c => initialPhone.startsWith(c.dial_code));
        if (countryData) {
            setCountry(countryData);
            setPhone(initialPhone.substring(countryData.dial_code.length));
        }
    }, [currentUser]);
    
    useEffect(() => {
        // Fix: Use `number` for the timer ID, which is the return type of `setInterval` in browsers.
        let timer: number | undefined;
        if (step === 'enterCode' && resendCooldown > 0) {
            timer = setInterval(() => {
                setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [step, resendCooldown]);


    const getCountryFlagEmoji = (countryCode: string) => {
        const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    };

    const handleSendCode = () => {
        setError('');
        if (phone.length < 7) {
            setError('الرجاء إدخال رقم هاتف صحيح.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
            setStep('enterCode');
            setResendCooldown(60);
        }, 1000);
    };
    
    const handleResendCode = () => {
        setIsResending(true);
        setError('');
        // Simulate API call to resend code
        setTimeout(() => {
            setOtp(new Array(6).fill("")); // Clear old OTP
            setResendCooldown(60); // Reset cooldown timer
            setIsResending(false);
            // Focus the first input for user convenience
            document.getElementById('otp-input-0')?.focus();
        }, 1000);
    };

    const handleVerifyCode = () => {
        setError('');
        const code = otp.join('');
        if (code.length !== 6) {
            setError('رمز التحقق يجب أن يتكون من 6 أرقام.');
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            // Simulating successful verification
            const fullPhoneNumber = `${country.dial_code}${phone}`;
            onVerified(fullPhoneNumber);
            setIsLoading(false);
        }, 1000);
    };

    const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const { value } = e.target;
        if (/^[0-9]$/.test(value) || value === "") {
            const newOtp = [...otp];
            newOtp[index] = value;
            setOtp(newOtp);
            // Move to next input
            if (value !== "" && index < 5) {
                const nextInput = document.getElementById(`otp-input-${index + 1}`);
                nextInput?.focus();
            }
        }
    };
    
    const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace' && otp[index] === '' && index > 0) {
             const prevInput = document.getElementById(`otp-input-${index - 1}`);
             prevInput?.focus();
        }
    }


    const renderEnterPhoneStep = () => (
        <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
            <div className="w-28 h-28 rounded-full bg-green-500/20 flex items-center justify-center mb-6">
                <PhoneFilledIcon className="w-16 h-16 text-green-400" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">أدخل رقم الهاتف</h2>
            <p className="text-[#BEBEBE] mb-8 max-w-xs">سنرسل لك رمز التحقق عبر رسالة نصية</p>
            
            <div className="w-full p-4 bg-black/40 border border-gray-700/50 rounded-2xl shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-2" dir="ltr">
                     <button
                        type="button"
                        onClick={() => setIsPickerOpen(true)}
                        className="flex items-center justify-center gap-2 bg-gray-800 border border-gray-600 rounded-lg p-3 text-white"
                    >
                        <span className="text-sm font-semibold">▾</span>
                        <span className="text-xl">{getCountryFlagEmoji(country.code)}</span>
                        <span className="font-mono">{country.dial_code}</span>
                    </button>
                    <input
                        type="tel"
                        placeholder="رقم الهاتف"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-gray-800 border border-gray-600 rounded-lg p-3 text-white placeholder-[#BEBEBE] text-left focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                </div>
            </div>

            <div className="w-full mt-4 p-3 bg-blue-900/40 border border-blue-700 rounded-lg text-sm text-blue-200 text-right flex items-center gap-2">
                <span className="font-bold text-lg">ⓘ</span>
                <span>أدخل رقم الهاتف بدون المفتاح الدولي ({country.dial_code})</span>
            </div>
            
            {error && <p className="text-red-400 mt-4">{error}</p>}

            <button
                onClick={handleSendCode}
                disabled={isLoading || phone.length < 7}
                className="w-full mt-6 py-4 rounded-lg font-semibold text-lg text-white bg-slate-700 hover:bg-slate-800 disabled:bg-slate-500 transition-colors shadow-lg"
            >
                {isLoading ? 'جار الإرسال...' : 'إرسال رمز التحقق'}
            </button>
            <div className="w-full mt-4 p-3 bg-blue-900/40 border border-blue-700 rounded-lg text-sm text-blue-200 text-right flex items-center gap-2">
                <ShieldCheckIcon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span>رقم هاتفك آمن ومحمي. سنستخدمه فقط لإرسال رمز التحقق.</span>
            </div>
        </div>
    );

    const renderEnterCodeStep = () => (
         <div className="flex-grow flex flex-col justify-center items-center text-center px-4">
            <p className="text-[#BEBEBE] mb-8 max-w-xs" dir="rtl">
                تم إرسال رمز التحقق إلى رقمك: <span className="font-bold font-mono tracking-wider text-white">{country.dial_code} {phone}</span>
            </p>

            <div className="flex justify-center gap-2" dir="ltr">
                {otp.map((data, index) => (
                    <input
                        key={index}
                        id={`otp-input-${index}`}
                        type="text"
                        maxLength={1}
                        value={data}
                        onChange={(e) => handleOtpChange(e, index)}
                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                        className="w-12 h-14 text-center text-2xl font-bold text-white bg-gray-800 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                    />
                ))}
            </div>
            
            {error && <p className="text-red-400 mt-4">{error}</p>}

            <button
                onClick={handleVerifyCode}
                disabled={isLoading || otp.join('').length !== 6}
                className="w-full mt-8 py-4 rounded-lg font-semibold text-lg text-white bg-green-600 hover:bg-green-700 disabled:bg-green-400 transition-colors shadow-lg"
            >
                {isLoading ? 'جار التحقق...' : 'تحقق من الرمز'}
            </button>
             <button onClick={() => setStep('enterPhone')} className="mt-4 text-sm text-[#BEBEBE] hover:underline">
                تغيير رقم الهاتف
            </button>
            <div className="mt-4 h-6">
                {resendCooldown > 0 ? (
                    <p className="text-sm text-white">
                        إعادة إرسال الرمز بعد ({resendCooldown} ثانية)
                    </p>
                ) : (
                    <button
                        onClick={handleResendCode}
                        disabled={isResending}
                        className="text-sm text-blue-400 font-semibold hover:underline disabled:text-gray-500 disabled:cursor-wait"
                    >
                        {isResending ? 'جار الإرسال...' : 'إعادة إرسال الرمز'}
                    </button>
                )}
            </div>
        </div>
    );

    const HelpModal = () => (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in-fast">
            <div className="w-full max-w-xs bg-black/80 border border-gray-600 rounded-2xl shadow-lg pt-8 pb-6 px-6 flex flex-col items-center text-center text-white">
                <h2 className="text-3xl font-bold mb-6 text-[#FFC107]">مساعدة</h2>
                <p className="text-lg leading-relaxed mb-4">اختر دولتك من القائمة ثم أدخل رقم هاتفك.</p>
                <div className="text-lg leading-relaxed mb-4 text-center">
                    <p className="text-[#BEBEBE]">سيتم إرسال رمز التحقق عبر رسالة نصية إلى</p>
                    <p className="font-bold font-mono tracking-wider mt-2">{country.dial_code}.</p>
                </div>
                <button
                    onClick={() => setShowHelpModal(false)}
                    className="mt-4 px-10 py-2 rounded-lg font-semibold text-lg bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] transition-colors"
                >
                    فهمت
                </button>
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 font-sans animate-fade-in-fast overflow-y-auto" style={{ background: '#000000' }}>
            <div className="container mx-auto max-w-lg min-h-screen flex flex-col p-4 pb-8 text-[#BEBEBE]">
                <header className="flex items-center justify-between py-2">
                    <button onClick={step === 'enterCode' ? () => setStep('enterPhone') : onBack} className="p-2 text-white" aria-label="عودة">
                        <ArrowRightIcon className="w-7 h-7" />
                    </button>
                    <h1 className="text-2xl font-bold text-white">
                        {step === 'enterPhone' ? 'توثيق الحساب' : 'أدخل الرمز'}
                    </h1>
                    <button onClick={() => setShowHelpModal(true)} className="p-2 text-white" aria-label="مساعدة">
                        <QuestionMarkIcon className="w-7 h-7" />
                    </button>
                </header>
                
                {step === 'enterPhone' ? renderEnterPhoneStep() : renderEnterCodeStep()}

                <CountryCodePicker
                    isOpen={isPickerOpen}
                    onClose={() => setIsPickerOpen(false)}
                    onSelect={(selected) => {
                        setCountry(selected);
                        setIsPickerOpen(false);
                    }}
                />
                {showHelpModal && <HelpModal />}
            </div>
        </div>
    );
};

export default AccountVerification;