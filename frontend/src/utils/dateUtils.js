/**
 * Format date and time utilities for better display
 */

export const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const formatDateTimeFull = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}

export const getDateParts = (dateString) => {
  const date = new Date(dateString)
  return {
    weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    month: date.toLocaleDateString('en-US', { month: 'short' }),
    day: date.getDate(),
    year: date.getFullYear(),
    time: formatTime(dateString)
  }
}

export const getDuration = (startDateString, endDateString) => {
  const start = new Date(startDateString)
  const end = new Date(endDateString)
  const durationMs = end - start
  const hours = Math.floor(durationMs / (1000 * 60 * 60))
  const minutes = Math.floor((durationMs % (1000 * 60 * 60)) / (1000 * 60))
  
  if (hours === 0) {
    return `${minutes}m`
  } else if (minutes === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${minutes}m`
  }
}

export const isToday = (dateString) => {
  const date = new Date(dateString)
  const today = new Date()
  return date.toDateString() === today.toDateString()
}

export const isTomorrow = (dateString) => {
  const date = new Date(dateString)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return date.toDateString() === tomorrow.toDateString()
}

export const getRelativeDay = (dateString) => {
  if (isToday(dateString)) return 'Today'
  if (isTomorrow(dateString)) return 'Tomorrow'
  return formatDate(dateString)
}
