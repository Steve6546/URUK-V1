
import React, { useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { User } from '../types';
import { Country, countries } from '../data/countries';
import { UserIcon, MailIcon, PhoneFilledIcon, ArrowRightIcon, EyeIcon, EyeSlashIcon } from './icons';
import CountryCodePicker from './CountryCodePicker';

interface AuthProps {
    onLoginSuccess: (user: User) => void;
}

async function hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function generateUniqueId(existingUsers: User[]): string {
    let newId: string;
    let isUnique = false;
    while (!isUnique) {
        newId = String(Math.floor(Math.random() * 10**10)).padStart(10, '0');
        if (!existingUsers.some(user => user.userId === newId)) {
            isUnique = true;
        }
    }
    return newId!;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [view, setView] = useState<'welcome' | 'login' | 'signup'>('welcome');
    const [authMethod, setAuthMethod] = useState<'email' | 'phone'>('email');
    const [users, setUsers] = useLocalStorage<User[]>('users', []);

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [country, setCountry] = useState<Country>(countries.find(c => c.code === 'IQ')!);
    const [isPickerOpen, setIsPickerOpen] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setError('');
        setShowPassword(false);
    };

    const handleAuthMethodChange = (method: 'email' | 'phone') => {
        setAuthMethod(method);
        resetForm();
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!name || !password || (authMethod === 'email' && !email) || (authMethod === 'phone' && !phone)) {
            setError('يرجى ملء جميع الحقول.');
            return;
        }

        let existingUser;
        if (authMethod === 'email') {
            existingUser = users.find(user => user.email === email);
        } else {
            const fullPhoneNumber = `${country.dial_code}${phone}`;
            existingUser = users.find(user => user.phone === fullPhoneNumber);
        }

        if (existingUser) {
            setError(authMethod === 'email' ? 'هذا البريد الإلكتروني مسجل بالفعل.' : 'رقم الهاتف هذا مسجل بالفعل.');
            return;
        }

        const hashedPassword = await hashPassword(password);
        const userId = generateUniqueId(users);
        const newUser: User = {
            userId,
            name,
            hashedPassword,
            isVerified: false,
            nameChangeCount: 0,
            profilePictureChangeCount: 0,
            profileBannerChangeCount: 0,
            ...(authMethod === 'email' && { email }),
            ...(authMethod === 'phone' && { phone: `${country.dial_code}${phone}` }),
        };

        setUsers([...users, newUser]);
        onLoginSuccess(newUser);
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (!password || (authMethod === 'email' && !email) || (authMethod === 'phone' && !phone)) {
            setError('يرجى ملء جميع الحقول.');
            return;
        }
        
        let user;
        if (authMethod === 'email') {
            user = users.find(u => u.email === email);
        } else {
            const fullPhoneNumber = `${country.dial_code}${phone}`;
            user = users.find(u => u.phone === fullPhoneNumber);
        }

        if (!user || !user.hashedPassword) {
            setError('البيانات المدخلة غير صحيحة.');
            return;
        }

        const hashedPassword = await hashPassword(password);
        if (user.hashedPassword === hashedPassword) {
            if (!user.userId) {
                user.userId = generateUniqueId(users);
                const updatedUsers = users.map(u => (u.email === user.email || u.phone === user.phone) ? user : u);
                setUsers(updatedUsers);
            }
            onLoginSuccess(user);
        } else {
            setError('البيانات المدخلة غير صحيحة.');
        }
    };
    
    const getCountryFlagEmoji = (countryCode: string) => {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    const isLogin = view === 'login';

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm mx-auto bg-black border border-gray-700/50 rounded-2xl shadow-lg p-8 text-center animate-fade-in-fast transition-all duration-300">
                {view === 'welcome' ? (
                    <div key="welcome" className="animate-fade-in-fast">
                        <h1 className="text-4xl font-bold text-[#FFC107] mb-12">URUK</h1>
                        <div className="w-full flex flex-col gap-4">
                            <button
                                onClick={() => { setView('signup'); resetForm(); }}
                                className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] hover:scale-105 shadow-lg"
                            >
                                إنشاء حساب جديد
                            </button>
                             <button
                                onClick={() => { setView('login'); resetForm(); }}
                                className="w-full py-3 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform bg-black/40 text-[#FFC107] border border-[#FFC107]/50 hover:bg-black/60 hover:scale-105"
                            >
                                تسجيل الدخول
                            </button>
                        </div>
                    </div>
                ) : (
                    <div key="form" className="animate-fade-in-fast relative">
                         <button onClick={() => setView('welcome')} className="absolute -top-2 -right-2 p-2 text-white hover:opacity-75 transition-opacity" aria-label="العودة">
                            <ArrowRightIcon className="w-6 h-6" />
                        </button>

                        <h1 className="text-3xl font-bold text-white mb-8">{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب'}</h1>
                        
                        <div className="w-full flex justify-center bg-black/50 p-1 rounded-lg mb-6">
                            <button
                                onClick={() => handleAuthMethodChange('email')}
                                className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${authMethod === 'email' ? 'bg-[#FFC107] text-slate-900' : 'text-[#BEBEBE]'}`}
                            >
                                <MailIcon className="w-5 h-5" /> البريد الإلكتروني
                            </button>
                            <button
                                onClick={() => handleAuthMethodChange('phone')}
                                className={`w-1/2 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-semibold transition-colors ${authMethod === 'phone' ? 'bg-[#FFC107] text-slate-900' : 'text-[#BEBEBE]'}`}
                            >
                                <PhoneFilledIcon className="w-5 h-5" /> رقم الهاتف
                            </button>
                        </div>

                        {error && <p className="bg-red-500/20 text-red-300 text-sm py-2 px-4 rounded-md mb-4 w-full">{error}</p>}
                        
                        <form onSubmit={isLogin ? handleLogin : handleSignup} className="w-full flex flex-col gap-4">
                            {!isLogin && (
                                <div className="relative">
                                    <UserIcon className="w-5 h-5 text-[#BEBEBE] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="الاسم"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 pr-3 pl-10 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                    />
                                </div>
                            )}
                            
                            {authMethod === 'email' ? (
                                <div className="relative">
                                    <MailIcon className="w-5 h-5 text-[#BEBEBE] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                                    <input
                                        type="email"
                                        placeholder="البريد الإلكتروني"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 pr-3 pl-10 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center gap-2" dir="ltr">
                                    <input
                                        type="tel"
                                        placeholder="رقم الهاتف"
                                        value={phone}
                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                                        className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 px-3 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107] text-left"
                                    />
                                     <button
                                        type="button"
                                        onClick={() => setIsPickerOpen(true)}
                                        className="flex-shrink-0 flex items-center justify-center gap-2 bg-black/50 border border-gray-600 rounded-lg h-full px-3 text-white placeholder-[#BEBEBE] hover:bg-black/70 transition-colors"
                                    >
                                        <span className="text-xl">{getCountryFlagEmoji(country.code)}</span>
                                        <span className="text-sm font-mono">{country.dial_code}</span>
                                    </button>
                                </div>
                            )}

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#BEBEBE] hover:text-white"
                                    aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                                >
                                    {showPassword ? (
                                        <EyeSlashIcon className="w-5 h-5" />
                                    ) : (
                                        <EyeIcon className="w-5 h-5" />
                                    )}
                                </button>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="كلمة المرور"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 pr-3 pl-10 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 mt-2 px-6 rounded-lg font-semibold text-lg transition-all duration-300 transform bg-[#FFC107] text-slate-900 hover:bg-[#ffca28] hover:scale-105 shadow-lg"
                            >
                                {isLogin ? 'دخول' : 'تسجيل'}
                            </button>
                        </form>
                        <button onClick={() => setView(isLogin ? 'signup' : 'login')} className="mt-6 text-sm text-[#FFC107] hover:underline">
                            {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'هل لديك حساب بالفعل؟ تسجيل الدخول'}
                        </button>
                    </div>
                )}
            </div>
           <CountryCodePicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onSelect={(selected) => {
                    setCountry(selected);
                    setIsPickerOpen(false);
                }}
           />
        </div>
    );
};

export default Auth;