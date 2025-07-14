import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { WifiIcon, WifiIcon as WifiOffIcon } from '@heroicons/react/24/outline'

const ConnectionStatus = () => {
  const [status, setStatus] = useState({
    isOnline: navigator.onLine,
    storage: 'localStorage'
  })

  useEffect(() => {
    const updateStatus = () => {
      const connectionStatus = apiService.getConnectionStatus()
      setStatus(connectionStatus)
    }

    // Update status immediately
    updateStatus()

    // Update status when online/offline status changes
    const handleOnline = () => {
      setTimeout(updateStatus, 1000) // Small delay to allow Firebase to initialize
    }

    const handleOffline = () => {
      updateStatus()
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (status.isOnline && status.storage === 'Firebase') {
    return (
      <div className="flex items-center space-x-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
        <WifiIcon className="h-4 w-4" />
        <span>Online - Firebase</span>
      </div>
    )
  }

  return (
    <div className="flex items-center space-x-2 text-orange-600 bg-orange-50 px-3 py-1 rounded-full text-sm">
      <WifiOffIcon className="h-4 w-4" />
      <span>Offline - Local Storage</span>
    </div>
  )
}

export default ConnectionStatus 