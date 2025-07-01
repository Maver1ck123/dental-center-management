import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Tab, 
  Tabs,
  Card,
  CardContent,
  Fab,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Breadcrumbs,
  Link,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar
} from '@mui/material';
import { 
  Add, 
  Close,
  Home,
  People,
  PersonAdd,
  Search,
  Edit,
  Delete,
  Visibility,
  AttachFile
} from '@mui/icons-material';
import { useData } from '../context/DataContext';
import PatientList from '../components/Patients/PatientList';
import PatientForm from '../components/Patients/PatientForm';
import IncidentForm from '../components/Incidents/IncidentForm';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

export default function Patients() {
  const { 
    patients, 
    incidents,
    addPatient, 
    updatePatient, 
    deletePatient,
    addIncident,
    updateIncident,
    deleteIncident
  } = useData();
  
  const [tabValue, setTabValue] = useState(0);
  const [patientFormOpen, setPatientFormOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [incidentFormOpen, setIncidentFormOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Completed': return 'success';
      case 'Pending': return 'warning';
      case 'Cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleAddPatient = () => {
    setSelectedPatient(null);
    setPatientFormOpen(true);
  };

  const handleEditPatient = (patient) => {
    setSelectedPatient(patient);
    setPatientFormOpen(true);
  };

  const handleDeletePatient = (patientId) => {
    if (window.confirm('Are you sure you want to delete this patient and all their appointments?')) {
      deletePatient(patientId);
    }
  };

  const handlePatientSubmit = (patientData) => {
    if (selectedPatient) {
      updatePatient(selectedPatient.id, patientData);
    } else {
      addPatient(patientData);
    }
    setPatientFormOpen(false);
    setSelectedPatient(null);
  };

  const handleAddIncident = (patientId = null) => {
    setSelectedPatientId(patientId);
    setSelectedIncident(null);
    setIncidentFormOpen(true);
  };

  const handleEditIncident = (incident) => {
    setSelectedIncident(incident);
    setIncidentFormOpen(true);
  };

  const handleDeleteIncident = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      deleteIncident(incidentId);
    }
  };

  const handleIncidentSubmit = (incidentData) => {
    if (selectedIncident) {
      updateIncident(selectedIncident.id, incidentData);
    } else {
      addIncident(incidentData);
    }
    setIncidentFormOpen(false);
    setSelectedIncident(null);
    setSelectedPatientId(null);
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
            <People sx={{ mr: 0.5 }} fontSize="inherit" />
            Patients
          </Typography>
        </Breadcrumbs>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
              Patient Management
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Chip 
                label={`${patients.length} Total Patients`}
                color="primary"
                variant="outlined"
              />
              <Chip 
                label={`${incidents.length} Total Appointments`}
                color="secondary"
                variant="outlined"
              />
            </Box>
          </Box>
          <Button
            variant="contained"
            startIcon={<PersonAdd />}
            onClick={handleAddPatient}
            size="large"
            sx={{
              borderRadius: 3,
              px: 3,
              py: 1.5,
              background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
              },
            }}
          >
            Add New Patient
          </Button>
        </Box>
      </Box>

      {/* Tabs */}
      <Card sx={{ mb: 3 }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange}
            variant="fullWidth"
            sx={{
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 500,
                fontSize: '1rem',
              },
            }}
          >
            <Tab 
              icon={<People />}
              iconPosition="start" 
              label="All Patients" 
            />
            <Tab 
              icon={<Search />}
              iconPosition="start" 
              label="All Appointments" 
            />
          </Tabs>
        </Box>

        <CustomTabPanel value={tabValue} index={0}>
          <PatientList 
            patients={patients}
            incidents={incidents}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            onAddIncident={handleAddIncident}
            onEditIncident={handleEditIncident}
          />
        </CustomTabPanel>

        <CustomTabPanel value={tabValue} index={1}>
          <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Box>
                <Typography variant="h6" gutterBottom>
                  All Appointments ({incidents.length})
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Comprehensive view of all patient appointments
                </Typography>
              </Box>
              <Button
                variant="contained"
                startIcon={<Add />}
                onClick={() => handleAddIncident()}
              >
                Add Appointment
              </Button>
            </Box>

            {incidents.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No appointments found
                </Typography>
                <Typography variant="body2" color="text.disabled" sx={{ mb: 3 }}>
                  Create your first appointment to get started
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => handleAddIncident()}
                  size="large"
                >
                  Add First Appointment
                </Button>
              </Box>
            ) : (
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Patient</TableCell>
                      <TableCell>Title</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Treatment</TableCell>
                      <TableCell>Cost</TableCell>
                      <TableCell>Files</TableCell>
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {incidents
                      .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate))
                      .map((incident) => (
                        <TableRow key={incident.id} hover>
                          <TableCell>
                            <Box display="flex" alignItems="center" gap={1}>
                              <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                                {getPatientName(incident.patientId).charAt(0)}
                              </Avatar>
                              <Typography variant="body2">
                                {getPatientName(incident.patientId)}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="subtitle2" fontWeight="medium">
                              {incident.title}
                            </Typography>
                            {incident.description && (
                              <Typography variant="caption" color="text.secondary" noWrap>
                                {incident.description.substring(0, 50)}...
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(incident.appointmentDate).toLocaleDateString()}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(incident.appointmentDate).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={incident.status} 
                              color={getStatusColor(incident.status)}
                              size="small"
                              variant="outlined"
                            />
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {incident.treatment || '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" fontWeight="medium">
                              {incident.cost ? `$${incident.cost}` : '-'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            {incident.files && incident.files.length > 0 ? (
                              <Chip 
                                icon={<AttachFile />} 
                                label={incident.files.length} 
                                size="small"
                                variant="outlined"
                                color="primary"
                                onClick={() => {
                                  const firstFile = incident.files[0];
                                  if (incident.files.length === 1) {
                                    if (firstFile && firstFile.url) {
                                      if (firstFile.url.startsWith('data:')) {
                                        const link = document.createElement('a');
                                        link.href = firstFile.url;
                                        link.download = firstFile.name;
                                        link.click();
                                      } else {
                                        window.open(firstFile.url, '_blank');
                                      }
                                    }
                                  } else {
                                    const fileList = incident.files.map((f, i) => `${i + 1}. ${f.name}`).join('\n');
                                    alert(`Files attached:\n${fileList}\n\nClick on individual file chips in the incident details to download.`);
                                  }
                                }}
                                sx={{ cursor: 'pointer' }}
                              />
                            ) : (
                              <Typography variant="body2" color="text.disabled">
                                No files
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell align="center">
                            <Box display="flex" gap={0.5}>
                              <IconButton 
                                color="secondary" 
                                onClick={() => handleEditIncident(incident)}
                                title="Edit"
                                size="small"
                              >
                                <Edit />
                              </IconButton>
                              <IconButton 
                                color="error" 
                                onClick={() => handleDeleteIncident(incident.id)}
                                title="Delete"
                                size="small"
                              >
                                <Delete />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        </CustomTabPanel>
      </Card>

      {/* Patient Form Dialog */}
      <Dialog
        open={patientFormOpen}
        onClose={() => {
          setPatientFormOpen(false);
          setSelectedPatient(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {selectedPatient ? 'Edit Patient' : 'Add New Patient'}
            </Typography>
            <IconButton
              onClick={() => {
                setPatientFormOpen(false);
                setSelectedPatient(null);
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <PatientForm
            open={patientFormOpen}
            patient={selectedPatient}
            onSubmit={handlePatientSubmit}
            onClose={() => {
              setPatientFormOpen(false);
              setSelectedPatient(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Incident Form Dialog */}
      <Dialog
        open={incidentFormOpen}
        onClose={() => {
          setIncidentFormOpen(false);
          setSelectedIncident(null);
          setSelectedPatientId(null);
        }}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight="bold">
              {selectedIncident ? 'Edit Appointment' : 'Add New Appointment'}
            </Typography>
            <IconButton
              onClick={() => {
                setIncidentFormOpen(false);
                setSelectedIncident(null);
                setSelectedPatientId(null);
              }}
            >
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <IncidentForm
            patientId={selectedPatientId}
            initialData={selectedIncident}
            onSubmit={handleIncidentSubmit}
            onCancel={() => {
              setIncidentFormOpen(false);
              setSelectedIncident(null);
              setSelectedPatientId(null);
            }}
          />
        </DialogContent>
      </Dialog>

      {/* Floating Action Button for Quick Add */}
      <Fab
        color="primary"
        aria-label="add patient"
        onClick={handleAddPatient}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
          },
        }}
      >
        <PersonAdd />
      </Fab>
    </Box>
  );
}
