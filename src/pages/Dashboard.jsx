import { useState, useEffect } from 'react'
import { 
  DollarSign, 
  TrendingUp, 
  Building2, 
  Calculator,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Info
} from 'lucide-react'
import api from '../services/api'
import PortfolioOverview from '../components/dashboard/PortfolioOverview'
import CashFlowChart from '../components/dashboard/CashFlowChart'
import PropertyPerformanceChart from '../components/dashboard/PropertyPerformanceChart'
import DepreciationChart from '../components/dashboard/DepreciationChart'

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedModal, setSelectedModal] = useState(null)
  const [modalData, setModalData] = useState(null)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      const data = await api.getDashboardOverview()
      setOverview(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCardClick = (type, data) => {
    setSelectedModal(type)
    setModalData(data)
  }

  const closeModal = () => {
    setSelectedModal(null)
    setModalData(null)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatPercentage = (value) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`
  }

  // Modal Components
  const PortfolioValueModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Portfolio Value Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold text-gray-700">Total Purchase Value</h3>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(data.total_purchase_value)}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-700">Total Current Value</h3>
              <p className="text-2xl font-bold text-success-600">
                {formatCurrency(data.total_portfolio_value)}
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-2">Property Breakdown</h3>
            <div className="space-y-2">
              {data.properties?.map((property, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{property.address}</span>
                  <span className="text-primary-600 font-bold">
                    {formatCurrency(property.current_value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const AppreciationModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Appreciation Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold text-gray-700">Total Appreciation</h3>
              <p className="text-2xl font-bold text-success-600">
                {formatCurrency(data.total_appreciation)}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-700">Appreciation Rate</h3>
              <p className="text-2xl font-bold text-success-600">
                {formatPercentage((data.total_appreciation / data.total_purchase_value) * 100)}
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-2">Property Appreciation</h3>
            <div className="space-y-2">
              {data.properties?.map((property, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{property.address}</span>
                  <div className="text-right">
                    <div className="text-success-600 font-bold">
                      {formatCurrency(property.appreciation)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatPercentage((property.appreciation / property.purchase_price) * 100)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const PropertiesModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Properties Overview</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="card">
              <h3 className="font-semibold text-gray-700">Total Properties</h3>
              <p className="text-2xl font-bold text-warning-600">
                {data.total_properties}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-700">Rental Properties</h3>
              <p className="text-2xl font-bold text-info-600">
                {data.rental_properties || 0}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-700">Vacant Properties</h3>
              <p className="text-2xl font-bold text-danger-600">
                {data.vacant_properties || 0}
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-2">Property Details</h3>
            <div className="space-y-2">
              {data.properties?.map((property, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{property.address}</div>
                    <div className="text-sm text-gray-600">{property.property_type}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-primary-600">
                      {formatCurrency(property.current_value)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.status || 'Active'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const DepreciationModal = ({ data, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Depreciation Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <h3 className="font-semibold text-gray-700">Total Depreciation</h3>
              <p className="text-2xl font-bold text-info-600">
                {formatCurrency(data.total_depreciation)}
              </p>
            </div>
            <div className="card">
              <h3 className="font-semibold text-gray-700">Section 179</h3>
              <p className="text-2xl font-bold text-primary-600">
                {formatCurrency(data.section_179_total)}
              </p>
            </div>
          </div>
          <div className="card">
            <h3 className="font-semibold text-gray-700 mb-2">Property Depreciation</h3>
            <div className="space-y-2">
              {data.properties?.map((property, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="font-medium">{property.address}</span>
                  <div className="text-right">
                    <div className="text-info-600 font-bold">
                      {formatCurrency(property.depreciation)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {property.depreciation_type || 'Straight Line'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-danger-600">Error loading dashboard: {error}</p>
        <button 
          onClick={loadDashboardData}
          className="btn-primary mt-4"
        >
          Retry
        </button>
      </div>
    )
  }

  if (!overview) return null

  const { portfolio, monthlyData, cashFlowByProperty, depreciation, currentYear } = overview

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Portfolio overview and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleCardClick('portfolio', portfolio)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolio.total_portfolio_value)}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Info className="h-4 w-4 mr-1" />
                <span>Click for details</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleCardClick('appreciation', portfolio)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <TrendingUp className="h-8 w-8 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Appreciation</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(portfolio.total_appreciation)}
              </p>
              <div className="flex items-center text-sm">
                <ArrowUpRight className="h-4 w-4 text-success-600" />
                <span className="text-success-600">
                  {formatPercentage((portfolio.total_appreciation / portfolio.total_purchase_value) * 100)}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Info className="h-4 w-4 mr-1" />
                <span>Click for details</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleCardClick('properties', portfolio)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Building2 className="h-8 w-8 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Properties</p>
              <p className="text-2xl font-bold text-gray-900">
                {portfolio.total_properties}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Info className="h-4 w-4 mr-1" />
                <span>Click for details</span>
              </div>
            </div>
          </div>
        </div>

        <div 
          className="card cursor-pointer hover:shadow-lg transition-shadow duration-200"
          onClick={() => handleCardClick('depreciation', depreciation)}
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Calculator className="h-8 w-8 text-info-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Depreciation ({currentYear})</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(depreciation.total_depreciation)}
              </p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Info className="h-4 w-4 mr-1" />
                <span>Click for details</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Cash Flow */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Cash Flow</h3>
          <CashFlowChart data={monthlyData} />
        </div>

        {/* Property Performance */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Property Performance</h3>
          <PropertyPerformanceChart data={cashFlowByProperty} />
        </div>
      </div>

      {/* Depreciation Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Depreciation Over Time</h3>
        <DepreciationChart />
      </div>

      {/* Portfolio Overview Table */}
      <PortfolioOverview data={cashFlowByProperty} />

      {/* Modals */}
      {selectedModal === 'portfolio' && (
        <PortfolioValueModal data={modalData} onClose={closeModal} />
      )}
      {selectedModal === 'appreciation' && (
        <AppreciationModal data={modalData} onClose={closeModal} />
      )}
      {selectedModal === 'properties' && (
        <PropertiesModal data={modalData} onClose={closeModal} />
      )}
      {selectedModal === 'depreciation' && (
        <DepreciationModal data={modalData} onClose={closeModal} />
      )}
    </div>
  )
}

export default Dashboard 