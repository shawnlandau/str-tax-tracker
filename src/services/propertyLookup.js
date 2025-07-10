// Property lookup service using free APIs
class PropertyLookupService {
  constructor() {
    this.addressCache = new Map()
  }

  // Get address suggestions using a free geocoding service
  async getAddressSuggestions(query) {
    if (query.length < 3) return []
    
    try {
      // Use OpenStreetMap Nominatim API (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=us&limit=5&addressdetails=1`
      )
      
      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions')
      }
      
      const data = await response.json()
      return data.map(item => ({
        description: item.display_name,
        place_id: item.place_id,
        lat: parseFloat(item.lat),
        lon: parseFloat(item.lon),
        address: {
          house_number: item.address?.house_number,
          road: item.address?.road,
          city: item.address?.city || item.address?.town,
          state: item.address?.state,
          postcode: item.address?.postcode
        }
      }))
    } catch (error) {
      console.error('Error fetching address suggestions:', error)
      return []
    }
  }

  // Get property information using free APIs
  async getPropertyInfo(address) {
    // Check cache first
    if (this.addressCache.has(address)) {
      return this.addressCache.get(address)
    }

    try {
      // Try to get property data from multiple sources
      const propertyInfo = await this.fetchPropertyData(address)
      
      if (propertyInfo) {
        this.addressCache.set(address, propertyInfo)
      }
      
      return propertyInfo
    } catch (error) {
      console.error('Error looking up property info:', error)
      return null
    }
  }

  async fetchPropertyData(address) {
    // Simulate API call with realistic delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // Mock property data based on address patterns
    // In a real implementation, you would use APIs like:
    // - Zillow API (requires API key)
    // - Realtor.com API (requires API key)
    // - County assessor APIs (free but limited)
    // - Property data services like Attom Data, CoreLogic, etc.
    
    const mockData = {
      '123 Main St, New York, NY': {
        property_type: 'single_family',
        estimated_value: '750000',
        annual_taxes: '12000',
        annual_insurance: '2400',
        square_feet: '2200',
        bedrooms: '3',
        bathrooms: '2',
        year_built: '1985'
      },
      '456 Oak Ave, Los Angeles, CA': {
        property_type: 'condo',
        estimated_value: '550000',
        annual_taxes: '8800',
        annual_insurance: '1800',
        square_feet: '1500',
        bedrooms: '2',
        bathrooms: '2',
        year_built: '1995'
      },
      '789 Pine St, Chicago, IL': {
        property_type: 'townhouse',
        estimated_value: '420000',
        annual_taxes: '6800',
        annual_insurance: '1600',
        square_feet: '1800',
        bedrooms: '3',
        bathrooms: '2.5',
        year_built: '2000'
      },
      '321 Elm Dr, Miami, FL': {
        property_type: 'single_family',
        estimated_value: '680000',
        annual_taxes: '10200',
        annual_insurance: '3200',
        square_feet: '2400',
        bedrooms: '4',
        bathrooms: '3',
        year_built: '1990'
      }
    }
    
    // Try to find a match based on address similarity
    const normalizedAddress = address.toLowerCase().replace(/[^a-z0-9\s]/g, '')
    
    for (const [mockAddress, data] of Object.entries(mockData)) {
      const normalizedMockAddress = mockAddress.toLowerCase().replace(/[^a-z0-9\s]/g, '')
      if (normalizedAddress.includes(normalizedMockAddress.split(',')[0]) ||
          normalizedMockAddress.includes(normalizedAddress.split(',')[0])) {
        return data
      }
    }
    
    // Generate realistic mock data for unknown addresses
    return this.generateMockPropertyData(address)
  }

  generateMockPropertyData(address) {
    // Extract city/state from address
    const parts = address.split(',').map(part => part.trim())
    const city = parts[1] || 'Unknown City'
    const state = parts[2] || 'Unknown State'
    
    // Generate realistic data based on location
    const cityFactors = {
      'New York': { value: 750000, taxes: 12000, insurance: 2400 },
      'Los Angeles': { value: 550000, taxes: 8800, insurance: 1800 },
      'Chicago': { value: 420000, taxes: 6800, insurance: 1600 },
      'Miami': { value: 680000, taxes: 10200, insurance: 3200 },
      'Houston': { value: 380000, taxes: 7200, insurance: 1400 },
      'Phoenix': { value: 350000, taxes: 5600, insurance: 1200 },
      'Philadelphia': { value: 450000, taxes: 7800, insurance: 1600 },
      'San Antonio': { value: 320000, taxes: 6400, insurance: 1300 },
      'San Diego': { value: 720000, taxes: 10800, insurance: 2000 },
      'Dallas': { value: 410000, taxes: 7600, insurance: 1500 }
    }
    
    const factor = cityFactors[city] || { value: 450000, taxes: 8000, insurance: 1800 }
    
    // Add some randomness
    const valueVariation = 0.8 + Math.random() * 0.4 // ±20%
    const taxesVariation = 0.9 + Math.random() * 0.2 // ±10%
    const insuranceVariation = 0.8 + Math.random() * 0.4 // ±20%
    
    return {
      property_type: this.getRandomPropertyType(),
      estimated_value: Math.round(factor.value * valueVariation).toString(),
      annual_taxes: Math.round(factor.taxes * taxesVariation).toString(),
      annual_insurance: Math.round(factor.insurance * insuranceVariation).toString(),
      square_feet: Math.round(1500 + Math.random() * 1000).toString(),
      bedrooms: Math.floor(2 + Math.random() * 3).toString(),
      bathrooms: Math.floor(2 + Math.random() * 2).toString(),
      year_built: Math.floor(1980 + Math.random() * 40).toString()
    }
  }

  getRandomPropertyType() {
    const types = ['single_family', 'condo', 'townhouse', 'multi_family']
    return types[Math.floor(Math.random() * types.length)]
  }

  // Get property details for display
  async getPropertyDetails(address) {
    const propertyInfo = await this.getPropertyInfo(address)
    
    if (!propertyInfo) return null
    
    return {
      ...propertyInfo,
      monthly_taxes: propertyInfo.annual_taxes ? (parseFloat(propertyInfo.annual_taxes) / 12).toFixed(2) : '0',
      monthly_insurance: propertyInfo.annual_insurance ? (parseFloat(propertyInfo.annual_insurance) / 12).toFixed(2) : '0',
      estimated_monthly_mortgage: this.calculateEstimatedMortgage(propertyInfo.estimated_value)
    }
  }

  calculateEstimatedMortgage(estimatedValue) {
    const value = parseFloat(estimatedValue)
    const downPayment = value * 0.2 // 20% down payment
    const loanAmount = value - downPayment
    const monthlyRate = 0.06 / 12 // 6% annual rate
    const numberOfPayments = 30 * 12 // 30-year fixed
    
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1)
    
    return monthlyPayment.toFixed(2)
  }
}

export default new PropertyLookupService() 