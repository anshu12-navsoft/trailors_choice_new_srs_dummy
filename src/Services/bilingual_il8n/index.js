import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as RNLocalize from 'react-native-localize';

import en from './locales/en.json';
import es from './locales/sp.json';

const resources = {
  en: { translation: en },
  es: { translation: es },
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    const locales = RNLocalize.getLocales();
    callback(locales[0].languageCode);
  },
  init: () => {},
  cacheUserLanguage: () => {},
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
