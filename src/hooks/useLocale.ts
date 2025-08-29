'use client';

import { useEffect, useState } from 'react';
import { routing, type Locale } from '@/i18n/routing';

// Ключ для localStorage
const LOCALE_STORAGE_KEY = 'NEXT_LOCALE';

/**
 * Хук для управления языком приложения
 * - Автоматически определяет язык системы при первом запуске
 * - Сохраняет выбор пользователя в localStorage
 * - Устанавливает cookie для server-side
 */
export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>(routing.defaultLocale);
  const [isLoading, setIsLoading] = useState(true);

  // Инициализация языка при загрузке
  useEffect(() => {
    const initializeLocale = () => {
      try {
        // Проверяем localStorage
        const savedLocale = localStorage.getItem(LOCALE_STORAGE_KEY);
        
        if (savedLocale && routing.locales.includes(savedLocale as Locale)) {
          setLocaleState(savedLocale as Locale);
        } else {
          // Определяем язык системы
          const systemLocale = getSystemLocale();
          setLocaleState(systemLocale);
          localStorage.setItem(LOCALE_STORAGE_KEY, systemLocale);
        }
      } catch (error) {
        console.log('Locale initialization error:', error);
        setLocaleState(routing.defaultLocale);
      } finally {
        setIsLoading(false);
      }
    };

    initializeLocale();
  }, []);

  // Функция для смены языка
  const setLocale = (newLocale: Locale) => {
    try {
      setLocaleState(newLocale);
      localStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
      
      // Устанавливаем cookie для server-side
      document.cookie = `${LOCALE_STORAGE_KEY}=${newLocale}; path=/; max-age=${60 * 60 * 24 * 365}; samesite=lax`;
      
      // Перезагружаем страницу для применения изменений
      window.location.reload();
    } catch (error) {
      console.log('Locale change error:', error);
    }
  };

  return {
    locale,
    setLocale,
    isLoading,
    availableLocales: routing.locales
  };
}

/**
 * Определяет язык системы пользователя
 */
function getSystemLocale(): Locale {
  try {
    const systemLang = navigator.language.split('-')[0];
    
    // Маппинг системных языков на поддерживаемые
    const langMap: Record<string, Locale> = {
      'uk': 'ua', // Украинский
      'en': 'en', // Английский
    };

    return langMap[systemLang] || routing.defaultLocale;
  } catch (error) {
    return routing.defaultLocale;
  }
}

/**
 * Получает текущий язык из localStorage (для SSR)
 */
export function getStoredLocale(): Locale {
  try {
    if (typeof window === 'undefined') return routing.defaultLocale;
    
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    return (saved && routing.locales.includes(saved as Locale)) 
      ? saved as Locale 
      : routing.defaultLocale;
  } catch {
    return routing.defaultLocale;
  }
}

