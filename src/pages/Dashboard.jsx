import React from 'react';
import { 
  Grid, 
  Typography, 
  Box, 
  Card, 
  CardContent, 
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  LinearProgress,
  Paper
} from '@mui/material';
import { 
  People, 
  CalendarToday, 
  AttachMoney, 
  CheckCircle,
  TrendingUp,
  Schedule,
  Warning
} from '@mui/icons-material';
import KPICard from '../components/Dashboard/KPICard';
import NextAppointments from '../components/Dashboard/NextAppointments';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

export default function Dashboard() {
  const { 
    patients, 
    incidents, 
    getUpcomingAppointments, 
    getTotalRevenue, 
    getPatientStats, 
    getStatusCounts 
  } = useData();

  const upcomingAppointments = getUpcomingAppointments(10);
  const totalRevenue = getTotalRevenue();
  const patientStats = getPatientStats();
  const statusCounts = getStatusCounts();
  const topPatients = patientStats.slice(0, 5);

  // Calculate additional metrics
  const todayAppointments = incidents.filter(incident => {
    const appointmentDate = new Date(incident.appointmentDate);
    const today = new Date();
    return appointmentDate.toDateString() === today.toDateString();
  });

  const thisMonthRevenue = incidents
    .filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      const now = new Date();
      return appointmentDate.getMonth() === now.getMonth() && 
             appointmentDate.getFullYear() === now.getFullYear() &&
             incident.status === 'Completed';
    })
    .reduce((sum, incident) => sum + (incident.cost || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Scheduled': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Welcome back! Here's what's happening at your dental center today.
        </Typography>
      </Box>
      
      <Grid container spacing={3}>
        {/* Enhanced KPI Cards */}
        <Grid item xs={12} sm={6} lg={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {patients.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Total Patients
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <People fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {todayAppointments.length}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Today's Appointments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CalendarToday fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    ${thisMonthRevenue.toLocaleString()}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    This Month Revenue
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <TrendingUp fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} lg={3}>
          <Card 
            sx={{ 
              background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
              color: 'white',
              height: '100%'
            }}
          >
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" fontWeight="bold">
                    {statusCounts.Completed || 0}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    Completed Treatments
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                  <CheckCircle fontSize="large" />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Treatment Status Overview */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Treatment Status Overview
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" sx={{ p: 2 }}>
                    <Typography variant="h3" color="warning.main" fontWeight="bold">
                      {statusCounts.Pending || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Pending
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={((statusCounts.Pending || 0) / incidents.length) * 100} 
                      color="warning"
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" sx={{ p: 2 }}>
                    <Typography variant="h3" color="success.main" fontWeight="bold">
                      {statusCounts.Completed || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Completed
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={((statusCounts.Completed || 0) / incidents.length) * 100} 
                      color="success"
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Box textAlign="center" sx={{ p: 2 }}>
                    <Typography variant="h3" color="info.main" fontWeight="bold">
                      {statusCounts.Scheduled || 0}
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Scheduled
                    </Typography>
                    <LinearProgress 
                      variant="determinate" 
                      value={((statusCounts.Scheduled || 0) / incidents.length) * 100} 
                      color="info"
                      sx={{ mt: 1, height: 8, borderRadius: 4 }}
                    />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Patients */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Top Patients
              </Typography>
              <List>
                {topPatients.length > 0 ? (
                  topPatients.map((stat, index) => (
                    <ListItem key={stat.patient?.id} divider={index < topPatients.length - 1}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          {stat.patient?.name?.charAt(0) || '?'}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={stat.patient?.name || 'Unknown'}
                        secondary={`${stat.appointmentCount} appointments`}
                      />
                      <Chip 
                        label={`#${index + 1}`} 
                        size="small" 
                        color="primary" 
                        variant="outlined"
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                    No patient data available
                  </Typography>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>

        {/* Today's Appointments */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  Today's Schedule
                </Typography>
                <Chip 
                  icon={<Schedule />}
                  label={`${todayAppointments.length} appointments`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
              
              {todayAppointments.length > 0 ? (
                <Grid container spacing={2}>
                  {todayAppointments.map((appointment) => {
                    const patient = patients.find(p => p.id === appointment.patientId);
                    return (
                      <Grid item xs={12} sm={6} md={4} key={appointment.id}>
                        <Paper 
                          sx={{ 
                            p: 2, 
                            border: 1, 
                            borderColor: 'divider',
                            '&:hover': { 
                              boxShadow: 3,
                              transform: 'translateY(-2px)',
                              transition: 'all 0.2s'
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                            <Typography variant="subtitle2" fontWeight="bold">
                              {format(new Date(appointment.appointmentDate), 'HH:mm')}
                            </Typography>
                            <Chip 
                              label={appointment.status}
                              size="small"
                              color={getStatusColor(appointment.status)}
                            />
                          </Box>
                          <Typography variant="body2" gutterBottom>
                            {patient?.name || 'Unknown Patient'}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {appointment.title}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="body1" color="text.secondary">
                    No appointments scheduled for today
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Next 10 Appointments */}
        <Grid item xs={12}>
          <NextAppointments appointments={upcomingAppointments} />
        </Grid>
      </Grid>
    </Box>
  );
}
