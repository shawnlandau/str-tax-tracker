import React, { useState, useEffect } from 'react'
import { apiService } from '../services/api'
import { Wifi, WifiOff } from 'lucide-react'

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

    // Update status periodically
    const interval = setInterval(updateStatus, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="flex items-center gap-1">
        {status.isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        <span className={status.isOnline ? 'text-green-600' : 'text-red-600'}>
          {status.isOnline ? 'Online' : 'Offline'}
        </span>
      </div>
      <span className="text-gray-500">({status.storage})</span>
    </div>
  )
}

export default ConnectionStatus 