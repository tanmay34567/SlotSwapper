import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchIncomingRequests, fetchOutgoingRequests } from '../../api'
import IncomingRequest from './IncomingRequest'
import OutgoingRequest from './OutgoingRequest'
import { Bell, Send } from 'lucide-react'

export default function Requests() {
  const { token } = useAuth()
  const [activeTab, setActiveTab] = useState('incoming')
  const [incoming, setIncoming] = useState([])
  const [outgoing, setOutgoing] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadRequests()
    
    // Listen for real-time notifications
    const handleSwapRequestReceived = () => {
      loadRequests()
    }
    
    const handleSwapRequestAccepted = () => {
      loadRequests()
    }
    
    const handleSwapRequestRejected = () => {
      loadRequests()
    }
    
    window.addEventListener('swapRequestReceived', handleSwapRequestReceived)
    window.addEventListener('swapRequestAccepted', handleSwapRequestAccepted)
    window.addEventListener('swapRequestRejected', handleSwapRequestRejected)
    
    return () => {
      window.removeEventListener('swapRequestReceived', handleSwapRequestReceived)
      window.removeEventListener('swapRequestAccepted', handleSwapRequestAccepted)
      window.removeEventListener('swapRequestRejected', handleSwapRequestRejected)
    }
  }, [])

  const loadRequests = async () => {
    try {
      setLoading(true)
      const [incomingData, outgoingData] = await Promise.all([
        fetchIncomingRequests(token),
        fetchOutgoingRequests(token)
      ])
      setIncoming(incomingData)
      setOutgoing(outgoingData)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading requests...</div></div>
  }

  const pendingIncoming = incoming.filter(r => r.status === 'PENDING')
  const pendingOutgoing = outgoing.filter(r => r.status === 'PENDING')

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Swap Requests</h1>
        <p className="text-gray-600 mt-1">Manage incoming and outgoing swap requests</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      <div className="mb-6 border-b border-gray-200">
        <div className="flex space-x-8">
          <button
            onClick={() => setActiveTab('incoming')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'incoming'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Incoming</span>
              {pendingIncoming.length > 0 && (
                <span className="bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingIncoming.length}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab('outgoing')}
            className={`pb-4 px-1 border-b-2 font-medium transition-colors ${
              activeTab === 'outgoing'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>Outgoing</span>
              {pendingOutgoing.length > 0 && (
                <span className="bg-gray-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {pendingOutgoing.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {activeTab === 'incoming' ? (
        incoming.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No incoming requests</h3>
            <p className="text-gray-600">You'll see swap requests from other users here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {incoming.map(request => (
              <IncomingRequest key={request._id} request={request} onUpdate={loadRequests} />
            ))}
          </div>
        )
      ) : (
        outgoing.length === 0 ? (
          <div className="card text-center py-12">
            <Send className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No outgoing requests</h3>
            <p className="text-gray-600">Request swaps from the marketplace to see them here</p>
          </div>
        ) : (
          <div className="space-y-4">
            {outgoing.map(request => (
              <OutgoingRequest key={request._id} request={request} />
            ))}
          </div>
        )
      )}
    </div>
  )
}
