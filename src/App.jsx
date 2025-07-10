import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Depreciation from './pages/Depreciation'
import TaxForms from './pages/TaxForms'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/depreciation" element={<Depreciation />} />
        <Route path="/tax-forms" element={<TaxForms />} />
      </Routes>
    </Layout>
  )
}

export default App 