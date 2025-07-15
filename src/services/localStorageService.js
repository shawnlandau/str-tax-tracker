// localStorage service for PWA data persistence
class LocalStorageService {
  constructor() {
    this.storageKeys = {
      properties: 'str_properties',
      bookings: 'str_bookings',
      expenses: 'str_expenses',
      depreciation: 'str_depreciation',
      materialParticipation: 'str_material_participation',
      taxEstimates: 'str_tax_estimates',
      settings: 'str_settings'
    }
  }

  // Generic localStorage methods with error handling
  isStorageAvailable() {
    try {
      const test = '__storage_test__'
      localStorage.setItem(test, test)
      localStorage.removeItem(test)
      return true
    } catch (e) {
      console.warn('localStorage is not available:', e)
      return false
    }
  }

  getItem(key, defaultValue = null) {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available, returning default value')
      return defaultValue
    }

    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : defaultValue
    } catch (error) {
      console.error('Error reading from localStorage:', error)
      return defaultValue
    }
  }

  setItem(key, value) {
    if (!this.isStorageAvailable()) {
      console.warn('localStorage not available, data not saved')
      return false
    }

    try {
      localStorage.setItem(key, JSON.stringify(value))
      return true
    } catch (error) {
      console.error('Error writing to localStorage:', error)
      return false
    }
  }

  removeItem(key) {
    if (!this.isStorageAvailable()) {
      return false
    }

    try {
      localStorage.removeItem(key)
      return true
    } catch (error) {
      console.error('Error removing from localStorage:', error)
      return false
    }
  }

  // Properties management
  getProperties() {
    return this.getItem(this.storageKeys.properties, [])
  }

  saveProperty(property) {
    const properties = this.getProperties()
    const existingIndex = properties.findIndex(p => p.id === property.id)
    let saved
    if (existingIndex >= 0) {
      properties[existingIndex] = { ...properties[existingIndex], ...property }
      saved = properties[existingIndex]
    } else {
      saved = { ...property, id: property.id || Date.now().toString() }
      properties.push(saved)
    }
    this.setItem(this.storageKeys.properties, properties)
    return saved
  }

  deleteProperty(propertyId) {
    const properties = this.getProperties()
    const filtered = properties.filter(p => p.id !== propertyId)
    return this.setItem(this.storageKeys.properties, filtered)
  }

  // Bookings management
  getBookings() {
    return this.getItem(this.storageKeys.bookings, [])
  }

  saveBooking(booking) {
    const bookings = this.getBookings()
    const existingIndex = bookings.findIndex(b => b.id === booking.id)
    let saved
    if (existingIndex >= 0) {
      bookings[existingIndex] = { ...bookings[existingIndex], ...booking }
      saved = bookings[existingIndex]
    } else {
      saved = { ...booking, id: booking.id || Date.now().toString() }
      bookings.push(saved)
    }
    this.setItem(this.storageKeys.bookings, bookings)
    return saved
  }

  deleteBooking(bookingId) {
    const bookings = this.getBookings()
    const filtered = bookings.filter(b => b.id !== bookingId)
    return this.setItem(this.storageKeys.bookings, filtered)
  }

  // Expenses management
  getExpenses() {
    return this.getItem(this.storageKeys.expenses, [])
  }

  saveExpense(expense) {
    const expenses = this.getExpenses()
    const existingIndex = expenses.findIndex(e => e.id === expense.id)
    let saved
    if (existingIndex >= 0) {
      expenses[existingIndex] = { ...expenses[existingIndex], ...expense }
      saved = expenses[existingIndex]
    } else {
      saved = { ...expense, id: expense.id || Date.now().toString() }
      expenses.push(saved)
    }
    this.setItem(this.storageKeys.expenses, expenses)
    return saved
  }

  deleteExpense(expenseId) {
    const expenses = this.getExpenses()
    const filtered = expenses.filter(e => e.id !== expenseId)
    return this.setItem(this.storageKeys.expenses, filtered)
  }

  // Depreciation management
  getDepreciation() {
    return this.getItem(this.storageKeys.depreciation, [])
  }

  saveDepreciation(depreciation) {
    const depreciationRecords = this.getDepreciation()
    const existingIndex = depreciationRecords.findIndex(d => d.id === depreciation.id)
    let saved
    if (existingIndex >= 0) {
      depreciationRecords[existingIndex] = { ...depreciationRecords[existingIndex], ...depreciation }
      saved = depreciationRecords[existingIndex]
    } else {
      saved = { ...depreciation, id: depreciation.id || Date.now().toString() }
      depreciationRecords.push(saved)
    }
    this.setItem(this.storageKeys.depreciation, depreciationRecords)
    return saved
  }

  deleteDepreciation(depreciationId) {
    const depreciationRecords = this.getDepreciation()
    const filtered = depreciationRecords.filter(d => d.id !== depreciationId)
    return this.setItem(this.storageKeys.depreciation, filtered)
  }

  // Material participation logs
  getMaterialParticipation() {
    return this.getItem(this.storageKeys.materialParticipation, [])
  }

  saveMaterialParticipation(participation) {
    const participationLogs = this.getMaterialParticipation()
    const existingIndex = participationLogs.findIndex(p => p.id === participation.id)
    let saved
    if (existingIndex >= 0) {
      participationLogs[existingIndex] = { ...participationLogs[existingIndex], ...participation }
      saved = participationLogs[existingIndex]
    } else {
      saved = { ...participation, id: participation.id || Date.now().toString() }
      participationLogs.push(saved)
    }
    this.setItem(this.storageKeys.materialParticipation, participationLogs)
    return saved
  }

  deleteMaterialParticipation(participationId) {
    const participationLogs = this.getMaterialParticipation()
    const filtered = participationLogs.filter(p => p.id !== participationId)
    return this.setItem(this.storageKeys.materialParticipation, filtered)
  }

  // Tax estimates
  getTaxEstimates() {
    return this.getItem(this.storageKeys.taxEstimates, [])
  }

  saveTaxEstimate(estimate) {
    const estimates = this.getTaxEstimates()
    const existingIndex = estimates.findIndex(e => e.id === estimate.id)
    let saved
    if (existingIndex >= 0) {
      estimates[existingIndex] = { ...estimates[existingIndex], ...estimate }
      saved = estimates[existingIndex]
    } else {
      saved = { ...estimate, id: estimate.id || Date.now().toString() }
      estimates.push(saved)
    }
    this.setItem(this.storageKeys.taxEstimates, estimates)
    return saved
  }

  deleteTaxEstimate(estimateId) {
    const estimates = this.getTaxEstimates()
    const filtered = estimates.filter(e => e.id !== estimateId)
    return this.setItem(this.storageKeys.taxEstimates, filtered)
  }

  // Settings
  getSettings() {
    return this.getItem(this.storageKeys.settings, {
      taxYear: new Date().getFullYear(),
      defaultCurrency: 'USD',
      notifications: true
    })
  }

  saveSettings(settings) {
    const currentSettings = this.getSettings()
    return this.setItem(this.storageKeys.settings, { ...currentSettings, ...settings })
  }

  // Data export/import
  exportAllData() {
    return {
      properties: this.getProperties(),
      bookings: this.getBookings(),
      expenses: this.getExpenses(),
      depreciation: this.getDepreciation(),
      materialParticipation: this.getMaterialParticipation(),
      taxEstimates: this.getTaxEstimates(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    }
  }

  importData(data) {
    try {
      if (data.properties) this.setItem(this.storageKeys.properties, data.properties)
      if (data.bookings) this.setItem(this.storageKeys.bookings, data.bookings)
      if (data.expenses) this.setItem(this.storageKeys.expenses, data.expenses)
      if (data.depreciation) this.setItem(this.storageKeys.depreciation, data.depreciation)
      if (data.materialParticipation) this.setItem(this.storageKeys.materialParticipation, data.materialParticipation)
      if (data.taxEstimates) this.setItem(this.storageKeys.taxEstimates, data.taxEstimates)
      if (data.settings) this.setItem(this.storageKeys.settings, data.settings)
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }

  // Clear all data
  clearAllData() {
    Object.values(this.storageKeys).forEach(key => {
      this.removeItem(key)
    })
  }

  // Get storage usage info
  getStorageInfo() {
    if (!this.isStorageAvailable()) {
      return { available: false, used: 0, total: 0 }
    }

    try {
      let used = 0
      Object.values(this.storageKeys).forEach(key => {
        const item = localStorage.getItem(key)
        if (item) used += item.length
      })

      return {
        available: true,
        used: used,
        total: 5 * 1024 * 1024 // 5MB typical localStorage limit
      }
    } catch (error) {
      return { available: false, used: 0, total: 0 }
    }
  }
}

export const localStorageService = new LocalStorageService() 