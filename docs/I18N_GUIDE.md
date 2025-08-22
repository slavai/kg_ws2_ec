# 🌍 Руководство по Локализации (i18n)

## Архитектура и Принципы

### Технологический Стек
- **next-intl** - основная библиотека локализации
- **Поддерживаемые языки**: English (en), Українська (ua)
- **URL стратегия**: Единые URL без языковых префиксов
- **Персистентность**: localStorage + server-side cookies
- **Автоопределение**: Системный язык при первом посещении

### Конфигурация Маршрутизации
```typescript
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'ua'],
  defaultLocale: 'en',
  localePrefix: 'never',        // Убирает /en, /ua из URL
  localeDetection: false        // Отключает URL-based определение
});
```

### Server-Side Конфигурация  
```typescript
// src/i18n/request.ts
export default getRequestConfig(async () => {
  // Приоритет источников локали:
  // 1. localStorage cookie (client→server)
  // 2. Accept-Language header (браузер)
  // 3. defaultLocale fallback

  const homeMessages = (await import(`../../messages/pages/home/${locale}.json`)).default;
  const headerMessages = (await import(`../../messages/components/header/${locale}.json`)).default;
  
  return {
    locale,
    messages: {
      HomePage: homeMessages,
      Header: headerMessages
      // ... другие компоненты
    }
  };
});
```

## Файловая Структура

### Модульная Организация
```
messages/
├── pages/                  # Переводы страниц
│   ├── home/              # Главная страница
│   ├── products/          # Страница товаров
│   ├── cart/              # Корзина
│   └── profile/           # Профиль пользователя
├── components/            # Переводы компонентов
│   ├── header/            # Навигация
│   ├── footer/            # Подвал
│   ├── auth/              # Авторизация
│   ├── product-card/      # Карточка товара
│   ├── common/            # Общие элементы (кнопки, ошибки)
│   └── forms/             # Формы
└── emails/                # Email шаблоны (опционально)
```

### Принципы Именования
- **Страницы**: `messages/pages/{page-name}/{locale}.json`
- **Компоненты**: `messages/components/{component-name}/{locale}.json`
- **Общие**: `common`, `header`, `footer` - для переиспользования

## Практические Примеры

### 1. Локализация Новой Страницы

**Шаг 1:** Создать структуру переводов
```bash
mkdir -p messages/pages/about
```

**Шаг 2:** Создать файлы переводов
```json
// messages/pages/about/en.json
{
  "title": "About Us",
  "description": "Learn more about our company",
  "sections": {
    "mission": "Our Mission",
    "team": "Our Team"
  }
}

// messages/pages/about/ua.json  
{
  "title": "Про Нас",
  "description": "Дізнайтеся більше про нашу компанію",
  "sections": {
    "mission": "Наша Місія", 
    "team": "Наша Команда"
  }
}
```

**Шаг 3:** Добавить в request.ts
```typescript
const aboutMessages = (await import(`../../messages/pages/about/${locale}.json`)).default;

messages: {
  // ... existing
  AboutPage: aboutMessages
}
```

**Шаг 4:** Использовать в компоненте
```typescript
// pages/about/page.tsx или components/AboutContent.tsx
import { useTranslations } from 'next-intl';

export default function AboutPage() {
  const t = useTranslations('AboutPage');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      <h2>{t('sections.mission')}</h2>
    </div>
  );
}
```

### 2. Локализация Переиспользуемого Компонента

**Шаг 1:** Создать переводы компонента
```json
// messages/components/button/en.json
{
  "save": "Save",
  "cancel": "Cancel", 
  "loading": "Loading...",
  "delete": "Delete",
  "confirm": "Are you sure?"
}

// messages/components/button/ua.json
{
  "save": "Зберегти",
  "cancel": "Скасувати",
  "loading": "Завантаження...", 
  "delete": "Видалити",
  "confirm": "Ви впевнені?"
}
```

**Шаг 2:** Подключить в request.ts
```typescript
const buttonMessages = (await import(`../../messages/components/button/${locale}.json`)).default;

messages: {
  Button: buttonMessages
}
```

**Шаг 3:** Использовать в любом компоненте
```typescript
import { useTranslations } from 'next-intl';

export default function ActionButton({ action }: { action: 'save' | 'delete' }) {
  const t = useTranslations('Button');
  
  return (
    <button onClick={handleAction}>
      {t(action)}
    </button>
  );
}
```

### 3. Управление Языком

**useLocale Hook:**
```typescript
import { useLocale } from '@/hooks/useLocale';

function LanguageControls() {
  const { locale, setLocale, isLoading, availableLocales } = useLocale();
  
  return (
    <select onChange={(e) => setLocale(e.target.value)}>
      {availableLocales.map(lang => (
        <option key={lang} value={lang}>{lang.toUpperCase()}</option>
      ))}
    </select>
  );
}
```

