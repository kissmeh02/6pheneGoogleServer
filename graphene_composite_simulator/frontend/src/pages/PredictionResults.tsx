import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Download, AlertTriangle } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'
import api from '../services/api'

const PredictionResults = () => {
  const { runId } = useParams()
  const { data: run } = useQuery({
    queryKey: ['run', runId],
    queryFn: () => api.get(`/api/runs/${runId}`).then(res => res.data),
    enabled: !!runId
  })

  const { data: prediction } = useQuery({
    queryKey: ['prediction', runId],
    queryFn: () => api.get(`/api/predictions/run/${runId}`).then(res => res.data),
    enabled: !!runId
  })

  const { data: baseMaterial } = useQuery({
    queryKey: ['material', run?.base_material_id],
    queryFn: () => api.get(`/api/materials/${run?.base_material_id}`).then(res => res.data),
    enabled: !!run?.base_material_id
  })

  const warnings = prediction?.warnings_json ? JSON.parse(prediction.warnings_json) : []

  const comparisonData = [
    {
      property: 'Tensile (MPa)',
      base: baseMaterial?.tensile_MPa || 0,
      predicted: prediction?.predicted_tensile_MPa || 0,
    },
    {
      property: 'Modulus (GPa)',
      base: baseMaterial?.youngs_GPa || 0,
      predicted: prediction?.predicted_modulus_GPa || 0,
    },
    {
      property: 'Toughness (J)',
      base: baseMaterial?.toughness_Jm3 || 0,
      predicted: prediction?.predicted_toughness_J || 0,
    },
    {
      property: 'Conductivity (S/m)',
      base: baseMaterial?.electrical_conductivity_S_m || 0,
      predicted: prediction?.predicted_conductivity_S_m || 0,
    },
  ]

  const radarData = [
    {
      property: 'Tensile',
      base: (baseMaterial?.tensile_MPa || 0) / 4000,
      predicted: (prediction?.predicted_tensile_MPa || 0) / 4000,
    },
    {
      property: 'Modulus',
      base: (baseMaterial?.youngs_GPa || 0) / 300,
      predicted: (prediction?.predicted_modulus_GPa || 0) / 300,
    },
    {
      property: 'Toughness',
      base: (baseMaterial?.toughness_Jm3 || 0) / 1e7,
      predicted: (prediction?.predicted_toughness_J || 0) / 1e7,
    },
    {
      property: 'Conductivity',
      base: Math.log10((baseMaterial?.electrical_conductivity_S_m || 1e-10) + 1) / 8,
      predicted: Math.log10((prediction?.predicted_conductivity_S_m || 1e-10) + 1) / 8,
    },
  ]

  const handleExportCSV = () => {
    const csv = [
      ['Property', 'Base Material', 'Predicted Composite'],
      ...comparisonData.map(d => [d.property, d.base, d.predicted])
    ].map(row => row.join(',')).join('\n')
    
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `composite_prediction_${runId}.csv`
    a.click()
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Prediction Results</h1>
          <p className="text-gray-400">Run #{runId} • {run && new Date(run.created_at).toLocaleDateString()}</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="bg-dark-accent2 text-dark-bg px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-cyan-400 transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="text-yellow-400" size={20} />
            <h3 className="font-bold text-yellow-400">Warnings</h3>
          </div>
          <ul className="list-disc list-inside text-yellow-300 space-y-1">
            {warnings.map((w: string, i: number) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Comparison Table */}
      <div className="bg-dark-panel rounded-lg border border-gray-800 p-6 mb-6">
        <h2 className="text-xl font-bold text-dark-text mb-4">Property Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Property</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Base Material</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Predicted Composite</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-400">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {comparisonData.map((row) => {
                const change = ((row.predicted - row.base) / row.base) * 100
                return (
                  <tr key={row.property}>
                    <td className="px-4 py-3 text-dark-text">{row.property}</td>
                    <td className="px-4 py-3 text-right text-gray-400">{row.base.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right text-dark-text font-semibold">{row.predicted.toFixed(2)}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {change > 0 ? '+' : ''}{change.toFixed(1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-dark-panel rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-dark-text mb-4">Property Comparison</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#424242" />
              <XAxis dataKey="property" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: '1px solid #424242' }} />
              <Legend />
              <Bar dataKey="base" fill="#03DAC6" name="Base Material" />
              <Bar dataKey="predicted" fill="#BB86FC" name="Predicted Composite" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-dark-panel rounded-lg border border-gray-800 p-6">
          <h2 className="text-xl font-bold text-dark-text mb-4">Radar Chart</h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#424242" />
              <PolarAngleAxis dataKey="property" stroke="#9CA3AF" />
              <PolarRadiusAxis angle={90} domain={[0, 1]} stroke="#9CA3AF" />
              <Radar name="Base" dataKey="base" stroke="#03DAC6" fill="#03DAC6" fillOpacity={0.3} />
              <Radar name="Predicted" dataKey="predicted" stroke="#BB86FC" fill="#BB86FC" fillOpacity={0.3} />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default PredictionResults










