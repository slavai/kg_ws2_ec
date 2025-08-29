import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// Создаем навигационные хелперы для next-intl
// Это легкие обертки вокруг Next.js navigation API
// которые учитывают конфигурацию маршрутизации
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);

