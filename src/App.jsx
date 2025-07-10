import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Depreciation from './pages/Depreciation'
import TaxForms from './pages/TaxForms'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/properties" element={<Properties />} />
          <Route path="/depreciation" element={<Depreciation />} />
          <Route path="/tax-forms" element={<TaxForms />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App 