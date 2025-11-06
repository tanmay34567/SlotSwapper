import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

export default function EventForm({ event, onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [status, setStatus] = useState('BUSY')
  const [error, setError] = useState('')

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setStartTime(new Date(event.startTime).toISOString().slice(0, 16))
      setEndTime(new Date(event.endTime).toISOString().slice(0, 16))
      setStatus(event.status)
    }
  }, [event])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    if (!title || !startTime || !endTime) {
      setError('All fields are required')
      return
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (end <= start) {
      setError('End time must be after start time')
      return
    }

    onSubmit({ title, startTime: start, endTime: end, status })
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          {event ? 'Edit Event' : 'Create New Event'}
        </h3>
        <button onClick={onCancel} className="text-gray-400 hover:text-gray-600">
          <X className="w-6 h-6" />
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input"
            placeholder="Meeting with team"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="datetime-local"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="input"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="datetime-local"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="input"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input">
            <option value="BUSY">Busy</option>
            <option value="SWAPPABLE">Swappable</option>
          </select>
        </div>

        <div className="flex space-x-3">
          <button type="submit" className="btn btn-primary flex-1">
            {event ? 'Update' : 'Create'}
          </button>
          <button type="button" onClick={onCancel} className="btn btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
