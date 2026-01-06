import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus, Edit2, Trash } from 'lucide-react'
import api from '../services/api'

const MaterialsCatalog = () => {
  const queryClient = useQueryClient()
  const [isAdding, setIsAdding] = useState(false)
  const [newMaterial, setNewMaterial] = useState<any>({
    name: '',
    type: 'fiber',
    density_g_cm3: '',
    tensile_MPa: '',
    youngs_GPa: '',
  })

  const { data: materials } = useQuery({
    queryKey: ['materials'],
    queryFn: () => api.get('/api/materials').then(res => res.data)
  })

  const { data: grapheneSpecs } = useQuery({
    queryKey: ['graphene-specs'],
    queryFn: () => api.get('/api/materials/graphene-specs').then(res => res.data)
  })

  const createMutation = useMutation({
    mutationFn: (data: any) => api.post('/api/materials', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['materials'] })
      setIsAdding(false)
      setNewMaterial({ name: '', type: 'fiber' })
    }
  })

  const handleSave = () => {
    const materialData = {
      ...newMaterial,
      density_g_cm3: newMaterial.density_g_cm3 ? parseFloat(newMaterial.density_g_cm3) : null,
      tensile_MPa: newMaterial.tensile_MPa ? parseFloat(newMaterial.tensile_MPa) : null,
      youngs_GPa: newMaterial.youngs_GPa ? parseFloat(newMaterial.youngs_GPa) : null,
    }
    createMutation.mutate(materialData)
  }

  return (
    <div className="max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-dark-text mb-2">Materials Catalog</h1>
          <p className="text-gray-400">Manage base materials and graphene specifications</p>
        </div>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-dark-accent text-white px-6 py-3 rounded-lg flex items-center gap-2 hover:bg-purple-600 transition-colors"
        >
          <Plus size={20} />
          Add Material
        </button>
      </div>

      {/* Materials Table */}
      <div className="bg-dark-panel rounded-lg border border-gray-800 overflow-hidden mb-8">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-dark-text">Base Materials</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Density (g/cm³)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Tensile (MPa)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Modulus (GPa)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {materials?.map((material: any) => (
                <tr key={material.id} className="hover:bg-gray-900">
                  <td className="px-6 py-4 text-dark-text">{material.name}</td>
                  <td className="px-6 py-4 text-gray-400">{material.type}</td>
                  <td className="px-6 py-4 text-gray-400">{material.density_g_cm3 || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{material.tensile_MPa || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{material.youngs_GPa || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-dark-accent hover:text-purple-400">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Graphene Specs */}
      <div className="bg-dark-panel rounded-lg border border-gray-800 overflow-hidden">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-dark-text">Graphene Specifications</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Lateral Size (μm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Thickness (nm)</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {grapheneSpecs?.map((spec: any) => (
                <tr key={spec.id} className="hover:bg-gray-900">
                  <td className="px-6 py-4 text-dark-text">{spec.name}</td>
                  <td className="px-6 py-4 text-gray-400">{spec.graphene_type}</td>
                  <td className="px-6 py-4 text-gray-400">{spec.lateral_size_um || '-'}</td>
                  <td className="px-6 py-4 text-gray-400">{spec.thickness_nm || '-'}</td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="text-dark-accent hover:text-purple-400">
                        <Edit2 size={18} />
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        <Trash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Material Modal */}
      {isAdding && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-dark-panel rounded-lg border border-gray-800 p-6 w-full max-w-2xl">
            <h2 className="text-2xl font-bold text-dark-text mb-4">Add Material</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                <input
                  type="text"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Type</label>
                <select
                  value={newMaterial.type}
                  onChange={(e) => setNewMaterial({ ...newMaterial, type: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                >
                  <option value="fiber">Fiber</option>
                  <option value="resin">Resin</option>
                  <option value="matrix">Matrix</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Density (g/cm³)</label>
                  <input
                    type="number"
                    value={newMaterial.density_g_cm3}
                    onChange={(e) => setNewMaterial({ ...newMaterial, density_g_cm3: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Tensile (MPa)</label>
                  <input
                    type="number"
                    value={newMaterial.tensile_MPa}
                    onChange={(e) => setNewMaterial({ ...newMaterial, tensile_MPa: e.target.value })}
                    className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-dark-text"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 text-gray-400 hover:text-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-dark-accent text-white rounded-lg hover:bg-purple-600"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialsCatalog












