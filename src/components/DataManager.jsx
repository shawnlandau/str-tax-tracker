import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import {
  Download,
  Upload,
  Trash2,
  Database,
  AlertTriangle,
  CheckCircle,
  X,
  FileText,
  HardDrive
} from 'lucide-react'

const DataManager = () => {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [storageInfo, setStorageInfo] = useState(null)

  const exportData = async () => {
    try {
      setLoading(true)
      const data = await apiService.exportData()
      
      // Create and download file
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `str-tax-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setMessage({ type: 'success', text: 'Data exported successfully!' })
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to export data' })
    } finally {
      setLoading(false)
    }
  }

  const importData = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    try {
      setLoading(true)
      const text = await file.text()
      const data = JSON.parse(text)
      
      const success = await apiService.importData(data)
      
      if (success) {
        setMessage({ type: 'success', text: 'Data imported successfully! Please refresh the page.' })
        // Reload the page to show imported data
        setTimeout(() => window.location.reload(), 2000)
      } else {
        setMessage({ type: 'error', text: 'Failed to import data' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Invalid file format' })
    } finally {
      setLoading(false)
      // Reset file input
      event.target.value = ''
    }
  }

  const clearAllData = async () => {
    if (!window.confirm('Are you sure you want to delete all data? This action cannot be undone.')) {
      return
    }

    try {
      setLoading(true)
      await apiService.clearAllData()
      setMessage({ type: 'success', text: 'All data cleared successfully!' })
      // Reload the page
      setTimeout(() => window.location.reload(), 2000)
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to clear data' })
    } finally {
      setLoading(false)
    }
  }

  const getStorageInfo = async () => {
    try {
      const info = await apiService.getStorageInfo()
      setStorageInfo(info)
    } catch (error) {
      console.error('Failed to get storage info:', error)
    }
  }

  React.useEffect(() => {
    getStorageInfo()
  }, [])

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Data Management</h1>
        <p className="text-gray-600">Export, import, and manage your data</p>
      </div>

      {/* Message Display */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center ${
          message.type === 'success' 
            ? 'bg-green-50 text-green-800 border border-green-200' 
            : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle className="h-5 w-5 mr-2" />
          ) : (
            <AlertTriangle className="h-5 w-5 mr-2" />
          )}
          {message.text}
        </div>
      )}

      {/* Storage Information */}
      {storageInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-center mb-2">
            <Database className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-900">Storage Information</h3>
          </div>
          <div className="text-sm text-blue-800">
            <p>Status: {storageInfo.available ? 'Available' : 'Not Available'}</p>
            {storageInfo.available && (
              <div className="mt-2">
                <div className="flex justify-between items-center mb-1">
                  <span>Usage:</span>
                  <span>{Math.round((storageInfo.used / storageInfo.total) * 100)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${Math.min((storageInfo.used / storageInfo.total) * 100, 100)}%` }}
                  ></div>
                </div>
                <p className="text-xs mt-1">
                  {Math.round(storageInfo.used / 1024)}KB used of {Math.round(storageInfo.total / 1024)}KB
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Data Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Data */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Download className="h-6 w-6 text-green-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Export Data</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Download a backup of all your data including properties, bookings, expenses, and depreciation records.
          </p>
          <button
            onClick={exportData}
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Download className="h-5 w-5 mr-2" />
                Export All Data
              </>
            )}
          </button>
        </div>

        {/* Import Data */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Upload className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Import Data</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Import previously exported data. This will replace all current data.
          </p>
          <label className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 cursor-pointer transition-colors flex items-center justify-center">
            <input
              type="file"
              accept=".json"
              onChange={importData}
              disabled={loading}
              className="hidden"
            />
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Upload className="h-5 w-5 mr-2" />
                Import Data
              </>
            )}
          </label>
        </div>

        {/* Clear All Data */}
        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <div className="flex items-center mb-4">
            <Trash2 className="h-6 w-6 text-red-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Clear All Data</h3>
          </div>
          <p className="text-gray-600 mb-4">
            Permanently delete all your data. This action cannot be undone.
          </p>
          <button
            onClick={clearAllData}
            disabled={loading}
            className="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2" />
                Clear All Data
              </>
            )}
          </button>
        </div>
      </div>

      {/* Data Safety Notice */}
      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Data Safety</h4>
            <p className="text-sm text-yellow-800">
              Your data is stored locally in your browser. Make sure to export your data regularly as a backup. 
              Data may be lost if you clear your browser data or switch devices.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DataManager 