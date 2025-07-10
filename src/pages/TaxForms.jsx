import { useState, useEffect } from 'react'
import { FileText, Download, Calendar, DollarSign, Calculator, Building2, ClipboardList, ExternalLink } from 'lucide-react'
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

  const generateTaxReport = () => {
    if (!taxData) return

    const report = `
TAX REPORT FOR ${selectedYear}
=====================================

PROPERTIES SUMMARY:
${taxData.properties.map(prop => `
Property: ${prop.address}
Purchase Price: ${formatCurrency(prop.purchase_price)}
Section 179 Deduction: ${formatCurrency(prop.section_179_deduction)}
Bonus Depreciation: ${formatCurrency(prop.bonus_depreciation)}
Rental Income: ${formatCurrency(prop.rental_income)}
Net Rental Income: ${formatCurrency(prop.net_rental_income)}
Placed in Service: ${formatDate(prop.placed_in_service_date)}
Business Use %: ${prop.business_use_percentage}%
`).join('\n')}

TOTALS:
Total Purchase Price: ${formatCurrency(taxData.totals.total_purchase_price)}
Total Section 179: ${formatCurrency(taxData.totals.total_section_179)}
Total Bonus Depreciation: ${formatCurrency(taxData.totals.total_bonus_depreciation)}
Total Rental Income: ${formatCurrency(taxData.totals.total_rental_income)}
Total Net Income: ${formatCurrency(taxData.totals.total_net_income)}

FORMS NEEDED:
${taxData.forms_needed.map(form => `- ${form}`).join('\n')}
    `

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `tax-report-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadForm4562 = () => {
    if (!taxData) return

    const form4562 = `
FORM 4562 - DEPRECIATION AND AMORTIZATION (${selectedYear})
========================================================

PART I - ELECTION TO EXPENSE CERTAIN PROPERTY UNDER SECTION 179
Line 1: Total cost of section 179 property placed in service: ${formatCurrency(taxData.totals.total_purchase_price)}
Line 2: Total section 179 deduction: ${formatCurrency(taxData.totals.total_section_179)}

PART II - SPECIAL DEPRECIATION ALLOWANCE AND OTHER DEPRECIATION
Line 14: Special depreciation allowance: ${formatCurrency(taxData.totals.total_bonus_depreciation)}

PART III - MACRS DEPRECIATION
Line 19: Total depreciation: ${formatCurrency(taxData.totals.total_section_179 + taxData.totals.total_bonus_depreciation)}

PROPERTY DETAILS:
${taxData.properties.map(prop => `
Property: ${prop.address}
Purchase Price: ${formatCurrency(prop.purchase_price)}
Section 179: ${formatCurrency(prop.section_179_deduction)}
Bonus Depreciation: ${formatCurrency(prop.bonus_depreciation)}
Placed in Service: ${formatDate(prop.placed_in_service_date)}
Business Use %: ${prop.business_use_percentage}%
`).join('\n')}
    `

    const blob = new Blob([form4562], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-4562-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadScheduleE = () => {
    if (!taxData) return

    const scheduleE = `
SCHEDULE E - SUPPLEMENTAL INCOME AND LOSS (${selectedYear})
==========================================================

PART I - INCOME OR LOSS FROM RENTALS AND ROYALTIES

Property Details:
${taxData.properties.map((prop, index) => `
Property ${index + 1}: ${prop.address}
Line 1: Rents received: ${formatCurrency(prop.rental_income)}
Line 5: Insurance: ${formatCurrency(prop.annual_insurance)}
Line 6: Mortgage interest: ${formatCurrency(prop.annual_mortgage_interest)}
Line 7: Other interest: $0
Line 8: Repairs: $0
Line 9: Supplies: $0
Line 10: Taxes: ${formatCurrency(prop.annual_property_taxes)}
Line 11: Utilities: $0
Line 12: Other: ${formatCurrency(prop.annual_hoa_fees)}
Line 13: Depreciation: ${formatCurrency(prop.section_179_deduction + prop.bonus_depreciation)}
Line 20: Net rental income (loss): ${formatCurrency(prop.net_rental_income)}
`).join('\n')}

TOTAL NET RENTAL INCOME: ${formatCurrency(taxData.totals.total_net_income)}
    `

    const blob = new Blob([scheduleE], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `schedule-e-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadForm4797 = () => {
    if (!taxData) return

    const form4797 = `
FORM 4797 - SALES OF BUSINESS PROPERTY (${selectedYear})
=======================================================

PART I - SALES OR EXCHANGES OF PROPERTY USED IN A TRADE OR BUSINESS
AND INVOLUNTARY CONVERSIONS FROM OTHER THAN CASUALTY OR THEFT

Note: This form is typically used when selling rental properties.
If you sold any properties in ${selectedYear}, complete this form.

Property Sales Summary:
- No properties sold in ${selectedYear}
- If you sell properties in future years, use this form to report gains/losses

PART II - ORDINARY GAINS AND LOSSES
Line 10: Net gain or (loss) from Form 4797, Part I: $0

PART III - GAIN FROM DISPOSITIONS UNDER CERTAIN NONRECOGNITION SECTIONS
Line 20: Net gain or (loss) from like-kind exchanges: $0
    `

    const blob = new Blob([form4797], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-4797-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadScheduleC = () => {
    if (!taxData) return

    const scheduleC = `
SCHEDULE C - PROFIT OR LOSS FROM BUSINESS (${selectedYear})
==========================================================

Note: This form is used if you operate rental properties as a business.
Most rental activities are reported on Schedule E, not Schedule C.

If you qualify as a real estate professional or have significant rental activities:

PART I - INCOME
Line 1: Gross receipts or sales: ${formatCurrency(taxData.totals.total_rental_income)}
Line 6: Gross income: ${formatCurrency(taxData.totals.total_rental_income)}

PART II - EXPENSES
Line 8: Advertising: $0
Line 9: Car and truck expenses: $0
Line 10: Commissions and fees: $0
Line 11: Contract labor: $0
Line 12: Depreciation and section 179: ${formatCurrency(taxData.totals.total_section_179 + taxData.totals.total_bonus_depreciation)}
Line 13: Employee benefit programs: $0
Line 14: Insurance: ${formatCurrency(taxData.properties.reduce((sum, p) => sum + (p.annual_insurance || 0), 0))}
Line 15: Legal and professional services: $0
Line 16: Office expense: $0
Line 17: Pension and profit-sharing plans: $0
Line 18: Rent or lease: $0
Line 19: Repairs and maintenance: $0
Line 20: Supplies: $0
Line 21: Taxes and licenses: ${formatCurrency(taxData.properties.reduce((sum, p) => sum + (p.annual_property_taxes || 0), 0))}
Line 22: Travel, meals, and entertainment: $0
Line 23: Utilities: $0
Line 24: Wages: $0
Line 25: Other expenses: ${formatCurrency(taxData.properties.reduce((sum, p) => sum + (p.annual_hoa_fees || 0), 0))}
Line 26: Total expenses: ${formatCurrency(taxData.totals.total_expenses + taxData.totals.total_section_179 + taxData.totals.total_bonus_depreciation)}

PART III - COST OF GOODS SOLD
Line 35: Net profit or (loss): ${formatCurrency(taxData.totals.total_net_income)}
    `

    const blob = new Blob([scheduleC], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `schedule-c-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadForm8829 = () => {
    if (!taxData) return

    const form8829 = `
FORM 8829 - EXPENSES FOR BUSINESS USE OF YOUR HOME (${selectedYear})
===================================================================

Note: This form is used if you use part of your home for rental business activities.

PART I - PART OF YOUR HOME USED FOR BUSINESS
Line 1: Area used regularly and exclusively for business: ___ sq ft
Line 2: Total area of your home: ___ sq ft
Line 3: Percentage of home used for business: ___%

PART II - FIGURE YOUR ALLOWABLE DEDUCTION
Line 8: Total expenses for business use of home: $0
Line 9: Limit on expenses for business use of home: $0
Line 10: Allowable expenses for business use of home: $0

PART III - DEPRECIATION OF YOUR HOME
Line 13: Depreciation of your home: $0

PART IV - CARRYOVER OF UNALLOWABLE OFFICE IN THE HOME EXPENSES
Line 15: Carryover from ${selectedYear - 1}: $0

Note: Most rental property owners do not need this form unless they use their personal residence for rental business activities.
    `

    const blob = new Blob([form8829], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `form-8829-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadSchedule1 = () => {
    if (!taxData) return

    const schedule1 = `
SCHEDULE 1 - ADDITIONAL INCOME AND ADJUSTMENTS TO INCOME (${selectedYear})
===========================================================================

PART I - ADDITIONAL INCOME
Line 1: State and local income tax refunds: $0
Line 2: Alimony received: $0
Line 3: Business income or (loss): ${formatCurrency(taxData.totals.total_net_income)}
Line 4: Other gains or (losses): $0
Line 5: Rental real estate, royalties, partnerships, S corporations, trusts, etc.: ${formatCurrency(taxData.totals.total_net_income)}
Line 6: Farm income or (loss): $0
Line 7: Unemployment compensation: $0
Line 8: Other income: $0
Line 9: Total additional income: ${formatCurrency(taxData.totals.total_net_income)}

PART II - ADJUSTMENTS TO INCOME
Line 10: Educator expenses: $0
Line 11: Certain business expenses of reservists, performing artists, and fee-basis government officials: $0
Line 12: Health savings account deduction: $0
Line 13: Moving expenses for members of the Armed Forces: $0
Line 14: Deductible part of self-employment tax: $0
Line 15: Self-employed SEP, SIMPLE, and qualified plans: $0
Line 16: Self-employed health insurance deduction: $0
Line 17: Penalty on early withdrawal of savings: $0
Line 18: Alimony paid: $0
Line 19: IRA deduction: $0
Line 20: Student loan interest deduction: $0
Line 21: Tuition and fees: $0
Line 22: Other adjustments: $0
Line 23: Total adjustments: $0

Line 24: Adjusted gross income: ${formatCurrency(taxData.totals.total_net_income)}
    `

    const blob = new Blob([schedule1], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `schedule-1-${selectedYear}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tax Forms</h1>
          <p className="text-gray-600">Generate tax information for your accountant</p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
          <button
            onClick={generateTaxReport}
            className="btn-primary flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Download Report
          </button>
        </div>
      </div>

      {taxData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Section 179</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(taxData.totals.total_section_179)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Calculator className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bonus Depreciation</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(taxData.totals.total_bonus_depreciation)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <Building2 className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Rental Income</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(taxData.totals.total_rental_income)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-orange-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Net Income</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(taxData.totals.total_net_income)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white rounded-lg shadow">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8 px-6">
                {[
                  { id: 'summary', name: 'Summary', icon: FileText },
                  { id: 'section179', name: 'Section 179', icon: Calculator },
                  { id: 'bonus', name: 'Bonus Depreciation', icon: DollarSign },
                  { id: 'income', name: 'Rental Income', icon: Building2 },
                  { id: 'expenses', name: 'Expenses', icon: Calendar },
                  { id: 'forms', name: 'Tax Forms', icon: ClipboardList }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm ${
                      activeTab === tab.id
                        ? 'border-primary-500 text-primary-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className="h-4 w-4 inline mr-2" />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === 'summary' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Tax Summary for {selectedYear}</h3>
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
                            Bonus Depreciation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rental Income
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Income
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
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.section_179_deduction)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.bonus_depreciation)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.rental_income)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(property.net_rental_income)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'section179' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Section 179 Deductions</h3>
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-800">Section 179 Information</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Section 179 allows you to deduct the full cost of qualifying property in the year it's placed in service, 
                      up to the annual limit. This is especially beneficial for rental properties.
                    </p>
                  </div>
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
                            Section 179 Deduction
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Placed in Service
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Business Use %
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {taxData.properties.filter(p => p.section_179_deduction > 0).map((property, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {property.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.purchase_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(property.section_179_deduction)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatDate(property.placed_in_service_date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {property.business_use_percentage}%
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'bonus' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Bonus Depreciation</h3>
                  <div className="bg-green-50 border border-green-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-green-800">Bonus Depreciation Information</h4>
                    <p className="text-sm text-green-700 mt-1">
                      Bonus depreciation allows for an additional first-year depreciation deduction of 100% for qualifying property 
                      placed in service after September 27, 2017.
                    </p>
                  </div>
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
                            Bonus Depreciation
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Placed in Service
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {taxData.properties.filter(p => p.bonus_depreciation > 0).map((property, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {property.address}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.purchase_price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(property.bonus_depreciation)}
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
              )}

              {activeTab === 'income' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Rental Income Summary</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Rental Income
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Other Expenses
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Net Rental Income
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
                              {formatCurrency(property.rental_income)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.other_expenses)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                              {formatCurrency(property.net_rental_income)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'expenses' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Property Expenses Breakdown</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Property
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Mortgage
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Taxes
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual Insurance
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Annual HOA
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
                              {formatCurrency(property.annual_mortgage_interest)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.annual_property_taxes)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.annual_insurance)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {formatCurrency(property.annual_hoa_fees)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeTab === 'forms' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Required Tax Forms for {selectedYear}</h3>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-yellow-800">Important Information</h4>
                    <p className="text-sm text-yellow-700 mt-1">
                      These forms are required for 100% depreciation and rental property reporting. Always consult with a tax professional 
                      before filing your taxes. The downloadable forms contain pre-filled data based on your property information.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form 4562 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Form 4562</h4>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Required</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Depreciation and Amortization - Used to report Section 179 deductions and bonus depreciation.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Section 179 Deduction:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_section_179)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Bonus Depreciation:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_bonus_depreciation)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadForm4562}
                          className="btn-primary flex items-center gap-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <a
                          href="https://www.irs.gov/forms-pubs/about-form-4562"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          IRS Form
                        </a>
                      </div>
                    </div>

                    {/* Schedule E */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Schedule E</h4>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Required</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Supplemental Income and Loss - Used to report rental income and expenses.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Rental Income:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_rental_income)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Net Income:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_net_income)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadScheduleE}
                          className="btn-primary flex items-center gap-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <a
                          href="https://www.irs.gov/forms-pubs/about-schedule-e-form-1040"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          IRS Form
                        </a>
                      </div>
                    </div>

                    {/* Form 4797 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Form 4797</h4>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded">If Applicable</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Sales of Business Property - Used when selling rental properties or reporting gains/losses.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Properties Sold:</span>
                          <span className="font-medium">0</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Gains/Losses:</span>
                          <span className="font-medium">$0</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadForm4797}
                          className="btn-primary flex items-center gap-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <a
                          href="https://www.irs.gov/forms-pubs/about-form-4797"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          IRS Form
                        </a>
                      </div>
                    </div>

                    {/* Schedule C */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Schedule C</h4>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">Optional</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Profit or Loss From Business - Used if operating rentals as a business (not typical).
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Business Income:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_rental_income)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Net Profit:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_net_income)}</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadScheduleC}
                          className="btn-primary flex items-center gap-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <a
                          href="https://www.irs.gov/forms-pubs/about-schedule-c-form-1040"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          IRS Form
                        </a>
                      </div>
                    </div>

                    {/* Form 8829 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Form 8829</h4>
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">Rarely Needed</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Expenses for Business Use of Your Home - Used if using personal residence for rental business.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Home Office Use:</span>
                          <span className="font-medium">Not Applicable</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Deduction:</span>
                          <span className="font-medium">$0</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadForm8829}
                          className="btn-primary flex items-center gap-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <a
                          href="https://www.irs.gov/forms-pubs/about-form-8829"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          IRS Form
                        </a>
                      </div>
                    </div>

                    {/* Schedule 1 */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-900">Schedule 1</h4>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">Required</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-4">
                        Additional Income and Adjustments - Used to report rental income on Form 1040.
                      </p>
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Additional Income:</span>
                          <span className="font-medium">{formatCurrency(taxData.totals.total_net_income)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Adjustments:</span>
                          <span className="font-medium">$0</span>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={downloadSchedule1}
                          className="btn-primary flex items-center gap-2 text-sm"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                        <a
                          href="https://www.irs.gov/forms-pubs/about-schedule-1-form-1040"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-secondary flex items-center gap-2 text-sm"
                        >
                          <ExternalLink className="h-4 w-4" />
                          IRS Form
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                    <h4 className="text-sm font-medium text-blue-800">100% Depreciation Information</h4>
                    <div className="text-sm text-blue-700 mt-2 space-y-1">
                      <p><strong>Section 179:</strong> Allows immediate deduction of up to $1,160,000 (2023) for qualifying property.</p>
                      <p><strong>Bonus Depreciation:</strong> Provides 100% first-year depreciation for property placed in service after 9/27/2017.</p>
                      <p><strong>Qualifying Property:</strong> Rental properties, improvements, and certain personal property used in rental business.</p>
                      <p><strong>Important:</strong> Always consult with a tax professional to ensure proper application of these deductions.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TaxForms 