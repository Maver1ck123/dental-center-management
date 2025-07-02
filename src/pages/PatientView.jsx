import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  List, 
  ListItem, 
  ListItemText,
  ListItemAvatar,
  Chip,
  Divider,
  Paper,
  Avatar,
  Button,
  Stack,
  LinearProgress,
  Breadcrumbs,
  Link,
  IconButton,
  Tooltip
} from '@mui/material';
import { 
  Person, 
  CalendarToday, 
  History, 
  AttachFile,
  Download,
  Home,
  Visibility,
  LocalHospital,
  Schedule,
  CheckCircle,
  AttachMoney,
  Cake,
  Phone,
  Email,
  HealthAndSafety,
  EventNote,
  Receipt,
  TrendingUp,
  Favorite
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { format } from 'date-fns';

export default function PatientView() {
  const { user } = useAuth();
  const { incidents, patients } = useData();
  
  if (!user || !user.patientId) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '60vh',
        textAlign: 'center' 
      }}>
        <LocalHospital sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" color="error" gutterBottom>
          Patient Data Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Please log in as a patient to view your dental records.
        </Typography>
      </Box>
    );
  }
  
  const patientData = patients.find(p => p.id === user.patientId);
  const patientIncidents = incidents.filter(
    incident => incident.patientId === user.patientId
  );

  const upcomingAppointments = patientIncidents
    .filter(incident => new Date(incident.appointmentDate) > new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const pastAppointments = patientIncidents
    .filter(incident => new Date(incident.appointmentDate) <= new Date())
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Scheduled': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const totalSpent = patientIncidents
    .filter(incident => incident.status === 'Completed')
    .reduce((sum, incident) => sum + (incident.cost || 0), 0);

  const completedAppointments = patientIncidents.filter(incident => incident.status === 'Completed').length;
  const totalAppointments = patientIncidents.length;
  const completionRate = totalAppointments > 0 ? (completedAppointments / totalAppointments) * 100 : 0;

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header with Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs aria-label="breadcrumb" sx={{ mb: 2 }}>
          <Link color="inherit" href="/" sx={{ display: 'flex', alignItems: 'center' }}>
            <Home sx={{ mr: 0.5 }} fontSize="inherit" />
            Dashboard
          </Link>
          <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
            <Person sx={{ mr: 0.5 }} fontSize="inherit" />
            My Profile
          </Typography>
        </Breadcrumbs>
        
        <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
          Welcome, {patientData?.name || 'Patient'}!
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Here's an overview of your dental health journey with us.
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Patient Profile Card */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 'fit-content', position: 'sticky', top: 20 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    bgcolor: 'primary.main',
                    mr: 2,
                    fontSize: '2rem',
                    fontWeight: 'bold'
                  }}
                >
                  {patientData?.name?.charAt(0) || 'P'}
                </Avatar>
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {patientData?.name || 'Patient'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Patient ID: {user.patientId}
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Contact Information
              </Typography>
              
              <Stack spacing={1.5}>
                {patientData?.contact && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Phone sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{patientData.contact}</Typography>
                  </Box>
                )}
                
                {patientData?.email && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Email sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">{patientData.email}</Typography>
                  </Box>
                )}
                
                {patientData?.dob && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Cake sx={{ mr: 1, color: 'text.secondary' }} />
                    <Typography variant="body2">
                      {format(new Date(patientData.dob), 'MMMM dd, yyyy')}
                    </Typography>
                  </Box>
                )}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Health Information */}
              <Typography variant="h6" gutterBottom fontWeight="bold">
                Health Information
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                <HealthAndSafety sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                <Typography variant="body2">
                  {patientData?.healthInfo || 'No health information on file'}
                </Typography>
              </Box>

              {patientData?.bloodType && (
                <Box sx={{ mb: 1 }}>
                  <Chip 
                    label={`Blood Type: ${patientData.bloodType}`}
                    color="error"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}

              {patientData?.insurance && (
                <Box>
                  <Chip 
                    label={`Insurance: ${patientData.insurance}`}
                    color="info"
                    variant="outlined"
                    size="small"
                  />
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} lg={8}>
          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {totalAppointments}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Visits
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <EventNote />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {upcomingAppointments.length}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Upcoming
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <Schedule />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        {completedAppointments}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Completed
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <CheckCircle />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ background: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h4" fontWeight="bold">
                        ${totalSpent}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Total Spent
                      </Typography>
                    </Box>
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)' }}>
                      <AttachMoney />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Health Progress */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" fontWeight="bold">
                  Treatment Progress
                </Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">
                    Appointment Completion Rate
                  </Typography>
                  <Typography variant="body2" fontWeight="bold">
                    {completionRate.toFixed(1)}%
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={completionRate} 
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="success.main" fontWeight="bold">
                      {completedAppointments}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="warning.main" fontWeight="bold">
                      {patientIncidents.filter(i => i.status === 'Pending').length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h6" color="info.main" fontWeight="bold">
                      {upcomingAppointments.length}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Scheduled
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Upcoming Appointments */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Upcoming Appointments
                  </Typography>
                </Box>
                {upcomingAppointments.length > 0 && (
                  <Chip 
                    label={`${upcomingAppointments.length} scheduled`}
                    color="primary"
                    size="small"
                  />
                )}
              </Box>
              
              {upcomingAppointments.length > 0 ? (
                <List>
                  {upcomingAppointments.map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            <Schedule />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {appointment.title}
                              </Typography>
                              <Chip 
                                label={appointment.status}
                                color={getStatusColor(appointment.status)}
                                size="small"
                              />
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                📅 {format(new Date(appointment.appointmentDate), 'EEEE, MMMM d, yyyy')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                🕐 {format(new Date(appointment.appointmentDate), 'h:mm a')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                📝 {appointment.description}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < upcomingAppointments.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Upcoming Appointments
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your schedule is clear! Contact us to book your next appointment.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Treatment History */}
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <History sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" fontWeight="bold">
                    Treatment History
                  </Typography>
                </Box>
                {pastAppointments.length > 0 && (
                  <Typography variant="body2" color="text.secondary">
                    {pastAppointments.length} past appointments
                  </Typography>
                )}
              </Box>
              
              {pastAppointments.length > 0 ? (
                <List>
                  {pastAppointments.slice(0, 5).map((appointment, index) => (
                    <React.Fragment key={appointment.id}>
                      <ListItem sx={{ px: 0 }}>
                        <ListItemAvatar>
                          <Avatar 
                            sx={{ 
                              bgcolor: getStatusColor(appointment.status) + '.main',
                              width: 40,
                              height: 40
                            }}
                          >
                            <CheckCircle />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {appointment.title}
                              </Typography>
                              <Stack direction="row" spacing={1}>
                                <Chip 
                                  label={appointment.status}
                                  color={getStatusColor(appointment.status)}
                                  size="small"
                                />
                                {appointment.cost > 0 && (
                                  <Chip 
                                    label={`$${appointment.cost}`}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                  />
                                )}
                              </Stack>
                            </Box>
                          }
                          secondary={
                            <Box>
                              <Typography variant="body2" color="text.secondary">
                                📅 {format(new Date(appointment.appointmentDate), 'MMMM d, yyyy')}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                📝 {appointment.description}
                              </Typography>
                              {appointment.treatment && (
                                <Typography variant="body2" color="text.secondary">
                                  🩺 Treatment: {appointment.treatment}
                                </Typography>
                              )}
                              {appointment.files && appointment.files.length > 0 && (
                                <Box sx={{ mt: 1 }}>
                                  {appointment.files.map((file, fileIndex) => (
                                    <Chip
                                      key={fileIndex}
                                      icon={<AttachFile />}
                                      label={file.name}
                                      size="small"
                                      variant="outlined"
                                      sx={{ mr: 1, mb: 0.5 }}
                                      onClick={() => {
                                        // Handle file download/view
                                        console.log('Download file:', file.name);
                                      }}
                                    />
                                  ))}
                                </Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {index < Math.min(pastAppointments.length, 5) - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <History sx={{ fontSize: 48, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Treatment History
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your treatment history will appear here after your appointments.
                  </Typography>
                </Box>
              )}

              {pastAppointments.length > 5 && (
                <Box sx={{ textAlign: 'center', mt: 2 }}>
                  <Button variant="outlined" startIcon={<Visibility />}>
                    View All History ({pastAppointments.length - 5} more)
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
