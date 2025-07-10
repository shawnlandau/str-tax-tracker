import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const TransactionModal = ({ transaction, properties, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    property_id: '',
    type: 'expense',
    category: '',
    amount: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    if (transaction) {
      setFormData({
        property_id: transaction.property_id || '',
        type: transaction.type || 'expense',
        category: transaction.category || '',
        amount: transaction.amount || '',
        description: transaction.description || '',
        date: transaction.date || new Date().toISOString().split('T')[0]
      })
    }
  }, [transaction])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      amount: parseFloat(formData.amount) || 0
    }
    
    if (transaction) {
      onSave(transaction.id, data)
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

  const getCategories = (type) => {
    if (type === 'income') {
      return [
        'rent',
        'late_fees',
        'pet_fees',
        'application_fees',
        'other_income'
      ]
    } else {
      return [
        'maintenance',
        'repairs',
        'utilities',
        'insurance',
        'property_taxes',
        'hoa_fees',
        'property_management',
        'advertising',
        'legal_fees',
        'other_expenses'
      ]
    }
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {transaction ? 'Edit Transaction' : 'Add Transaction'}
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
              {properties.map((property) => (
                <option key={property.id} value={property.id}>
                  {property.address}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>

          <div>
            <label className="label">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select Category</option>
              {getCategories(formData.type).map((category) => (
                <option key={category} value={category}>
                  {category.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Amount</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="input"
              step="0.01"
              required
            />
          </div>

          <div>
            <label className="label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="input"
              required
            />
          </div>

          <div>
            <label className="label">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input"
              rows="3"
              placeholder="Optional description..."
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
              {transaction ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal 