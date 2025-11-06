import { Calendar, Clock, Timer } from 'lucide-react'
import { getDateParts, formatTime, getDuration, getRelativeDay } from '../../utils/dateUtils'

export function DateBadge({ date, className = '' }) {
  const parts = getDateParts(date)
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200 ${className}`}>
      <Calendar className="w-4 h-4 text-primary-600" />
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-primary-900">{parts.weekday}</span>
        <span className="text-sm font-bold text-primary-700">{parts.month} {parts.day}</span>
      </div>
    </div>
  )
}

export function TimeBadge({ date, className = '' }) {
  const time = formatTime(date)
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 ${className}`}>
      <Clock className="w-4 h-4 text-blue-600" />
      <span className="text-sm font-semibold text-blue-700">{time}</span>
    </div>
  )
}

export function DateTimeRange({ startDate, endDate, className = '' }) {
  const startParts = getDateParts(startDate)
  const endParts = getDateParts(endDate)
  const duration = getDuration(startDate, endDate)
  const relativeDay = getRelativeDay(startDate)
  
  return (
    <div className={`space-y-2 ${className}`}>
      {/* Date Display */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg border border-primary-200">
          <Calendar className="w-4 h-4 text-primary-600" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-primary-900">{relativeDay}</span>
            {!['Today', 'Tomorrow'].includes(relativeDay) && (
              <span className="text-xs text-primary-600">• {startParts.weekday}</span>
            )}
          </div>
        </div>
        
        {/* Duration Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-br from-purple-50 to-purple-100 rounded-md border border-purple-200">
          <Timer className="w-3.5 h-3.5 text-purple-600" />
          <span className="text-xs font-semibold text-purple-700">{duration}</span>
        </div>
      </div>
      
      {/* Time Range */}
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">{startParts.time}</span>
        </div>
        <span className="text-gray-400 font-medium">→</span>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <Clock className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-700">{endParts.time}</span>
        </div>
      </div>
    </div>
  )
}

export function CompactDateTime({ date, showIcon = true, className = '' }) {
  const parts = getDateParts(date)
  const relativeDay = getRelativeDay(date)
  
  return (
    <div className={`inline-flex items-center gap-1.5 text-sm text-gray-600 ${className}`}>
      {showIcon && <Calendar className="w-4 h-4 text-gray-400" />}
      <span className="font-medium">{relativeDay}</span>
      <span className="text-gray-400">•</span>
      <Clock className="w-4 h-4 text-gray-400" />
      <span className="font-medium">{parts.time}</span>
    </div>
  )
}
