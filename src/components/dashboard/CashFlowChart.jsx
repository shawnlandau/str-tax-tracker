import { useState } from 'react'
import { Line } from 'react-chartjs-2'
import { X, DollarSign, TrendingUp, TrendingDown } from 'lucide-react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const CashFlowChart = ({ data }) => {
  const [selectedMonth, setSelectedMonth] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ]

  const chartData = {
    labels: months,
    datasets: [
      {
        label: 'Income',
        data: months.map((_, index) => {
          const monthData = data.find(d => d.month === index + 1)
          return monthData ? monthData.income : 0
        }),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: months.map((_, index) => {
          const monthData = data.find(d => d.month === index + 1)
          return monthData ? monthData.expenses : 0
        }),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.1,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`
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
      }
    },
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const index = elements[0].index
        const monthData = data.find(d => d.month === index + 1)
        if (monthData) {
          setSelectedMonth({ ...monthData, monthName: months[index] })
          setShowModal(true)
        }
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

  const MonthlyDetailsModal = ({ monthData, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{monthData.monthName} Cash Flow Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center">
                <TrendingUp className="h-6 w-6 text-success-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-700">Total Income</h3>
                  <p className="text-2xl font-bold text-success-600">
                    {formatCurrency(monthData.income)}
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
                    {formatCurrency(monthData.expenses)}
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
                <p className={`text-2xl font-bold ${monthData.income - monthData.expenses >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                  {formatCurrency(monthData.income - monthData.expenses)}
                </p>
              </div>
            </div>
          </div>

          {monthData.breakdown && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Income Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(monthData.breakdown.income || {}).map(([source, amount]) => (
                  <div key={source} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{source.replace('_', ' ')}</span>
                    <span className="text-success-600 font-bold">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {monthData.breakdown && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Expense Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(monthData.breakdown.expenses || {}).map(([category, amount]) => (
                  <div key={category} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{category.replace('_', ' ')}</span>
                    <span className="text-danger-600 font-bold">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
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
        <Line data={chartData} options={options} />
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Click on any data point to view detailed breakdown
      </p>
      
      {showModal && selectedMonth && (
        <MonthlyDetailsModal monthData={selectedMonth} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

export default CashFlowChart 