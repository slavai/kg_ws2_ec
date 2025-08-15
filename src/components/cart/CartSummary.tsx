'use client'

import Link from 'next/link'

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

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Order Summary
      </h2>
      
      {/* Items Count */}
      <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
        <span className="text-gray-600 dark:text-gray-400">
          Items ({itemCount})
        </span>
        <span className="font-medium text-gray-900 dark:text-white">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Total */}
      <div className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
        <span className="text-lg font-semibold text-gray-900 dark:text-white">
          Total
        </span>
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          ${total.toFixed(2)}
        </span>
      </div>

      {/* Balance Info */}
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Your Balance
          </span>
          <span className={`font-medium ${
            userBalance >= total 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-gray-900 dark:text-white'
          }`}>
            ${userBalance.toFixed(2)}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600 dark:text-gray-400">
            Remaining After Purchase
          </span>
          <span className={`font-medium ${
            remainingBalance >= 0 
              ? 'text-green-600 dark:text-green-400' 
              : 'text-red-600 dark:text-red-400'
          }`}>
            ${remainingBalance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Balance Warning */}
      {!hasEnoughBalance && (
        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.268 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Insufficient Balance
              </p>
              <p className="text-xs text-red-700 dark:text-red-300">
                You need ${(total - userBalance).toFixed(2)} more to complete this purchase.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Button */}
      <div className="mt-6">
        {itemCount > 0 ? (
          <Link
            href="/checkout"
            className={`w-full py-3 px-4 rounded-lg text-center font-medium transition-colors block ${
              hasEnoughBalance && !isLoading
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
            }`}
            onClick={(e) => {
              if (!hasEnoughBalance || isLoading) {
                e.preventDefault()
              }
            }}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : hasEnoughBalance ? (
              'Proceed to Checkout'
            ) : (
              'Insufficient Balance'
            )}
          </Link>
        ) : (
          <div className="text-center py-3 text-gray-500 dark:text-gray-400">
            Your cart is empty
          </div>
        )}
      </div>

      {/* Continue Shopping */}
      <div className="mt-4 text-center">
        <Link 
          href="/"
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          ← Continue Shopping
        </Link>
      </div>
    </div>
  )
}