**Автоматическое определение:**
- 🖥️ **Системный язык**: `navigator.language` → маппинг на поддерживаемые
- 💾 **Сохранение**: localStorage + cookie для SSR
- 🔄 **Синхронизация**: client ↔ server через cookie

## TypeScript Типизация

### Расширение next-intl типов
```typescript
// src/global.d.ts
declare global {
  interface IntlMessages {
    HomePage: typeof import('../messages/pages/home/en.json');
    Header: typeof import('../messages/components/header/en.json');
    Common: typeof import('../messages/components/common/en.json');
    // ... добавлять новые компоненты
  }
}

declare module 'next-intl' {
  interface AppConfig {
    Locale: 'en' | 'ua'; // или (typeof routing.locales)[number]
  }
}
```

### Строгая типизация ключей
```typescript
// Автокомплит и проверка типов
const t = useTranslations('HomePage');
t('title');           // ✅ Valid
t('nonexistent');     // ❌ TypeScript error
```

## Middleware Интеграция

### Совместимость с Auth Middleware
```typescript
// src/middleware.ts
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Сначала i18n processing
  const response = intlMiddleware(request);
  if (response.status !== 200) return response;
  
  // 2. Затем auth/business logic
  // ... ваша логика аутентификации
  
  return authResponse;
}
```

## Лучшие Практики

### 1. Структурирование Ключей
```json
// ✅ Хорошо - логическая группировка
{
  "form": {
    "validation": {
      "required": "Field is required",
      "email": "Invalid email format"
    },
    "submit": "Submit Form"
  }
}

// ❌ Плохо - плоская структура
{
  "formValidationRequired": "Field is required",
  "formValidationEmail": "Invalid email", 
  "formSubmit": "Submit"
}
```

### 2. Переиспользование Переводов
```typescript
// Для общих элементов используйте Common
const tCommon = useTranslations('Common');
const tSpecific = useTranslations('ComponentName');

return (
  <div>
    <h1>{tSpecific('title')}</h1>
    <button>{tCommon('save')}</button>  {/* Переиспользование */}
  </div>
);
```

### 3. Условная Локализация
```typescript
// Fallback для отсутствующих ключей
{t('optionalKey') || 'Default fallback text'}

// Условные переводы
{isLoading ? t('loading') : t('loaded')}
```

### 4. Интерполяция Значений
```json
// В JSON файле
{
  "welcome": "Welcome, {userName}!",
  "itemsCount": "You have {count} items"
}
```

```typescript
// В компоненте
t('welcome', { userName: user.name });
t('itemsCount', { count: items.length });
```

## Расширение Системы

### Добавление Нового Языка
1. **Routing**: добавить в `locales: ['en', 'ua', 'fr']`
2. **Файлы**: создать `messages/**/fr.json` для всех компонентов
3. **UI**: добавить флаг в переключатель языка
4. **Маппинг**: обновить `getSystemLocale()` в useLocale

### Добавление Нового Компонента
1. **Создать папку**: `messages/components/{component-name}/`
2. **Создать переводы**: `en.json`, `ua.json`
3. **Импорт**: добавить в `request.ts`
4. **Типы**: обновить `IntlMessages` в `global.d.ts`

### Локализация Ошибок и Уведомлений
```json
// messages/components/notifications/en.json
{
  "success": {
    "saved": "Changes saved successfully",
    "deleted": "Item deleted"
  },
  "errors": {
    "network": "Network error occurred",
    "validation": "Please check your input"
  }
}
```

## Отладка и Тестирование

### Проверка Текущего Языка
```javascript
// В браузере консоли
localStorage.getItem('NEXT_LOCALE');
document.cookie; // Найти NEXT_LOCALE
```

### Принудительное Переключение
```javascript
// В браузере
localStorage.setItem('NEXT_LOCALE', 'ua');
location.reload();
```

### Проверка Загруженных Переводов
```typescript
import { useTranslations } from 'next-intl';

function DebugTranslations() {
  const t = useTranslations('HomePage');
  console.log(t.raw('title')); // Показывает исходный перевод
}
```

## Performance Соображения

### Оптимизация Загрузки
- ✅ **Ленивая загрузка**: переводы загружаются по компонентам
- ✅ **Tree shaking**: неиспользуемые переводы исключаются
- ✅ **Кэширование**: browser cache + localStorage
- ✅ **Статическая генерация**: поддерживается для SEO

### Размер Бандла
- Маленькие JSON файлы → быстрая загрузка
- Модульная структура → только нужные переводы
- Fallback значения для отсутствующих ключей

## Миграция Существующих Компонентов

### Процесс Локализации Компонента

**Шаг 1: Анализ**
```typescript
// До локализации - hardcoded текст
function MyComponent() {
  return (
    <div>
      <h1>My Page Title</h1>
      <button>Save Changes</button>
      <p>Click here to continue</p>
    </div>
  );
}
```

**Шаг 2: Создание Переводов**
```json
// messages/components/my-component/en.json
{
  "title": "My Page Title",
  "saveButton": "Save Changes", 
  "continueText": "Click here to continue"
}

// messages/components/my-component/ua.json
{
  "title": "Заголовок Моєї Сторінки",
  "saveButton": "Зберегти Зміни",
  "continueText": "Натисніть тут щоб продовжити"
}
```

