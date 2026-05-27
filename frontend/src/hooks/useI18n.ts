import { useState, useEffect } from 'react';
import id from '../locales/id.json';
import en from '../locales/en.json';

type SupportedLanguages = 'id' | 'en';
type Translations = typeof id;

const locales: Record<SupportedLanguages, Translations> = { id, en };

export const useI18n = (initialLang: SupportedLanguages = 'id') => {
  const [language, setLanguage] = useState<SupportedLanguages>(initialLang);
  const [t, setT] = useState<Translations>(locales[initialLang]);

  useEffect(() => {
    setT(locales[language] || locales.id);
  }, [language]);

  const changeLanguage = (lang: SupportedLanguages) => {
    setLanguage(lang);
  };

  return { t, language, changeLanguage };
};