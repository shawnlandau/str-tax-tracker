import { useState } from 'react'
import { Bar } from 'react-chartjs-2'
import { X, Building2, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

const PropertyPerformanceChart = ({ data }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const chartData = {
    labels: data.map(property => property.address.substring(0, 20) + (property.address.length > 20 ? '...' : '')),
    datasets: [
      {
        label: 'Net Cash Flow',
        data: data.map(property => property.net_cash_flow),
        backgroundColor: data.map(property => 
          property.net_cash_flow >= 0 ? 'rgba(34, 197, 94, 0.8)' : 'rgba(239, 68, 68, 0.8)'
        ),
        borderColor: data.map(property => 
          property.net_cash_flow >= 0 ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)'
        ),
        borderWidth: 1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Net Cash Flow: $${context.parsed.y.toLocaleString()}`
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString()
          }
        }
      },
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 45,
        }
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index
        setSelectedProperty(data[index])
        setShowModal(true)
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
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

  const PropertyDetailsModal = ({ property, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Property Performance Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="card">
            <div className="flex items-center mb-2">
              <Building2 className="h-6 w-6 text-primary-600 mr-2" />
              <h3 className="font-semibold text-gray-700">{property.address}</h3>
            </div>
            <p className="text-sm text-gray-600">{property.property_type}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-success-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-700">Total Income</h3>
                  <p className="text-2xl font-bold text-success-600">
                    {formatCurrency(property.total_income)}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <TrendingDown className="h-6 w-6 text-danger-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-700">Total Expenses</h3>
                  <p className="text-2xl font-bold text-danger-600">
                    {formatCurrency(property.total_expenses)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <DollarSign className="h-6 w-6 text-primary-600 mr-2" />
              <div>
                <h3 className="font-semibold text-gray-700">Net Cash Flow</h3>
                <p className={`text-2xl font-bold ${property.net_cash_flow >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {formatCurrency(property.net_cash_flow)}
                </p>
              </div>
            </div>
          </div>

          {property.monthly_breakdown && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Monthly Breakdown</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {Object.entries(property.monthly_breakdown).map(([month, data]) => (
                  <div key={month} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium">{month}</span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${data.net_cash_flow >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                        {formatCurrency(data.net_cash_flow)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Income: {formatCurrency(data.income)} | Expenses: {formatCurrency(data.expenses)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {property.occupancy_rate !== undefined && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Occupancy Rate</h3>
              <div className="flex items-center">
                <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                  <div 
                    className="bg-primary-600 h-2 rounded-full" 
                    style={{ width: `${property.occupancy_rate}%` }}
                  ></div>
                </div>
                <span className="font-bold text-primary-600">{property.occupancy_rate}%</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return (
    <>
      <div className="h-64">
        <Bar data={chartData} options={options} />
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Click on any bar to view detailed property performance
      </p>
      
      {showModal && selectedProperty && (
        <PropertyDetailsModal property={selectedProperty} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

export default PropertyPerformanceChart 