import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { 
  TextField, 
  Button, 
  Box, 
  InputLabel, 
  MenuItem, 
  Select, 
  FormControl,
  Typography,
  Grid,
  Card,
  CardContent,
  Divider,
  Paper,
  InputAdornment,
  Chip,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Alert
} from '@mui/material';
import {
  Title,
  Description,
  CalendarToday,
  AttachMoney,
  LocalHospital,
  Person,
  Comment,
  Schedule,
  AttachFile,
  Delete,
  CloudUpload
} from '@mui/icons-material';
import FileUpload from './FileUpload';

const IncidentForm = forwardRef(({ 
  patientId, 
  onSubmit, 
  initialData, 
  patients = [], 
  hideSubmitButton = false,
  submitTrigger = null 
}, ref) => {
  const [formData, setFormData] = useState(initialData || {
    title: '',
    description: '',
    comments: '',
    appointmentDate: '',
    cost: '',
    treatment: '',
    status: 'Pending',
    nextDate: '',
    patientId: patientId || ''
  });
  
  const [files, setFiles] = useState(initialData?.files || []);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (submitTrigger) {
      handleSubmit();
    }
  }, [submitTrigger]);

  useImperativeHandle(ref, () => ({
    handleSubmit,
    validate,
    resetForm: () => {
      setFormData({
        title: '',
        description: '',
        comments: '',
        appointmentDate: '',
        cost: '',
        treatment: '',
        status: 'Pending',
        nextDate: '',
        patientId: patientId || ''
      });
      setFiles([]);
      setErrors({});
    }
  }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    if (!formData.appointmentDate) {
      newErrors.appointmentDate = 'Appointment date is required';
    } else {
      const appointmentDate = new Date(formData.appointmentDate);
      const now = new Date();
      if (appointmentDate < now) {
        newErrors.appointmentDate = 'Appointment date cannot be in the past';
      }
    }
    
    if (!formData.patientId) {
      newErrors.patientId = 'Patient is required';
    }
    
    if (formData.cost && formData.cost < 0) {
      newErrors.cost = 'Cost cannot be negative';
    }
    
    if (formData.nextDate) {
      const nextDate = new Date(formData.nextDate);
      const appointmentDate = new Date(formData.appointmentDate);
      if (nextDate <= appointmentDate) {
        newErrors.nextDate = 'Next appointment must be after current appointment';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    if (validate()) {
      const submissionData = {
        ...formData,
        files,
        patientId: formData.patientId || patientId,
        cost: formData.cost ? parseFloat(formData.cost) : 0,
        id: initialData?.id || Date.now(),
        createdAt: initialData?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      try {
        await onSubmit(submissionData);
      } catch (error) {
        console.error('Error submitting form:', error);
        setErrors({ submit: 'Failed to save appointment. Please try again.' });
      }
    }
    
    setIsSubmitting(false);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {initialData ? 'Edit Appointment' : 'New Appointment'}
        </Typography>
        
        {errors.submit && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.submit}
          </Alert>
        )}
        
        <Box component="form" sx={{ mt: 2 }}>
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Basic Information
              </Typography>
            </Grid>
            
            {/* Patient Selection (only show if patients array is provided) */}
            {patients.length > 0 && (
              <Grid item xs={12} md={6}>
                <FormControl fullWidth error={!!errors.patientId}>
                  <InputLabel>Patient *</InputLabel>
                  <Select
                    name="patientId"
                    value={formData.patientId}
                    onChange={handleChange}
                    label="Patient *"
                  >
                    {patients.map(patient => (
                      <MenuItem key={patient.id} value={patient.id}>
                        {patient.name}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.patientId && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                      {errors.patientId}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
            )}
            
            <Grid item xs={12} md={6}>
              <TextField
                name="title"
                label="Title"
                fullWidth
                value={formData.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.status}>
                <InputLabel>Status *</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status *"
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                  <MenuItem value="Cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Description"
                fullWidth
                multiline
                rows={3}
                value={formData.description}
                onChange={handleChange}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="comments"
                label="Comments"
                fullWidth
                multiline
                rows={2}
                value={formData.comments}
                onChange={handleChange}
                helperText="Additional notes or comments"
              />
            </Grid>

            {/* Appointment Details */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Appointment Details
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="appointmentDate"
                label="Appointment Date & Time"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.appointmentDate}
                onChange={handleChange}
                error={!!errors.appointmentDate}
                helperText={errors.appointmentDate}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="nextDate"
                label="Next Appointment Date"
                type="datetime-local"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={formData.nextDate}
                onChange={handleChange}
                helperText="Schedule follow-up appointment"
              />
            </Grid>

            {/* Treatment Information */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" gutterBottom>
                Treatment Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="treatment"
                label="Treatment"
                fullWidth
                value={formData.treatment}
                onChange={handleChange}
                helperText="Type of treatment provided"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="cost"
                label="Cost"
                type="number"
                fullWidth
                value={formData.cost}
                onChange={handleChange}
                helperText="Treatment cost in dollars"
                InputProps={{
                  startAdornment: '$'
                }}
              />
            </Grid>

            {/* File Upload */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <FileUpload onUpload={setFiles} initialFiles={files} />
            </Grid>

            {/* Submit Button */}
            {!hideSubmitButton && (
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
                  <Button 
                    variant="contained" 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !formData.title || !formData.description || !formData.appointmentDate}
                  >
                    {isSubmitting ? 'Saving...' : (initialData ? 'Update Appointment' : 'Create Appointment')}
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
});

export default IncidentForm;
