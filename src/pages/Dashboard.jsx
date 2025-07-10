import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import { 
  HomeIcon, 
  CurrencyDollarIcon, 
  BuildingOfficeIcon, 
  ChartBarIcon,
  DocumentTextIcon,
  CalculatorIcon,
  ArrowTrendingUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await apiService.getDashboardOverview()
        setDashboardData(data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const handleCardClick = (route) => {
    navigate(route)
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatPercentage = (value, total) => {
    if (total === 0) return '0%'
    return `${((value / total) * 100).toFixed(1)}%`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Overview of your real estate portfolio</p>
      </div>

      {/* Portfolio Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/properties')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Portfolio Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.total_portfolio_value > 0 
                  ? formatCurrency(dashboardData.total_portfolio_value)
                  : 'No data'
                }
              </p>
            </div>
            <BuildingOfficeIcon className="h-8 w-8 text-blue-600" />
          </div>
          {dashboardData.total_portfolio_value > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {dashboardData.total_properties} properties
              </span>
            </div>
          )}
        </div>

        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/transactions')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Monthly Cash Flow</p>
              <p className={`text-2xl font-bold ${
                dashboardData.net_monthly_cashflow > 0 ? 'text-green-600' : 
                dashboardData.net_monthly_cashflow < 0 ? 'text-red-600' : 'text-gray-900'
              }`}>
                {dashboardData.net_monthly_cashflow !== 0 
                  ? formatCurrency(dashboardData.net_monthly_cashflow)
                  : 'No data'
                }
              </p>
            </div>
            <CurrencyDollarIcon className="h-8 w-8 text-green-600" />
          </div>
          {dashboardData.net_monthly_cashflow !== 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                Income: {formatCurrency(dashboardData.monthly_income)} | 
                Expenses: {formatCurrency(dashboardData.monthly_expenses)}
              </span>
            </div>
          )}
        </div>

        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/depreciation')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Appreciation</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.total_appreciation > 0 
                  ? formatCurrency(dashboardData.total_appreciation)
                  : 'No data'
                }
              </p>
            </div>
            <ArrowTrendingUpIcon className="h-8 w-8 text-green-600" />
          </div>
          {dashboardData.total_appreciation > 0 && (
            <div className="mt-2">
              <span className="text-sm text-gray-500">
                {formatPercentage(dashboardData.total_appreciation, dashboardData.total_purchase_value)} gain
              </span>
            </div>
          )}
        </div>

        <div 
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => handleCardClick('/tax-forms')}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Tax Forms</p>
              <p className="text-2xl font-bold text-gray-900">
                {dashboardData.total_properties > 0 ? 'Ready' : 'No data'}
              </p>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-purple-600" />
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              {dashboardData.total_properties > 0 
                ? `${dashboardData.total_properties} properties` 
                : 'Add properties first'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Property Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Property Status</h3>
            <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
          </div>
          {dashboardData.total_properties > 0 ? (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Properties</span>
                <span className="font-semibold">{dashboardData.total_properties}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Rented</span>
                <span className="font-semibold text-green-600">{dashboardData.rental_properties}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Vacant</span>
                <span className="font-semibold text-orange-600">{dashboardData.vacant_properties}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No properties added yet</p>
              <button 
                onClick={() => handleCardClick('/properties')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Add Properties
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
            <ChartBarIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div className="space-y-3">
            <button 
              onClick={() => handleCardClick('/properties')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Manage Properties</span>
                <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
              </div>
            </button>
            <button 
              onClick={() => handleCardClick('/transactions')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">View Transactions</span>
                <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
              </div>
            </button>
            <button 
              onClick={() => handleCardClick('/depreciation')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Depreciation Calculator</span>
                <CalculatorIcon className="h-5 w-5 text-gray-400" />
              </div>
            </button>
            <button 
              onClick={() => handleCardClick('/tax-forms')}
              className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">Tax Forms</span>
                <DocumentTextIcon className="h-5 w-5 text-gray-400" />
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Properties */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Properties</h3>
          <button 
            onClick={() => handleCardClick('/properties')}
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            View All
          </button>
        </div>
        {dashboardData.properties && dashboardData.properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboardData.properties.slice(0, 6).map((property) => (
              <div key={property.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">{property.address}</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Value:</span>
                    <span className="font-medium">{formatCurrency(property.current_value)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-medium ${
                      property.status === 'Rented' ? 'text-green-600' : 'text-orange-600'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  {property.monthly_rent > 0 && (
                    <div className="flex justify-between">
                      <span>Rent:</span>
                      <span className="font-medium">{formatCurrency(property.monthly_rent)}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <BuildingOfficeIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No properties added yet</p>
            <button 
              onClick={() => handleCardClick('/properties')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Your First Property
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 