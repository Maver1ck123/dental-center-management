import React, { useState, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  Fab,
  useTheme,
  useMediaQuery,
  Breadcrumbs,
  Link,
  Divider,
  Avatar,
  ListItemAvatar,
  List,
  ListItem,
  ListItemText,
  ListItemIcon
} from '@mui/material';
import { 
  Add, 
  Edit, 
  Delete, 
  Visibility,
  AttachFile,
  FilterList,
  CalendarToday,
  Person,
  Assessment,
  Home
} from '@mui/icons-material';
import { useData } from '../context/DataContext';
import IncidentForm from '../components/Incidents/IncidentForm';

export default function Incidents() {
  const { 
    incidents, 
    patients, 
    addIncident, 
    updateIncident, 
    deleteIncident,
    getStatusCounts
  } = useData();
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPatient, setFilterPatient] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [filesDialogOpen, setFilesDialogOpen] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const formRef = useRef(null);

  const statusCounts = getStatusCounts();

  const filteredIncidents = incidents.filter(incident => {
    const statusMatch = filterStatus === 'All' || incident.status === filterStatus;
    const patientMatch = filterPatient === 'All' || incident.patientId === filterPatient;
    return statusMatch && patientMatch;
  });

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

  const handleEdit = (incident) => {
    setSelectedIncident(incident);
    setIsFormOpen(true);
  };

  const handleView = (incident) => {
    setSelectedIncident(incident);
    setViewDialogOpen(true);
  };

  const handleDelete = (incidentId) => {
    if (window.confirm('Are you sure you want to delete this incident?')) {
      deleteIncident(incidentId);
    }
  };

  const handleFormSubmit = (formData) => {
    if (selectedIncident) {
      updateIncident(selectedIncident.id, formData);
    } else {
      addIncident(formData);
    }
    setIsFormOpen(false);
    setSelectedIncident(null);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedIncident(null);
  };

  const handleDownloadFile = (file) => {
    if (file.url && file.url.startsWith('data:')) {
      const link = document.createElement('a');
      link.href = file.url;
      link.download = file.name;
      link.click();
    } else {
      window.open(file.url, '_blank');
    }
  };

  const handleFilesClick = (files) => {
    if (files.length === 1) {
      handleDownloadFile(files[0]);
    } else {
      setSelectedFiles(files);
      setFilesDialogOpen(true);
    }
  };

  return (
    <Box>
      {/* Breadcrumbs */}
      <Breadcrumbs sx={{ mb: 2 }}>
        <Link color="inherit" href="#" sx={{ display: 'flex', alignItems: 'center' }}>
          <Home sx={{ mr: 0.5 }} fontSize="inherit" />
          Dashboard
        </Link>
        <Typography color="text.primary" sx={{ display: 'flex', alignItems: 'center' }}>
          <Assessment sx={{ mr: 0.5 }} fontSize="inherit" />
          Appointments & Incidents
        </Typography>
      </Breadcrumbs>

      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Appointments & Incidents
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage patient appointments, treatments, and medical incidents
          </Typography>
        </Box>
        
        {!isMobile && (
          <Box display="flex" gap={1}>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={() => setIsFormOpen(true)}
            >
              Add New
            </Button>
          </Box>
        )}
      </Box>

      {/* Status Overview Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.warning.main}15 0%, ${theme.palette.warning.main}25 100%)`,
            border: `1px solid ${theme.palette.warning.main}30`
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'warning.main', 
                mx: 'auto', 
                mb: 2,
                width: 56,
                height: 56
              }}>
                <CalendarToday />
              </Avatar>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {statusCounts.Pending || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Pending</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.success.main}15 0%, ${theme.palette.success.main}25 100%)`,
            border: `1px solid ${theme.palette.success.main}30`
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'success.main', 
                mx: 'auto', 
                mb: 2,
                width: 56,
                height: 56
              }}>
                <Assessment />
              </Avatar>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {statusCounts.Completed || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Completed</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.error.main}15 0%, ${theme.palette.error.main}25 100%)`,
            border: `1px solid ${theme.palette.error.main}30`
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'error.main', 
                mx: 'auto', 
                mb: 2,
                width: 56,
                height: 56
              }}>
                <Delete />
              </Avatar>
              <Typography variant="h4" color="error.main" fontWeight="bold">
                {statusCounts.Cancelled || 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">Cancelled</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} sm={6} md={3}>
          <Card sx={{ 
            background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.primary.main}25 100%)`,
            border: `1px solid ${theme.palette.primary.main}30`
          }}>
            <CardContent sx={{ textAlign: 'center', py: 3 }}>
              <Avatar sx={{ 
                bgcolor: 'primary.main', 
                mx: 'auto', 
                mb: 2,
                width: 56,
                height: 56
              }}>
                <Person />
              </Avatar>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {incidents.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">Total</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      {(showFilters || isMobile) && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">
                Filters
              </Typography>
              {isMobile && (
                <IconButton onClick={() => setShowFilters(false)}>
                  <FilterList />
                </IconButton>
              )}
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Status"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="All">All Statuses</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  select
                  fullWidth
                  label="Filter by Patient"
                  value={filterPatient}
                  onChange={(e) => setFilterPatient(e.target.value)}
                  variant="outlined"
                  size="small"
                >
                  <MenuItem value="All">All Patients</MenuItem>
                  {patients.map(patient => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Incidents Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Appointments ({filteredIncidents.length})
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {filteredIncidents.length} of {incidents.length} total
            </Typography>
          </Box>
          <Divider sx={{ mb: 2 }} />
          <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>Title</TableCell>
                  <TableCell>Patient</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Cost</TableCell>
                  <TableCell>Files</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredIncidents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                      <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
                        <Assessment sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary">
                          No appointments found
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                          {filterStatus !== 'All' || filterPatient !== 'All' 
                            ? 'Try adjusting your filters' 
                            : 'Create your first appointment to get started'
                          }
                        </Typography>
                        {filterStatus === 'All' && filterPatient === 'All' && (
                          <Button
                            variant="contained"
                            startIcon={<Add />}
                            onClick={() => setIsFormOpen(true)}
                          >
                            Add First Appointment
                          </Button>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIncidents.map((incident) => (
                    <TableRow key={incident.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="medium">
                          {incident.title}
                        </Typography>
                        {incident.treatment && (
                          <Typography variant="caption" color="text.secondary">
                            {incident.treatment}
                          </Typography>
                        )}
                      </TableCell>
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
                            onClick={() => handleFilesClick(incident.files)}
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
                            color="primary" 
                            onClick={() => handleView(incident)}
                            title="View Details"
                            size="small"
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton 
                            color="secondary" 
                            onClick={() => handleEdit(incident)}
                            title="Edit"
                            size="small"
                          >
                            <Edit />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => handleDelete(incident.id)}
                            title="Delete"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add/Edit Form Dialog */}
      <Dialog 
        open={isFormOpen} 
        onClose={handleFormClose}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {selectedIncident ? 'Edit Incident' : 'Add New Incident'}
        </DialogTitle>
        <DialogContent>
          <IncidentForm
            ref={formRef}
            initialData={selectedIncident}
            onSubmit={handleFormSubmit}
            patients={patients}
            hideSubmitButton={true}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleFormClose}>Cancel</Button>
          <Button 
            onClick={() => {
              if (formRef.current) {
                formRef.current.handleSubmit();
              }
            }}
            variant="contained"
          >
            {selectedIncident ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={() => setViewDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Incident Details</DialogTitle>
        <DialogContent>
          {selectedIncident && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Title:</Typography>
                  <Typography variant="body1" mb={2}>{selectedIncident.title}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Patient:</Typography>
                  <Typography variant="body1" mb={2}>
                    {getPatientName(selectedIncident.patientId)}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Description:</Typography>
                  <Typography variant="body1" mb={2}>{selectedIncident.description}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Comments:</Typography>
                  <Typography variant="body1" mb={2}>{selectedIncident.comments || 'None'}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Appointment Date:</Typography>
                  <Typography variant="body1" mb={2}>
                    {new Date(selectedIncident.appointmentDate).toLocaleString()}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Status:</Typography>
                  <Typography variant="body1" mb={2}>
                    <Chip 
                      label={selectedIncident.status} 
                      color={getStatusColor(selectedIncident.status)}
                      size="small"
                    />
                  </Typography>
                </Grid>
                {selectedIncident.cost && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Cost:</Typography>
                    <Typography variant="body1" mb={2}>${selectedIncident.cost}</Typography>
                  </Grid>
                )}
                {selectedIncident.treatment && (
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Treatment:</Typography>
                    <Typography variant="body1" mb={2}>{selectedIncident.treatment}</Typography>
                  </Grid>
                )}
                {selectedIncident.nextDate && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Next Appointment:</Typography>
                    <Typography variant="body1" mb={2}>
                      {new Date(selectedIncident.nextDate).toLocaleString()}
                    </Typography>
                  </Grid>
                )}
                {selectedIncident.files && selectedIncident.files.length > 0 && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2">Files:</Typography>
                    <Box mt={1}>
                      {selectedIncident.files.map((file, index) => (
                        <Chip 
                          key={index}
                          label={file.name}
                          icon={<AttachFile />}
                          sx={{ mr: 1, mb: 1 }}
                          onClick={() => {
                            if (file.url && file.url.startsWith('data:')) {
                              const link = document.createElement('a');
                              link.href = file.url;
                              link.download = file.name;
                              link.click();
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Grid>
                )}
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Files Selection Dialog */}
      <Dialog
        open={filesDialogOpen}
        onClose={() => setFilesDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Select File to Download</DialogTitle>
        <DialogContent>
          <List>
            {selectedFiles.map((file, index) => (
              <ListItem 
                key={index}
                button
                onClick={() => {
                  handleDownloadFile(file);
                  setFilesDialogOpen(false);
                }}
                sx={{ 
                  borderRadius: 1, 
                  mb: 1,
                  '&:hover': {
                    backgroundColor: 'action.hover'
                  }
                }}
              >
                <ListItemIcon>
                  <AttachFile color="primary" />
                </ListItemIcon>
                <ListItemText
                  primary={file.name}
                  secondary={`${file.type || 'Unknown type'} • ${file.size ? (file.size / 1024).toFixed(1) + ' KB' : 'Unknown size'}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFilesDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>

      {/* Mobile FAB */}
      {isMobile && (
        <Fab
          color="primary"
          aria-label="add"
          onClick={() => setIsFormOpen(true)}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
          }}
        >
          <Add />
        </Fab>
      )}
    </Box>
  );
}
