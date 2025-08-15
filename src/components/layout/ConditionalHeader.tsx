'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'

export default function ConditionalHeader() {
  const pathname = usePathname()
  
  // Не показываем обычный Header на страницах админки
  const isAdminPage = pathname.startsWith('/admin')
  
  if (isAdminPage) {
    return null
  }
  
  return <Header />
}
