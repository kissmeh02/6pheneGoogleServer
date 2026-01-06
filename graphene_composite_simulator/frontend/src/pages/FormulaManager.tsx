import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash, Save } from 'lucide-react'
import api from '../services/api'

const FormulaManager = () => {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [formula, setFormula] = useState({
    property_name: '',
    formula_expression: '',
    variables: '',
    description: '',
    unit: '',
  })

  const { data: formulas } = useQuery({
    queryKey: ['formulas'],
    queryFn: () => api.get('/api/formulas').then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/formulas', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] })
      setIsAdding(false)
      setFormula({ property_name: '', formula_expression: '', variables: '', description: '', unit: '' })
    }
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => api.patch(`/api/formulas/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] })
      setEditingId(null)
      setFormula({ property_name: '', formula_expression: '', variables: '', description: '', unit: '' })
    }
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => api.delete(`/api/formulas/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['formulas'] })
    }
  })

  const handleSave = () => {
    const formulaData = {
      ...formula,
      variables: JSON.stringify(formula.variables.split(',').map(v => v.trim())),
    }
    if (editingId) {
      updateMutation.mutate({ id: editingId, data: formulaData })
    } else {
      createMutation.mutate(formulaData)
    }
  }

  const handleEdit = (f: any) => {
    setEditingId(f.id)
    setFormula({
      property_name: f.property_name,
      formula_expression: f.formula_expression,
      variables: JSON.parse(f.variables || '[]').join(', '),
      description: f.description || '',
      unit: f.unit || '',
    })
    setIsAdding(true)
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Formula Manager</h1>
          <p className="text-gray-400">Edit prediction formulas and mathematical models</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true)
            setEditingId(null)
            setFormula({ property_name: '', formula_expression: '', variables: '', description: '', unit: '' })
          }}
          className="bg-dark-accent text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors"
        >
          <Plus size={20} />
          Add Formula
        </button>
      </div>

      {/* Formulas List */}
      <div className="bg-dark-panel rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-dark-text">Formulas</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Property</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Formula</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Variables</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Unit</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {formulas?.map((f: any) => {
                const vars = JSON.parse(f.variables || '[]')
                return (
                  <tr key={f.id} className="hover:bg-gray-900">
                    <td className="px-6 py-4 text-dark-text font-semibold">{f.property_name}</td>
                    <td className="px-6 py-4 text-gray-400 font-mono text-sm">{f.formula_expression}</td>
                    <td className="px-6 py-4 text-gray-400">{vars.join(', ')}</td>
                    <td className="px-6 py-4 text-gray-400">{f.unit || '-'}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(f)}
                          className="text-dark-accent hover:text-purple-400"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this formula?')) {
                              deleteMutation.mutate(f.id)
                            }
                          }}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-panel rounded-lg border border-gray-800 p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-dark-text mb-4">
              {editingId ? 'Edit Formula' : 'Add Formula'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Property Name</label>
                <input
                  type="text"
                  value={formula.property_name}
                  onChange={(e) => setFormula({ ...formula, property_name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                  placeholder="e.g. Tensile Strength"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Formula Expression</label>
                <input
                  type="text"
                  value={formula.formula_expression}
                  onChange={(e) => setFormula({ ...formula, formula_expression: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text font-mono"
                  placeholder="e.g. E_m * V_m + E_g * V_g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Variables (comma-separated)</label>
                <input
                  type="text"
                  value={formula.variables}
                  onChange={(e) => setFormula({ ...formula, variables: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                  placeholder="e.g. E_m, V_m, E_g, V_g"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Unit</label>
                <input
                  type="text"
                  value={formula.unit}
                  onChange={(e) => setFormula({ ...formula, unit: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                  placeholder="e.g. MPa, GPa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                <textarea
                  value={formula.description}
                  onChange={(e) => setFormula({ ...formula, description: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                  rows={3}
                  placeholder="Optional description"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAdding(false)
                  setEditingId(null)
                }}
                className="px-6 py-2 text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-dark-accent text-white rounded-lg hover:bg-purple-600 flex items-center gap-2"
              >
                <Save size={18} />
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FormulaManager












