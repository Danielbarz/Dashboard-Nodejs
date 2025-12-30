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
import ReportsAnalysis from './pages/ReportsAnalysis'
import ReportsHSI from './pages/ReportsHSI'
import ReportsDatin from './pages/ReportsDatin'
import ReportsTambahan from './pages/ReportsTambahan'
import AdminUsers from './pages/AdminUsers'
import AdminRollback from './pages/AdminRollback'

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
            path="/reports-analysis"
            element={
              <AdminModeRoute>
                <ReportsAnalysis />
              </AdminModeRoute>
            }
          />
          <Route
            path="/reports-hsi"
            element={
              <AdminModeRoute>
                <ReportsHSI />
              </AdminModeRoute>
            }
          />
          <Route
            path="/reports-datin"
            element={
              <AdminModeRoute>
                <ReportsDatin />
              </AdminModeRoute>
            }
          />
          <Route
            path="/reports-tambahan"
            element={
              <AdminModeRoute>
                <ReportsTambahan />
              </AdminModeRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminModeRoute>
                <AdminUsers />
              </AdminModeRoute>
            }
          />
          <Route
            path="/admin/rollback"
            element={
              <AdminModeRoute>
                <AdminRollback />
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
