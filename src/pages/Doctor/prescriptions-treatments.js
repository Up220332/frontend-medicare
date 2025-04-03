import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, List, ListItem, 
  ListItemText, Paper, Box, TextField, Card,
  Dialog, DialogTitle, DialogContent, DialogActions,
  IconButton, Grid
} from '@mui/material';
import {
  PictureAsPdf, Edit, Delete, Add
} from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
import { format } from 'date-fns';

const PrescriptionsAndTreatments = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentPrescription, setCurrentPrescription] = useState({
    patientId: '',
    weight: '',
    height: '',
    medication: '',
    dosage: '',
    instructions: '',
    prescriptionDate: format(new Date(), 'yyyy-MM-dd')
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));

        const patientsResponse = await axios.get('http://localhost:3001/api/patients', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(patientsResponse.data);

        const prescriptionsResponse = await axios.get('http://localhost:3001/api/prescriptions', {
          headers: { Authorization: `Bearer ${token}` },
          params: { doctorId: user.id }
        });
        setPrescriptions(prescriptionsResponse.data);

      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
  };

  const handleOpenDialog = (prescription = null) => {
    if (prescription) {
      setCurrentPrescription({
        _id: prescription._id,
        patientId: prescription.patientId,
        weight: prescription.weight,
        height: prescription.height,
        medication: prescription.medication,
        dosage: prescription.dosage,
        instructions: prescription.instructions,
        prescriptionDate: format(new Date(prescription.prescriptionDate), 'yyyy-MM-dd')
      });
    } else {
      setCurrentPrescription({
        patientId: selectedPatient?._id || '',
        weight: '',
        height: '',
        medication: '',
        dosage: '',
        instructions: '',
        prescriptionDate: format(new Date(), 'yyyy-MM-dd')
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentPrescription(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSavePrescription = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));

      if (currentPrescription._id) {
        await axios.put(
          `http://localhost:3001/api/prescriptions/${currentPrescription._id}`,
          { ...currentPrescription, doctorId: user.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/prescriptions',
          { ...currentPrescription, doctorId: user.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      const response = await axios.get('http://localhost:3001/api/prescriptions', {
        headers: { Authorization: `Bearer ${token}` },
        params: { doctorId: user.id }
      });
      setPrescriptions(response.data);
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving prescription:', error);
    }
  };

  const handleDeletePrescription = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/prescriptions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPrescriptions(prescriptions.filter(p => p._id !== id));
    } catch (error) {
      console.error('Error deleting prescription:', error);
    }
  };

  const handleGeneratePDF = (prescription) => {
    const doc = new jsPDF();
    
    doc.setFontSize(18);
    doc.text('Medical Prescription', 105, 20, { align: 'center' });
    doc.setFontSize(12);
    doc.text(`Date: ${format(new Date(prescription.prescriptionDate), 'PP')}`, 15, 40);
    
    doc.setFontSize(14);
    doc.text('Patient Information:', 15, 60);
    doc.setFontSize(12);
    doc.text(`Weight: ${prescription.weight} kg`, 15, 80);
    doc.text(`Height: ${prescription.height} cm`, 15, 90);
    
    doc.setFontSize(14);
    doc.text('Prescription Details:', 15, 110);
    doc.setFontSize(12);
    doc.text(`Medication: ${prescription.medication}`, 15, 120);
    doc.text(`Dosage: ${prescription.dosage}`, 15, 130);

    const splitInstructions = doc.splitTextToSize(prescription.instructions, 180);
    doc.text('Instructions:', 15, 150);
    doc.text(splitInstructions, 15, 160);
    
    doc.setFontSize(10);
    doc.text('Doctor Signature: ________________________', 15, 280);
    
    doc.save(`prescription-${prescription._id}.pdf`);
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Prescriptions & Treatments</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2 }}>
            <Typography variant="h6">Patients List</Typography>
            <List>
              {patients.map((patient) => (
                <ListItem 
                  button 
                  key={patient._id} 
                  onClick={() => handleSelectPatient(patient)}
                  selected={selectedPatient?._id === patient._id}
                >
                  <ListItemText primary={patient.username} />
                </ListItem>
              ))}
            </List>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 3 }}>
            <Box sx={{ mb: 2 }}>
              <Button 
                variant="contained" 
                startIcon={<Add />} 
                onClick={() => handleOpenDialog()}
                disabled={!selectedPatient}
              >
                New Prescription
              </Button>
            </Box>
            
            {selectedPatient ? (
              <List>
                {prescriptions
                  .filter(p => p.patientId === selectedPatient?._id)
                  .map((prescription) => (
                    <Paper key={prescription._id} sx={{ p: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="subtitle1">
                          {prescription.medication} - {prescription.dosage}
                        </Typography>
                        <Box>
                          <IconButton onClick={() => handleGeneratePDF(prescription)} color="primary">
                            <PictureAsPdf />
                          </IconButton>
                          <IconButton onClick={() => handleOpenDialog(prescription)}>
                            <Edit />
                          </IconButton>
                          <IconButton onClick={() => handleDeletePrescription(prescription._id)} color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body2" sx={{ mt: 1 }}>
                        {prescription.instructions}
                      </Typography>
                    </Paper>
                  ))
                }
              </List>
            ) : (
              <Typography variant="body1" sx={{ mt: 2 }}>
                Please select a patient to view or create prescriptions
              </Typography>
            )}
          </Card>
        </Grid>
      </Grid>

      {/* Dialog for adding/editing prescriptions */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {currentPrescription._id ? 'Edit Prescription' : 'Create New Prescription'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Weight (kg)"
                name="weight"
                value={currentPrescription.weight}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Height (cm)"
                name="height"
                value={currentPrescription.height}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Medication"
                name="medication"
                value={currentPrescription.medication}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dosage"
                name="dosage"
                value={currentPrescription.dosage}
                onChange={handleInputChange}
                margin="normal"
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Instructions"
                name="instructions"
                value={currentPrescription.instructions}
                onChange={handleInputChange}
                margin="normal"
                multiline
                rows={4}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Prescription Date"
                name="prescriptionDate"
                type="date"
                value={currentPrescription.prescriptionDate}
                onChange={handleInputChange}
                margin="normal"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSavePrescription} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PrescriptionsAndTreatments;