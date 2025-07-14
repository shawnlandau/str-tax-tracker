import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { apiService } from '../services/api'
import PortfolioOverview from '../components/dashboard/PortfolioOverview'
import DepreciationChart from '../components/dashboard/DepreciationChart'
import {
  Plus,
  Building2,
  TrendingUp,
  Calculator,
  FileText,
  Clock,
  DollarSign,
  Calendar,
  AlertTriangle
} from 'lucide-react'

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await apiService.getDashboardData()
        setDashboardData(data)
      } catch (err) {
        setError('Failed to load dashboard data')
        console.error('Dashboard error:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const dashboardCards = [
    {
      title: 'Properties',
      value: dashboardData?.totalProperties || 0,
      change: '+0',
      changeType: 'positive',
      icon: Building2,
      color: 'bg-blue-500',
      href: '/properties'
    },
    {
      title: 'Total Revenue',
      value: formatCurrency(dashboardData?.totalRevenue || 0),
      change: '+0%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-green-500',
      href: '/properties'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(dashboardData?.totalExpenses || 0),
      change: '+0%',
      changeType: 'negative',
      icon: Clock,
      color: 'bg-orange-500',
      href: '/properties'
    },
    {
      title: 'Net Income',
      value: formatCurrency(dashboardData?.netIncome || 0),
      change: '+0%',
      changeType: dashboardData?.netIncome >= 0 ? 'positive' : 'negative',
      icon: TrendingUp,
      color: 'bg-emerald-500',
      href: '/properties'
    },
    {
      title: 'Total Bookings',
      value: dashboardData?.totalBookings || 0,
      change: '+0%',
      changeType: 'positive',
      icon: DollarSign,
      color: 'bg-purple-500',
      href: '/properties'
    },
    {
      title: 'Depreciation',
      value: formatCurrency(dashboardData?.totalDepreciation || 0),
      change: '+0%',
      changeType: 'positive',
      icon: Calculator,
      color: 'bg-indigo-500',
      href: '/depreciation'
    },
    {
      title: 'Tax Forms',
      value: 'Ready',
      change: '100% Compliance',
      changeType: 'positive',
      icon: FileText,
      color: 'bg-teal-500',
      href: '/tax-forms'
    }
  ]

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Track your real estate portfolio performance and tax compliance</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
        {dashboardCards.map((card, index) => (
          <div
            key={index}
            onClick={() => navigate(card.href)}
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.color}`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="mt-4">
              <span className={`text-sm font-medium ${
                card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.change}
              </span>
              <span className="text-sm text-gray-600 ml-1">from last month</span>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
        {dashboardData?.properties && dashboardData.properties.length > 0 ? (
          <div className="space-y-4">
            {dashboardData.properties.slice(0, 5).map((property, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center">
                  <Building2 className="h-5 w-5 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">{property.address}</p>
                    <p className="text-sm text-gray-600">{property.property_type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">{formatCurrency(property.current_value || 0)}</p>
                  <p className="text-sm text-gray-600">{property.status}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No properties added yet</p>
            <button 
              onClick={() => navigate('/properties')}
              className="mt-2 text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first property
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Dashboard 