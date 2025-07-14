import { hybridService } from './hybridService.js'

class ApiService {
  // Properties API
  async getProperties() {
    return hybridService.getProperties()
  }

  async getProperty(id) {
    return hybridService.getProperty(id)
  }

  async createProperty(data) {
    return hybridService.createProperty(data)
  }

  async updateProperty(id, data) {
    return hybridService.updateProperty(id, data)
  }

  async deleteProperty(id) {
    return hybridService.deleteProperty(id)
  }

  // Transactions/Expenses API
  async getTransactions() {
    return hybridService.getExpenses()
  }

  async getPropertyTransactions(propertyId) {
    return hybridService.getPropertyExpenses(propertyId)
  }

  async getTransaction(id) {
    return hybridService.getDocument('expenses', id)
  }

  async createTransaction(data) {
    return hybridService.createExpense(data)
  }

  async updateTransaction(id, data) {
    return hybridService.updateExpense(id, data)
  }

  async deleteTransaction(id) {
    return hybridService.deleteExpense(id)
  }

  async getTransactionSummary(propertyId, year) {
    const expenses = await hybridService.getExpenses()
    const filtered = expenses.filter(e => e.property_id === propertyId)
    
    if (year) {
      const yearStart = new Date(year, 0, 1)
      const yearEnd = new Date(year, 11, 31)
      return filtered.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate >= yearStart && expenseDate <= yearEnd
      })
    }
    
    return filtered
  }

  // Bookings API
  async getBookings() {
    return hybridService.getBookings()
  }

  async getPropertyBookings(propertyId) {
    return hybridService.getPropertyBookings(propertyId)
  }

  async getBooking(id) {
    return hybridService.getDocument('bookings', id)
  }

  async createBooking(data) {
    return hybridService.createBooking(data)
  }

  async updateBooking(id, data) {
    return hybridService.updateBooking(id, data)
  }

  async deleteBooking(id) {
    return hybridService.deleteBooking(id)
  }

  async getBookingStats() {
    const bookings = await hybridService.getBookings()
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    const avgBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0
    
    return {
      totalBookings,
      totalRevenue,
      avgBookingValue
    }
  }

  // Depreciation API
  async getDepreciation() {
    return hybridService.getCollection('depreciation')
  }

  async getPropertyDepreciation(propertyId) {
    const depreciation = await hybridService.getCollection('depreciation')
    return depreciation.filter(d => d.property_id === propertyId)
  }

  async getDepreciationRecord(id) {
    return hybridService.getDocument('depreciation', id)
  }

  async createDepreciation(data) {
    return hybridService.addDocument('depreciation', data)
  }

  async updateDepreciation(id, data) {
    return hybridService.updateDocument('depreciation', id, data)
  }

  async deleteDepreciation(id) {
    return hybridService.deleteDocument('depreciation', id)
  }

  async getDepreciationSummary(propertyId) {
    const depreciation = await hybridService.getCollection('depreciation')
    const propertyDepreciation = depreciation.filter(d => d.property_id === propertyId)
    
    const totalDepreciation = propertyDepreciation.reduce((sum, d) => sum + (d.amount || 0), 0)
    const bonusDepreciation = propertyDepreciation
      .filter(d => d.type === 'bonus')
      .reduce((sum, d) => sum + (d.amount || 0), 0)
    
    return {
      totalDepreciation,
      bonusDepreciation,
      regularDepreciation: totalDepreciation - bonusDepreciation,
      records: propertyDepreciation
    }
  }

  // Dashboard API
  async getDashboardData() {
    const [properties, bookings, expenses, depreciation] = await Promise.all([
      hybridService.getProperties(),
      hybridService.getBookings(),
      hybridService.getExpenses(),
      hybridService.getCollection('depreciation')
    ])

    const totalProperties = properties.length
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    const totalDepreciation = depreciation.reduce((sum, d) => sum + (d.amount || 0), 0)
    const netIncome = totalRevenue - totalExpenses

    return {
      totalProperties,
      totalBookings,
      totalRevenue,
      totalExpenses,
      totalDepreciation,
      netIncome,
      properties: properties.slice(0, 5), // Recent properties
      recentBookings: bookings.slice(-5), // Recent bookings
      recentExpenses: expenses.slice(-5) // Recent expenses
    }
  }

  async getPropertyPerformance() {
    const [properties, bookings, expenses] = await Promise.all([
      hybridService.getProperties(),
      hybridService.getBookings(),
      hybridService.getExpenses()
    ])

    return properties.map(property => {
      const propertyBookings = bookings.filter(b => b.property_id === property.id)
      const propertyExpenses = expenses.filter(e => e.property_id === property.id)
      
      const totalIncome = propertyBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
      const totalExpenses = propertyExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      const netIncome = totalIncome - totalExpenses
      
      return {
        ...property,
        totalIncome,
        totalExpenses,
        netIncome,
        bookingCount: propertyBookings.length,
        expenseCount: propertyExpenses.length
      }
    })
  }

  async getMonthlyCashFlow(year = new Date().getFullYear()) {
    const [bookings, expenses] = await Promise.all([
      hybridService.getBookings(),
      hybridService.getExpenses()
    ])
    
    const monthlyData = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1
      const monthBookings = bookings.filter(b => {
        const bookingDate = new Date(b.date)
        return bookingDate.getFullYear() === year && bookingDate.getMonth() === i
      })
      const monthExpenses = expenses.filter(e => {
        const expenseDate = new Date(e.date)
        return expenseDate.getFullYear() === year && expenseDate.getMonth() === i
      })
      
      const income = monthBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
      const expenses = monthExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
      
      return {
        month,
        income,
        expenses,
        net: income - expenses
      }
    })
    
    return monthlyData
  }

  async getDepreciationChart() {
    const depreciation = await hybridService.getCollection('depreciation')
    const currentYear = new Date().getFullYear()
    
    const yearlyData = Array.from({ length: 5 }, (_, i) => {
      const year = currentYear - 2 + i
      const yearDepreciation = depreciation.filter(d => {
        const depDate = new Date(d.date)
        return depDate.getFullYear() === year
      })
      
      const total = yearDepreciation.reduce((sum, d) => sum + (d.amount || 0), 0)
      const bonus = yearDepreciation
        .filter(d => d.type === 'bonus')
        .reduce((sum, d) => sum + (d.amount || 0), 0)
      
      return {
        year,
        total,
        bonus,
        regular: total - bonus
      }
    })
    
    return yearlyData
  }

  async getTransactionCategories(year = new Date().getFullYear()) {
    const expenses = await hybridService.getExpenses()
    const yearExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date)
      return expenseDate.getFullYear() === year
    })
    
    const categories = {}
    yearExpenses.forEach(expense => {
      const category = expense.category || 'Other'
      if (!categories[category]) {
        categories[category] = 0
      }
      categories[category] += expense.amount || 0
    })
    
    return Object.entries(categories).map(([category, amount]) => ({
      category,
      amount
    }))
  }

  async getPropertyDistribution() {
    const [properties, bookings] = await Promise.all([
      hybridService.getProperties(),
      hybridService.getBookings()
    ])
    
    return properties.map(property => {
      const propertyBookings = bookings.filter(b => b.property_id === property.id)
      const totalIncome = propertyBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
      
      return {
        id: property.id,
        name: property.address,
        value: property.current_value || 0,
        income: totalIncome
      }
    })
  }

  // Tax forms and estimates
  async getTaxSummary(year = new Date().getFullYear()) {
    const [bookings, expenses, depreciation] = await Promise.all([
      hybridService.getBookings(),
      hybridService.getExpenses(),
      hybridService.getCollection('depreciation')
    ])
    
    const yearBookings = bookings.filter(b => {
      const bookingDate = new Date(b.date)
      return bookingDate.getFullYear() === year
    })
    
    const yearExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date)
      return expenseDate.getFullYear() === year
    })
    
    const yearDepreciation = depreciation.filter(d => {
      const depDate = new Date(d.date)
      return depDate.getFullYear() === year
    })
    
    const totalIncome = yearBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    const totalExpenses = yearExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    const totalDepreciation = yearDepreciation.reduce((sum, d) => sum + (d.amount || 0), 0)
    const bonusDepreciation = yearDepreciation
      .filter(d => d.type === 'bonus')
      .reduce((sum, d) => sum + (d.amount || 0), 0)
    
    return {
      year,
      totalIncome,
      totalExpenses,
      totalDepreciation,
      bonusDepreciation,
      regularDepreciation: totalDepreciation - bonusDepreciation,
      netIncome: totalIncome - totalExpenses - totalDepreciation,
      taxableIncome: totalIncome - totalExpenses - totalDepreciation
    }
  }

  async getSection179Summary(year = new Date().getFullYear()) {
    const depreciation = await hybridService.getCollection('depreciation')
    const yearDepreciation = depreciation.filter(d => {
      const depDate = new Date(d.date)
      return depDate.getFullYear() === year && d.type === 'section179'
    })
    
    const totalSection179 = yearDepreciation.reduce((sum, d) => sum + (d.amount || 0), 0)
    
    return {
      year,
      totalSection179,
      records: yearDepreciation
    }
  }

  async getBonusDepreciationSummary(year = new Date().getFullYear()) {
    const depreciation = await hybridService.getCollection('depreciation')
    const yearDepreciation = depreciation.filter(d => {
      const depDate = new Date(d.date)
      return depDate.getFullYear() === year && d.type === 'bonus'
    })
    
    const totalBonus = yearDepreciation.reduce((sum, d) => sum + (d.amount || 0), 0)
    
    return {
      year,
      totalBonus,
      records: yearDepreciation
    }
  }

  async getRentalIncomeSummary(year = new Date().getFullYear()) {
    const bookings = await hybridService.getBookings()
    const yearBookings = bookings.filter(b => {
      const bookingDate = new Date(b.date)
      return bookingDate.getFullYear() === year
    })
    
    const totalIncome = yearBookings.reduce((sum, b) => sum + (b.amount || 0), 0)
    const avgBookingValue = yearBookings.length > 0 ? totalIncome / yearBookings.length : 0
    
    return {
      year,
      totalIncome,
      bookingCount: yearBookings.length,
      avgBookingValue,
      bookings: yearBookings
    }
  }

  async getExpensesBreakdown(year = new Date().getFullYear()) {
    const expenses = await hybridService.getExpenses()
    const yearExpenses = expenses.filter(e => {
      const expenseDate = new Date(e.date)
      return expenseDate.getFullYear() === year
    })
    
    const categories = {}
    yearExpenses.forEach(expense => {
      const category = expense.category || 'Other'
      if (!categories[category]) {
        categories[category] = 0
      }
      categories[category] += expense.amount || 0
    })
    
    const totalExpenses = yearExpenses.reduce((sum, e) => sum + (e.amount || 0), 0)
    
    return {
      year,
      totalExpenses,
      categories: Object.entries(categories).map(([category, amount]) => ({
        category,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      })),
      expenses: yearExpenses
    }
  }

  async getTaxFormsData(year = new Date().getFullYear()) {
    const [taxSummary, section179, bonusDepreciation, rentalIncome, expensesBreakdown] = await Promise.all([
      this.getTaxSummary(year),
      this.getSection179Summary(year),
      this.getBonusDepreciationSummary(year),
      this.getRentalIncomeSummary(year),
      this.getExpensesBreakdown(year)
    ])
    
    return {
      year,
      taxSummary,
      section179,
      bonusDepreciation,
      rentalIncome,
      expensesBreakdown
    }
  }

  // Material participation tracking
  async getMaterialParticipation() {
    return hybridService.getMaterialParticipation()
  }

  async saveMaterialParticipation(data) {
    return hybridService.createMaterialParticipation(data)
  }

  async deleteMaterialParticipation(id) {
    return hybridService.deleteMaterialParticipation(id)
  }

  // Data management
  async exportData() {
    return hybridService.exportAllData()
  }

  async importData(data) {
    return hybridService.importData(data)
  }

  async clearAllData() {
    return hybridService.clearAllData()
  }

  async getStorageInfo() {
    return hybridService.getStorageInfo()
  }

  // Get connection status
  getConnectionStatus() {
    return hybridService.getConnectionStatus()
  }
}

export const apiService = new ApiService() 