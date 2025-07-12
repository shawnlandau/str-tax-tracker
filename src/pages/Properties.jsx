import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { 
  PlusIcon, 
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  CurrencyDollarIcon,
  CalendarIcon,
  WrenchScrewdriverIcon,
  ArrowDownTrayIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [showAddBooking, setShowAddBooking] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)
  const [newBooking, setNewBooking] = useState({
    check_in: '',
    check_out: '',
    amount: '',
    guest_name: '',
    notes: ''
  })
  const [newProperty, setNewProperty] = useState({
    address: '',
    property_type: 'Single Family',
    purchase_price: '',
    current_value: '',
    mortgage: '',
    property_tax: '',
    insurance: '',
    hoa: '',
    utilities: '',
    other_fixed_costs: '',
    status: 'Active',
    bookings: [],
    expenses: []
  })

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
    const bookings = property.bookings || []
    const expenses = property.expenses || []
    
    const totalIncome = bookings.reduce((sum, booking) => sum + booking.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const netIncome = totalIncome - totalExpenses
    
    return { totalIncome, totalExpenses, netIncome }
  }

  const handleAddBooking = (e) => {
    e.preventDefault()
    
    try {
      const bookingToAdd = {
        ...newBooking,
        id: Date.now().toString(),
        amount: parseFloat(newBooking.amount) || 0,
        date: new Date().toISOString()
      }
      
      // Add booking to the selected property
      setProperties(properties.map(property => {
        if (property.id === selectedPropertyId) {
          return {
            ...property,
            bookings: [...(property.bookings || []), bookingToAdd]
          }
        }
        return property
      }))
      
      // Reset form
      setNewBooking({
        check_in: '',
        check_out: '',
        amount: '',
        guest_name: '',
        notes: ''
      })
      
      setShowAddBooking(false)
      setSelectedPropertyId(null)
    } catch (err) {
      console.error('Failed to add booking:', err)
    }
  }

  const handleAddProperty = async (e) => {
    e.preventDefault()
    
    try {
      const propertyToAdd = {
        ...newProperty,
        id: Date.now().toString(),
        purchase_price: parseFloat(newProperty.purchase_price) || 0,
        current_value: parseFloat(newProperty.current_value) || 0,
        mortgage: parseFloat(newProperty.mortgage) || 0,
        property_tax: parseFloat(newProperty.property_tax) || 0,
        insurance: parseFloat(newProperty.insurance) || 0,
        hoa: parseFloat(newProperty.hoa) || 0,
        utilities: parseFloat(newProperty.utilities) || 0,
        other_fixed_costs: parseFloat(newProperty.other_fixed_costs) || 0
      }
      
      // Add to local state
      setProperties([...properties, propertyToAdd])
      
      // Reset form
      setNewProperty({
        address: '',
        property_type: 'Single Family',
        purchase_price: '',
        current_value: '',
        mortgage: '',
        property_tax: '',
        insurance: '',
        hoa: '',
        utilities: '',
        other_fixed_costs: '',
        status: 'Active',
        bookings: [],
        expenses: []
      })
      
      setShowAddProperty(false)
    } catch (err) {
      console.error('Failed to add property:', err)
    }
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
        <button 
          onClick={() => setShowAddProperty(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
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
                      Bookings
                    </button>
                    <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                      Expenses
                    </button>
                    <button className="py-4 px-1 border-b-2 border-transparent text-gray-500 hover:text-gray-700 font-medium">
                      Depreciation
                    </button>
                  </nav>
                </div>

                {/* Bookings Section */}
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Bookings</h4>
                    <button 
                      onClick={() => {
                        setSelectedPropertyId(property.id)
                        setShowAddBooking(true)
                      }}
                      className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                    >
                      <PlusIcon className="h-4 w-4 mr-1" />
                      Add Booking
                    </button>
                  </div>
                  
                  {property.bookings && property.bookings.length > 0 ? (
                    <div className="space-y-3">
                      {property.bookings.map((booking, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">{booking.guest_name || 'Guest'}</p>
                              <p className="text-sm text-gray-600">
                                {formatDate(booking.check_in)} - {formatDate(booking.check_out)}
                              </p>
                              {booking.notes && (
                                <p className="text-xs text-gray-500">{booking.notes}</p>
                              )}
                            </div>
                          </div>
                          <span className="font-semibold text-green-600">{formatCurrency(booking.amount)}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No bookings recorded yet</p>
                      <button 
                        onClick={() => {
                          setSelectedPropertyId(property.id)
                          setShowAddBooking(true)
                        }}
                        className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Add your first booking
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
          <button 
            onClick={() => setShowAddProperty(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Your First Property
          </button>
        </div>
      )}

      {/* Add Property Modal */}
      {showAddProperty && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add New Property</h3>
              <button 
                onClick={() => setShowAddProperty(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddProperty} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                <input 
                  type="text" 
                  required
                  value={newProperty.address}
                  onChange={(e) => setNewProperty({...newProperty, address: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="123 Main St, City, State"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
                <select 
                  value={newProperty.property_type}
                  onChange={(e) => setNewProperty({...newProperty, property_type: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option>Single Family</option>
                  <option>Multi-Family</option>
                  <option>Condo</option>
                  <option>Townhouse</option>
                  <option>Commercial</option>
                  <option>Land</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price</label>
                <input 
                  type="number" 
                  value={newProperty.purchase_price}
                  onChange={(e) => setNewProperty({...newProperty, purchase_price: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Value</label>
                <input 
                  type="number" 
                  value={newProperty.current_value}
                  onChange={(e) => setNewProperty({...newProperty, current_value: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mortgage (monthly)</label>
                <input 
                  type="number" 
                  value={newProperty.mortgage}
                  onChange={(e) => setNewProperty({...newProperty, mortgage: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Tax (monthly)</label>
                <input 
                  type="number" 
                  value={newProperty.property_tax}
                  onChange={(e) => setNewProperty({...newProperty, property_tax: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Insurance (monthly)</label>
                <input 
                  type="number" 
                  value={newProperty.insurance}
                  onChange={(e) => setNewProperty({...newProperty, insurance: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">HOA Fees (monthly)</label>
                <input 
                  type="number" 
                  value={newProperty.hoa}
                  onChange={(e) => setNewProperty({...newProperty, hoa: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Utilities (monthly)</label>
                <input 
                  type="number" 
                  value={newProperty.utilities}
                  onChange={(e) => setNewProperty({...newProperty, utilities: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Other Fixed Costs (monthly)</label>
                <input 
                  type="number" 
                  value={newProperty.other_fixed_costs}
                  onChange={(e) => setNewProperty({...newProperty, other_fixed_costs: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddProperty(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Property
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Booking Modal */}
      {showAddBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Booking</h3>
              <button 
                onClick={() => {
                  setShowAddBooking(false)
                  setSelectedPropertyId(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Guest Name</label>
                <input 
                  type="text" 
                  value={newBooking.guest_name}
                  onChange={(e) => setNewBooking({...newBooking, guest_name: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Guest name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-in Date</label>
                <input 
                  type="date" 
                  required
                  value={newBooking.check_in}
                  onChange={(e) => setNewBooking({...newBooking, check_in: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Check-out Date</label>
                <input 
                  type="date" 
                  required
                  value={newBooking.check_out}
                  onChange={(e) => setNewBooking({...newBooking, check_out: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  required
                  value={newBooking.amount}
                  onChange={(e) => setNewBooking({...newBooking, amount: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  value={newBooking.notes}
                  onChange={(e) => setNewBooking({...newBooking, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Optional notes about the booking"
                  rows="3"
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowAddBooking(false)
                    setSelectedPropertyId(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Add Booking
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