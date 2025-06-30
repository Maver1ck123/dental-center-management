import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box, CircularProgress } from '@mui/material';
import theme from './theme/theme';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/Layout/ProtectedRoute';
import Login from './components/Auth/Login';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Incidents from './pages/Incidents';
import Calendar from './pages/Calendar';
import PatientView from './pages/PatientView';

const AppRoutes = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={!user ? <Login /> : <Navigate to={user?.role === 'Admin' ? '/dashboard' : '/patient-view'} />} />
      <Route 
        path="/*" 
        element={
          user ? (
            <MainLayout />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route path="dashboard" element={<ProtectedRoute adminOnly><Dashboard /></ProtectedRoute>} />
        <Route path="patients" element={<ProtectedRoute adminOnly><Patients /></ProtectedRoute>} />
        <Route path="incidents" element={<ProtectedRoute adminOnly><Incidents /></ProtectedRoute>} />
        <Route path="calendar" element={<ProtectedRoute adminOnly><Calendar /></ProtectedRoute>} />
        <Route path="patient-view" element={<ProtectedRoute><PatientView /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to={user?.role === 'Admin' ? '/dashboard' : '/patient-view'} replace />} />
      </Route>
    </Routes>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <BrowserRouter>
          <AuthProvider>
            <DataProvider>
              <AppRoutes />
            </DataProvider>
          </AuthProvider>
        </BrowserRouter>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
