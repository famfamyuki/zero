'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from './translations';

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  lang: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_LANG_KEY = 'agentgraph_lang';

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedLang = localStorage.getItem(STORAGE_LANG_KEY) as Language;
    if (savedLang === 'en' || savedLang === 'ja') {
      setLangState(savedLang);
    } else {
      // Auto-detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.includes('ja')) {
        setLangState('ja');
      } else {
        setLangState('en');
      }
    }
    setIsInitialized(true);
  }, []);

  const setLanguage = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_LANG_KEY, newLang);
    }
  };

  const t = (key: TranslationKey): string => {
    return translations[lang]?.[key] || translations.en[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback default
    return {
      lang: 'en',
      setLanguage: () => {},
      t: (key: TranslationKey) => translations.en[key] || key,
    };
  }
  return context;
};
