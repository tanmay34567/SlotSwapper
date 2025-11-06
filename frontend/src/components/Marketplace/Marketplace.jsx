import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { fetchSwappableSlots, fetchEvents } from '../../api'
import SlotCard from './SlotCard'
import RequestModal from './RequestModal'
import { Store } from 'lucide-react'

export default function Marketplace() {
  const { token } = useAuth()
  const [slots, setSlots] = useState([])
  const [mySlots, setMySlots] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [swappableData, myEventsData] = await Promise.all([
        fetchSwappableSlots(token),
        fetchEvents(token)
      ])
      setSlots(swappableData)
      setMySlots(myEventsData.filter(e => e.status === 'SWAPPABLE'))
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestSwap = (slot) => {
    if (mySlots.length === 0) {
      setError('You need at least one SWAPPABLE slot to request a swap')
      return
    }
    setSelectedSlot(slot)
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setSelectedSlot(null)
  }

  const handleSwapSuccess = () => {
    setShowModal(false)
    setSelectedSlot(null)
    loadData()
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="text-gray-500">Loading marketplace...</div></div>
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Marketplace</h1>
        <p className="text-gray-600 mt-1">Browse and request swaps for available time slots</p>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">{error}</div>}

      {slots.length === 0 ? (
        <div className="card text-center py-12">
          <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No slots available</h3>
          <p className="text-gray-600">Check back later for swappable slots</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {slots.map(slot => (
            <SlotCard key={slot._id} slot={slot} onRequest={handleRequestSwap} />
          ))}
        </div>
      )}

      {showModal && selectedSlot && (
        <RequestModal
          slot={selectedSlot}
          mySlots={mySlots}
          onClose={handleCloseModal}
          onSuccess={handleSwapSuccess}
        />
      )}
    </div>
  )
}
