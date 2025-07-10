import { useState, useEffect } from 'react'
import api from '../services/api'

const Dashboard = () => {
  const [overview, setOverview] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Error loading dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">No data available</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Portfolio Value</h3>
          <p className="text-2xl font-bold text-primary-600">
            ${overview.total_portfolio_value?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Total Properties</h3>
          <p className="text-2xl font-bold text-success-600">
            {overview.total_properties || '0'}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Monthly Income</h3>
          <p className="text-2xl font-bold text-warning-600">
            ${overview.monthly_income?.toLocaleString() || '0'}
          </p>
        </div>
        
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Net Cash Flow</h3>
          <p className="text-2xl font-bold text-info-600">
            ${overview.net_monthly_cashflow?.toLocaleString() || '0'}
          </p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Properties</h2>
        <div className="space-y-2">
          {overview.properties?.map((property, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
              <span className="font-medium">{property.address}</span>
              <span className="text-primary-600 font-bold">
                ${property.current_value?.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard 