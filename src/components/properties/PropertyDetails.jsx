import { X } from 'lucide-react'

const PropertyDetails = ({ property, onClose }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Address</label>
            <p className="text-sm text-gray-900">{property.address}</p>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Property Type</label>
            <p className="text-sm text-gray-900 capitalize">{property.property_type}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Purchase Price</label>
              <p className="text-sm text-gray-900">{formatCurrency(property.purchase_price)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Down Payment</label>
              <p className="text-sm text-gray-900">{formatCurrency(property.down_payment)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly Mortgage</label>
              <p className="text-sm text-gray-900">{formatCurrency(property.monthly_mortgage)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly Taxes</label>
              <p className="text-sm text-gray-900">{formatCurrency(property.monthly_taxes)}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly Insurance</label>
              <p className="text-sm text-gray-900">{formatCurrency(property.monthly_insurance)}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Monthly HOA Fees</label>
              <p className="text-sm text-gray-900">{formatCurrency(property.monthly_hoa_fees)}</p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Total Income</label>
                <p className="text-sm text-success-600">{formatCurrency(property.total_income)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Total Expenses</label>
                <p className="text-sm text-danger-600">{formatCurrency(property.total_expenses)}</p>
              </div>
            </div>
            <div className="mt-2">
              <label className="text-sm font-medium text-gray-600">Net Cash Flow</label>
              <p className={`text-sm font-medium ${
                property.net_cash_flow >= 0 ? 'text-success-600' : 'text-danger-600'
              }`}>
                {formatCurrency(property.net_cash_flow)}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Created</label>
                <p className="text-sm text-gray-900">{formatDate(property.created_at)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Updated</label>
                <p className="text-sm text-gray-900">{formatDate(property.updated_at)}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyDetails 