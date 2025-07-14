import { firebaseService } from './firebaseService.js'
import { localStorageService } from './localStorageService.js'

class HybridService {
  constructor() {
    this.isOnline = navigator.onLine
    this.setupOnlineOfflineListeners()
  }

  setupOnlineOfflineListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true
      console.log('App is online - switching to Firebase')
      this.syncLocalToFirebase()
    })

    window.addEventListener('offline', () => {
      this.isOnline = false
      console.log('App is offline - using localStorage')
    })
  }

  async syncLocalToFirebase() {
    try {
      // Get all local data
      const localData = localStorageService.exportAllData()
      
      // Sync each collection
      for (const [collection, items] of Object.entries(localData)) {
        if (collection === 'exportDate') continue
        
        for (const item of items) {
          const { id, ...data } = item
          try {
            await firebaseService.addDocument(collection, data)
          } catch (error) {
            console.warn(`Failed to sync ${collection} item:`, error)
          }
        }
      }
      
      console.log('Local data synced to Firebase')
    } catch (error) {
      console.error('Error syncing local data to Firebase:', error)
    }
  }

  // Generic methods that choose between Firebase and localStorage
  async getCollection(collectionName) {
    if (this.isOnline) {
      try {
        return await firebaseService.getCollection(collectionName)
      } catch (error) {
        console.warn('Firebase failed, falling back to localStorage:', error)
        return localStorageService.getItem(`str_${collectionName}`, [])
      }
    } else {
      return localStorageService.getItem(`str_${collectionName}`, [])
    }
  }

  async addDocument(collectionName, data) {
    if (this.isOnline) {
      try {
        return await firebaseService.addDocument(collectionName, data)
      } catch (error) {
        console.warn('Firebase failed, saving to localStorage:', error)
        return localStorageService.setItem(`str_${collectionName}`, data)
      }
    } else {
      return localStorageService.setItem(`str_${collectionName}`, data)
    }
  }

  async updateDocument(collectionName, docId, data) {
    if (this.isOnline) {
      try {
        return await firebaseService.updateDocument(collectionName, docId, data)
      } catch (error) {
        console.warn('Firebase failed, updating localStorage:', error)
        return localStorageService.setItem(`str_${collectionName}`, data)
      }
    } else {
      return localStorageService.setItem(`str_${collectionName}`, data)
    }
  }

  async deleteDocument(collectionName, docId) {
    if (this.isOnline) {
      try {
        return await firebaseService.deleteDocument(collectionName, docId)
      } catch (error) {
        console.warn('Firebase failed, deleting from localStorage:', error)
        return localStorageService.removeItem(`str_${collectionName}`)
      }
    } else {
      return localStorageService.removeItem(`str_${collectionName}`)
    }
  }

  // Properties management
  async getProperties() {
    return this.getCollection('properties')
  }

  async getProperty(id) {
    if (this.isOnline) {
      try {
        return await firebaseService.getProperty(id)
      } catch (error) {
        console.warn('Firebase failed, getting from localStorage:', error)
        const properties = localStorageService.getProperties()
        return properties.find(p => p.id === id) || null
      }
    } else {
      const properties = localStorageService.getProperties()
      return properties.find(p => p.id === id) || null
    }
  }

  async createProperty(data) {
    if (this.isOnline) {
      try {
        return await firebaseService.createProperty(data)
      } catch (error) {
        console.warn('Firebase failed, saving to localStorage:', error)
        return localStorageService.saveProperty(data)
      }
    } else {
      return localStorageService.saveProperty(data)
    }
  }

  async updateProperty(id, data) {
    if (this.isOnline) {
      try {
        return await firebaseService.updateProperty(id, data)
      } catch (error) {
        console.warn('Firebase failed, updating localStorage:', error)
        return localStorageService.saveProperty({ ...data, id })
      }
    } else {
      return localStorageService.saveProperty({ ...data, id })
    }
  }

  async deleteProperty(id) {
    if (this.isOnline) {
      try {
        return await firebaseService.deleteProperty(id)
      } catch (error) {
        console.warn('Firebase failed, deleting from localStorage:', error)
        return localStorageService.deleteProperty(id)
      }
    } else {
      return localStorageService.deleteProperty(id)
    }
  }

  // Bookings management
  async getBookings() {
    return this.getCollection('bookings')
  }

  async getPropertyBookings(propertyId) {
    if (this.isOnline) {
      try {
        return await firebaseService.getPropertyBookings(propertyId)
      } catch (error) {
        console.warn('Firebase failed, getting from localStorage:', error)
        const bookings = localStorageService.getBookings()
        return bookings.filter(b => b.property_id === propertyId)
      }
    } else {
      const bookings = localStorageService.getBookings()
      return bookings.filter(b => b.property_id === propertyId)
    }
  }

  async createBooking(data) {
    if (this.isOnline) {
      try {
        return await firebaseService.createBooking(data)
      } catch (error) {
        console.warn('Firebase failed, saving to localStorage:', error)
        return localStorageService.saveBooking(data)
      }
    } else {
      return localStorageService.saveBooking(data)
    }
  }

  async updateBooking(id, data) {
    if (this.isOnline) {
      try {
        return await firebaseService.updateBooking(id, data)
      } catch (error) {
        console.warn('Firebase failed, updating localStorage:', error)
        return localStorageService.saveBooking({ ...data, id })
      }
    } else {
      return localStorageService.saveBooking({ ...data, id })
    }
  }

  async deleteBooking(id) {
    if (this.isOnline) {
      try {
        return await firebaseService.deleteBooking(id)
      } catch (error) {
        console.warn('Firebase failed, deleting from localStorage:', error)
        return localStorageService.deleteBooking(id)
      }
    } else {
      return localStorageService.deleteBooking(id)
    }
  }

  // Expenses/Transactions management
  async getExpenses() {
    return this.getCollection('expenses')
  }

  async getPropertyExpenses(propertyId) {
    if (this.isOnline) {
      try {
        return await firebaseService.getPropertyExpenses(propertyId)
      } catch (error) {
        console.warn('Firebase failed, getting from localStorage:', error)
        const expenses = localStorageService.getExpenses()
        return expenses.filter(e => e.property_id === propertyId)
      }
    } else {
      const expenses = localStorageService.getExpenses()
      return expenses.filter(e => e.property_id === propertyId)
    }
  }

  async createExpense(data) {
    if (this.isOnline) {
      try {
        return await firebaseService.createExpense(data)
      } catch (error) {
        console.warn('Firebase failed, saving to localStorage:', error)
        return localStorageService.saveExpense(data)
      }
    } else {
      return localStorageService.saveExpense(data)
    }
  }

  async updateExpense(id, data) {
    if (this.isOnline) {
      try {
        return await firebaseService.updateExpense(id, data)
      } catch (error) {
        console.warn('Firebase failed, updating localStorage:', error)
        return localStorageService.saveExpense({ ...data, id })
      }
    } else {
      return localStorageService.saveExpense({ ...data, id })
    }
  }

  async deleteExpense(id) {
    if (this.isOnline) {
      try {
        return await firebaseService.deleteExpense(id)
      } catch (error) {
        console.warn('Firebase failed, deleting from localStorage:', error)
        return localStorageService.deleteExpense(id)
      }
    } else {
      return localStorageService.deleteExpense(id)
    }
  }

  // Material participation management
  async getMaterialParticipation() {
    return this.getCollection('materialParticipation')
  }

  async createMaterialParticipation(data) {
    if (this.isOnline) {
      try {
        return await firebaseService.createMaterialParticipation(data)
      } catch (error) {
        console.warn('Firebase failed, saving to localStorage:', error)
        return localStorageService.saveMaterialParticipation(data)
      }
    } else {
      return localStorageService.saveMaterialParticipation(data)
    }
  }

  async deleteMaterialParticipation(id) {
    if (this.isOnline) {
      try {
        return await firebaseService.deleteMaterialParticipation(id)
      } catch (error) {
        console.warn('Firebase failed, deleting from localStorage:', error)
        return localStorageService.deleteMaterialParticipation(id)
      }
    } else {
      return localStorageService.deleteMaterialParticipation(id)
    }
  }

  // Data management
  async exportAllData() {
    if (this.isOnline) {
      try {
        return await firebaseService.exportAllData()
      } catch (error) {
        console.warn('Firebase failed, exporting from localStorage:', error)
        return localStorageService.exportAllData()
      }
    } else {
      return localStorageService.exportAllData()
    }
  }

  async importData(data) {
    if (this.isOnline) {
      try {
        return await firebaseService.importData(data)
      } catch (error) {
        console.warn('Firebase failed, importing to localStorage:', error)
        return localStorageService.importData(data)
      }
    } else {
      return localStorageService.importData(data)
    }
  }

  async clearAllData() {
    if (this.isOnline) {
      try {
        return await firebaseService.clearAllData()
      } catch (error) {
        console.warn('Firebase failed, clearing localStorage:', error)
        return localStorageService.clearAllData()
      }
    } else {
      return localStorageService.clearAllData()
    }
  }

  async getStorageInfo() {
    if (this.isOnline) {
      try {
        return await firebaseService.getStorageInfo()
      } catch (error) {
        console.warn('Firebase failed, getting localStorage info:', error)
        return localStorageService.getStorageInfo()
      }
    } else {
      return localStorageService.getStorageInfo()
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      storage: this.isOnline ? 'Firebase' : 'localStorage'
    }
  }
}

export const hybridService = new HybridService() 