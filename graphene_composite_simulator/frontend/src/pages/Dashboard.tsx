import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Plus, TrendingUp, Database, Calculator } from 'lucide-react'
import api from '../services/api'

const Dashboard = () => {
  const { data: runs } = useQuery({
    queryKey: ['runs'],
    queryFn: () => api.get('/api/runs?limit=5').then(res => res.data)
  })

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Dashboard</h1>
          <p className="text-gray-400">Graphene Composite Property Predictor</p>
        </div>
        <Link
          to="/new-run"
          className="bg-dark-accent text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors"
        >
          <Plus size={20} />
          New Composite Run
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-dark-panel p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Total Runs</p>
              <p className="text-3xl font-bold text-dark-text">{runs?.length || 0}</p>
            </div>
            <Calculator className="text-dark-accent" size={32} />
          </div>
        </div>

        <div className="bg-dark-panel p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Materials</p>
              <p className="text-3xl font-bold text-dark-text">-</p>
            </div>
            <Database className="text-dark-accent2" size={32} />
          </div>
        </div>

        <div className="bg-dark-panel p-6 rounded-lg border border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm mb-1">Recent Activity</p>
              <p className="text-3xl font-bold text-dark-text">-</p>
            </div>
            <TrendingUp className="text-dark-accent" size={32} />
          </div>
        </div>
      </div>

      {/* Recent Runs */}
      <div className="bg-dark-panel rounded-lg border border-gray-800 p-6">
        <h2 className="text-xl font-bold text-dark-text mb-4">Recent Runs</h2>
        {runs && runs.length > 0 ? (
          <div className="space-y-3">
            {runs.map((run: any) => (
              <Link
                key={run.id}
                to={`/results/${run.id}`}
                className="block p-4 bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold text-dark-text">Run #{run.id}</p>
                    <p className="text-sm text-gray-400">
                      {run.graphene_wt_pct}% graphene • {new Date(run.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <span className="text-dark-accent">View →</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No runs yet. Create your first composite run!</p>
        )}
      </div>
    </div>
  )
}

export default Dashboard










