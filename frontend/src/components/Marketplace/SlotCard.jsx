import { User, ArrowLeftRight } from 'lucide-react'
import { DateTimeRange } from '../common/DateTimeDisplay'

export default function SlotCard({ slot, onRequest }) {
  return (
    <div className="card hover-lift animate-slide-in group">
      <div className="mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-primary-600 transition-colors">{slot.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mt-2">
          <User className="w-4 h-4 mr-1.5 text-primary-500" />
          <span className="font-medium">{slot.owner?.name}</span>
        </div>
      </div>

      <div className="mb-4">
        <DateTimeRange startDate={slot.startTime} endDate={slot.endTime} />
      </div>

      <button
        onClick={() => onRequest(slot)}
        className="w-full btn btn-primary flex items-center justify-center space-x-2"
      >
        <ArrowLeftRight className="w-4 h-4" />
        <span>Request Swap</span>
      </button>
    </div>
  )
}
