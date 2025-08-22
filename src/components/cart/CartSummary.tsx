'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { CyberButton } from '@/components/ui/CyberButton'

interface CartSummaryProps {
  total: number
  itemCount: number
  userBalance?: number
  isLoading?: boolean
}

export default function CartSummary({ 
  total, 
  itemCount, 
  userBalance = 0,
  isLoading = false 
}: CartSummaryProps) {
  const hasEnoughBalance = userBalance >= total
  const remainingBalance = userBalance - total
  const t = useTranslations('Cart')

  return (
    <div className="cyber-card bg-cyber-dark border border-cyber-medium p-6 neon-glow-purple">
      <h2 className="text-2xl font-bold neon-text-purple font-cyber uppercase tracking-wider mb-6 glitch-text">
        {t('orderSummary')}
      </h2>
      
      {/* Items Count */}
      <div className="flex justify-between items-center py-3 border-b border-neon-cyan">
        <span className="text-cyber-light font-mono">
          {t('items')} ([{itemCount}])
        </span>
        <span className="font-bold neon-text-cyan font-cyber">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-4 border-b border-neon-cyan">
        <span className="text-xl font-bold neon-text-cyan font-cyber uppercase tracking-wider">
          {t('total')}
        </span>
        <span className="text-xl font-bold neon-text-cyan font-cyber glitch-text">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Balance Info */}
      <div className="mt-6 space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-cyber-light font-mono">
            {t('yourBalance')}
          </span>
          <span className={`font-bold font-cyber ${
            userBalance >= total 
              ? 'neon-text-green' 
              : 'text-cyber-light'
          }`}>
            ${userBalance.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-cyber-light font-mono">
            {t('remainingAfterPurchase')}
          </span>
          <span className={`font-bold font-cyber ${
            remainingBalance >= 0 
              ? 'neon-text-green' 
              : 'text-glitch-red'
          }`}>
            ${remainingBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Balance Warning */}
      {!hasEnoughBalance && (
        <div className="mt-6 p-4 bg-cyber-black border border-glitch-red rounded-cyber neon-glow-pink">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-glitch-red mr-3 pulse-soft" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-bold text-glitch-red font-cyber uppercase tracking-wider">
                {t('insufficientBalance')}
              </p>
              <p className="text-xs text-glitch-red font-mono mt-1">
                {t('needMoreFunds', { amount: (total - userBalance).toFixed(2) })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <div className="mt-8">
        {itemCount > 0 ? (
          <Link
            href="/checkout"
            className={hasEnoughBalance && !isLoading ? '' : 'pointer-events-none'}
            onClick={(e) => {
              if (!hasEnoughBalance || isLoading) {
                e.preventDefault()
              }
            }}
          >
            <CyberButton
              variant="neon"
              color={hasEnoughBalance && !isLoading ? "green" : "cyan"}
              size="lg"
              className="w-full hover:glitch"
              disabled={!hasEnoughBalance || isLoading}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {t('processing')}
                </span>
              ) : hasEnoughBalance ? (
                t('proceedToCheckout')
              ) : (
                t('insufficientBalance')
              )}
            </CyberButton>
          </Link>
        ) : (
          <div className="text-center py-4 text-cyber-light font-mono">
            [{t('emptyCartTitle')}]
          </div>
        )}
      </div>

      {/* Continue Shopping */}
      <div className="mt-6 text-center">
        <Link 
          href="/"
          className="text-sm neon-text-pink hover:neon-text-cyan font-mono uppercase tracking-wider hover:glitch-hover transition-all duration-300"
        >
          ← {t('continueShoppingButton')}
        </Link>
      </div>
    </div>
  )
}

