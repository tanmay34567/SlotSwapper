import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from './AuthContext'
import { Bell } from 'lucide-react'

const SocketContext = createContext(null)

export function SocketProvider({ children }) {
  const { token, user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (!token || !user) {
      // Disconnect socket if user logs out
      if (socket) {
        socket.disconnect()
        setSocket(null)
        setConnected(false)
      }
      return
    }

    // Connect to Socket.IO server
    const API_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:4000'
    const newSocket = io(API_URL, {
      auth: { token }
    })

    newSocket.on('connect', () => {
      console.log('✅ Connected to WebSocket')
      setConnected(true)
      toast.success('Real-time notifications enabled', {
        icon: '🔔',
        duration: 2000
      })
    })

    newSocket.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket')
      setConnected(false)
    })

    newSocket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      setConnected(false)
    })

    // Listen for swap request notifications
    newSocket.on('swapRequestReceived', (data) => {
      console.log('📩 New swap request:', data)
      toast((t) => (
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <Bell className="w-5 h-5 text-primary-600" />
          </div>
          <div>
            <p className="font-semibold text-gray-900">New Swap Request!</p>
            <p className="text-sm text-gray-600">{data.message}</p>
          </div>
        </div>
      ), {
        duration: 5000,
        style: {
          background: '#fff',
          border: '2px solid #3b82f6',
          borderRadius: '12px',
          padding: '16px'
        }
      })
      
      // Trigger custom event for components to refresh
      window.dispatchEvent(new CustomEvent('swapRequestReceived', { detail: data }))
    })

    newSocket.on('swapRequestAccepted', (data) => {
      console.log('✅ Swap request accepted:', data)
      toast.success(data.message, {
        icon: '🎉',
        duration: 5000,
        style: {
          background: '#fff',
          border: '2px solid #10b981',
          borderRadius: '12px',
          padding: '16px'
        }
      })
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent('swapRequestAccepted', { detail: data }))
    })

    newSocket.on('swapRequestRejected', (data) => {
      console.log('❌ Swap request rejected:', data)
      toast.error(data.message, {
        duration: 5000,
        style: {
          background: '#fff',
          border: '2px solid #ef4444',
          borderRadius: '12px',
          padding: '16px'
        }
      })
      
      // Trigger custom event
      window.dispatchEvent(new CustomEvent('swapRequestRejected', { detail: data }))
    })

    setSocket(newSocket)

    return () => {
      newSocket.disconnect()
    }
  }, [token, user])

  const value = {
    socket,
    connected
  }

  return (
    <SocketContext.Provider value={value}>
      <Toaster position="top-right" />
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocket must be used within SocketProvider')
  }
  return context
}
