import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, Button, Card, 
  Grid, Divider, IconButton, TextField,
  Chip, Dialog, DialogTitle, DialogContent,
  DialogActions, CircularProgress, Avatar
} from '@mui/material';
import {
  Edit, AccessTime, Payment,
  Person, Add, Delete,
  Email, LocationOn, MedicalServices
} from '@mui/icons-material';
import axios from 'axios';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState({ field: null, value: '' });
  const [openServiceDialog, setOpenServiceDialog] = useState(false);
  const [newService, setNewService] = useState({ name: '', price: '' });
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchDoctorProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/doctors/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDoctorProfile();
    }
  }, [user]);

  const handleEdit = (field, value) => {
    setEditing({ field, value });
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3001/api/doctors/${user.id}`,
        { [editing.field]: editing.value },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDoctor(response.data);
      setEditing({ field: null, value: '' });
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleServiceSave = async () => {
    try {
      const updatedServices = [...(doctor.services || []), newService];
      const response = await axios.put(
        `http://localhost:3001/api/doctors/${user.id}`,
        { services: updatedServices },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDoctor(response.data);
      setOpenServiceDialog(false);
      setNewService({ name: '', price: '' });
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleServiceDelete = async (index) => {
    try {
      const updatedServices = doctor.services.filter((_, i) => i !== index);
      const response = await axios.put(
        `http://localhost:3001/api/doctors/${user.id}`,
        { services: updatedServices },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDoctor(response.data);
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const togglePaymentMethod = async (method) => {
    try {
      const currentAccepts = doctor.accepts || [];
      const updatedAccepts = currentAccepts.includes(method)
        ? currentAccepts.filter(m => m !== method)
        : [...currentAccepts, method];
      
      const response = await axios.put(
        `http://localhost:3001/api/doctors/${user.id}`,
        { accepts: updatedAccepts },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      setDoctor(response.data);
    } catch (error) {
      console.error('Error updating payment methods:', error);
    }
  };

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
          <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
            {doctor?.username?.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4">{doctor?.username}</Typography>
            <Typography variant="subtitle1" color="text.secondary">
              {doctor?.specialty}
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <MedicalServices sx={{ mr: 1 }} /> Professional Information
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">Specialty</Typography>
                {editing.field === 'specialty' ? (
                  <Box display="flex" alignItems="center" mt={1}>
                    <TextField
                      value={editing.value}
                      onChange={(e) => setEditing({...editing, value: e.target.value})}
                      size="small"
                      fullWidth
                    />
                    <Button onClick={handleSave} sx={{ ml: 1 }}>Save</Button>
                    <Button onClick={() => setEditing({ field: null, value: '' })}>Cancel</Button>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">{doctor?.specialty}</Typography>
                    <IconButton onClick={() => handleEdit('specialty', doctor?.specialty)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">Email</Typography>
                {editing.field === 'email' ? (
                  <Box display="flex" alignItems="center" mt={1}>
                    <TextField
                      value={editing.value}
                      onChange={(e) => setEditing({...editing, value: e.target.value})}
                      size="small"
                      fullWidth
                    />
                    <Button onClick={handleSave} sx={{ ml: 1 }}>Save</Button>
                    <Button onClick={() => setEditing({ field: null, value: '' })}>Cancel</Button>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">{doctor?.email}</Typography>
                    <IconButton onClick={() => handleEdit('email', doctor?.email)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>

            <Card sx={{ mb: 3, p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOn sx={{ mr: 1 }} /> Location & Preferences
              </Typography>
              
              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">Address</Typography>
                {editing.field === 'address' ? (
                  <Box display="flex" alignItems="center" mt={1}>
                    <TextField
                      value={editing.value}
                      onChange={(e) => setEditing({...editing, value: e.target.value})}
                      size="small"
                      fullWidth
                      multiline
                      rows={2}
                    />
                    <Button onClick={handleSave} sx={{ ml: 1 }}>Save</Button>
                    <Button onClick={() => setEditing({ field: null, value: '' })}>Cancel</Button>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">{doctor?.address || 'Not specified'}</Typography>
                    <IconButton onClick={() => handleEdit('address', doctor?.address)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>

              <Box mb={2}>
                <Typography variant="body2" color="text.secondary">Patient Type</Typography>
                {editing.field === 'patientType' ? (
                  <Box display="flex" alignItems="center" mt={1}>
                    <TextField
                      value={editing.value}
                      onChange={(e) => setEditing({...editing, value: e.target.value})}
                      size="small"
                      fullWidth
                    />
                    <Button onClick={handleSave} sx={{ ml: 1 }}>Save</Button>
                    <Button onClick={() => setEditing({ field: null, value: '' })}>Cancel</Button>
                  </Box>
                ) : (
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="body1">{doctor?.patientType || 'Not specified'}</Typography>
                    <IconButton onClick={() => handleEdit('patientType', doctor?.patientType)} size="small">
                      <Edit fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <AccessTime sx={{ mr: 1 }} /> Availability
              </Typography>
              
              {editing.field === 'schedule' ? (
                <Box>
                  <TextField
                    multiline
                    rows={4}
                    fullWidth
                    value={editing.value}
                    onChange={(e) => setEditing({...editing, value: e.target.value})}
                    placeholder="Example: Monday to Friday, 9:00 AM - 6:00 PM"
                  />
                  <Box mt={1}>
                    <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>Save</Button>
                    <Button onClick={() => setEditing({ field: null, value: '' })}>Cancel</Button>
                  </Box>
                </Box>
              ) : (
                <Box>
                  <Typography whiteSpace="pre-line">
                    {doctor?.schedule || 'Not specified'}
                  </Typography>
                  <Button 
                    startIcon={<Edit />} 
                    onClick={() => handleEdit('schedule', doctor?.schedule)}
                    sx={{ mt: 1 }}
                  >
                    Edit
                  </Button>
                </Box>
              )}
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ mb: 3, p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Services and Prices</Typography>
                <Button startIcon={<Add />} onClick={() => setOpenServiceDialog(true)}>
                  Add
                </Button>
              </Box>
              
              {doctor?.services?.length > 0 ? (
                doctor.services.map((service, index) => (
                  <Box 
                    key={index} 
                    display="flex" 
                    justifyContent="space-between" 
                    alignItems="center" 
                    mb={2}
                    p={2}
                    sx={{ border: '1px solid #eee', borderRadius: 1 }}
                  >
                    <Box>
                      <Typography variant="subtitle1">{service.name}</Typography>
                      <Typography variant="body2">${service.price}</Typography>
                    </Box>
                    <IconButton onClick={() => handleServiceDelete(index)} color="error">
                      <Delete />
                    </IconButton>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">No services registered</Typography>
              )}
            </Card>

            <Card sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <Payment sx={{ mr: 1 }} /> Accepted Payment Methods
              </Typography>
              
              <Box display="flex" flexWrap="wrap" gap={1}>
                {['Cash', 'Card', 'Transfer'].map((method) => (
                  <Chip
                    key={method}
                    label={method}
                    color={doctor?.accepts?.includes(method) ? 'primary' : 'default'}
                    onClick={() => togglePaymentMethod(method)}
                    variant={doctor?.accepts?.includes(method) ? 'filled' : 'outlined'}
                  />
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>

        <Dialog open={openServiceDialog} onClose={() => setOpenServiceDialog(false)}>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Service Name"
              fullWidth
              value={newService.name}
              onChange={(e) => setNewService({...newService, name: e.target.value})}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Price"
              type="number"
              fullWidth
              value={newService.price}
              onChange={(e) => setNewService({...newService, price: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenServiceDialog(false)}>Cancel</Button>
            <Button onClick={handleServiceSave} variant="contained">Save</Button>
          </DialogActions>
        </Dialog>
      </Container>
  );
};

export default DoctorProfile;