// Mock data for the real estate tracker app
export const mockDashboardData = {
  overview: {
    total_portfolio_value: 2500000,
    total_purchase_value: 1800000,
    total_appreciation: 700000,
    total_properties: 5,
    rental_properties: 4,
    vacant_properties: 1,
    monthly_income: 8500,
    monthly_expenses: 3200,
    net_monthly_cashflow: 5300,
    properties: [
      {
        id: 1,
        address: "123 Main St, City, ST",
        property_type: "Single Family",
        current_value: 450000,
        purchase_price: 380000,
        appreciation: 70000,
        status: "Rented",
        monthly_rent: 2200
      },
      {
        id: 2,
        address: "456 Oak Ave, City, ST",
        property_type: "Townhouse",
        current_value: 380000,
        purchase_price: 320000,
        appreciation: 60000,
        status: "Rented",
        monthly_rent: 1900
      },
      {
        id: 3,
        address: "789 Pine Rd, City, ST",
        property_type: "Condo",
        current_value: 280000,
        purchase_price: 250000,
        appreciation: 30000,
        status: "Rented",
        monthly_rent: 1600
      },
      {
        id: 4,
        address: "321 Elm St, City, ST",
        property_type: "Single Family",
        current_value: 520000,
        purchase_price: 450000,
        appreciation: 70000,
        status: "Rented",
        monthly_rent: 2400
      },
      {
        id: 5,
        address: "654 Maple Dr, City, ST",
        property_type: "Duplex",
        current_value: 370000,
        purchase_price: 300000,
        appreciation: 70000,
        status: "Vacant",
        monthly_rent: 0
      }
    ]
  },
  properties: [
    {
      id: 1,
      address: "123 Main St, City, ST",
      property_type: "Single Family",
      purchase_price: 380000,
      current_value: 450000,
      purchase_date: "2020-03-15",
      monthly_rent: 2200,
      status: "Rented",
      tenant: "John Smith",
      lease_end: "2024-12-31"
    },
    {
      id: 2,
      address: "456 Oak Ave, City, ST",
      property_type: "Townhouse",
      purchase_price: 320000,
      current_value: 380000,
      purchase_date: "2021-06-20",
      monthly_rent: 1900,
      status: "Rented",
      tenant: "Sarah Johnson",
      lease_end: "2024-08-31"
    },
    {
      id: 3,
      address: "789 Pine Rd, City, ST",
      property_type: "Condo",
      purchase_price: 250000,
      current_value: 280000,
      purchase_date: "2022-01-10",
      monthly_rent: 1600,
      status: "Rented",
      tenant: "Mike Davis",
      lease_end: "2024-10-31"
    },
    {
      id: 4,
      address: "321 Elm St, City, ST",
      property_type: "Single Family",
      purchase_price: 450000,
      current_value: 520000,
      purchase_date: "2019-11-05",
      monthly_rent: 2400,
      status: "Rented",
      tenant: "Lisa Wilson",
      lease_end: "2025-02-28"
    },
    {
      id: 5,
      address: "654 Maple Dr, City, ST",
      property_type: "Duplex",
      purchase_price: 300000,
      current_value: 370000,
      purchase_date: "2023-04-12",
      monthly_rent: 0,
      status: "Vacant",
      tenant: null,
      lease_end: null
    }
  ],
  transactions: [
    {
      id: 1,
      property_id: 1,
      type: "income",
      category: "rent",
      amount: 2200,
      date: "2024-01-01",
      description: "Monthly rent payment"
    },
    {
      id: 2,
      property_id: 1,
      type: "expense",
      category: "maintenance",
      amount: 150,
      date: "2024-01-05",
      description: "Plumbing repair"
    },
    {
      id: 3,
      property_id: 2,
      type: "income",
      category: "rent",
      amount: 1900,
      date: "2024-01-01",
      description: "Monthly rent payment"
    },
    {
      id: 4,
      property_id: 3,
      type: "income",
      category: "rent",
      amount: 1600,
      date: "2024-01-01",
      description: "Monthly rent payment"
    },
    {
      id: 5,
      property_id: 4,
      type: "income",
      category: "rent",
      amount: 2400,
      date: "2024-01-01",
      description: "Monthly rent payment"
    }
  ],
  depreciation: [
    {
      id: 1,
      property_id: 1,
      year: 2024,
      building_value: 300000,
      land_value: 150000,
      depreciation_rate: 0.03636,
      annual_depreciation: 10908,
      accumulated_depreciation: 32724
    },
    {
      id: 2,
      property_id: 2,
      year: 2024,
      building_value: 250000,
      land_value: 130000,
      depreciation_rate: 0.03636,
      annual_depreciation: 9090,
      accumulated_depreciation: 18180
    }
  ],
  taxForms: {
    2024: {
      properties: [
        {
          id: 1,
          address: "123 Main St, City, ST",
          purchase_price: 380000,
          section_179_deduction: 1000000, // Section 179 limit
          bonus_depreciation: 0, // No bonus depreciation when using Section 179
          rental_income: 26400,
          net_rental_income: 18000,
          placed_in_service_date: "2024-03-15",
          business_use_percentage: 100,
          annual_insurance: 1200,
          annual_mortgage_interest: 18000,
          annual_property_taxes: 3800,
          annual_hoa_fees: 0
        },
        {
          id: 2,
          address: "456 Oak Ave, City, ST",
          purchase_price: 320000,
          section_179_deduction: 320000,
          bonus_depreciation: 0,
          rental_income: 22800,
          net_rental_income: 15000,
          placed_in_service_date: "2024-06-20",
          business_use_percentage: 100,
          annual_insurance: 1000,
          annual_mortgage_interest: 15000,
          annual_property_taxes: 3200,
          annual_hoa_fees: 2400
        },
        {
          id: 3,
          address: "789 Pine Rd, City, ST",
          purchase_price: 250000,
          section_179_deduction: 250000,
          bonus_depreciation: 0,
          rental_income: 19200,
          net_rental_income: 12000,
          placed_in_service_date: "2024-01-10",
          business_use_percentage: 100,
          annual_insurance: 800,
          annual_mortgage_interest: 12000,
          annual_property_taxes: 2500,
          annual_hoa_fees: 3600
        },
        {
          id: 4,
          address: "321 Elm St, City, ST",
          purchase_price: 450000,
          section_179_deduction: 450000,
          bonus_depreciation: 0,
          rental_income: 28800,
          net_rental_income: 20000,
          placed_in_service_date: "2024-11-05",
          business_use_percentage: 100,
          annual_insurance: 1500,
          annual_mortgage_interest: 22000,
          annual_property_taxes: 4500,
          annual_hoa_fees: 0
        },
        {
          id: 5,
          address: "654 Maple Dr, City, ST",
          purchase_price: 300000,
          section_179_deduction: 300000,
          bonus_depreciation: 0,
          rental_income: 0,
          net_rental_income: -5000,
          placed_in_service_date: "2024-04-12",
          business_use_percentage: 100,
          annual_insurance: 1200,
          annual_mortgage_interest: 15000,
          annual_property_taxes: 3000,
          annual_hoa_fees: 0
        }
      ],
      totals: {
        total_purchase_price: 1700000,
        total_section_179: 2320000, // Exceeds limit, will be capped
        total_bonus_depreciation: 0,
        total_rental_income: 97200,
        total_net_income: 60000
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
        "✓ Properties placed in service in 2024",
        "✓ Business use percentage 100%",
        "✓ Section 179 election made",
        "✓ Total cost under $2,700,000 limit",
        "✓ No personal use of properties",
        "✓ Proper documentation maintained",
        "✓ Tax professional consultation recommended"
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