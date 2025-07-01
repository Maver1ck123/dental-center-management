import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Divider,
  Chip,
  Box,
  Avatar,
  Grid,
  Paper,
  IconButton
} from '@mui/material';
import { 
  Schedule,
  Person,
  AttachMoney,
  CalendarToday,
  AccessTime
} from '@mui/icons-material';
import { useData } from '../../context/DataContext';
import { format, isToday, isTomorrow, addDays } from 'date-fns';

export default function NextAppointments({ appointments }) {
  const { patients } = useData();

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const getPatient = (patientId) => {
    return patients.find(p => p.id === patientId);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Scheduled': return 'info';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const getDateLabel = (date) => {
    const appointmentDate = new Date(date);
    if (isToday(appointmentDate)) return 'Today';
    if (isTomorrow(appointmentDate)) return 'Tomorrow';
    if (appointmentDate <= addDays(new Date(), 7)) {
      return format(appointmentDate, 'EEEE'); // Day of week
    }
    return format(appointmentDate, 'MMM dd, yyyy');
  };

  return (
    <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Schedule sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6" fontWeight="bold">
              Upcoming Appointments
            </Typography>
          </Box>
          <Chip 
            label={`${appointments.length} total`}
            color="primary"
            variant="outlined"
            size="small"
          />
        </Box>

        {appointments.length > 0 ? (
          <Grid container spacing={2}>
            {appointments.map((appointment, index) => {
              const patient = getPatient(appointment.patientId);
              const appointmentDate = new Date(appointment.appointmentDate);
              
              return (
                <Grid item xs={12} sm={6} lg={4} key={appointment.id}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 2,
                      border: 1,
                      borderColor: 'divider',
                      borderRadius: 2,
                      height: '100%',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: 3,
                        transform: 'translateY(-2px)',
                        borderColor: 'primary.main',
                      }
                    }}
                  >
                    {/* Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Chip 
                        label={getDateLabel(appointment.appointmentDate)}
                        color={isToday(appointmentDate) ? 'error' : isTomorrow(appointmentDate) ? 'warning' : 'default'}
                        size="small"
                        variant={isToday(appointmentDate) || isTomorrow(appointmentDate) ? 'filled' : 'outlined'}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Chip 
                          label={appointment.status}
                          color={getStatusColor(appointment.status)}
                          size="small"
                          variant="outlined"
                        />
                      </Box>
                    </Box>

                    {/* Patient Info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar 
                        sx={{ 
                          width: 40, 
                          height: 40, 
                          bgcolor: 'primary.main',
                          mr: 1
                        }}
                      >
                        {patient?.name?.charAt(0) || '?'}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle2" fontWeight="bold" noWrap>
                          {patient?.name || 'Unknown Patient'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {patient?.contact}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Appointment Details */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="subtitle1" fontWeight="medium" gutterBottom>
                        {appointment.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          minHeight: '2.5em'
                        }}
                      >
                        {appointment.description}
                      </Typography>
                    </Box>

                    {/* Time and Status */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary">
                          {format(appointmentDate, 'HH:mm')}
                        </Typography>
                      </Box>
                      <Chip 
                        label={appointment.status}
                        color={getStatusColor(appointment.status)}
                        size="small"
                      />
                    </Box>

                    {/* Cost */}
                    {appointment.cost > 0 && (
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <AttachMoney sx={{ fontSize: 16, mr: 0.5, color: 'success.main' }} />
                        <Typography variant="body2" color="success.main" fontWeight="medium">
                          ${appointment.cost}
                        </Typography>
                      </Box>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <CalendarToday sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary" gutterBottom>
              No Upcoming Appointments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              All caught up! No appointments scheduled for the next 10 slots.
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}
