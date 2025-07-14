import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import {
  Plus,
  Clock,
  Calendar,
  FileText,
  Download,
  Filter,
  Search,
  Edit,
  Trash2,
  Calculator,
  TrendingUp,
  AlertTriangle
} from 'lucide-react'

const MaterialParticipation = () => {
  const [participationLogs, setParticipationLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAddLog, setShowAddLog] = useState(false)
  const [properties, setProperties] = useState([])
  const [newLog, setNewLog] = useState({
    property_id: '',
    date: new Date().toISOString().split('T')[0],
    hours: '',
    activity: '',
    category: 'Maintenance',
    notes: ''
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [logsData, propertiesData] = await Promise.all([
          apiService.getMaterialParticipation(),
          apiService.getProperties()
        ])
        setParticipationLogs(logsData)
        setProperties(propertiesData)
      } catch (err) {
        setError('Failed to load participation logs')
        console.error('Material participation error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const handleAddLog = async (e) => {
    e.preventDefault()
    
    try {
      const logToAdd = {
        ...newLog,
        id: Date.now().toString(),
        hours: parseFloat(newLog.hours) || 0,
        date: new Date(newLog.date).toISOString()
      }
      
      const savedLog = await apiService.saveMaterialParticipation(logToAdd)
      setParticipationLogs([...participationLogs, savedLog])
      
      // Reset form
      setNewLog({
        property_id: '',
        date: new Date().toISOString().split('T')[0],
        hours: '',
        activity: '',
        category: 'Maintenance',
        notes: ''
      })
      
      setShowAddLog(false)
    } catch (err) {
      console.error('Failed to add participation log:', err)
      setError('Failed to save participation log. Please try again.')
    }
  }

  const handleDeleteLog = async (logId) => {
    if (!window.confirm('Are you sure you want to delete this participation log?')) {
      return
    }

    try {
      await apiService.deleteMaterialParticipation(logId)
      setParticipationLogs(participationLogs.filter(l => l.id !== logId))
    } catch (err) {
      console.error('Failed to delete participation log:', err)
      setError('Failed to delete participation log. Please try again.')
    }
  }

  // Calculate totals
  const totalHours = participationLogs.reduce((sum, log) => sum + (log.hours || 0), 0)
  const currentYear = new Date().getFullYear()
  const yearLogs = participationLogs.filter(log => {
    const logDate = new Date(log.date)
    return logDate.getFullYear() === currentYear
  })
  const yearHours = yearLogs.reduce((sum, log) => sum + (log.hours || 0), 0)

  // Group by property
  const logsByProperty = participationLogs.reduce((acc, log) => {
    const property = properties.find(p => p.id === log.property_id)
    const propertyName = property ? property.address : 'Unknown Property'
    
    if (!acc[propertyName]) {
      acc[propertyName] = []
    }
    acc[propertyName].push(log)
    return acc
  }, {})

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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Participation Logs</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Material Participation</h1>
          <p className="text-gray-600">Track your work hours for tax compliance and material participation</p>
        </div>
        <button 
          onClick={() => setShowAddLog(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Work Log
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-blue-600 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-600">Total Hours</p>
              <p className="text-2xl font-bold text-blue-600">{totalHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-green-600 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-600">{currentYear} Hours</p>
              <p className="text-2xl font-bold text-green-600">{yearHours.toFixed(1)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center">
            <Calculator className="h-8 w-8 text-orange-600 mr-4" />
            <div>
              <p className="text-sm font-medium text-gray-600">Properties</p>
              <p className="text-2xl font-bold text-orange-600">{Object.keys(logsByProperty).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tax Compliance Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex items-start">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
          <div>
            <h4 className="font-semibold text-yellow-900 mb-2">Tax Compliance</h4>
            <p className="text-sm text-yellow-800">
              To qualify as a real estate professional for tax purposes, you generally need to spend more than 750 hours 
              per year in real estate activities. Keep detailed records of all your work hours.
            </p>
          </div>
        </div>
      </div>

      {/* Participation Logs by Property */}
      {Object.keys(logsByProperty).length > 0 ? (
        <div className="space-y-6">
          {Object.entries(logsByProperty).map(([propertyName, logs]) => {
            const propertyHours = logs.reduce((sum, log) => sum + (log.hours || 0), 0)
            return (
              <div key={propertyName} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">{propertyName}</h3>
                  <p className="text-sm text-gray-600">Total: {propertyHours.toFixed(1)} hours</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Activity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Hours
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {logs.map((log) => (
                        <tr key={log.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {formatDate(log.date)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {log.activity}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {log.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {log.hours} hours
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button
                              onClick={() => handleDeleteLog(log.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-12">
          <Clock className="h-16 w-16 text-gray-400 mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Participation Logs</h3>
          <p className="text-gray-600 mb-6">
            Start tracking your work hours to maintain proper tax compliance records.
          </p>
          <button 
            onClick={() => setShowAddLog(true)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Your First Work Log
          </button>
        </div>
      )}

      {/* Add Work Log Modal */}
      {showAddLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Work Log</h3>
              <button 
                onClick={() => setShowAddLog(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Edit className="h-6 w-6" />
              </button>
            </div>
            <form onSubmit={handleAddLog} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property</label>
                <select 
                  required
                  value={newLog.property_id}
                  onChange={(e) => setNewLog({...newLog, property_id: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option value="">Select Property</option>
                  {properties.map(property => (
                    <option key={property.id} value={property.id}>
                      {property.address}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input 
                  type="date" 
                  required
                  value={newLog.date}
                  onChange={(e) => setNewLog({...newLog, date: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Activity</label>
                <input 
                  type="text" 
                  required
                  value={newLog.activity}
                  onChange={(e) => setNewLog({...newLog, activity: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="e.g., Plumbing repair, Painting, Landscaping"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={newLog.category}
                  onChange={(e) => setNewLog({...newLog, category: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                >
                  <option>Maintenance</option>
                  <option>Repairs</option>
                  <option>Improvements</option>
                  <option>Management</option>
                  <option>Marketing</option>
                  <option>Administrative</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hours</label>
                <input 
                  type="number" 
                  required
                  step="0.5"
                  min="0"
                  value={newLog.hours}
                  onChange={(e) => setNewLog({...newLog, hours: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  placeholder="2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea 
                  value={newLog.notes}
                  onChange={(e) => setNewLog({...newLog, notes: e.target.value})}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  rows="3"
                  placeholder="Additional details about the work performed..."
                />
              </div>
              <div className="flex space-x-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setShowAddLog(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Add Work Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default MaterialParticipation 