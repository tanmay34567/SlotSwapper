import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchEvents, createEvent, updateEvent, deleteEvent } from '../../api'
import EventForm from './EventForm'
import EventCard from './EventCard'
import { Plus, Calendar } from 'lucide-react'

export default function Dashboard() {
  const { token } = useAuth()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)

  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const data = await fetchEvents(token)
      setEvents(data)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateEvent = async (eventData) => {
    try {
      const newEvent = await createEvent(token, eventData)
      setEvents([...events, newEvent])
      setShowForm(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUpdateEvent = async (eventId, eventData) => {
    try {
      const updated = await updateEvent(token, eventId, eventData)
      setEvents(events.map(e => e._id === eventId ? updated : e))
      setEditingEvent(null)
      setShowForm(false)
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      await deleteEvent(token, eventId)
      setEvents(events.filter(e => e._id !== eventId))
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleEdit = (event) => {
    setEditingEvent(event)
    setShowForm(true)
  }

  const handleCancelForm = () => {
    setShowForm(false)
    setEditingEvent(null)
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading events...</div></div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Events</h1>
          <p className="text-gray-600 mt-1">Manage your time slots</p>
        </div>
        <button onClick={() => setShowForm(true)} className="btn btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>New Event</span>
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {showForm && (
        <div className="mb-8">
          <EventForm
            event={editingEvent}
            onSubmit={editingEvent ? (data) => handleUpdateEvent(editingEvent._id, data) : handleCreateEvent}
            onCancel={handleCancelForm}
          />
        </div>
      )}

      {events.length === 0 ? (
        <div className="card text-center py-12">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events yet</h3>
          <p className="text-gray-600">Create your first event to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <EventCard
              key={event._id}
              event={event}
              onEdit={handleEdit}
              onDelete={handleDeleteEvent}
            />
          ))}
        </div>
      )}
    </div>
  )
}
