import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { locale, setLocale, t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50" 
      aria-modal="true" 
      role="dialog"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-lg shadow-xl w-full max-w-md mx-4 p-6 text-white"
        onClick={(e) => e.stopPropagation()} // Prevent closing modal when clicking inside
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-cyan-400">{t.settings}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white" aria-label={t.close}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3 border-b border-gray-700 pb-2">{t.language}</h3>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <button 
              onClick={() => setLocale('en')}
              className={`px-4 py-2 rounded-md transition-colors w-full ${locale === 'en' ? 'bg-cyan-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              English
            </button>
            <button 
              onClick={() => setLocale('ru')}
              className={`px-4 py-2 rounded-md transition-colors w-full ${locale === 'ru' ? 'bg-cyan-600 text-white font-bold' : 'bg-gray-700 hover:bg-gray-600'}`}
            >
              Русский
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
};