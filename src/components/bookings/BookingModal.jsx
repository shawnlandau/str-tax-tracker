import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const BookingModal = ({ booking, properties, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    property_id: '',
    guest_name: '',
    check_in_date: '',
    check_out_date: '',
    total_amount: '',
    notes: ''
  })

  useEffect(() => {
    if (booking) {
      setFormData({
        property_id: booking.property_id || '',
        guest_name: booking.guest_name || '',
        check_in_date: booking.check_in_date || '',
        check_out_date: booking.check_out_date || '',
        total_amount: booking.total_amount || '',
        notes: booking.notes || ''
      })
    }
  }, [booking])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      property_id: parseInt(formData.property_id) || 0,
      total_amount: parseFloat(formData.total_amount) || 0
    }
    
    if (booking) {
      onSave(booking.id, data)
    } else {
      onSave(data)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {booking ? 'Edit Booking' : 'Add Booking'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Property</label>
            <select
              name="property_id"
              value={formData.property_id}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Property</option>
              {properties.map(property => (
                <option key={property.id} value={property.id}>
                  {property.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Guest Name</label>
            <input
              type="text"
              name="guest_name"
              value={formData.guest_name}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Check-in Date</label>
              <input
                type="date"
                name="check_in_date"
                value={formData.check_in_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
            <div>
              <label className="label">Check-out Date</label>
              <input
                type="date"
                name="check_out_date"
                value={formData.check_out_date}
                onChange={handleChange}
                className="input"
                required
              />
            </div>
          </div>

          <div>
            <label className="label">Total Amount</label>
            <input
              type="number"
              name="total_amount"
              value={formData.total_amount}
              onChange={handleChange}
              className="input"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="input"
              rows="3"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
            >
              {booking ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BookingModal 