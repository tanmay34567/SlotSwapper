import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { respondToSwap } from '../../api'
import { User, ArrowLeftRight, Check, X } from 'lucide-react'
import { CompactDateTime } from '../common/DateTimeDisplay'

export default function IncomingRequest({ request, onUpdate }) {
  const { token } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleRespond = async (accept) => {
    setLoading(true)
    setError('')

    try {
      await respondToSwap(token, request._id, accept)
      onUpdate()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const statusColors = {
    PENDING: 'badge-pending',
    ACCEPTED: 'badge-accepted',
    REJECTED: 'badge-rejected'
  }

  return (
    <div className="card">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <User className="w-5 h-5 text-gray-500" />
            <span className="font-semibold text-gray-900">{request.requester?.name}</span>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`badge ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">Their Slot</p>
          <p className="font-semibold text-gray-900 mb-3">{request.mySlot?.title}</p>
          <CompactDateTime date={request.mySlot?.startTime} />
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <p className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide">Your Slot</p>
          <p className="font-semibold text-gray-900 mb-3">{request.theirSlot?.title}</p>
          <CompactDateTime date={request.theirSlot?.startTime} />
        </div>
      </div>

      {request.status === 'PENDING' && (
        <div className="flex space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={() => handleRespond(true)}
            disabled={loading}
            className="flex-1 btn btn-success flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>Accept</span>
          </button>
          <button
            onClick={() => handleRespond(false)}
            disabled={loading}
            className="flex-1 btn btn-danger flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Reject</span>
          </button>
        </div>
      )}
    </div>
  )
}
