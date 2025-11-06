import { User } from 'lucide-react'
import { CompactDateTime } from '../common/DateTimeDisplay'

export default function OutgoingRequest({ request }) {
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
            <span className="font-semibold text-gray-900">To: {request.recipient?.name}</span>
          </div>
          <p className="text-sm text-gray-500">
            {new Date(request.createdAt).toLocaleDateString()}
          </p>
        </div>
        <span className={`badge ${statusColors[request.status]}`}>
          {request.status}
        </span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
          <p className="text-xs font-bold text-blue-900 mb-2 uppercase tracking-wide">Your Slot</p>
          <p className="font-semibold text-gray-900 mb-3">{request.mySlot?.title}</p>
          <CompactDateTime date={request.mySlot?.startTime} />
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
          <p className="text-xs font-bold text-green-900 mb-2 uppercase tracking-wide">Their Slot</p>
          <p className="font-semibold text-gray-900 mb-3">{request.theirSlot?.title}</p>
          <CompactDateTime date={request.theirSlot?.startTime} />
        </div>
      </div>
    </div>
  )
}
