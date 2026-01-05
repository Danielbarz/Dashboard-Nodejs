import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import AdminModeRoute from './components/AdminModeRoute'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Analysis from './pages/Analysis'
import History from './pages/History'
import Reports from './pages/Reports'
import Connectivity from './pages/Connectivity'
import Tambahan from './pages/Tambahan'
import DATIN from './pages/DATIN'
import HSI from './pages/HSI'
import FlowProcessHSI from './pages/FlowProcessHSI'
import ReportDigPro from './pages/ReportDigPro'
import ReportsHSI from './pages/ReportsHSI'
import ReportsDatin from './pages/ReportsDatin'
import ReportsTambahan from './pages/ReportsTambahan'
import AdminUsers from './pages/AdminUsers'
import AdminRollback from './pages/AdminRollback'
import MasterDataPO from './pages/MasterDataPO'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analysis"
            element={
              <ProtectedRoute>
                <Analysis />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <History />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <AdminModeRoute>
                <Reports />
              </AdminModeRoute>
            }
          />
          <Route
            path="/connectivity"
            element={
              <ProtectedRoute>
                <Connectivity />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tambahan"
            element={
              <ProtectedRoute>
                <Tambahan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/datin"
            element={
              <ProtectedRoute>
                <DATIN />
              </ProtectedRoute>
            }
          />
          <Route
            path="/hsi"
            element={
              <ProtectedRoute>
                <HSI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/flow-process-hsi"
            element={
              <ProtectedRoute>
                <FlowProcessHSI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report-digpro"
            element={
              <ProtectedRoute>
                <ReportDigPro />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports-hsi"
            element={
              <ProtectedRoute>
                <ReportsHSI />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports-datin"
            element={
              <ProtectedRoute>
                <ReportsDatin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports-tambahan"
            element={
              <ProtectedRoute>
                <ReportsTambahan />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminModeRoute superOnly>
                <AdminUsers />
              </AdminModeRoute>
            }
          />
          <Route
            path="/admin/rollback"
            element={
              <AdminModeRoute superOnly>
                <AdminRollback />
              </AdminModeRoute>
            }
          />
          <Route
            path="/admin/master-po"
            element={
              <AdminModeRoute>
                <MasterDataPO />
              </AdminModeRoute>
            }
          />
          <Route path="/" element={<Navigate to="/analysis" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
