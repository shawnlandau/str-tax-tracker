const API_BASE_URL = '/api'

class ApiService {
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    }

    try {
      const response = await fetch(url, config)
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Network error' }))
        throw new Error(error.error || `HTTP ${response.status}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('API request failed:', error)
      throw error
    }
  }

  // Properties API
  async getProperties() {
    return this.request('/properties')
  }

  async getProperty(id) {
    return this.request(`/properties/${id}`)
  }

  async createProperty(data) {
    return this.request('/properties', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateProperty(id, data) {
    return this.request(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteProperty(id) {
    return this.request(`/properties/${id}`, {
      method: 'DELETE',
    })
  }

  // Transactions API
  async getTransactions() {
    return this.request('/transactions')
  }

  async getPropertyTransactions(propertyId) {
    return this.request(`/transactions/property/${propertyId}`)
  }

  async getTransaction(id) {
    return this.request(`/transactions/${id}`)
  }

  async createTransaction(data) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTransaction(id, data) {
    return this.request(`/transactions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteTransaction(id) {
    return this.request(`/transactions/${id}`, {
      method: 'DELETE',
    })
  }

  async getTransactionSummary(propertyId, year) {
    const params = year ? `?year=${year}` : ''
    return this.request(`/transactions/summary/property/${propertyId}${params}`)
  }

  // Depreciation API
  async getDepreciation() {
    return this.request('/depreciation')
  }

  async getPropertyDepreciation(propertyId) {
    return this.request(`/depreciation/property/${propertyId}`)
  }

  async getDepreciationRecord(id) {
    return this.request(`/depreciation/${id}`)
  }

  async createDepreciation(data) {
    return this.request('/depreciation', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateDepreciation(id, data) {
    return this.request(`/depreciation/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteDepreciation(id) {
    return this.request(`/depreciation/${id}`, {
      method: 'DELETE',
    })
  }

  async getDepreciationSummary(propertyId) {
    return this.request(`/depreciation/summary/property/${propertyId}`)
  }

  // Dashboard API
  async getDashboardOverview() {
    return this.request('/dashboard/overview')
  }

  async getPropertyPerformance() {
    return this.request('/dashboard/property-performance')
  }

  async getMonthlyCashFlow(year) {
    const params = year ? `?year=${year}` : ''
    return this.request(`/dashboard/monthly-cashflow${params}`)
  }

  async getDepreciationChart() {
    return this.request('/dashboard/depreciation-chart')
  }

  async getTransactionCategories(year) {
    const params = year ? `?year=${year}` : ''
    return this.request(`/dashboard/transaction-categories${params}`)
  }

  async getPropertyDistribution() {
    return this.request('/dashboard/property-distribution')
  }

  // Bookings API
  async getBookings() {
    return this.request('/bookings')
  }

  async getPropertyBookings(propertyId) {
    return this.request(`/bookings/property/${propertyId}`)
  }

  async getBooking(id) {
    return this.request(`/bookings/${id}`)
  }

  async createBooking(data) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateBooking(id, data) {
    return this.request(`/bookings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteBooking(id) {
    return this.request(`/bookings/${id}`, {
      method: 'DELETE',
    })
  }

  async getBookingStats() {
    return this.request('/bookings/stats/summary')
  }

  // Tax Forms API
  async getTaxSummary(year) {
    return this.request(`/tax-forms/summary/${year}`)
  }

  async getSection179Summary(year) {
    return this.request(`/tax-forms/section179/${year}`)
  }

  async getBonusDepreciationSummary(year) {
    return this.request(`/tax-forms/bonus-depreciation/${year}`)
  }

  async getRentalIncomeSummary(year) {
    return this.request(`/tax-forms/rental-income/${year}`)
  }

  async getExpensesBreakdown(year) {
    return this.request(`/tax-forms/expenses/${year}`)
  }

  async getTaxFormsData(year) {
    return this.request(`/tax-forms/forms/${year}`)
  }
}

export default new ApiService() 