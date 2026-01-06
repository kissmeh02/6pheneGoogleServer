import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { Calculator } from 'lucide-react'
import api from '../services/api'

const NewRun = () => {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [newRun, setNewRun] = useState({
    base_material_id: '',
    matrix_material_id: '',
    graphene_spec_id: '',
    graphene_wt_pct: 1.0,
    dispersion_quality: 0.5,
    bonding_score: 0.5,
    manufacturing_method: '',
    cure_temp_C: '',
    cure_pressure_bar: '',
    void_fraction: 0.0,
    sample_thickness_mm: '',
  })

  const { data: materials } = useQuery({
    queryKey: ['materials'],
    queryFn: () => api.get('/api/materials').then(res => res.data)
  })

  const { data: grapheneSpecs } = useQuery({
    queryKey: ['graphene-specs'],
    queryFn: () => api.get('/api/materials/graphene-specs').then(res => res.data)
  })

  const createRunMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/runs', data),
    onSuccess: async (response) => {
      // Calculate predictions
      const runId = response.data.id
      await api.post(`/api/predictions/calculate/${runId}`)
      queryClient.invalidateQueries({ queryKey: ['runs'] })
      navigate(`/results/${runId}`)
    }
  })

  const handleSubmit = () => {
    const runData = {
      ...newRun,
      base_material_id: parseInt(newRun.base_material_id),
      matrix_material_id: newRun.matrix_material_id ? parseInt(newRun.matrix_material_id) : null,
      graphene_spec_id: newRun.graphene_spec_id ? parseInt(newRun.graphene_spec_id) : null,
      graphene_wt_pct: parseFloat(newRun.graphene_wt_pct.toString()),
      dispersion_quality: parseFloat(newRun.dispersion_quality.toString()),
      bonding_score: parseFloat(newRun.bonding_score.toString()),
      cure_temp_C: newRun.cure_temp_C ? parseFloat(newRun.cure_temp_C) : null,
      cure_pressure_bar: newRun.cure_pressure_bar ? parseFloat(newRun.cure_pressure_bar) : null,
      void_fraction: parseFloat(newRun.void_fraction.toString()),
      sample_thickness_mm: newRun.sample_thickness_mm ? parseFloat(newRun.sample_thickness_mm) : null,
    }
    createRunMutation.mutate(runData)
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-dark-text mb-2">New Composite Run</h1>
        <p className="text-gray-400">Configure parameters and predict composite properties</p>
      </div>

      <div className="bg-dark-panel rounded-lg border border-gray-800 p-6 space-y-6">
        {/* Material Selection */}
        <div>
          <h2 className="text-xl font-bold text-dark-text mb-4">Material Selection</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Base Material *</label>
              <select
                value={newRun.base_material_id}
                onChange={(e) => setNewRun({ ...newRun, base_material_id: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                required
              >
                <option value="">Select base material</option>
                {materials?.map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name} ({m.type})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Matrix Material</label>
              <select
                value={newRun.matrix_material_id}
                onChange={(e) => setNewRun({ ...newRun, matrix_material_id: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
              >
                <option value="">Select matrix (optional)</option>
                {materials?.filter((m: any) => m.type === 'resin' || m.type === 'matrix').map((m: any) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Graphene Specification</label>
              <select
                value={newRun.graphene_spec_id}
                onChange={(e) => setNewRun({ ...newRun, graphene_spec_id: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
              >
                <option value="">Select graphene spec (optional)</option>
                {grapheneSpecs?.map((spec: any) => (
                  <option key={spec.id} value={spec.id}>{spec.name} ({spec.graphene_type})</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Process Parameters */}
        <div>
          <h2 className="text-xl font-bold text-dark-text mb-4">Process Parameters</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Graphene Weight %: {newRun.graphene_wt_pct}%
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.1"
                value={newRun.graphene_wt_pct}
                onChange={(e) => setNewRun({ ...newRun, graphene_wt_pct: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Dispersion Quality: {(newRun.dispersion_quality * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={newRun.dispersion_quality}
                onChange={(e) => setNewRun({ ...newRun, dispersion_quality: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Bonding Score: {(newRun.bonding_score * 100).toFixed(0)}%
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={newRun.bonding_score}
                onChange={(e) => setNewRun({ ...newRun, bonding_score: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Void Fraction: {(newRun.void_fraction * 100).toFixed(1)}%
              </label>
              <input
                type="range"
                min="0"
                max="0.1"
                step="0.001"
                value={newRun.void_fraction}
                onChange={(e) => setNewRun({ ...newRun, void_fraction: parseFloat(e.target.value) })}
                className="w-full"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cure Temperature (°C)</label>
              <input
                type="number"
                value={newRun.cure_temp_C}
                onChange={(e) => setNewRun({ ...newRun, cure_temp_C: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                placeholder="e.g. 180"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Cure Pressure (bar)</label>
              <input
                type="number"
                value={newRun.cure_pressure_bar}
                onChange={(e) => setNewRun({ ...newRun, cure_pressure_bar: e.target.value })}
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                placeholder="e.g. 6"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
          <button
            onClick={handleSubmit}
            disabled={!newRun.base_material_id || createRunMutation.isPending}
            className="bg-dark-accent text-white px-8 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors disabled:opacity-50"
          >
            <Calculator size={20} />
            {createRunMutation.isPending ? 'Calculating...' : 'Calculate Predictions'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default NewRun












