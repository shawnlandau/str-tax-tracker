// Mock data for the real estate tracker app
export const mockDashboardData = {
  overview: {
    total_portfolio_value: 0,
    total_purchase_value: 0,
    total_appreciation: 0,
    total_properties: 0,
    rental_properties: 0,
    vacant_properties: 0,
    monthly_income: 0,
    monthly_expenses: 0,
    net_monthly_cashflow: 0,
    properties: []
  },
  properties: [],
  transactions: [],
  depreciation: [],
  taxForms: {
    2024: {
      properties: [],
      totals: {
        total_purchase_price: 0,
        total_section_179: 0,
        total_bonus_depreciation: 0,
        total_rental_income: 0,
        total_net_income: 0
      },
      forms_needed: [
        "Form 4562 - Depreciation and Amortization",
        "Schedule E - Supplemental Income and Loss",
        "Form 4797 - Sales of Business Property (if applicable)",
        "Form 8829 - Expenses for Business Use of Home (if applicable)",
        "Schedule 1 - Additional Income and Adjustments to Income",
        "Form 1040 - Individual Income Tax Return"
      ],
      compliance_checklist: [
        "No properties added yet",
        "Add properties to enable Section 179",
        "Enter property details for depreciation",
        "Add rental income data",
        "Complete business use documentation",
        "Consult with tax professional"
      ]
    }
  }
}

export const mockApiService = {
  async getDashboardOverview() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return mockDashboardData.overview
  },

  async getProperties() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDashboardData.properties
  },

  async getProperty(id) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDashboardData.properties.find(p => p.id === parseInt(id))
  },

  async getTransactions() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDashboardData.transactions
  },

  async getDepreciation() {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDashboardData.depreciation
  },

  async getPropertyTransactions(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDashboardData.transactions.filter(t => t.property_id === parseInt(propertyId))
  },

  async getPropertyDepreciation(propertyId) {
    await new Promise(resolve => setTimeout(resolve, 200))
    return mockDashboardData.depreciation.filter(d => d.property_id === parseInt(propertyId))
  },

  async getTaxFormsData(year) {
    await new Promise(resolve => setTimeout(resolve, 400))
    return mockDashboardData.taxForms[year] || mockDashboardData.taxForms[2024]
  },

  async getTaxSummary(year) {
    await new Promise(resolve => setTimeout(resolve, 300))
    return mockDashboardData.taxForms[year] || mockDashboardData.taxForms[2024]
  }
} 