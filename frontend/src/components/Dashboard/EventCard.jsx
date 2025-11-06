import { Edit, Trash2 } from 'lucide-react'
import { DateTimeRange } from '../common/DateTimeDisplay'

export default function EventCard({ event, onEdit, onDelete }) {
  const statusColors = {
    BUSY: 'badge-busy',
    SWAPPABLE: 'badge-swappable',
    SWAP_PENDING: 'badge-pending'
  }

  return (
    <div className="card hover-lift animate-slide-in">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{event.title}</h3>
        <span className={`badge ${statusColors[event.status]}`}>
          {event.status.replace('_', ' ')}
        </span>
      </div>

      <div className="mb-4">
        <DateTimeRange startDate={event.startTime} endDate={event.endTime} />
      </div>

      {event.status !== 'SWAP_PENDING' && (
        <div className="flex space-x-2 pt-3 border-t border-gray-200">
          <button
            onClick={() => onEdit(event)}
            className="flex-1 btn btn-secondary flex items-center justify-center space-x-1"
          >
            <Edit className="w-4 h-4" />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onDelete(event._id)}
            className="flex-1 btn btn-danger flex items-center justify-center space-x-1"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete</span>
          </button>
        </div>
      )}
    </div>
  )
}
