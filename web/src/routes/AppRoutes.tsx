// LEAF - Application Router

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { AppShell } from '../components/layout/AppShell';
import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import PatientsPage from '../pages/PatientsPage';
import PatientProfilePage from '../pages/PatientProfilePage';
import NewAssessmentPage from '../pages/NewAssessmentPage';
import AssessmentDetailPage from '../pages/AssessmentDetailPage';
import ComparePage from '../pages/ComparePage';
import AssessmentsPage from '../pages/AssessmentsPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <AppShell>{children}</AppShell>;
}

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />

      {/* Protected */}
      <Route path="/dashboard"    element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/patients"     element={<ProtectedRoute><PatientsPage /></ProtectedRoute>} />
      <Route path="/patients/:patientId" element={<ProtectedRoute><PatientProfilePage /></ProtectedRoute>} />
      <Route path="/patients/:patientId/assessments/:assessmentId" element={<ProtectedRoute><AssessmentDetailPage /></ProtectedRoute>} />
      <Route path="/patients/:patientId/compare" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />
      <Route path="/patients/:patientId/history" element={<ProtectedRoute><ComparePage /></ProtectedRoute>} />

      {/* New top-level routes */}
      <Route path="/assessments"     element={<ProtectedRoute><AssessmentsPage /></ProtectedRoute>} />
      <Route path="/assessments/new" element={<ProtectedRoute><NewAssessmentPage /></ProtectedRoute>} />
      <Route path="/reports"         element={<ProtectedRoute><ReportsPage /></ProtectedRoute>} />
      <Route path="/settings"        element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />

      {/* Redirects */}
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}
