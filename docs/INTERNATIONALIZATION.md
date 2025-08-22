# Интернационализация (i18n)

## Обзор

Проект использует **next-intl** для полноценной локализации с поддержкой:
- 🌍 Языки: **English (en)** и **Українська (ua)**
- 🔗 **Единые URL** без языковых префиксов (например `/about` вместо `/en/about`)
- 💾 **localStorage** для сохранения выбора пользователя
- 🖥️ **Автоопределение языка системы** при первом посещении
- 🔄 **Переключатель языка** в Header
- 📁 **Модульная структура** JSON файлов по страницам

## Структура файлов

```
digital-store/
├── messages/                    # JSON файлы локализации  
│   ├── pages/                  # Переводы для страниц
│   │   └── home/               # Главная страница
│   │       ├── en.json         # Английские переводы
│   │       └── ua.json         # Украинские переводы
│   ├── components/             # Переводы для компонентов
│   │   ├── header/             # Header компонент
│   │   │   ├── en.json
│   │   │   └── ua.json
│   │   ├── common/             # Общие элементы (кнопки, ошибки)
│   │   │   ├── en.json
│   │   │   └── ua.json
│   │   └── product-catalog/    # Каталог продуктов
│   │       ├── en.json
│   │       └── ua.json
├── src/
│   ├── i18n/                   # Конфигурация i18n
│   │   ├── routing.ts          # Настройки маршрутизации
│   │   ├── request.ts          # Server-side конфигурация
│   │   └── navigation.ts       # Navigation helpers
│   ├── hooks/
│   │   └── useLocale.ts        # Хук управления языком
│   ├── lib/types/
│   │   └── product.ts          # TypeScript типы
│   └── global.d.ts             # Глобальные типы для i18n
```

## Конфигурация

### 1. Routing (`src/i18n/routing.ts`)
```typescript
export const routing = defineRouting({
  locales: ['en', 'ua'],
  defaultLocale: 'en',
  localePrefix: 'never',        // Единые URL без префиксов
  localeDetection: false        // Отключаем URL-based определение
});
```

### 2. Request Config (`src/i18n/request.ts`)
- Автоматическое определение языка из:
  1. **localStorage cookie** (приоритет)
  2. **Accept-Language header** (системный язык)
  3. **Fallback** на английский

### 3. useLocale Hook (`src/hooks/useLocale.ts`)
```typescript
const { locale, setLocale, availableLocales, isLoading } = useLocale();
```

**Функционал:**
- ✅ Автоинициализация при загрузке
- ✅ Сохранение в localStorage + cookie
- ✅ Определение системного языка (`navigator.language`)
- ✅ Перезагрузка страницы при смене языка

## Использование

### В Server Components:
```typescript
import { getTranslations } from 'next-intl/server';

const t = await getTranslations('HomePage');
return <h1>{t('title')}</h1>;
```

### В Client Components:
```typescript
import { useTranslations } from 'next-intl';

const t = useTranslations('HomePage');
return <h1>{t('title')}</h1>;
```

### Смена языка:
```typescript
const { setLocale } = useLocale();
setLocale('ua'); // Автоматически сохранится и перезагрузится
```

## Структура переводов

### Модульная структура JSON:

**messages/pages/home/en.json:**
```json
{
  "title": "DIGITAL_STORE.EXE",
  "categories": {
    "games": {
      "title": "[GAMES.DLL]"
    }
  }
}
```

**messages/components/header/en.json:**
```json
{
  "login": "Login",
  "cart": "Cart",
  "profile": "Profile"
}
```

**messages/components/common/en.json:**
```json
{
  "loading": "Loading...",
  "credits": "CREDITS",
  "error": "Error"
}
```

### Принципы организации:
- **Pages**: `messages/pages/{page-name}/{locale}.json`
- **Components**: `messages/components/{component-name}/{locale}.json`
- **Переиспользуемые элементы**: `common`, `header`, `footer`
- **Киберпанк стилистика сохранена** в обоих языках
- **Легкое масштабирование** - добавляй папку = добавляй функционал

## Языковой переключатель

Расположен в Header, показывает:
- 🇺🇸 **[EN]** для английского
- 🇺🇦 **[UA]** для украинского

**Функционал:**
- Dropdown при hover
- Активный язык подсвечен
- Мгновенное переключение с перезагрузкой

## Будущие расширения

### Планируемые функции:
1. **Редактор переводов** - админ панель для изменения ключей
2. **Дополнительные языки** - легко добавляются в `routing.ts`
3. **Контекстные переводы** - переводы зависящие от контекста
4. **Плюрализация** - поддержка множественных форм
5. **Форматирование дат/чисел** по локали

### Добавление нового языка:
1. Добавить код языка в `routing.ts`: `locales: ['en', 'ua', 'fr']`
2. Создать структуру: `messages/pages/*/fr.json` + `messages/components/*/fr.json`
3. Добавить флаг в `LanguageSwitcher`: `'fr': { name: 'FR', flag: '🇫🇷' }`
4. Обновить маппинг в `useLocale.ts`

### Добавление нового компонента:
1. Создать `messages/components/{component-name}/en.json`
2. Создать `messages/components/{component-name}/ua.json`
3. Добавить в `request.ts`:
   ```typescript
   const componentMessages = (await import(`../../messages/components/{component-name}/${locale}.json`)).default;
   // В messages объект:
   ComponentName: componentMessages
   ```

## Технические детали

### Middleware Integration:
- **i18n middleware** выполняется первым
- **Auth middleware** выполняется после
- Совместимость с существующей аутентификацией

### Performance:
- ✅ **Static generation** поддерживается
- ✅ **Tree shaking** неиспользуемых переводов
- ✅ **Lazy loading** переводов по страницам
- ✅ **Кэширование** в браузере

### TypeScript Support:
- 🔒 **Строгая типизация** ключей переводов
- 🔒 **Автокомплит** в IDE
- 🔒 **Compile-time проверки** отсутствующих ключей

## Отладка

### Проверка локали:
```javascript
// В браузере
console.log(localStorage.getItem('NEXT_LOCALE'));
```

### Проверка переводов:
```typescript
import { useTranslations } from 'next-intl';
const t = useTranslations('HomePage');
console.log(t.raw('title')); // Получить исходный ключ
```

---

**Статус**: ✅ **Готово к продакшену**  
**Последнее обновление**: Январь 2025
