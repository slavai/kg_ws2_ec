import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async () => {
  // Определяем локаль из различных источников
  let locale = routing.defaultLocale;

  // В server-side контексте пытаемся получить из headers или cookies
  try {
    const { cookies, headers } = await import('next/headers');
    
    // Проверяем localStorage через cookie (установленный на клиенте)
    const cookieStore = await cookies();
    const localeCookie = cookieStore.get('NEXT_LOCALE');
    
    if (localeCookie?.value && routing.locales.includes(localeCookie.value as any)) {
      locale = localeCookie.value as (typeof routing.locales)[number];
    } else {
      // Пытаемся определить из Accept-Language header
      const headersList = await headers();
      const acceptLanguage = headersList.get('accept-language');
      
      if (acceptLanguage) {
        // Простое определение предпочитаемого языка
        const preferredLang = acceptLanguage.split(',')[0]?.split('-')[0];
        if (preferredLang === 'uk') {
          locale = 'ua'; // Украинский язык
        } else if (preferredLang === 'en') {
          locale = 'en';
        }
      }
    }
  } catch (error) {
    // Fallback to default if there's any error
    console.log('Locale detection error:', error);
  }

  // Загружаем переводы из разных файлов и объединяем их
  const homeMessages = (await import(`../../messages/pages/home/${locale}.json`)).default;
  const headerMessages = (await import(`../../messages/components/header/${locale}.json`)).default;
  const commonMessages = (await import(`../../messages/components/common/${locale}.json`)).default;
  const productCatalogMessages = (await import(`../../messages/components/product-catalog/${locale}.json`)).default;

  return {
    locale,
    messages: {
      HomePage: homeMessages,
      Header: headerMessages,
      Common: commonMessages,
      ProductCatalog: productCatalogMessages
    }
  };
});
