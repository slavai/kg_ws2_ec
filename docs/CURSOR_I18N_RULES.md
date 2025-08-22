# 🌍 Cursor AI Rules: Локализация Обязательна

## КРИТИЧЕСКИ ВАЖНО: НИКАКОГО HARDCODED ТЕКСТА!

### 🚨 ОБЯЗАТЕЛЬНЫЕ ПРАВИЛА ДЛЯ AI:

1. **ВСЕ пользовательские тексты ДОЛЖНЫ быть локализованы через next-intl**
2. **НИКОГДА не используй hardcoded строки для UI элементов**  
3. **ВСЕГДА проверяй существующие переводы перед созданием новых**
4. **Следуй модульной структуре** файлов переводов

---

## 📋 Чек-лист При Создании/Изменении Компонентов:

### ❌ ЗАПРЕЩЕНО:
```typescript
// НЕ ДЕЛАЙ ТАК!
return <button>Save</button>;                    // Hardcoded
return <h1>Welcome to our store</h1>;           // Hardcoded  
return <p>Please enter your email</p>;          // Hardcoded
```

### ✅ ПРАВИЛЬНО:
```typescript
// ДЕЛАЙ ТАК!
const t = useTranslations('ComponentName');
return <button>{t('save')}</button>;
return <h1>{t('welcome')}</h1>;
return <p>{t('enterEmail')}</p>;
```

---

## 🏗️ Процесс Локализации:

### Для НОВЫХ компонентов:
1. **Создай переводы**: `messages/components/{name}/en.json` + `ua.json`
2. **Добавь в request.ts**: импорт + регистрация в messages
3. **Используй в компоненте**: `useTranslations('ComponentName')`
4. **Обнови типы**: добавь в `global.d.ts` IntlMessages

### Для СУЩЕСТВУЮЩИХ компонентов:
1. **Найди hardcoded тексты** (любые строки в кавычках для UI)
2. **Создай ключи переводов** в соответствующем файле
3. **Замени на t('key')**
4. **Протестируй на обоих языках**

---

## 📁 Файловая Структура - СТРОГО СОБЛЮДАЙ:

```
messages/
├── pages/                  # Переводы для страниц
│   ├── home/              # каждая страница = папка
│   ├── products/ 
│   └── profile/
├── components/            # Переводы для компонентов  
│   ├── header/            # навигация, пользователь
│   ├── common/            # кнопки, ошибки, общее
│   ├── auth/              # формы входа/регистрации
│   ├── product-card/      # карточка товара
│   └── forms/             # формы
```

### Принцип Разделения:
- **pages/** - тексты специфичные для страницы
- **components/common/** - переиспользуемые элементы (Save, Cancel, Loading...)
- **components/{name}/** - тексты специфичные для компонента

---

## 🔧 ТЕХНИЧЕСКАЯ ДОКУМЕНТАЦИЯ:

**📖 Полное руководство**: `/docs/I18N_GUIDE.md`

### Ключевые файлы системы:
- `src/i18n/routing.ts` - конфигурация языков
- `src/i18n/request.ts` - server-side загрузка переводов
- `src/hooks/useLocale.ts` - client-side управление языком
- `messages/**` - файлы переводов

### Поддерживаемые языки:
- **en** (English) - по умолчанию
- **ua** (Українська)

---

## 🚨 ЧТО ПРОВЕРЯТЬ ПРИ CODE REVIEW:

### 1. Поиск Hardcoded Текста:
```bash
# Найди все подозрительные строки:
grep -r "return.*>.*[A-Za-z].*<" src/
grep -r "className.*>.*[A-Za-z].*<" src/
```

### 2. Проверка Переводов:
- Есть ли файлы `en.json` И `ua.json`?
- Зарегистрирован ли компонент в `request.ts`?
- Добавлен ли тип в `global.d.ts`?

### 3. Тестирование:
- Переключается ли язык корректно?
- Сохраняется ли выбор языка?
- Все ли тексты переведены?

---

## 🎯 ПРИМЕРЫ ИНТЕГРАЦИИ:

### Базовый Компонент:
```typescript
import { useTranslations } from 'next-intl';

export default function MyComponent() {
  const t = useTranslations('MyComponent');
  
  return (
    <div>
      <h1>{t('title')}</h1>
      <button>{t('actionButton')}</button>
    </div>
  );
}
```

### С Переиспользованием Common:
```typescript
import { useTranslations } from 'next-intl';

export default function FormComponent() {
  const t = useTranslations('FormComponent');
  const tCommon = useTranslations('Common');
  
  return (
    <form>
      <h2>{t('formTitle')}</h2>
      <button type="submit">{tCommon('save')}</button>
      <button type="button">{tCommon('cancel')}</button>
    </form>
  );
}
```

### Server Component:
```typescript
import { getTranslations } from 'next-intl/server';

export default async function ServerPage() {
  const t = await getTranslations('ServerPage');
  
  return <h1>{t('serverTitle')}</h1>;
}
```

---

## ⚡ БЫСТРЫЕ КОМАНДЫ:

### Создание нового компонента с локализацией:
```bash
# 1. Создать файлы переводов
mkdir -p messages/components/{component-name}
touch messages/components/{component-name}/en.json
touch messages/components/{component-name}/ua.json

# 2. Добавить базовый контент
echo '{"title": "Component Title"}' > messages/components/{component-name}/en.json
echo '{"title": "Заголовок Компонента"}' > messages/components/{component-name}/ua.json
```

### Поиск нелокализованного текста:
```bash
# Найти строки которые могут быть hardcoded
grep -r '"[A-Z][a-z].*"' src/ --include="*.tsx" --include="*.ts"
```

---

## 🎨 СТИЛИСТИЧЕСКИЕ ТРЕБОВАНИЯ:

### Киберпанк Стилистика:
- Сохраняй `[BRACKETS]`, `CAPS_LOCK`, `SYSTEM.EXE` стиль в переводах
- Используй техническую терминологию: "LOADING...", "ERROR.LOG", "STATUS: ACTIVE"
- Адаптируй стиль под украинский: "[СТАТУС.LOG]", "ЗАВАНТАЖЕННЯ..."

### Консистентность:
- Одинаковый стиль naming в обоих языках
- Сохраняй технические сокращения: `.exe`, `.sys`, `.bat`, `.dll`
- Используй подчеркивания для составных слов: `USER_PROFILE`, `КОРИСТУВАЧ_ПРОФІЛЬ`

---

**🔥 ГЛАВНОЕ ПРАВИЛО: NO HARDCODED TEXT! ВСЕ ЧЕРЕЗ t('key')!**

**📚 Детальная документация**: `docs/I18N_GUIDE.md`
