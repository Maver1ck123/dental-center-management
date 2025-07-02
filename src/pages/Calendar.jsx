import React, { useState, useMemo } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar,
  Chip, 
  Button,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Avatar,
  Stack,
  Breadcrumbs,
  Link,
  Badge,
  Tooltip,
  Divider
} from '@mui/material';
import { 
  CalendarToday, 
  ViewWeek, 
  ViewModule, 
  ChevronLeft, 
  ChevronRight,
  Home,
  Schedule,
  Person,
  AccessTime,
  Add,
  Today
} from '@mui/icons-material';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useData } from '../context/DataContext';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isToday, isSameMonth } from 'date-fns';

export default function Calendar() {
  const { incidents, patients } = useData();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  const getAppointmentsForDate = (date) => {
    return incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return isSameDay(appointmentDate, date);
    });
  };

  const getAppointmentsForMonth = (month) => {
    return incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return isSameMonth(appointmentDate, month);
    });
  };

  const getAppointmentsForWeek = (date) => {
    const weekStart = startOfWeek(date);
    const weekEnd = endOfWeek(date);
    
    return incidents.filter(incident => {
      const appointmentDate = new Date(incident.appointmentDate);
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    });
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);
  const currentMonthAppointments = getAppointmentsForMonth(currentMonth);
  const currentWeekAppointments = getAppointmentsForWeek(selectedDate);

  const navigateMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  const goToToday = () => {
    const today = new Date();
    setSelectedDate(today);
    setCurrentMonth(today);
  };

  const renderCalendarDay = (day) => {
    const dayAppointments = getAppointmentsForDate(day);
    const hasAppointments = dayAppointments.length > 0;
    
    return (
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          minHeight: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          borderRadius: 1,
          backgroundColor: isSameDay(day, selectedDate) ? 'primary.main' : 'transparent',
          color: isSameDay(day, selectedDate) ? 'white' : isToday(day) ? 'primary.main' : 'text.primary',
          fontWeight: isToday(day) || isSameDay(day, selectedDate) ? 'bold' : 'normal',
          '&:hover': {
            backgroundColor: isSameDay(day, selectedDate) ? 'primary.dark' : 'grey.100',
          }
        }}
        onClick={() => setSelectedDate(day)}
      >
        {format(day, 'd')}
        {hasAppointments && (
          <Badge
            color="error"
            variant="dot"
            sx={{
              position: 'absolute',
              top: 4,
              right: 4,
              '& .MuiBadge-badge': {
                backgroundColor: isSameDay(day, selectedDate) ? 'white' : 'error.main',
              }
            }}
          />
        )}
      </Box>
    );
  };

  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate);
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: endOfWeek(selectedDate)
    });

    return (
      <Grid container spacing={2}>
        {weekDays.map((day, index) => {
          const dayAppointments = getAppointmentsForDate(day);
          
          return (
            <Grid item xs key={index}>
              <Card sx={{ height: 300, overflow: 'auto' }}>
                <CardContent sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {format(day, 'EEE')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {format(day, 'MMM d')}
                    </Typography>
                    {dayAppointments.length > 0 && (
                      <Chip
                        label={dayAppointments.length}
                        size="small"
                        color="primary"
                      />
                    )}
                  </Box>
                  
                  {dayAppointments.length > 0 ? (
                    <List dense>
                      {dayAppointments
                        .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                        .map((appointment) => {
                          const patient = getPatient(appointment.patientId);
                          return (
                            <ListItem key={appointment.id} sx={{ px: 0, py: 0.5 }}>
                              <Paper 
                                sx={{ 
                                  width: '100%',
                                  p: 1,
                                  backgroundColor: getStatusColor(appointment.status) + '.light',
                                  border: 1,
                                  borderColor: getStatusColor(appointment.status) + '.main',
                                }}
                              >
                                <Typography variant="caption" fontWeight="bold">
                                  {format(new Date(appointment.appointmentDate), 'HH:mm')}
                                </Typography>
                                <Typography variant="body2" noWrap>
                                  {appointment.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" noWrap>
                                  {patient?.name}
                                </Typography>
                              </Paper>
                            </ListItem>
                          );
                        })}
                    </List>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mt: 2 }}>
                      No appointments
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    );
  };

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
            <CalendarToday sx={{ mr: 0.5 }} fontSize="inherit" />
            Calendar
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Appointment Calendar
            </Typography>
            <Stack direction="row" spacing={1}>
              <Chip 
                label={`${currentMonthAppointments.length} appointments this month`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`${selectedDateAppointments.length} today`}
                color="secondary"
                variant="outlined"
              />
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<Today />}
              onClick={goToToday}
            >
              Today
            </Button>
            
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={(e, newView) => newView && setView(newView)}
              size="small"
            >
              <ToggleButton value="month" aria-label="month view">
                <ViewModule />
              </ToggleButton>
              <ToggleButton value="week" aria-label="week view">
                <ViewWeek />
              </ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Calendar */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              {/* Calendar Header */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {view === 'month' 
                    ? format(currentMonth, 'MMMM yyyy')
                    : `Week of ${format(startOfWeek(selectedDate), 'MMM d, yyyy')}`
                  }
                </Typography>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <IconButton onClick={() => navigateMonth(-1)}>
                    <ChevronLeft />
                  </IconButton>
                  <IconButton onClick={() => navigateMonth(1)}>
                    <ChevronRight />
                  </IconButton>
                </Box>
              </Box>

              {view === 'month' ? (
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DateCalendar
                    value={selectedDate}
                    onChange={setSelectedDate}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    renderDay={(day, selectedDays, pickersDayProps) => (
                      <Box key={day.toString()} sx={{ position: 'relative' }}>
                        {renderCalendarDay(day)}
                      </Box>
                    )}
                    sx={{
                      width: '100%',
                      '& .MuiPickersDay-root': {
                        fontSize: '1rem',
                      },
                      '& .MuiDayCalendar-monthContainer': {
                        position: 'relative',
                      },
                    }}
                  />
                </LocalizationProvider>
              ) : (
                renderWeekView()
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Selected Date Appointments */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6" fontWeight="bold">
                  {format(selectedDate, 'EEEE, MMMM d')}
                </Typography>
                <Chip 
                  label={`${selectedDateAppointments.length} appointments`}
                  color="primary"
                  size="small"
                />
              </Box>

              {selectedDateAppointments.length > 0 ? (
                <List>
                  {selectedDateAppointments
                    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
                    .map((appointment, index) => {
                      const patient = getPatient(appointment.patientId);
                      return (
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
                                <AccessTime />
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <Typography variant="subtitle2" fontWeight="bold">
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
                                    {format(new Date(appointment.appointmentDate), 'HH:mm')} - {patient?.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" noWrap>
                                    {appointment.description}
                                  </Typography>
                                  {appointment.cost > 0 && (
                                    <Typography variant="body2" color="success.main" fontWeight="medium">
                                      ${appointment.cost}
                                    </Typography>
                                  )}
                                </Box>
                              }
                            />
                          </ListItem>
                          {index < selectedDateAppointments.length - 1 && <Divider />}
                        </React.Fragment>
                      );
                    })}
                </List>
              ) : (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Schedule sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    No appointments scheduled
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Monthly Stats */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom fontWeight="bold">
                {format(currentMonth, 'MMMM')} Statistics
              </Typography>
              
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color="primary.main" fontWeight="bold">
                      {currentMonthAppointments.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color="success.main" fontWeight="bold">
                      {currentMonthAppointments.filter(a => a.status === 'Completed').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Completed
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color="warning.main" fontWeight="bold">
                      {currentMonthAppointments.filter(a => a.status === 'Pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending
                    </Typography>
                  </Box>
                </Grid>
                
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center', p: 1 }}>
                    <Typography variant="h4" color="info.main" fontWeight="bold">
                      {currentMonthAppointments.filter(a => a.status === 'Scheduled').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Scheduled
                    </Typography>
                  </Box>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Revenue this month:
              </Typography>
              <Typography variant="h5" color="success.main" fontWeight="bold">
                ${currentMonthAppointments
                  .filter(a => a.status === 'Completed')
                  .reduce((sum, a) => sum + (a.cost || 0), 0)
                  .toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
