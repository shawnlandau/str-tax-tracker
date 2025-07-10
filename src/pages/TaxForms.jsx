import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, DollarSign, Calculator, Building2, ClipboardList, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react'
import api from '../services/api'

const TaxForms = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [taxData, setTaxData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('summary')

  useEffect(() => {
    loadTaxData()
  }, [selectedYear])

  const loadTaxData = async () => {
    setLoading(true)
    try {
      const data = await api.getTaxFormsData(selectedYear)
      setTaxData(data)
    } catch (error) {
      console.error('Error loading tax data:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount || 0)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tax forms...</p>
        </div>
      </div>
    )
  }

  if (!taxData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-600">No tax data available</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tax Forms & Compliance</h1>
          <p className="text-gray-600">100% Depreciation Compliance for {selectedYear}</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value={2024}>2024</option>
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
          </select>
        </div>
      </div>

      {/* Compliance Status */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Compliance Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            {taxData.compliance_checklist.map((item, index) => (
              <div key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">Section 179 Limits</h3>
              <p className="text-sm text-blue-700">
                Maximum deduction: $1,160,000 (2024)<br/>
                Phase-out begins: $2,890,000<br/>
                Your total: {formatCurrency(taxData.totals.total_section_179)}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-900 mb-2">100% Depreciation Achieved</h3>
              <p className="text-sm text-green-700">
                All properties placed in service in {selectedYear} qualify for immediate expensing.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Forms Navigation */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Required Tax Forms</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {taxData.forms_needed.map((form, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center space-x-2 mb-2">
                <FileText className="h-5 w-5 text-primary-600" />
                <h3 className="font-semibold text-gray-900">{form}</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                {getFormDescription(form)}
              </p>
              <button
                onClick={() => downloadForm(form)}
                className="btn-primary text-sm"
              >
                <Download className="h-4 w-4 mr-1" />
                Download
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Property Summary */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Property Tax Summary</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Property
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Purchase Price
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section 179
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rental Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Net Income
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placed in Service
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {taxData.properties.map((property, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {property.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(property.purchase_price)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                    {formatCurrency(property.section_179_deduction)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(property.rental_income)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(property.net_rental_income)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(property.placed_in_service_date)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Total Purchase Price</h3>
          <p className="text-2xl font-bold text-primary-600">
            {formatCurrency(taxData.totals.total_purchase_price)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Section 179 Deduction</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(taxData.totals.total_section_179)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Rental Income</h3>
          <p className="text-2xl font-bold text-blue-600">
            {formatCurrency(taxData.totals.total_rental_income)}
          </p>
        </div>
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-700">Net Income</h3>
          <p className="text-2xl font-bold text-success-600">
            {formatCurrency(taxData.totals.total_net_income)}
          </p>
        </div>
      </div>

      {/* Important Notes */}
      <div className="card bg-yellow-50 border-yellow-200">
        <h2 className="text-xl font-bold text-yellow-900 mb-4">Important Compliance Notes</h2>
        <div className="space-y-3 text-sm text-yellow-800">
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Section 179 Election:</strong> You must make an election on Form 4562 to claim Section 179 deduction.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Business Use:</strong> Properties must be used 100% for business purposes to qualify for Section 179.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Documentation:</strong> Maintain detailed records of property costs, dates placed in service, and business use percentage.
            </div>
          </div>
          <div className="flex items-start space-x-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
            <div>
              <strong>Professional Consultation:</strong> Consult with a tax professional to ensure compliance with all requirements.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function getFormDescription(form) {
  const descriptions = {
    'Form 4562 - Depreciation and Amortization': 'Main form for claiming Section 179 deduction and depreciation',
    'Schedule E - Supplemental Income and Loss': 'Reports rental income and expenses',
    'Form 4797 - Sales of Business Property': 'Used when selling rental properties',
    'Form 8829 - Expenses for Business Use of Home': 'If using home office for rental business',
    'Schedule 1 - Additional Income and Adjustments to Income': 'Additional income and adjustments',
    'Form 1040 - Individual Income Tax Return': 'Main tax return form'
  }
  return descriptions[form] || 'Tax form for rental property reporting'
}

function downloadForm(form) {
  // This would generate the actual form content
  const formContent = `Generated ${form} content would go here...`
  const blob = new Blob([formContent], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${form.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().getFullYear()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

export default TaxForms 