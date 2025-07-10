import { useState, useEffect, useRef } from 'react'
import { X, Search, MapPin } from 'lucide-react'
import propertyLookupService from '../../services/propertyLookup'

const PropertyModal = ({ property, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    address: '',
    property_type: '',
    purchase_price: '',
    down_payment: '',
    monthly_mortgage: '',
    monthly_taxes: '',
    monthly_insurance: '',
    monthly_hoa_fees: ''
  })

  const [addressSuggestions, setAddressSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isLoadingProperty, setIsLoadingProperty] = useState(false)
  const suggestionsRef = useRef(null)

  useEffect(() => {
    if (property) {
      setFormData({
        address: property.address || '',
        property_type: property.property_type || '',
        purchase_price: property.purchase_price || '',
        down_payment: property.down_payment || '',
        monthly_mortgage: property.monthly_mortgage || '',
        monthly_taxes: property.monthly_taxes || '',
        monthly_insurance: property.monthly_insurance || '',
        monthly_hoa_fees: property.monthly_hoa_fees || ''
      })
    }
  }, [property])

  const handleAddressChange = async (e) => {
    const { value } = e.target
    setFormData(prev => ({ ...prev, address: value }))
    
    if (value.length < 3) {
      setAddressSuggestions([])
      setShowSuggestions(false)
      return
    }

    try {
      const suggestions = await propertyLookupService.getAddressSuggestions(value)
      setAddressSuggestions(suggestions)
      setShowSuggestions(suggestions.length > 0)
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
      setAddressSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleAddressSelect = async (suggestion) => {
    setFormData(prev => ({ ...prev, address: suggestion.description }))
    setShowSuggestions(false)
    setAddressSuggestions([])
    
    // Look up property information
    await lookupPropertyInfo(suggestion.description)
  }

  const lookupPropertyInfo = async (address) => {
    setIsLoadingProperty(true)
    try {
      const propertyDetails = await propertyLookupService.getPropertyDetails(address)
      if (propertyDetails) {
        setFormData(prev => ({
          ...prev,
          property_type: propertyDetails.property_type || prev.property_type,
          purchase_price: propertyDetails.estimated_value || prev.purchase_price,
          monthly_mortgage: propertyDetails.estimated_monthly_mortgage || prev.monthly_mortgage,
          monthly_taxes: propertyDetails.monthly_taxes || prev.monthly_taxes,
          monthly_insurance: propertyDetails.monthly_insurance || prev.monthly_insurance
        }))
      }
    } catch (error) {
      console.error('Error looking up property info:', error)
    } finally {
      setIsLoadingProperty(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      purchase_price: parseFloat(formData.purchase_price) || 0,
      down_payment: parseFloat(formData.down_payment) || 0,
      monthly_mortgage: parseFloat(formData.monthly_mortgage) || 0,
      monthly_taxes: parseFloat(formData.monthly_taxes) || 0,
      monthly_insurance: parseFloat(formData.monthly_insurance) || 0,
      monthly_hoa_fees: parseFloat(formData.monthly_hoa_fees) || 0
    }
    
    if (property) {
      onSave(property.id, data)
    } else {
      onSave(data)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {property ? 'Edit Property' : 'Add Property'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <label className="label">Address</label>
            <div className="relative">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleAddressChange}
                className="input pr-10"
                placeholder="Start typing address..."
                required
              />
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            {/* Address Suggestions */}
            {showSuggestions && addressSuggestions.length > 0 && (
              <div 
                ref={suggestionsRef}
                className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
              >
                {addressSuggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                    onClick={() => handleAddressSelect(suggestion)}
                  >
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm">{suggestion.description}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Info Loading Indicator */}
          {isLoadingProperty && (
            <div className="flex items-center justify-center p-3 bg-blue-50 rounded-md">
              <Search className="h-4 w-4 text-blue-500 mr-2 animate-spin" />
              <span className="text-sm text-blue-600">Looking up property information...</span>
            </div>
          )}

          <div>
            <label className="label">Property Type</label>
            <select
              name="property_type"
              value={formData.property_type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Type</option>
              <option value="single_family">Single Family</option>
              <option value="multi_family">Multi Family</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="commercial">Commercial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Purchase Price</label>
              <input
                type="number"
                name="purchase_price"
                value={formData.purchase_price}
                onChange={handleChange}
                className="input"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="label">Down Payment</label>
              <input
                type="number"
                name="down_payment"
                value={formData.down_payment}
                onChange={handleChange}
                className="input"
                step="0.01"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Monthly Mortgage</label>
            <input
              type="number"
              name="monthly_mortgage"
              value={formData.monthly_mortgage}
              onChange={handleChange}
              className="input"
              step="0.01"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Monthly Taxes</label>
              <input
                type="number"
                name="monthly_taxes"
                value={formData.monthly_taxes}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
            <div>
              <label className="label">Monthly Insurance</label>
              <input
                type="number"
                name="monthly_insurance"
                value={formData.monthly_insurance}
                onChange={handleChange}
                className="input"
                step="0.01"
              />
            </div>
          </div>

          <div>
            <label className="label">Monthly HOA Fees</label>
            <input
              type="number"
              name="monthly_hoa_fees"
              value={formData.monthly_hoa_fees}
              onChange={handleChange}
              className="input"
              step="0.01"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {property ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PropertyModal 