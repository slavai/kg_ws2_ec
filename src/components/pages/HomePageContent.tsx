'use client'

import { useTranslations } from 'next-intl'
import ProductCatalog from '@/components/products/ProductCatalog'
import SpaceGameCanvas from '@/components/game/SpaceGameCanvas'
import { Product } from '@/lib/types/product'

interface HomePageContentProps {
  products: Product[]
}

export default function HomePageContent({ products }: HomePageContentProps) {
  const t = useTranslations('HomePage')

  return (
    <div className="min-h-screen bg-cyber-black relative overflow-hidden z-9">
      {/* Data Stream Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="data-stream" style={{ left: '10%', animationDelay: '0s' }} />
        <div className="data-stream" style={{ left: '30%', animationDelay: '1s' }} />
        <div className="data-stream" style={{ left: '50%', animationDelay: '2s' }} />
        <div className="data-stream" style={{ left: '70%', animationDelay: '0.5s' }} />
        <div className="data-stream" style={{ left: '90%', animationDelay: '1.5s' }} />
      </div>

      {/* Scanlines Effect */}
      <div className="scanlines absolute inset-0 pointer-events-none" />

      {/* Space Game Canvas - Interactive Background */}
      <SpaceGameCanvas />

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="text-center">
          <h1 className="text-6xl font-cyber font-bold neon-text-cyan mb-6 glitch-hover">
            {t('title')}
          </h1>
          <div className="cyber-border-cyan inline-block p-1 mb-8">
            <p className="text-xl text-neon-pink bg-cyber-dark px-6 py-3 font-mono">
              {t('subtitle')}
            </p>
          </div>
          
          {/* Cyberpunk Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 mb-20">
            <div className="cyber-card group hover:shadow-lg hover:shadow-neon-cyan/50 transition-all duration-300">
              <div className="text-5xl mb-6 transform group-hover:glitch">🎮</div>
              <h3 className="text-xl font-cyber font-bold mb-4 neon-text-cyan group-hover:neon-text-pink transition-all duration-300">
                {t('categories.games.title')}
              </h3>
              <p className="text-cyber-lighter font-mono text-sm leading-relaxed">
                {t('categories.games.line1')} <br/>
                {t('categories.games.line2')} <br/>
                {t('categories.games.line3')}
              </p>
              <div className="mt-4 h-1 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-pink opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="cyber-card hover:neon-glow-pink group">
              <div className="text-5xl mb-6 transform group-hover:glitch">💻</div>
              <h3 className="text-xl font-cyber font-bold mb-4 neon-text-cyan group-hover:neon-text-pink transition-all duration-300">
                {t('categories.software.title')}
              </h3>
              <p className="text-cyber-lighter font-mono text-sm leading-relaxed">
                {t('categories.software.line1')} <br/>
                {t('categories.software.line2')} <br/>
                {t('categories.software.line3')}
              </p>
              <div className="mt-4 h-1 bg-gradient-to-r from-neon-pink via-neon-yellow to-neon-cyan opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="cyber-card hover:neon-glow-purple group">
              <div className="text-5xl mb-6 transform group-hover:glitch">🎫</div>
              <h3 className="text-xl font-cyber font-bold mb-4 neon-text-cyan group-hover:neon-text-pink transition-all duration-300">
                {t('categories.coupons.title')}
              </h3>
              <p className="text-cyber-lighter font-mono text-sm leading-relaxed">
                {t('categories.coupons.line1')} <br/>
                {t('categories.coupons.line2')} <br/>
                {t('categories.coupons.line3')}
              </p>
              <div className="mt-4 h-1 bg-gradient-to-r from-neon-purple via-neon-green to-neon-yellow opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          </div>

          {/* Terminal Interface */}
          <div className="bg-cyber-black border border-neon-cyan p-6 rounded-cyber max-w-2xl mx-auto font-mono text-left">
            <div className="flex items-center mb-4">
              <div className="w-3 h-3 rounded-full bg-glitch-red mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-neon-yellow mr-2"></div>
              <div className="w-3 h-3 rounded-full bg-neon-green mr-4"></div>
              <span className="text-cyber-lighter text-sm">terminal://digital_store/</span>
            </div>
            <div className="text-neon-cyan space-y-1 text-sm">
              <div>{t('terminal.initializing')}</div>
              <div className="text-neon-green">{t('terminal.connectionEstablished')}</div>
              <div>{t('terminal.loadingDatabase')}</div>
              <div className="text-neon-pink">{t('terminal.complete')}</div>
              <div>{t('terminal.readyForPurchase')}</div>
              <div className="animate-pulse">{t('terminal.cursor')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog with Cyberpunk Styling */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 relative z-10">
        <div className="cyber-border-cyan p-1 mb-8">
          <div className="bg-cyber-dark p-6">
            <h2 className="text-3xl font-cyber font-bold neon-text-pink mb-2 text-center">
              {t('featuredProducts')}
            </h2>
            <p className="text-center text-cyber-lighter font-mono">
              {t('selectItem')}
            </p>
          </div>
        </div>
        <ProductCatalog initialProducts={products} />
      </section>

      {/* Floating Glitch Text */}
      <div className="fixed bottom-4 right-4 text-glitch-red font-mono text-xs opacity-30 animate-pulse pointer-events-none">
        {t('errorText')}
      </div>
    </div>
  )
}
