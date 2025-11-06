import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { createSwapRequest } from '../../api'
import { X } from 'lucide-react'
import { DateTimeRange } from '../common/DateTimeDisplay'

export default function RequestModal({ slot, mySlots, onClose, onSuccess }) {
  const { token } = useAuth()
  const [selectedMySlot, setSelectedMySlot] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedMySlot) {
      setError('Please select one of your slots')
      return
    }

    setLoading(true)
    setError('')

    try {
      await createSwapRequest(token, selectedMySlot, slot._id)
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Request Swap</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X className="w-6 h-6" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Their Slot:</h3>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200">
              <p className="font-semibold text-gray-900 text-lg mb-2">{slot.title}</p>
              <p className="text-sm text-gray-600 mb-3">Owner: <span className="font-medium">{slot.owner?.name}</span></p>
              <DateTimeRange startDate={slot.startTime} endDate={slot.endTime} />
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Select Your Slot to Offer:</h3>
              <div className="space-y-2">
                {mySlots.map(mySlot => (
                  <label
                    key={mySlot._id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedMySlot === mySlot._id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="mySlot"
                      value={mySlot._id}
                      checked={selectedMySlot === mySlot._id}
                      onChange={(e) => setSelectedMySlot(e.target.value)}
                      className="sr-only"
                    />
                    <p className="font-semibold text-gray-900 mb-2">{mySlot.title}</p>
                    <DateTimeRange startDate={mySlot.startTime} endDate={mySlot.endTime} />
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Request'}
              </button>
              <button type="button" onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
