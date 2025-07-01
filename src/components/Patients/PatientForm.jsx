import React, { useState, useEffect } from 'react';
import { 
  TextField, 
  Button, 
  Box,
  Grid,
  Typography,
  MenuItem,
  Chip,
  Paper,
  Divider,
  InputAdornment
} from '@mui/material';
import { 
  Person,
  Cake,
  Phone,
  Email,
  LocationOn,
  HealthAndSafety,
  ContactEmergency,
  Bloodtype,
  Security
} from '@mui/icons-material';

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const insuranceProviders = [
  'Delta Dental Plus',
  'MetLife Dental',
  'Guardian Dental',
  'Cigna Dental',
  'Aetna Dental',
  'Blue Cross Blue Shield',
  'Humana Dental',
  'Other'
];

export default function PatientForm({ open, patient, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    contact: '',
    email: '',
    address: '',
    emergencyContact: '',
    healthInfo: '',
    bloodType: '',
    insurance: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || '',
        dob: patient.dob || '',
        contact: patient.contact || '',
        email: patient.email || '',
        address: patient.address || '',
        emergencyContact: patient.emergencyContact || '',
        healthInfo: patient.healthInfo || '',
        bloodType: patient.bloodType || '',
        insurance: patient.insurance || ''
      });
    } else {
      setFormData({
        name: '',
        dob: '',
        contact: '',
        email: '',
        address: '',
        emergencyContact: '',
        healthInfo: '',
        bloodType: '',
        insurance: ''
      });
    }
    setErrors({});
  }, [patient, open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.dob) newErrors.dob = 'Date of birth is required';
    if (!formData.contact.trim()) newErrors.contact = 'Contact number is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (formData.contact && !/^\d{10,}$/.test(formData.contact.replace(/\D/g, ''))) {
      newErrors.contact = 'Please enter a valid phone number (at least 10 digits)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  if (!open) return null;

  return (
    <Paper elevation={0} sx={{ p: 3 }}>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          {/* Personal Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center' }}>
              <Person sx={{ mr: 1, color: 'primary.main' }} />
              Personal Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date of Birth"
              name="dob"
              type="date"
              value={formData.dob}
              onChange={handleChange}
              error={!!errors.dob}
              helperText={errors.dob}
              required
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Cake color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone Number"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              error={!!errors.contact}
              helperText={errors.contact}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Phone color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              multiline
              rows={2}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOn color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Emergency Contact"
              name="emergencyContact"
              value={formData.emergencyContact}
              onChange={handleChange}
              placeholder="Name - Phone Number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <ContactEmergency color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Medical Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom fontWeight="bold" sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <HealthAndSafety sx={{ mr: 1, color: 'primary.main' }} />
              Medical Information
            </Typography>
            <Divider sx={{ mb: 2 }} />
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Blood Type"
              name="bloodType"
              value={formData.bloodType}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Bloodtype color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Select Blood Type</em>
              </MenuItem>
              {bloodTypes.map((type) => (
                <MenuItem key={type} value={type}>
                  {type}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Insurance Provider"
              name="insurance"
              value={formData.insurance}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Security color="action" />
                  </InputAdornment>
                ),
              }}
            >
              <MenuItem value="">
                <em>Select Insurance Provider</em>
              </MenuItem>
              {insuranceProviders.map((provider) => (
                <MenuItem key={provider} value={provider}>
                  {provider}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Health Information & Allergies"
              name="healthInfo"
              value={formData.healthInfo}
              onChange={handleChange}
              multiline
              rows={3}
              placeholder="Please list any allergies, medical conditions, medications, or other relevant health information..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <HealthAndSafety color="action" />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {/* Form Actions */}
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button 
                onClick={onClose}
                variant="outlined"
                size="large"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1565c0 30%, #1976d2 90%)',
                  },
                }}
              >
                {patient ? 'Update Patient' : 'Add Patient'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
}
