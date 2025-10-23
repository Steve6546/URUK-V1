import React, { useState, useMemo } from 'react';
import { Country, countries } from '../data/countries';
import { SearchIcon } from './icons';

interface CountryCodePickerProps {
    isOpen: boolean;
    onClose: () => void;
    onSelect: (country: Country) => void;
}

const CountryCodePicker: React.FC<CountryCodePickerProps> = ({ isOpen, onClose, onSelect }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredCountries = useMemo(() => {
        if (!searchTerm) return countries;
        return countries.filter(country =>
            country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            country.dial_code.includes(searchTerm)
        );
    }, [searchTerm]);

    const getCountryFlagEmoji = (countryCode: string) => {
        const codePoints = countryCode
            .toUpperCase()
            .split('')
            .map(char => 127397 + char.charCodeAt(0));
        return String.fromCodePoint(...codePoints);
    }

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div 
                className="w-full max-w-sm h-[80vh] bg-black/70 border border-gray-700/50 rounded-2xl shadow-lg flex flex-col text-center animate-fade-in-fast"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-700/50">
                    <div className="relative">
                        <SearchIcon className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
                        <input
                            type="text"
                            placeholder="ابحث عن دولة..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-gray-600 rounded-lg py-2.5 pl-3 pr-10 text-white placeholder-[#BEBEBE] focus:outline-none focus:ring-2 focus:ring-[#FFC107]"
                            autoFocus
                        />
                    </div>
                </div>

                {/* Body */}
                <div className="flex-grow p-2 overflow-y-auto">
                    {filteredCountries.length > 0 ? (
                        <ul className="space-y-1">
                            {filteredCountries.map(country => (
                                <li key={country.code}>
                                    <button 
                                        onClick={() => onSelect(country)}
                                        className="w-full flex items-center justify-between text-right p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                                    >
                                        <span className="font-mono text-[#BEBEBE]">{country.dial_code}</span>
                                        <div className="flex items-center gap-3">
                                            <span className="font-semibold text-white">{country.name}</span>
                                            <span className="text-2xl">{getCountryFlagEmoji(country.code)}</span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-[#BEBEBE] py-8">لم يتم العثور على نتائج.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CountryCodePicker;