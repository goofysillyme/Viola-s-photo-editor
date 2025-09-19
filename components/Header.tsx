import React, { useState } from 'react';
import { SettingsModal } from './SettingsModal';
import { useLanguage } from '../contexts/LanguageContext';

const BananaIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-300" viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.41,8.38C17.43,5.4,12,3,12,3S6.57,5.4,3.59,8.38A1.5,1.5,0,0,0,3,9.5a1.49,1.49,0,0,0,1.5,1.5c.19,0,.38-0.05,.56-0.12C8.68,9.4,12,8,12,8s3.32,1.4,6.94,2.88c.18,0.07,.37,0.12,.56,0.12A1.5,1.5,0,0,0,21,9.5,1.5,1.5,0,0,0,20.41,8.38Z" transform="rotate(45 12 12)" />
  </svg>
);

export const Header: React.FC = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { t } = useLanguage();

  const handleExitClick = () => {
    if (window.confirm(t.exitConfirmation)) {
      window.close();
    }
  };

  return (
    <>
      <header className="bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <BananaIcon />
              <h1 className="text-2xl font-bold text-white tracking-wider">
                {t.appTitle}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-yellow-300 bg-yellow-900/50 px-3 py-1 rounded-full hidden sm:block">
                {t.poweredBy}
              </span>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                title={t.settings}
                aria-label={t.settingsAriaLabel}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <button
                onClick={handleExitClick}
                className="text-gray-400 hover:text-red-500 transition-colors duration-200 p-2 rounded-full hover:bg-gray-700"
                title={t.exit}
                aria-label={t.exitAriaLabel}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
