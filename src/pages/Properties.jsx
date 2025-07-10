import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Eye, Building2 } from 'lucide-react'
import api from '../services/api'
import PropertyModal from '../components/properties/PropertyModal'
import PropertyDetails from '../components/properties/PropertyDetails'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [showDetails, setShowDetails] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [editingProperty, setEditingProperty] = useState(null)

  useEffect(() => {
    loadProperties()
  }, [])

  const loadProperties = async () => {
    try {
      setLoading(true)
      const data = await api.getProperties()
      setProperties(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProperty = async (propertyData) => {
    try {
      await api.createProperty(propertyData)
      setShowModal(false)
      loadProperties()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateProperty = async (id, propertyData) => {
    try {
      await api.updateProperty(id, propertyData)
      setShowModal(false)
      setEditingProperty(null)
      loadProperties()
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteProperty = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await api.deleteProperty(id)
        loadProperties()
      } catch (err) {
        setError(err.message)
      }
    }
  }

  const openEditModal = (property) => {
    setEditingProperty(property)
    setShowModal(true)
  }

  const openDetailsModal = (property) => {
    setSelectedProperty(property)
    setShowDetails(true)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
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
          <h1 className="text-2xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your real estate portfolio</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Property
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-danger-50 border border-danger-200 text-danger-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div key={property.id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {property.address}
                </h3>
                <p className="text-sm text-gray-600 capitalize">
                  {property.property_type}
                </p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => openDetailsModal(property)}
                  className="text-primary-600 hover:text-primary-700"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={() => openEditModal(property)}
                  className="text-warning-600 hover:text-warning-700"
                  title="Edit Property"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="text-danger-600 hover:text-danger-700"
                  title="Delete Property"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Purchase Price:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(property.purchase_price)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Down Payment:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(property.down_payment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Mortgage:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(property.monthly_mortgage)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Taxes:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(property.monthly_taxes)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Monthly Insurance:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(property.monthly_insurance)}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Net Cash Flow:</span>
                <span className={`font-medium ${
                  property.net_cash_flow >= 0 ? 'text-success-600' : 'text-danger-600'
                }`}>
                  {formatCurrency(property.net_cash_flow)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {properties.length === 0 && !loading && (
        <div className="text-center py-12">
          <Building2 className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No properties</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by adding your first property.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowModal(true)}
              className="btn-primary"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </button>
          </div>
        </div>
      )}

      {/* Property Modal */}
      {showModal && (
        <PropertyModal
          property={editingProperty}
          onSave={editingProperty ? handleUpdateProperty : handleCreateProperty}
          onClose={() => {
            setShowModal(false)
            setEditingProperty(null)
          }}
        />
      )}

      {/* Property Details Modal */}
      {showDetails && selectedProperty && (
        <PropertyDetails
          property={selectedProperty}
          onClose={() => {
            setShowDetails(false)
            setSelectedProperty(null)
          }}
        />
      )}
    </div>
  )
}

export default Properties 