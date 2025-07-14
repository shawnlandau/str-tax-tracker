import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase-config'

class FirebaseService {
  constructor() {
    this.collections = {
      properties: 'properties',
      bookings: 'bookings',
      expenses: 'expenses',
      depreciation: 'depreciation',
      materialParticipation: 'materialParticipation',
      taxEstimates: 'taxEstimates',
      settings: 'settings'
    }
  }

  // Generic CRUD operations
  async getCollection(collectionName) {
    try {
      const querySnapshot = await getDocs(collection(db, collectionName))
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error getting ${collectionName}:`, error)
      throw error
    }
  }

  async getDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        return null
      }
    } catch (error) {
      console.error(`Error getting document ${docId} from ${collectionName}:`, error)
      throw error
    }
  }

  async addDocument(collectionName, data) {
    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return { id: docRef.id, ...data }
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error)
      throw error
    }
  }

  async updateDocument(collectionName, docId, data) {
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
      return { id: docId, ...data }
    } catch (error) {
      console.error(`Error updating document ${docId} in ${collectionName}:`, error)
      throw error
    }
  }

  async deleteDocument(collectionName, docId) {
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
      return { success: true }
    } catch (error) {
      console.error(`Error deleting document ${docId} from ${collectionName}:`, error)
      throw error
    }
  }

  async queryCollection(collectionName, conditions = []) {
    try {
      let q = collection(db, collectionName)
      
      conditions.forEach(condition => {
        q = query(q, where(condition.field, condition.operator, condition.value))
      })
      
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error(`Error querying ${collectionName}:`, error)
      throw error
    }
  }

  // Properties management
  async getProperties() {
    return this.getCollection(this.collections.properties)
  }

  async getProperty(id) {
    return this.getDocument(this.collections.properties, id)
  }

  async createProperty(data) {
    return this.addDocument(this.collections.properties, data)
  }

  async updateProperty(id, data) {
    return this.updateDocument(this.collections.properties, id, data)
  }

  async deleteProperty(id) {
    return this.deleteDocument(this.collections.properties, id)
  }

  // Bookings management
  async getBookings() {
    return this.getCollection(this.collections.bookings)
  }

  async getPropertyBookings(propertyId) {
    return this.queryCollection(this.collections.bookings, [
      { field: 'property_id', operator: '==', value: propertyId }
    ])
  }

  async createBooking(data) {
    return this.addDocument(this.collections.bookings, data)
  }

  async updateBooking(id, data) {
    return this.updateDocument(this.collections.bookings, id, data)
  }

  async deleteBooking(id) {
    return this.deleteDocument(this.collections.bookings, id)
  }

  // Expenses/Transactions management
  async getExpenses() {
    return this.getCollection(this.collections.expenses)
  }

  async getPropertyExpenses(propertyId) {
    return this.queryCollection(this.collections.expenses, [
      { field: 'property_id', operator: '==', value: propertyId }
    ])
  }

  async createExpense(data) {
    return this.addDocument(this.collections.expenses, data)
  }

  async updateExpense(id, data) {
    return this.updateDocument(this.collections.expenses, id, data)
  }

  async deleteExpense(id) {
    return this.deleteDocument(this.collections.expenses, id)
  }

  // Depreciation management
  async getDepreciation() {
    return this.getCollection(this.collections.depreciation)
  }

  async getPropertyDepreciation(propertyId) {
    return this.queryCollection(this.collections.depreciation, [
      { field: 'property_id', operator: '==', value: propertyId }
    ])
  }

  async createDepreciation(data) {
    return this.addDocument(this.collections.depreciation, data)
  }

  async updateDepreciation(id, data) {
    return this.updateDocument(this.collections.depreciation, id, data)
  }

  async deleteDepreciation(id) {
    return this.deleteDocument(this.collections.depreciation, id)
  }

  // Material participation management
  async getMaterialParticipation() {
    return this.getCollection(this.collections.materialParticipation)
  }

  async getPropertyParticipation(propertyId) {
    return this.queryCollection(this.collections.materialParticipation, [
      { field: 'property_id', operator: '==', value: propertyId }
    ])
  }

  async createMaterialParticipation(data) {
    return this.addDocument(this.collections.materialParticipation, data)
  }

  async updateMaterialParticipation(id, data) {
    return this.updateDocument(this.collections.materialParticipation, id, data)
  }

  async deleteMaterialParticipation(id) {
    return this.deleteDocument(this.collections.materialParticipation, id)
  }

  // Tax estimates management
  async getTaxEstimates() {
    return this.getCollection(this.collections.taxEstimates)
  }

  async createTaxEstimate(data) {
    return this.addDocument(this.collections.taxEstimates, data)
  }

  async updateTaxEstimate(id, data) {
    return this.updateDocument(this.collections.taxEstimates, id, data)
  }

  async deleteTaxEstimate(id) {
    return this.deleteDocument(this.collections.taxEstimates, id)
  }

  // Settings management
  async getSettings() {
    const settings = await this.getCollection(this.collections.settings)
    if (settings.length > 0) {
      return settings[0]
    }
    return {
      taxYear: new Date().getFullYear(),
      defaultCurrency: 'USD',
      notifications: true
    }
  }

  async updateSettings(data) {
    const settings = await this.getCollection(this.collections.settings)
    if (settings.length > 0) {
      return this.updateDocument(this.collections.settings, settings[0].id, data)
    } else {
      return this.addDocument(this.collections.settings, data)
    }
  }

  // Data export/import
  async exportAllData() {
    try {
      const [properties, bookings, expenses, depreciation, materialParticipation, taxEstimates, settings] = await Promise.all([
        this.getProperties(),
        this.getBookings(),
        this.getExpenses(),
        this.getDepreciation(),
        this.getMaterialParticipation(),
        this.getTaxEstimates(),
        this.getSettings()
      ])

      return {
        properties,
        bookings,
        expenses,
        depreciation,
        materialParticipation,
        taxEstimates,
        settings,
        exportDate: new Date().toISOString()
      }
    } catch (error) {
      console.error('Error exporting data:', error)
      throw error
    }
  }

  async importData(data) {
    try {
      const promises = []
      
      if (data.properties) {
        for (const property of data.properties) {
          const { id, ...propertyData } = property
          promises.push(this.createProperty(propertyData))
        }
      }
      
      if (data.bookings) {
        for (const booking of data.bookings) {
          const { id, ...bookingData } = booking
          promises.push(this.createBooking(bookingData))
        }
      }
      
      if (data.expenses) {
        for (const expense of data.expenses) {
          const { id, ...expenseData } = expense
          promises.push(this.createExpense(expenseData))
        }
      }
      
      if (data.depreciation) {
        for (const dep of data.depreciation) {
          const { id, ...depData } = dep
          promises.push(this.createDepreciation(depData))
        }
      }
      
      if (data.materialParticipation) {
        for (const participation of data.materialParticipation) {
          const { id, ...participationData } = participation
          promises.push(this.createMaterialParticipation(participationData))
        }
      }
      
      if (data.taxEstimates) {
        for (const estimate of data.taxEstimates) {
          const { id, ...estimateData } = estimate
          promises.push(this.createTaxEstimate(estimateData))
        }
      }
      
      if (data.settings) {
        promises.push(this.updateSettings(data.settings))
      }
      
      await Promise.all(promises)
      return { success: true }
    } catch (error) {
      console.error('Error importing data:', error)
      throw error
    }
  }

  async clearAllData() {
    try {
      const collections = Object.values(this.collections)
      const promises = []
      
      for (const collectionName of collections) {
        const docs = await this.getCollection(collectionName)
        for (const doc of docs) {
          promises.push(this.deleteDocument(collectionName, doc.id))
        }
      }
      
      await Promise.all(promises)
      return { success: true }
    } catch (error) {
      console.error('Error clearing data:', error)
      throw error
    }
  }

  // Get storage info (Firebase doesn't have the same limits as localStorage)
  async getStorageInfo() {
    return {
      available: true,
      used: 'Unlimited',
      total: 'Unlimited'
    }
  }
}

export const firebaseService = new FirebaseService() 