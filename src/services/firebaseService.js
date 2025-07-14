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
  limit,
  writeBatch,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../firebase-config';

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  try {
    // Check if db is available and properly initialized
    return db && typeof db.collection === 'function';
  } catch (error) {
    console.warn('Firebase not properly configured, falling back to localStorage');
    return false;
  }
};

// Firebase service with fallback to localStorage
class FirebaseService {
  constructor() {
    this.isConfigured = isFirebaseConfigured();
    if (!this.isConfigured) {
      console.warn('Firebase not available, using localStorage fallback');
    }
  }

  // Generic CRUD operations with fallback
  async getCollection(collectionName) {
    if (!this.isConfigured) {
      return this.getFromLocalStorage(collectionName);
    }

    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const data = [];
      querySnapshot.forEach((doc) => {
        data.push({ id: doc.id, ...doc.data() });
      });
      return data;
    } catch (error) {
      console.error(`Error fetching ${collectionName}:`, error);
      return this.getFromLocalStorage(collectionName);
    }
  }

  async getDocument(collectionName, docId) {
    if (!this.isConfigured) {
      return this.getFromLocalStorage(collectionName, docId);
    }

    try {
      const docRef = doc(db, collectionName, docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error(`Error fetching document ${docId}:`, error);
      return this.getFromLocalStorage(collectionName, docId);
    }
  }

  async addDocument(collectionName, data) {
    if (!this.isConfigured) {
      return this.addToLocalStorage(collectionName, data);
    }

    try {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      return { id: docRef.id, ...data };
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      return this.addToLocalStorage(collectionName, data);
    }
  }

  async updateDocument(collectionName, docId, data) {
    if (!this.isConfigured) {
      return this.updateInLocalStorage(collectionName, docId, data);
    }

    try {
      const docRef = doc(db, collectionName, docId);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      });
      return { id: docId, ...data };
    } catch (error) {
      console.error(`Error updating document ${docId}:`, error);
      return this.updateInLocalStorage(collectionName, docId, data);
    }
  }

  async deleteDocument(collectionName, docId) {
    if (!this.isConfigured) {
      return this.deleteFromLocalStorage(collectionName, docId);
    }

    try {
      const docRef = doc(db, collectionName, docId);
      await deleteDoc(docRef);
      return true;
    } catch (error) {
      console.error(`Error deleting document ${docId}:`, error);
      return this.deleteFromLocalStorage(collectionName, docId);
    }
  }

  // LocalStorage fallback methods
  getFromLocalStorage(collectionName, docId = null) {
    try {
      const data = localStorage.getItem(collectionName);
      if (!data) return docId ? null : [];
      
      const items = JSON.parse(data);
      if (docId) {
        return items.find(item => item.id === docId) || null;
      }
      return items;
    } catch (error) {
      console.error(`Error reading from localStorage ${collectionName}:`, error);
      return docId ? null : [];
    }
  }

  addToLocalStorage(collectionName, data) {
    try {
      const items = this.getFromLocalStorage(collectionName);
      const newItem = {
        id: Date.now().toString(),
        ...data,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      items.push(newItem);
      localStorage.setItem(collectionName, JSON.stringify(items));
      return newItem;
    } catch (error) {
      console.error(`Error adding to localStorage ${collectionName}:`, error);
      return null;
    }
  }

  updateInLocalStorage(collectionName, docId, data) {
    try {
      const items = this.getFromLocalStorage(collectionName);
      const index = items.findIndex(item => item.id === docId);
      if (index !== -1) {
        items[index] = {
          ...items[index],
          ...data,
          updatedAt: new Date().toISOString()
        };
        localStorage.setItem(collectionName, JSON.stringify(items));
        return items[index];
      }
      return null;
    } catch (error) {
      console.error(`Error updating in localStorage ${collectionName}:`, error);
      return null;
    }
  }

  deleteFromLocalStorage(collectionName, docId) {
    try {
      const items = this.getFromLocalStorage(collectionName);
      const filteredItems = items.filter(item => item.id !== docId);
      localStorage.setItem(collectionName, JSON.stringify(filteredItems));
      return true;
    } catch (error) {
      console.error(`Error deleting from localStorage ${collectionName}:`, error);
      return false;
    }
  }

  // Connection status
  getConnectionStatus() {
    return {
      isOnline: navigator.onLine,
      storage: this.isConfigured ? 'firebase' : 'localStorage',
      firebaseConfigured: this.isConfigured
    };
  }
}

export default new FirebaseService(); 