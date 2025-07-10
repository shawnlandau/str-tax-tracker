import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Calculator } from 'lucide-react'
import api from '../services/api'
import DepreciationModal from '../components/depreciation/DepreciationModal'

const Depreciation = () => {
  const [depreciation, setDepreciation] = useState([])
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [editingDepreciation, setEditingDepreciation] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [depreciationData, propertiesData] = await Promise.all([
        api.getDepreciation(),
        api.getProperties()
      ])
      setDepreciation(depreciationData)
      setProperties(propertiesData)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDepreciation = async (depreciationData) => {
    try {
      await api.createDepreciation(depreciationData)
      setShowModal(false)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateDepreciation = async (id, depreciationData) => {
    try {
      await api.updateDepreciation(id, depreciationData)
      setShowModal(false)
      setEditingDepreciation(null)
      loadData()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteDepreciation = async (id) => {
    if (window.confirm('Are you sure you want to delete this depreciation record? This action cannot be undone.')) {
      try {
        await api.deleteDepreciation(id)
        loadData()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const openEditModal = (depreciationRecord) => {
    setEditingDepreciation(depreciationRecord)
    setShowModal(true)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Depreciation</h1>
          <p className="text-gray-600">Track straight-line and bonus depreciation for tax purposes</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Depreciation
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Depreciation Table */}
      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Year
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Straight Line
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Bonus Depreciation
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {depreciation.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.property_address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.straight_line)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(record.bonus_depreciation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-primary-600">
                    {formatCurrency(record.total_depreciation)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => openEditModal(record)}
                        className="text-warning-600 hover:text-warning-700"
                        title="Edit Depreciation"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteDepreciation(record.id)}
                        className="text-danger-600 hover:text-danger-700"
                        title="Delete Depreciation"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {depreciation.length === 0 && !loading && (
        <div className="text-center py-12">
          <Calculator className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No depreciation records</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first depreciation record.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Depreciation
            </button>
          </div>
        </div>
      )}

      {/* Depreciation Modal */}
      {showModal && (
        <DepreciationModal
          depreciation={editingDepreciation}
          properties={properties}
          onSave={editingDepreciation ? handleUpdateDepreciation : handleCreateDepreciation}
          onClose={() => {
            setShowModal(false)
            setEditingDepreciation(null)
          }}
        />
      )}
    </div>
  )
}

export default Depreciation 