import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // Поддерживаемые языки
  locales: ['en', 'ua'],

  // Язык по умолчанию
  defaultLocale: 'en',

  // Убираем префиксы из URL - единые URL для всех языков
  localePrefix: 'never',

  // Отключаем автоматическое определение локали из URL
  localeDetection: false
});

// Типы для TypeScript
export type Locale = (typeof routing.locales)[number];

