import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  // Check if user is authenticated and is admin
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/?redirected=true&message=Требуется авторизация')
  }

  const { data: userProfile } = await supabase
    .from('users')
    .select('is_admin, full_name, email')
    .eq('id', user.id)
    .single()

  if (!userProfile?.is_admin) {
    redirect('/?redirected=true&message=Недостаточно прав доступа')
  }

  return (
    <div className="min-h-screen bg-cyber-black cyber-grid-pattern">
      {/* Admin Header */}
      <header className="bg-cyber-black border-b-2 border-glitch-red shadow-neon-red relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-cyber-dark border border-glitch-red rounded-cyber flex items-center justify-center neon-glow-red">
                  <span className="text-glitch-red font-bold text-lg font-cyber">A</span>
                </div>
                <h1 className="text-xl font-bold neon-text-red font-cyber">
                  [ADMIN.CONSOLE]
                </h1>
              </div>
              
              {/* Admin Navigation */}
              <nav className="hidden md:flex items-center space-x-6 ml-8">
                <a
                  href="/admin/dashboard"
                  className="text-cyber-lighter hover:neon-text-red transition-all duration-300 font-mono text-sm uppercase tracking-wider hover:glitch-hover relative"
                >
                  [DASHBOARD.SYS]
                </a>
                <a
                  href="/admin/products"
                  className="text-cyber-lighter hover:neon-text-purple transition-all duration-300 font-mono text-sm uppercase tracking-wider hover:glitch-hover relative"
                >
                  [PRODUCTS.DB]
                </a>
              </nav>
            </div>

            {/* Admin User Info */}
            <div className="flex items-center space-x-4">
              <div className="text-right bg-cyber-dark border border-glitch-red px-3 py-2 rounded-cyber neon-glow-red">
                <div className="text-sm font-medium neon-text-red font-cyber">
                  {userProfile.full_name || userProfile.email}
                </div>
                <div className="text-xs text-glitch-red font-medium font-cyber uppercase pulse-soft">
                  &gt;&gt;&gt; ADMINISTRATOR &lt;&lt;&lt;
                </div>
              </div>
              <a
                href="/"
                className="cyber-card bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border border-neon-cyan hover:neon-glow-cyan text-neon-cyan px-4 py-2 rounded-cyber text-sm font-cyber font-bold transition-all duration-300 flex items-center space-x-2 hover:glitch uppercase tracking-wider"
              >
                <span className="text-base pulse-soft">🌐</span>
                <span>[PORTAL.EXE]</span>
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}