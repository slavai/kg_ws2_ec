import { getProducts } from '@/lib/supabase/database'
import HomePageContent from '@/components/pages/HomePageContent'

export default async function Home() {
  // Fetch products on server side
  const products = await getProducts({ limit: 8, activeOnly: true })

  return <HomePageContent products={products} />
}
