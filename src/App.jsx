import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Properties from './pages/Properties'
import Transactions from './pages/Transactions'
import MaterialParticipation from './pages/MaterialParticipation'
import Depreciation from './pages/Depreciation'
import TaxForms from './pages/TaxForms'
import DataManager from './components/DataManager'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/properties" element={<Properties />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/material-participation" element={<MaterialParticipation />} />
        <Route path="/depreciation" element={<Depreciation />} />
        <Route path="/tax-forms" element={<TaxForms />} />
        <Route path="/data-manager" element={<DataManager />} />
      </Routes>
    </Layout>
  )
}

export default App 