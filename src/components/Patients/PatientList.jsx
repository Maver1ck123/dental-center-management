import React, { useState } from 'react';
import { 
  Card,
  CardContent,
  Grid,
  Box,
  Typography,
  Chip,
  Avatar,
  IconButton,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Paper,
  TextField,
  InputAdornment,
  Stack,
  Tooltip
} from '@mui/material';
import { 
  Edit, 
  Delete, 
  Add, 
  ExpandMore, 
  ExpandLess,
  CalendarToday,
  Phone,
  Cake,
  HealthAndSafety,
  Search,
  Email,
  LocationOn,
  ContactEmergency,
  AttachMoney,
  Schedule,
  CheckCircle,
  PersonOutline
} from '@mui/icons-material';
import { format } from 'date-fns';

export default function PatientList({ 
  patients, 
  incidents = [], 
  onEdit, 
  onDelete, 
  onAddIncident, 
  onEditIncident 
}) {
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getPatientIncidents = (patientId) => {
    return incidents.filter(incident => incident.patientId === patientId);
  };

  const getPatientStats = (patientId) => {
    const patientIncidents = getPatientIncidents(patientId);
    const totalAppointments = patientIncidents.length;
    const completedAppointments = patientIncidents.filter(i => i.status === 'Completed').length;
    const pendingAppointments = patientIncidents.filter(i => i.status === 'Pending').length;
    const totalSpent = patientIncidents
      .filter(i => i.status === 'Completed')
      .reduce((sum, i) => sum + (i.cost || 0), 0);
    
    return { totalAppointments, completedAppointments, pendingAppointments, totalSpent };
  };

  const handleExpandClick = (patientId) => {
    setExpandedPatient(expandedPatient === patientId ? null : patientId);
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

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.contact.includes(searchTerm)
  );

  if (patients.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', py: 6 }}>
        <PersonOutline sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary" gutterBottom>
          No Patients Found
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Start by adding your first patient to the system.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Search */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search patients by name, email, or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 400 }}
        />
      </Box>

      {/* Patient Cards */}
      <Grid container spacing={3}>
        {filteredPatients.map((patient) => {
          const stats = getPatientStats(patient.id);
          const patientIncidents = getPatientIncidents(patient.id).sort(
            (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
          );
          const isExpanded = expandedPatient === patient.id;

          return (
            <Grid item xs={12} key={patient.id}>
              <Card 
                sx={{ 
                  transition: 'all 0.3s',
                  '&:hover': { 
                    transform: 'translateY(-2px)',
                    boxShadow: 6 
                  }
                }}
              >
                <CardContent>
                  {/* Patient Header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 60, 
                          height: 60, 
                          bgcolor: 'primary.main',
                          mr: 2,
                          fontSize: '1.5rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {patient.name.charAt(0)}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                          {patient.name}
                        </Typography>
                        
                        <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Phone sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {patient.contact}
                            </Typography>
                          </Box>
                          
                          {patient.email && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Email sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                              <Typography variant="body2" color="text.secondary">
                                {patient.email}
                              </Typography>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Cake sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
                            <Typography variant="body2" color="text.secondary">
                              {format(new Date(patient.dob), 'MMM dd, yyyy')}
                            </Typography>
                          </Box>
                        </Stack>

                        {/* Stats */}
                        <Stack direction="row" spacing={1}>
                          <Chip 
                            icon={<Schedule />}
                            label={`${stats.totalAppointments} appointments`}
                            size="small"
                            variant="outlined"
                          />
                          <Chip 
                            icon={<CheckCircle />}
                            label={`${stats.completedAppointments} completed`}
                            size="small"
                            color="success"
                            variant="outlined"
                          />
                          <Chip 
                            icon={<AttachMoney />}
                            label={`$${stats.totalSpent}`}
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Tooltip title="Edit Patient">
                        <IconButton 
                          onClick={() => onEdit(patient)}
                          color="primary"
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Add Appointment">
                        <IconButton 
                          onClick={() => onAddIncident(patient.id)}
                          color="success"
                        >
                          <Add />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title="Delete Patient">
                        <IconButton 
                          onClick={() => onDelete(patient.id)}
                          color="error"
                        >
                          <Delete />
                        </IconButton>
                      </Tooltip>
                      
                      <Tooltip title={isExpanded ? "Hide Details" : "Show Details"}>
                        <IconButton 
                          onClick={() => handleExpandClick(patient.id)}
                          sx={{ 
                            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s'
                          }}
                        >
                          <ExpandMore />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>

                  {/* Expandable Details */}
                  <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                    <Divider sx={{ my: 2 }} />
                    
                    <Grid container spacing={3}>
                      {/* Patient Details */}
                      <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom fontWeight="bold">
                          Patient Information
                        </Typography>
                        
                        <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
                          {patient.address && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <LocationOn sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">Address</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.address}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          
                          {patient.emergencyContact && (
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                              <ContactEmergency sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                              <Box>
                                <Typography variant="body2" fontWeight="medium">Emergency Contact</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {patient.emergencyContact}
                                </Typography>
                              </Box>
                            </Box>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
                            <HealthAndSafety sx={{ mr: 1, mt: 0.5, color: 'text.secondary' }} />
                            <Box>
                              <Typography variant="body2" fontWeight="medium">Health Information</Typography>
                              <Typography variant="body2" color="text.secondary">
                                {patient.healthInfo || 'No health information provided'}
                              </Typography>
                            </Box>
                          </Box>

                          {patient.bloodType && (
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                              <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                                Blood Type:
                              </Typography>
                              <Chip label={patient.bloodType} size="small" color="error" />
                            </Box>
                          )}

                          {patient.insurance && (
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                              <Typography variant="body2" fontWeight="medium" sx={{ mr: 1 }}>
                                Insurance:
                              </Typography>
                              <Chip label={patient.insurance} size="small" color="info" />
                            </Box>
                          )}
                        </Paper>
                      </Grid>

                      {/* Appointments History */}
                      <Grid item xs={12} md={6}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6" fontWeight="bold">
                            Appointment History
                          </Typography>
                          <Button
                            variant="outlined"
                            size="small"
                            startIcon={<Add />}
                            onClick={() => onAddIncident(patient.id)}
                          >
                            Add Appointment
                          </Button>
                        </Box>
                        
                        {patientIncidents.length > 0 ? (
                          <Paper sx={{ maxHeight: 400, overflow: 'auto' }}>
                            <List>
                              {patientIncidents.map((incident, index) => (
                                <React.Fragment key={incident.id}>
                                  <ListItem
                                    sx={{
                                      '&:hover': { bgcolor: 'grey.50' },
                                      cursor: 'pointer'
                                    }}
                                    onClick={() => onEditIncident(incident)}
                                  >
                                    <ListItemAvatar>
                                      <Avatar sx={{ bgcolor: getStatusColor(incident.status) + '.main' }}>
                                        <CalendarToday />
                                      </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                      primary={
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <Typography variant="subtitle2" fontWeight="bold">
                                            {incident.title}
                                          </Typography>
                                          <Chip 
                                            label={incident.status}
                                            size="small"
                                            color={getStatusColor(incident.status)}
                                          />
                                        </Box>
                                      }
                                      secondary={
                                        <Box>
                                          <Typography variant="body2" color="text.secondary">
                                            {format(new Date(incident.appointmentDate), 'MMM dd, yyyy HH:mm')}
                                          </Typography>
                                          <Typography variant="body2" color="text.secondary" noWrap>
                                            {incident.description}
                                          </Typography>
                                          {incident.cost > 0 && (
                                            <Typography variant="body2" color="success.main" fontWeight="medium">
                                              ${incident.cost}
                                            </Typography>
                                          )}
                                        </Box>
                                      }
                                    />
                                  </ListItem>
                                  {index < patientIncidents.length - 1 && <Divider />}
                                </React.Fragment>
                              ))}
                            </List>
                          </Paper>
                        ) : (
                          <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'grey.50' }}>
                            <CalendarToday sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                            <Typography variant="body2" color="text.secondary">
                              No appointments scheduled yet
                            </Typography>
                          </Paper>
                        )}
                      </Grid>
                    </Grid>
                  </Collapse>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {filteredPatients.length === 0 && searchTerm && (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <Search sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No patients found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or add a new patient.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