**Шаг 3: Интеграция**
```typescript
import { useTranslations } from 'next-intl';

function MyComponent() {
  const t = useTranslations('MyComponent');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('saveButton')}</button>
      <p>{t('continueText')}</p>
    </div>
  );
}
```

**Шаг 4: Регистрация в Системе**
```typescript
// В src/i18n/request.ts добавить:
const myComponentMessages = (await import(`../../messages/components/my-component/${locale}.json`)).default;

messages: {
  MyComponent: myComponentMessages
}
```

## Частые Сценарии

### Динамический Контент
```json
{
  "userGreeting": "Hello, {userName}!",
  "itemsCount": "{count, plural, =0 {No items} one {# item} other {# items}}"
}
```

```typescript
t('userGreeting', { userName: 'John' });
t('itemsCount', { count: items.length });
```

### Условная Локализация
```typescript
// Для необязательных ключей
const optionalText = t.has('optionalKey') ? t('optionalKey') : fallbackText;

// Или с fallback
const text = t('key') || 'Default English text';
```

### Форматирование
```typescript
// Числа, даты, валюты автоматически форматируются по локали
const formatter = useFormatter();
formatter.number(1234.56);           // en: "1,234.56" / ua: "1 234,56"
formatter.dateTime(new Date());      // Локализованная дата
```

### Вложенные Переводы
```json
{
  "navigation": {
    "main": {
      "home": "Home",
      "products": "Products"
    },
    "footer": {
      "privacy": "Privacy Policy",
      "terms": "Terms of Service"
    }
  }
}
```

```typescript
t('navigation.main.home');     // "Home"
t('navigation.footer.privacy'); // "Privacy Policy"
```

## Интеграция с Существующими Системами

### Redux/State Management
```typescript
// Переводы в Redux actions/reducers
const errorMessage = t('errors.networkError');
dispatch(setError(errorMessage));
```

### API Responses
```typescript
// Server-side переводы для API
import { getTranslations } from 'next-intl/server';

export async function POST() {
  const t = await getTranslations('API');
  
  return Response.json({
    message: t('success.created'),
    error: t('errors.validation')
  });
}
```

### Forms Validation
```json
{
  "validation": {
    "required": "This field is required",
    "email": "Please enter a valid email",
    "minLength": "Minimum {min} characters required"
  }
}
```

## Mobile и Responsive

### Адаптивный Language Switcher
```typescript
// Компактная версия для мобильных
<div className="flex lg:hidden">
  <select onChange={handleLanguageChange}>
    <option value="en">🇺🇸</option>
    <option value="ua">🇺🇦</option>
  </select>
</div>

// Полная версия для десктопа  
<div className="hidden lg:flex">
  <DropdownLanguageSwitcher />
</div>
```

## Безопасность и Валидация

### XSS Защита
```typescript
// Используйте t() для безопасной интерполяции
t('message', { userInput }); // Автоматически экранируется

// Избегайте dangerouslySetInnerHTML с переводами
```

### Валидация Ключей
```typescript
// Проверка существования ключа
if (t.has('conditionalKey')) {
  return t('conditionalKey');
}
```

## Стилизация и UX

### Сохранение Дизайн-Системы
```json
// Киберпанк стилистика в переводах
{
  "en": {
    "button": "[EXECUTE.BAT]",
    "loading": "> PROCESSING_DATA..."
  },
  "ua": {
    "button": "[ВИКОНАТИ.BAT]", 
    "loading": "> ОБРОБКА_ДАНИХ..."
  }
}
```

### Responsive Text Length
```json
// Учитывайте разную длину текста в языках
{
  "en": {
    "shortButton": "OK",           // 2 символа
    "longDescription": "Click here to save your changes permanently"
  },
  "ua": {
    "shortButton": "Гаразд",       // 6 символов  
    "longDescription": "Натисніть тут щоб зберегти ваші зміни назавжди"
  }
}
```

---

## Быстрая Справка

### Команды для Новой Страницы:
```bash
# 1. Создать структуру
mkdir -p messages/pages/{page-name}

# 2. Создать переводы
touch messages/pages/{page-name}/en.json
touch messages/pages/{page-name}/ua.json

# 3. Добавить в request.ts импорт и messages объект
# 4. Использовать useTranslations('{PageName}')
```

### Команды для Нового Компонента:
```bash
# 1. Создать структуру  
mkdir -p messages/components/{component-name}

# 2. Создать переводы
touch messages/components/{component-name}/en.json
touch messages/components/{component-name}/ua.json

# 3. Регистрация аналогично страницам
```

**💡 Помните**: Каждый hardcoded текст должен быть заменен на `t('key')` для полной локализации!

---

**Статус**: ✅ Готово к Production  
**Версия**: 1.0  
**Обновлено**: Январь 2025
