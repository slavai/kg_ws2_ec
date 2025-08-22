import { createClient } from '@/lib/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Get dashboard statistics
  const [
    { count: totalProducts },
    { count: activeProducts },
    { count: totalUsers },
    { count: totalOrders }
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('users').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true })
  ])

  const stats = [
    {
      title: "Всего продуктов",
      value: totalProducts || 0,
      icon: "📦",
      color: "blue"
    },
    {
      title: "Активных продуктов", 
      value: activeProducts || 0,
      icon: "✅",
      color: "green"
    },
    {
      title: "Пользователей",
      value: totalUsers || 0,
      icon: "👥",
      color: "purple"
    },
    {
      title: "Заказов",
      value: totalOrders || 0,
      icon: "🛒",
      color: "orange"
    }
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold neon-text-red font-cyber glitch-hover">
          [DASHBOARD.SYS]
        </h1>
        <p className="text-cyber-lighter mt-2 font-mono text-sm uppercase tracking-wider">
          &gt;&gt;&gt; SYSTEM STATISTICS &amp; CONTROL PANEL &lt;&lt;&lt;
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div key={index} className="cyber-card bg-cyber-dark border border-neon-cyan neon-glow-cyan p-6 hover:glitch transition-all duration-300">
            <div className="flex items-center">
              <div className="text-3xl mr-4 pulse-soft">{stat.icon}</div>
              <div>
                <p className="text-sm font-medium text-neon-cyan uppercase tracking-wide font-mono">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold neon-text-green font-cyber">
                  {stat.value}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="cyber-card bg-cyber-dark border border-neon-purple neon-glow-purple p-6">
        <h2 className="text-xl font-semibold neon-text-purple font-cyber mb-4 uppercase tracking-wider">
          [QUICK_ACTIONS.EXE]
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="cyber-card bg-gradient-to-r from-neon-green/20 to-neon-cyan/20 border-2 border-dashed border-neon-green hover:border-solid hover:neon-glow-green hover:glitch transition-all duration-300 p-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-2 pulse-soft">➕</div>
              <div className="font-medium neon-text-green font-cyber uppercase tracking-wider">ADD PRODUCT</div>
              <div className="text-sm text-cyber-lighter font-mono">[CREATE_NEW.BAT]</div>
            </div>
          </a>
          
          <a
            href="/admin/products"
            className="cyber-card bg-gradient-to-r from-neon-purple/20 to-neon-pink/20 border-2 border-dashed border-neon-purple hover:border-solid hover:neon-glow-purple hover:glitch transition-all duration-300 p-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-2 pulse-soft">📦</div>
              <div className="font-medium neon-text-purple font-cyber uppercase tracking-wider">MANAGE PRODUCTS</div>
              <div className="text-sm text-cyber-lighter font-mono">[EDIT_DB.SYS]</div>
            </div>
          </a>
          
          <a
            href="/"
            className="cyber-card bg-gradient-to-r from-neon-cyan/20 to-neon-blue/20 border-2 border-dashed border-neon-cyan hover:border-solid hover:neon-glow-cyan hover:glitch transition-all duration-300 p-4"
          >
            <div className="text-center">
              <div className="text-2xl mb-2 pulse-soft">🌐</div>
              <div className="font-medium neon-text-cyan font-cyber uppercase tracking-wider">GO TO SITE</div>
              <div className="text-sm text-cyber-lighter font-mono">[CLIENT_VIEW.EXE]</div>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}