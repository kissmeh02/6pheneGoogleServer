import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Database, Calculator, BarChart3, Settings } from 'lucide-react'

interface LayoutProps {
  children: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation()

  const navItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/materials', label: 'Materials', icon: Database },
    { path: '/new-run', label: 'New Run', icon: Calculator },
    { path: '/formulas', label: 'Formulas', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-dark-panel border-r border-gray-800 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-dark-accent">Graphene Sim</h1>
          <p className="text-sm text-gray-400 mt-1">Composite Predictor</p>
        </div>
        
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-dark-accent text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}

export default Layout










