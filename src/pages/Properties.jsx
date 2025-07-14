import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import {
  Plus,
  Building2,
  DollarSign,
  Calendar,
  FileText,
  Download,
  Edit,
  Trash2,
  Clock,
  Calculator,
  Wrench,
  Shield,
  Phone,
  MapPin,
  Star,
  AlertTriangle
} from 'lucide-react'

const Properties = () => {
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showAddIncome, setShowAddIncome] = useState(false)
  const [showAddExpense, setShowAddExpense] = useState(false)
  const [showAddProperty, setShowAddProperty] = useState(false)
  const [showAddBooking, setShowAddBooking] = useState(false)
  const [showPropertyDetails, setShowPropertyDetails] = useState(false)
  const [selectedPropertyId, setSelectedPropertyId] = useState(null)
  const [activeTab, setActiveTab] = useState('bookings') // Add tab state
  const [newBooking, setNewBooking] = useState({
    check_in: '',
    check_out: '',
    amount: '',
    guest_name: '',
    notes: ''
  })
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Maintenance',
    date: new Date().toISOString().split('T')[0]
  })
  const [propertyDetails, setPropertyDetails] = useState({
    warranties: [],
    maintenance_schedule: [],
    filters: [],
    appliances: [],
    utilities_info: [],
    emergency_contacts: [],
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

  const handleAddBooking = async (e) => {
    e.preventDefault()
    
    try {
      const bookingToAdd = {
        ...newBooking,
        property_id: selectedPropertyId,
        amount: parseFloat(newBooking.amount) || 0,
        date: new Date().toISOString()
      }
      
      // Save booking via API
      const savedBooking = await apiService.createBooking(bookingToAdd)
      
      // Add booking to the selected property
      setProperties(properties.map(property => {
        if (property.id === selectedPropertyId) {
          return {
            ...property,
            bookings: [...(property.bookings || []), savedBooking]
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
      setError('Failed to save booking. Please try again.')
    }
  }

  const handleAddProperty = async (e) => {
    e.preventDefault()
    
    try {
      const propertyToAdd = {
        ...newProperty,
        purchase_price: parseFloat(newProperty.purchase_price) || 0,
        current_value: parseFloat(newProperty.current_value) || 0,
        mortgage: parseFloat(newProperty.mortgage) || 0,
        property_tax: parseFloat(newProperty.property_tax) || 0,
        insurance: parseFloat(newProperty.insurance) || 0,
        hoa: parseFloat(newProperty.hoa) || 0,
        utilities: parseFloat(newProperty.utilities) || 0,
        other_fixed_costs: parseFloat(newProperty.other_fixed_costs) || 0
      }
      
      // Save property via API
      const savedProperty = await apiService.createProperty(propertyToAdd)
      
      // Add to local state
      setProperties([...properties, savedProperty])
      
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
      setError('Failed to save property. Please try again.')
    }
  }

  const handleAddIncome = (propertyId, incomeData) => {
    // In a real app, this would call the API
    console.log('Adding income to property:', propertyId, incomeData)
    setShowAddIncome(false)
  }

  const handleAddExpense = async (e) => {
    e.preventDefault()
    
    try {
      const expenseToAdd = {
        ...newExpense,
        property_id: selectedPropertyId,
        amount: parseFloat(newExpense.amount) || 0,
        date: new Date(newExpense.date).toISOString()
      }
      
      // Save expense via API
      const savedExpense = await apiService.createTransaction(expenseToAdd)
      
      // Add expense to the selected property
      setProperties(properties.map(property => {
        if (property.id === selectedPropertyId) {
          return {
            ...property,
            expenses: [...(property.expenses || []), savedExpense]
          }
        }
        return property
      }))
      
      // Reset form
      setNewExpense({
        description: '',
        amount: '',
        category: 'Maintenance',
        date: new Date().toISOString().split('T')[0]
      })
      
      setShowAddExpense(false)
      setSelectedPropertyId(null)
    } catch (err) {
      console.error('Failed to add expense:', err)
      setError('Failed to save expense. Please try again.')
    }
  }

  const handleAddPropertyDetails = (e) => {
    e.preventDefault()
    
    try {
      // Update the selected property with details
      setProperties(properties.map(property => {
        if (property.id === selectedPropertyId) {
          return {
            ...property,
            details: propertyDetails
          }
        }
        return property
      }))
      
      setShowPropertyDetails(false)
      setSelectedPropertyId(null)
    } catch (err) {
      console.error('Failed to update property details:', err)
    }
  }

  const addWarranty = () => {
    setPropertyDetails({
      ...propertyDetails,
      warranties: [...propertyDetails.warranties, {
        id: Date.now().toString(),
        item: '',
        company: '',
        start_date: '',
        end_date: '',
        contact: '',
        notes: ''
      }]
    })
  }

  const addMaintenanceItem = () => {
    setPropertyDetails({
      ...propertyDetails,
      maintenance_schedule: [...propertyDetails.maintenance_schedule, {
        id: Date.now().toString(),
        task: '',
        frequency: 'Monthly',
        last_done: '',
        next_due: '',
        notes: ''
      }]
    })
  }

  const addFilter = () => {
    setPropertyDetails({
      ...propertyDetails,
      filters: [...propertyDetails.filters, {
        id: Date.now().toString(),
        type: '',
        location: '',
        last_changed: '',
        next_change: '',
        notes: ''
      }]
    })
  }

  const addAppliance = () => {
    setPropertyDetails({
      ...propertyDetails,
      appliances: [...propertyDetails.appliances, {
        id: Date.now().toString(),
        name: '',
        model: '',
        serial_number: '',
        purchase_date: '',
        warranty_info: '',
        notes: ''
      }]
    })
  }

  const addUtility = () => {
    setPropertyDetails({
      ...propertyDetails,
      utilities_info: [...propertyDetails.utilities_info, {
        id: Date.now().toString(),
        utility: '',
        account_number: '',
        provider: '',
        contact: '',
        notes: ''
      }]
    })
  }

  const addEmergencyContact = () => {
    setPropertyDetails({
      ...propertyDetails,
      emergency_contacts: [...propertyDetails.emergency_contacts, {
        id: Date.now().toString(),
        name: '',
        type: 'Plumber',
        phone: '',
        email: '',
        notes: ''
      }]
    })
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
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
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
        <div className="flex space-x-3">
          <a 
            href="/material-participation"
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
          >
            <Wrench className="h-5 w-5 mr-2" />
            Track Work Hours
          </a>
          <button 
            onClick={() => setShowAddProperty(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="h-5 w-5 mr-2" />
            Add Property
          </button>
        </div>
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
                    <button 
                      onClick={() => setActiveTab('bookings')}
                      className={`py-4 px-1 border-b-2 ${activeTab === 'bookings' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 font-medium'}`}
                    >
                      Bookings
                    </button>
                    <button 
                      onClick={() => setActiveTab('expenses')}
                      className={`py-4 px-1 border-b-2 ${activeTab === 'expenses' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 font-medium'}`}
                    >
                      Expenses
                    </button>
                    <button 
                      onClick={() => setActiveTab('property_details')}
                      className={`py-4 px-1 border-b-2 ${activeTab === 'property_details' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 font-medium'}`}
                    >
                      Property Details
                    </button>
                    <button 
                      onClick={() => setActiveTab('depreciation')}
                      className={`py-4 px-1 border-b-2 ${activeTab === 'depreciation' ? 'border-blue-500 text-blue-600 font-medium' : 'border-transparent text-gray-500 hover:text-gray-700 font-medium'}`}
                    >
                      Depreciation
                    </button>
                  </nav>
                </div>

                {/* Bookings Section */}
                {activeTab === 'bookings' && (
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
                        <Plus className="h-4 w-4 mr-1" />
                        Add Booking
                      </button>
                    </div>
                    
                    {property.bookings && property.bookings.length > 0 ? (
                      <div className="space-y-3">
                        {property.bookings.map((booking, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <Calendar className="h-5 w-5 text-green-600 mr-3" />
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
                        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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
                )}

                {/* Expenses Section */}
                {activeTab === 'expenses' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Expenses</h4>
                      <button 
                        onClick={() => {
                          setSelectedPropertyId(property.id)
                          setShowAddExpense(true)
                        }}
                        className="bg-orange-600 text-white px-3 py-1 rounded-lg hover:bg-orange-700 transition-colors flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add Expense
                      </button>
                    </div>
                    
                    {property.expenses && property.expenses.length > 0 ? (
                      <div className="space-y-3">
                        {property.expenses.map((expense, index) => (
                          <div key={index} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                            <div className="flex items-center">
                              <Wrench className="h-5 w-5 text-red-600 mr-3" />
                              <div>
                                <p className="font-medium">{expense.description}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(expense.date)}
                                </p>
                                <p className="text-sm text-gray-600">Category: {expense.category}</p>
                                <p className="text-sm text-gray-600">Amount: {formatCurrency(expense.amount)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <DollarSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No expenses recorded yet</p>
                        <button 
                          onClick={() => {
                            setSelectedPropertyId(property.id)
                            setShowAddExpense(true)
                          }}
                          className="mt-2 text-orange-600 hover:text-orange-700 font-medium"
                        >
                          Add your first expense
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Property Details Section */}
                {activeTab === 'property_details' && (
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold text-gray-900">Property Details</h4>
                      <button 
                        onClick={() => {
                          setSelectedPropertyId(property.id)
                          setPropertyDetails(property.details || {
                            warranties: [],
                            maintenance_schedule: [],
                            filters: [],
                            appliances: [],
                            utilities_info: [],
                            emergency_contacts: [],
                            notes: ''
                          })
                          setShowPropertyDetails(true)
                        }}
                        className="bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition-colors flex items-center text-sm"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Manage Details
                      </button>
                    </div>
                    
                    {property.details ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Warranties</h5>
                          <p className="text-sm text-gray-600">{property.details.warranties?.length || 0} items</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Maintenance Schedule</h5>
                          <p className="text-sm text-gray-600">{property.details.maintenance_schedule?.length || 0} tasks</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Filters</h5>
                          <p className="text-sm text-gray-600">{property.details.filters?.length || 0} filters</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                          <h5 className="font-medium text-gray-900 mb-2">Appliances</h5>
                          <p className="text-sm text-gray-600">{property.details.appliances?.length || 0} appliances</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-500">No property details added yet</p>
                        <button 
                          onClick={() => {
                            setSelectedPropertyId(property.id)
                            setPropertyDetails({
                              warranties: [],
                              maintenance_schedule: [],
                              filters: [],
                              appliances: [],
                              utilities_info: [],
                              emergency_contacts: [],
                              notes: ''
                            })
                            setShowPropertyDetails(true)
                          }}
                          className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
                        >
                          Add property details
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Depreciation Section */}
                {activeTab === 'depreciation' && (
                  <div className="p-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Depreciation</h4>
                    <p className="text-gray-600">Depreciation tracking for tax purposes is not yet implemented in this version.</p>
                    <p className="text-gray-600">Please add property details to enable depreciation calculations.</p>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex space-x-3">
                    <button 
                      onClick={() => {
                        setSelectedPropertyId(property.id)
                        setShowAddBooking(true)
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Add Booking
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedPropertyId(property.id)
                        setShowAddExpense(true)
                      }}
                      className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center"
                    >
                      <Wrench className="h-5 w-5 mr-2" />
                      Add Expense
                    </button>
                    <button className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center">
                      <Download className="h-5 w-5 mr-2" />
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
          <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Properties Added</h3>
          <p className="text-gray-600 mb-6">
            Add your first property to start tracking income, expenses, and depreciation for tax purposes.
          </p>
          <button 
            onClick={() => setShowAddProperty(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
          >
            <Plus className="h-5 w-5 mr-2" />
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
                <Edit className="h-6 w-6" />
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
                <Edit className="h-6 w-6" />
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
            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Plumbing repair"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input 
                  type="number" 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                >
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
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
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

      {/* Property Details Modal */}
      {showPropertyDetails && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Property Details</h3>
              <button 
                onClick={() => {
                  setShowPropertyDetails(false)
                  setSelectedPropertyId(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleAddPropertyDetails} className="space-y-6">
              {/* Warranties Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold text-gray-900">Warranties</h4>
                  <button 
                    type="button"
                    onClick={addWarranty}
                    className="bg-green-600 text-white px-2 py-1 rounded text-sm hover:bg-green-700"
                  >
                    Add Warranty
                  </button>
                </div>
                <div className="space-y-3">
                  {propertyDetails.warranties.map((warranty, index) => (
                    <div key={warranty.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text"
                          placeholder="Item (e.g., HVAC, Water Heater)"
                          value={warranty.item}
                          onChange={(e) => {
                            const updated = [...propertyDetails.warranties]
                            updated[index].item = e.target.value
                            setPropertyDetails({...propertyDetails, warranties: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Company"
                          value={warranty.company}
                          onChange={(e) => {
                            const updated = [...propertyDetails.warranties]
                            updated[index].company = e.target.value
                            setPropertyDetails({...propertyDetails, warranties: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="date"
                          placeholder="Start Date"
                          value={warranty.start_date}
                          onChange={(e) => {
                            const updated = [...propertyDetails.warranties]
                            updated[index].start_date = e.target.value
                            setPropertyDetails({...propertyDetails, warranties: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="date"
                          placeholder="End Date"
                          value={warranty.end_date}
                          onChange={(e) => {
                            const updated = [...propertyDetails.warranties]
                            updated[index].end_date = e.target.value
                            setPropertyDetails({...propertyDetails, warranties: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Contact Info"
                          value={warranty.contact}
                          onChange={(e) => {
                            const updated = [...propertyDetails.warranties]
                            updated[index].contact = e.target.value
                            setPropertyDetails({...propertyDetails, warranties: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Notes"
                          value={warranty.notes}
                          onChange={(e) => {
                            const updated = [...propertyDetails.warranties]
                            updated[index].notes = e.target.value
                            setPropertyDetails({...propertyDetails, warranties: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Maintenance Schedule Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold text-gray-900">Maintenance Schedule</h4>
                  <button 
                    type="button"
                    onClick={addMaintenanceItem}
                    className="bg-blue-600 text-white px-2 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {propertyDetails.maintenance_schedule.map((task, index) => (
                    <div key={task.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text"
                          placeholder="Task (e.g., HVAC Service, Gutter Cleaning)"
                          value={task.task}
                          onChange={(e) => {
                            const updated = [...propertyDetails.maintenance_schedule]
                            updated[index].task = e.target.value
                            setPropertyDetails({...propertyDetails, maintenance_schedule: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <select 
                          value={task.frequency}
                          onChange={(e) => {
                            const updated = [...propertyDetails.maintenance_schedule]
                            updated[index].frequency = e.target.value
                            setPropertyDetails({...propertyDetails, maintenance_schedule: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option>Monthly</option>
                          <option>Quarterly</option>
                          <option>Semi-annually</option>
                          <option>Annually</option>
                          <option>As needed</option>
                        </select>
                        <input 
                          type="date"
                          placeholder="Last Done"
                          value={task.last_done}
                          onChange={(e) => {
                            const updated = [...propertyDetails.maintenance_schedule]
                            updated[index].last_done = e.target.value
                            setPropertyDetails({...propertyDetails, maintenance_schedule: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="date"
                          placeholder="Next Due"
                          value={task.next_due}
                          onChange={(e) => {
                            const updated = [...propertyDetails.maintenance_schedule]
                            updated[index].next_due = e.target.value
                            setPropertyDetails({...propertyDetails, maintenance_schedule: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Notes"
                          value={task.notes}
                          onChange={(e) => {
                            const updated = [...propertyDetails.maintenance_schedule]
                            updated[index].notes = e.target.value
                            setPropertyDetails({...propertyDetails, maintenance_schedule: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filters Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold text-gray-900">Filters</h4>
                  <button 
                    type="button"
                    onClick={addFilter}
                    className="bg-purple-600 text-white px-2 py-1 rounded text-sm hover:bg-purple-700"
                  >
                    Add Filter
                  </button>
                </div>
                <div className="space-y-3">
                  {propertyDetails.filters.map((filter, index) => (
                    <div key={filter.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text"
                          placeholder="Filter Type (e.g., HVAC, Water)"
                          value={filter.type}
                          onChange={(e) => {
                            const updated = [...propertyDetails.filters]
                            updated[index].type = e.target.value
                            setPropertyDetails({...propertyDetails, filters: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Location"
                          value={filter.location}
                          onChange={(e) => {
                            const updated = [...propertyDetails.filters]
                            updated[index].location = e.target.value
                            setPropertyDetails({...propertyDetails, filters: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="date"
                          placeholder="Last Changed"
                          value={filter.last_changed}
                          onChange={(e) => {
                            const updated = [...propertyDetails.filters]
                            updated[index].last_changed = e.target.value
                            setPropertyDetails({...propertyDetails, filters: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="date"
                          placeholder="Next Change"
                          value={filter.next_change}
                          onChange={(e) => {
                            const updated = [...propertyDetails.filters]
                            updated[index].next_change = e.target.value
                            setPropertyDetails({...propertyDetails, filters: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Notes"
                          value={filter.notes}
                          onChange={(e) => {
                            const updated = [...propertyDetails.filters]
                            updated[index].notes = e.target.value
                            setPropertyDetails({...propertyDetails, filters: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appliances Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold text-gray-900">Appliances</h4>
                  <button 
                    type="button"
                    onClick={addAppliance}
                    className="bg-orange-600 text-white px-2 py-1 rounded text-sm hover:bg-orange-700"
                  >
                    Add Appliance
                  </button>
                </div>
                <div className="space-y-3">
                  {propertyDetails.appliances.map((appliance, index) => (
                    <div key={appliance.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text"
                          placeholder="Appliance Name"
                          value={appliance.name}
                          onChange={(e) => {
                            const updated = [...propertyDetails.appliances]
                            updated[index].name = e.target.value
                            setPropertyDetails({...propertyDetails, appliances: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Model"
                          value={appliance.model}
                          onChange={(e) => {
                            const updated = [...propertyDetails.appliances]
                            updated[index].model = e.target.value
                            setPropertyDetails({...propertyDetails, appliances: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Serial Number"
                          value={appliance.serial_number}
                          onChange={(e) => {
                            const updated = [...propertyDetails.appliances]
                            updated[index].serial_number = e.target.value
                            setPropertyDetails({...propertyDetails, appliances: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="date"
                          placeholder="Purchase Date"
                          value={appliance.purchase_date}
                          onChange={(e) => {
                            const updated = [...propertyDetails.appliances]
                            updated[index].purchase_date = e.target.value
                            setPropertyDetails({...propertyDetails, appliances: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Warranty Info"
                          value={appliance.warranty_info}
                          onChange={(e) => {
                            const updated = [...propertyDetails.appliances]
                            updated[index].warranty_info = e.target.value
                            setPropertyDetails({...propertyDetails, appliances: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Notes"
                          value={appliance.notes}
                          onChange={(e) => {
                            const updated = [...propertyDetails.appliances]
                            updated[index].notes = e.target.value
                            setPropertyDetails({...propertyDetails, appliances: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contacts Section */}
              <div>
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-md font-semibold text-gray-900">Emergency Contacts</h4>
                  <button 
                    type="button"
                    onClick={addEmergencyContact}
                    className="bg-red-600 text-white px-2 py-1 rounded text-sm hover:bg-red-700"
                  >
                    Add Contact
                  </button>
                </div>
                <div className="space-y-3">
                  {propertyDetails.emergency_contacts.map((contact, index) => (
                    <div key={contact.id} className="border border-gray-200 rounded-lg p-3">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <input 
                          type="text"
                          placeholder="Name"
                          value={contact.name}
                          onChange={(e) => {
                            const updated = [...propertyDetails.emergency_contacts]
                            updated[index].name = e.target.value
                            setPropertyDetails({...propertyDetails, emergency_contacts: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <select 
                          value={contact.type}
                          onChange={(e) => {
                            const updated = [...propertyDetails.emergency_contacts]
                            updated[index].type = e.target.value
                            setPropertyDetails({...propertyDetails, emergency_contacts: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option>Plumber</option>
                          <option>Electrician</option>
                          <option>HVAC</option>
                          <option>General Contractor</option>
                          <option>Property Manager</option>
                          <option>Other</option>
                        </select>
                        <input 
                          type="tel"
                          placeholder="Phone"
                          value={contact.phone}
                          onChange={(e) => {
                            const updated = [...propertyDetails.emergency_contacts]
                            updated[index].phone = e.target.value
                            setPropertyDetails({...propertyDetails, emergency_contacts: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="email"
                          placeholder="Email"
                          value={contact.email}
                          onChange={(e) => {
                            const updated = [...propertyDetails.emergency_contacts]
                            updated[index].email = e.target.value
                            setPropertyDetails({...propertyDetails, emergency_contacts: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        />
                        <input 
                          type="text"
                          placeholder="Notes"
                          value={contact.notes}
                          onChange={(e) => {
                            const updated = [...propertyDetails.emergency_contacts]
                            updated[index].notes = e.target.value
                            setPropertyDetails({...propertyDetails, emergency_contacts: updated})
                          }}
                          className="border border-gray-300 rounded px-2 py-1 text-sm col-span-2"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Notes */}
              <div>
                <h4 className="text-md font-semibold text-gray-900 mb-3">General Notes</h4>
                <textarea 
                  value={propertyDetails.notes}
                  onChange={(e) => setPropertyDetails({...propertyDetails, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="Any additional notes about the property..."
                  rows="4"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => {
                    setShowPropertyDetails(false)
                    setSelectedPropertyId(null)
                  }}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Save Details
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