import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

const DepreciationModal = ({ depreciation, properties, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    property_id: '',
    year: new Date().getFullYear(),
    straight_line: '',
    bonus_depreciation: '',
    section_179_deduction: '',
    placed_in_service_date: '',
    business_use_percentage: '100'
  })

  useEffect(() => {
    if (depreciation) {
      setFormData({
        property_id: depreciation.property_id || '',
        year: depreciation.year || new Date().getFullYear(),
        straight_line: depreciation.straight_line || '',
        bonus_depreciation: depreciation.bonus_depreciation || '',
        section_179_deduction: depreciation.section_179_deduction || '',
        placed_in_service_date: depreciation.placed_in_service_date || '',
        business_use_percentage: depreciation.business_use_percentage || '100'
      })
    }
  }, [depreciation])

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = {
      ...formData,
      straight_line: parseFloat(formData.straight_line) || 0,
      bonus_depreciation: parseFloat(formData.bonus_depreciation) || 0,
      section_179_deduction: parseFloat(formData.section_179_deduction) || 0,
      business_use_percentage: parseFloat(formData.business_use_percentage) || 100
    }
    
    if (depreciation) {
      onSave(depreciation.id, data)
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
            {depreciation ? 'Edit Depreciation' : 'Add Depreciation'}
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
            <label className="label">Year</label>
            <input
              type="number"
              name="year"
              value={formData.year}
              onChange={handleChange}
              className="input"
              min="2000"
              max="2100"
              required
            />
          </div>

          <div>
            <label className="label">Straight Line Depreciation</label>
            <input
              type="number"
              name="straight_line"
              value={formData.straight_line}
              onChange={handleChange}
              className="input"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Bonus Depreciation</label>
            <input
              type="number"
              name="bonus_depreciation"
              value={formData.bonus_depreciation}
              onChange={handleChange}
              className="input"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Section 179 Deduction</label>
            <input
              type="number"
              name="section_179_deduction"
              value={formData.section_179_deduction}
              onChange={handleChange}
              className="input"
              step="0.01"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="label">Placed in Service Date</label>
            <input
              type="date"
              name="placed_in_service_date"
              value={formData.placed_in_service_date}
              onChange={handleChange}
              className="input"
            />
          </div>

          <div>
            <label className="label">Business Use Percentage</label>
            <input
              type="number"
              name="business_use_percentage"
              value={formData.business_use_percentage}
              onChange={handleChange}
              className="input"
              min="0"
              max="100"
              step="0.01"
              placeholder="100"
            />
          </div>

          <div className="bg-gray-50 p-3 rounded">
            <label className="text-sm font-medium text-gray-600">Total Depreciation</label>
            <p className="text-lg font-semibold text-primary-600">
              ${((parseFloat(formData.straight_line) || 0) + (parseFloat(formData.bonus_depreciation) || 0) + (parseFloat(formData.section_179_deduction) || 0)).toFixed(2)}
            </p>
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
              {depreciation ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default DepreciationModal 