import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  TextField, 
  Button, 
  Container, 
  Box, 
  Typography, 
  Paper, 
  Alert,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import { 
  MedicalServices, 
  Person, 
  Lock 
} from '@mui/icons-material';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loggedInUser = login(email, password);
      if (loggedInUser) {
        navigate(loggedInUser.role === 'Admin' ? '/dashboard' : '/patient-view');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = (userType) => {
    if (userType === 'admin') {
      setEmail('admin@entnt.in');
      setPassword('admin123');
    } else {
      setEmail('john@entnt.in');
      setPassword('patient123');
    }
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        p: 2
      }}
    >
      <Container maxWidth="sm">
        <Paper elevation={10} sx={{ borderRadius: 3 }}>
          <Box sx={{ p: 4 }}>
            {/* Header */}
            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Box 
                sx={{
                  width: 80,
                  height: 80,
                  backgroundColor: 'primary.main',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2
                }}
              >
                <MedicalServices sx={{ fontSize: 40, color: 'white' }} />
              </Box>
              <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
                Dental Center
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" textAlign="center">
                Management System
              </Typography>
            </Box>

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <Person sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />
              
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                margin="normal"
                required
                InputProps={{
                  startAdornment: <Lock sx={{ mr: 1, color: 'text.secondary' }} />
                }}
              />

              {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, height: 48 }}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Demo Accounts
              </Typography>
            </Divider>

            {/* Demo Login Options */}
            <Box display="flex" gap={2}>
              <Card variant="outlined" sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleDemoLogin('admin')}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="subtitle2" color="primary" gutterBottom>
                    Admin/Dentist
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    admin@entnt.in
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Full access
                  </Typography>
                </CardContent>
              </Card>

              <Card variant="outlined" sx={{ flex: 1, cursor: 'pointer' }} onClick={() => handleDemoLogin('patient')}>
                <CardContent sx={{ textAlign: 'center', py: 2 }}>
                  <Typography variant="subtitle2" color="secondary" gutterBottom>
                    Patient
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    john@entnt.in
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Limited view
                  </Typography>
                </CardContent>
              </Card>
            </Box>

            {/* Footer */}
            <Box textAlign="center" mt={3}>
              <Typography variant="caption" color="text.secondary">
                ENTNT Technical Assignment - Dental Center Management
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}
