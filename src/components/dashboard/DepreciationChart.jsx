import { useState, useEffect } from 'react'
import { Line } from 'react-chartjs-2'
import { X, Calculator, TrendingDown, Calendar, Building2 } from 'lucide-react'
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
import api from '../../services/api'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const DepreciationChart = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedYear, setSelectedYear] = useState(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    loadDepreciationData()
  }, [])

  const loadDepreciationData = async () => {
    try {
      setLoading(true)
      const depreciationData = await api.getDepreciationChart()
      setData(depreciationData)
    } catch (error) {
      console.error('Error loading depreciation data:', error)
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

  const YearDetailsModal = ({ yearData, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{yearData.year} Depreciation Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="card">
              <div className="flex items-center">
                <Calculator className="h-6 w-6 text-primary-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-700">Straight Line</h3>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(yearData.straight_line_total)}
                  </p>
                </div>
              </div>
            </div>
            <div className="card">
              <div className="flex items-center">
                <TrendingDown className="h-6 w-6 text-warning-600 mr-2" />
                <div>
                  <h3 className="font-semibold text-gray-700">Bonus Depreciation</h3>
                  <p className="text-2xl font-bold text-warning-600">
                    {formatCurrency(yearData.bonus_depreciation_total)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <Calculator className="h-6 w-6 text-success-600 mr-2" />
              <div>
                <h3 className="font-semibold text-gray-700">Total Depreciation</h3>
                <p className="text-2xl font-bold text-success-600">
                  {formatCurrency(yearData.total_depreciation)}
                </p>
              </div>
            </div>
          </div>

          {yearData.properties && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Property Breakdown</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {yearData.properties.map((property, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="font-medium">{property.address}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-success-600 font-bold">
                        {formatCurrency(property.depreciation)}
                      </div>
                      <div className="text-sm text-gray-600">
                        {property.depreciation_type || 'Straight Line'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {yearData.section_179_breakdown && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Section 179 Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(yearData.section_179_breakdown).map(([property, amount]) => (
                  <div key={property} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{property}</span>
                    <span className="text-warning-600 font-bold">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {yearData.bonus_breakdown && (
            <div className="card">
              <h3 className="font-semibold text-gray-700 mb-2">Bonus Depreciation Breakdown</h3>
              <div className="space-y-2">
                {Object.entries(yearData.bonus_breakdown).map(([property, amount]) => (
                  <div key={property} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                    <span className="font-medium">{property}</span>
                    <span className="text-warning-600 font-bold">
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const chartData = {
    labels: data.map(item => item.year).reverse(),
    datasets: [
      {
        label: 'Straight Line',
        data: data.map(item => item.straight_line_total).reverse(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Bonus Depreciation',
        data: data.map(item => item.bonus_depreciation_total).reverse(),
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.1,
      },
      {
        label: 'Total Depreciation',
        data: data.map(item => item.total_depreciation).reverse(),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
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
        const yearData = data[data.length - 1 - index] // Reverse the index since data is reversed
        setSelectedYear(yearData)
        setShowModal(true)
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length ? 'pointer' : 'default'
    }
  }

  return (
    <>
      <div className="h-64">
        <Line data={chartData} options={options} />
      </div>
      <p className="text-sm text-gray-500 mt-2 text-center">
        Click on any data point to view detailed depreciation breakdown
      </p>
      
      {showModal && selectedYear && (
        <YearDetailsModal yearData={selectedYear} onClose={() => setShowModal(false)} />
      )}
    </>
  )
}

export default DepreciationChart 