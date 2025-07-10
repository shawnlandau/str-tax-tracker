import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { 
  PlusIcon, 
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        const data = await apiService.getProperties()
        setProperties(data)
      } catch (err) {
        setError('Failed to load properties')
        console.error('Properties error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const calculatePropertyTotals = (property) => {
    const income = property.income || []
    const expenses = property.expenses || []
    
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0)
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0)
    const netIncome = totalIncome - totalExpenses
    
    return { totalIncome, totalExpenses, netIncome }
  }

  const handleAddIncome = (propertyId, incomeData) => {
    // In a real app, this would call the API
    console.log('Adding income to property:', propertyId, incomeData)
    setShowAddIncome(false)
  }

  const handleAddExpense = (propertyId, expenseData) => {
    // In a real app, this would call the API
    console.log('Adding expense to property:', propertyId, expenseData)
    setShowAddExpense(false)
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Properties</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600">Manage your real estate portfolio with integrated income & expenses</p>
        </div>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Property
        </button>
      </div>

      {properties.length > 0 ? (
        <div className="space-y-6">
          {properties.map((property) => {
            const totals = calculatePropertyTotals(property)
            return (
              <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Property Header */}
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{property.address}</h3>
                      <p className="text-gray-600">{property.property_type}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      property.status === 'Rented' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {property.status}
                    </span>
                  </div>
                  
                  {/* Property Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600">Purchase Price</p>
                      <p className="text-lg font-semibold">{formatCurrency(property.purchase_price)}</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Income</p>
                      <p className="text-lg font-semibold text-green-600">{formatCurrency(totals.totalIncome)}</p>
                    </div>
                    <div className="text-center p-3 bg-red-50 rounded-lg">
                      <p className="text-sm text-gray-600">Total Expenses</p>
                      <p className="text-lg font-semibold text-red-600">{formatCurrency(totals.totalExpenses)}</p>
                    </div>
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-gray-600">Net Income</p>
                      <p className={`text-lg font-semibold ${
                        totals.netIncome >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {formatCurrency(totals.netIncome)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Income & Expenses Tabs */}
                <div className="border-b border-gray-200">
                  <nav className="flex space-x-8 px-6">
                    <button className="py-4 px-1 border-b-2 border-blue-500 text-blue-600 font-medium">
                      Income
                    </button>
                    <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                      Expenses
                    </button>
                    <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                      Depreciation
                    </button>
                  </nav>
                </div>

                {/* Income Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Income</h4>
                    <button 
                      onClick={() => setShowAddIncome(true)}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Income
                    </button>
                  </div>
                  
                  {property.income && property.income.length > 0 ? (
                    <div className="space-y-3">
                      {property.income.map((item, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">{item.description}</p>
                              <p className="text-sm text-gray-600">{formatDate(item.date)}</p>
                            </div>
                          </div>
                          <span className="font-semibold text-green-600">{formatCurrency(item.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No income recorded yet</p>
                      <button 
                        onClick={() => setShowAddIncome(true)}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Add your first income entry
                      </button>
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                      <CalendarIcon className="h-5 w-5 mr-2" />
                      Add Booking
                    </button>
                    <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center">
                      <WrenchScrewdriverIcon className="h-5 w-5 mr-2" />
                      Add Expense
                    </button>
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                      Export Data
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <BuildingOfficeIcon className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Added</h3>
          <p className="text-gray-600 mb-6">
            Add your first property to start tracking income, expenses, and depreciation for tax purposes.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto">
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Property
          </button>
        </div>
      )}

      {/* Add Income Modal */}
      {showAddIncome && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Income</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Monthly rent payment"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddIncome(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Income
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpense && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add Expense</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Plumbing repair"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                  <option>Maintenance</option>
                  <option>Utilities</option>
                  <option>Insurance</option>
                  <option>Property Tax</option>
                  <option>HOA Fees</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddExpense(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Properties 