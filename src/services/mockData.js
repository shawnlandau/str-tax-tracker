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
  ]
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
  }
} 