import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { 
  PlusIcon, 
  CalculatorIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

const Depreciation = () => {
  const [depreciation, setDepreciation] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDepreciation = async () => {
      try {
        setLoading(true)
        const data = await apiService.getDepreciation()
        setDepreciation(data)
      } catch (err) {
        setError('Failed to load depreciation data')
        console.error('Depreciation error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDepreciation()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Depreciation Data</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Depreciation Calculator</h1>
          <p className="text-gray-600">Track depreciation for tax purposes</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {depreciation.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Depreciation Summary</h2>
            <div className="space-y-4">
              {depreciation.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Property {item.property_id}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Building Value:</span>
                      <span className="font-medium">{formatCurrency(item.building_value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Land Value:</span>
                      <span className="font-medium">{formatCurrency(item.land_value)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Annual Depreciation:</span>
                      <span className="font-medium">{formatCurrency(item.annual_depreciation)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Accumulated:</span>
                      <span className="font-medium">{formatCurrency(item.accumulated_depreciation)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tax Benefits</h2>
            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 mb-2">Section 179 Deduction</h3>
                <p className="text-sm text-blue-700">
                  Qualifying properties may be eligible for immediate expensing under Section 179.
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-medium text-green-900 mb-2">Bonus Depreciation</h3>
                <p className="text-sm text-green-700">
                  Additional first-year depreciation may be available for qualifying property.
                </p>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h3 className="font-medium text-purple-900 mb-2">Regular Depreciation</h3>
                <p className="text-sm text-purple-700">
                  Standard depreciation over 27.5 years for residential rental property.
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <CalculatorIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Depreciation Data</h3>
          <p className="text-gray-600 mb-6">Add properties to your portfolio to start tracking depreciation for tax purposes.</p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Property
          </button>
        </div>
      )}
    </div>
  )
}

export default Depreciation 