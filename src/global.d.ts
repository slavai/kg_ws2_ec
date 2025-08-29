import { routing } from '@/i18n/routing';

declare global {
  // Расширяем интерфейс для next-intl
  interface IntlMessages {
    HomePage: typeof import('../messages/en.json')['HomePage'];
    Header: typeof import('../messages/en.json')['Header'];
    Common: typeof import('../messages/en.json')['Common'];
  }
}

// Декларация модуля для next-intl
declare module 'next-intl' {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
  }
}

export {};

