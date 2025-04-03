import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, List, ListItem, ListItemText, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Box, Paper } from '@mui/material';
import axios from 'axios';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [openForm, setOpenForm] = useState(false);
  const [currentPatient, setCurrentPatient] = useState({
    id: '',
    name: '',
    info: '',
    history: '',
    medicalNotes: '',
    pastAppointments: '',
    treatments: ''
  });
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get('http://localhost:5000/receptionists/patients'); 
        setPatients(response.data); 
      } catch (error) {
        console.error("Error fetching patients", error);
      }
    };

    fetchPatients();
  }, []);

  const handleOpenForm = (patient = { id: '', name: '', info: '', history: '', medicalNotes: '', pastAppointments: '', treatments: '' }) => {
    setCurrentPatient(patient);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
  };

  const handleSavePatient = async () => {
    try {
      if (currentPatient.id) {
        // Update patient
        await axios.put(`http://localhost:5000/receptionists/patients/${currentPatient.id}`, currentPatient);
        setPatients(patients.map(p => (p.id === currentPatient.id ? currentPatient : p)));
      } else {
        // Add new patient
        const response = await axios.post('http://localhost:5000/receptionists/patients', currentPatient);
        setPatients([...patients, response.data]);
      }
      handleCloseForm();
    } catch (error) {
      console.error("Error saving patient", error);
    }
  };

  const handleOpenDetailsDialog = (patient) => {
    setSelectedPatient(patient);
    setOpenDetailsDialog(true);
  };

  const handleCloseDetailsDialog = () => {
    setOpenDetailsDialog(false);
    setSelectedPatient(null);
  };

  const handleInputChange = (e, field) => {
    setCurrentPatient({ ...currentPatient, [field]: e.target.value });
  };

  const handleDetailsInputChange = (e, field) => {
    setSelectedPatient({ ...selectedPatient, [field]: e.target.value });
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Patient Management
      </Typography>

      <Paper elevation={3} sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          List of Patients
        </Typography>
        <List>
          {patients.map(patient => (
            <ListItem key={patient.id} button onClick={() => handleOpenDetailsDialog(patient)}>
              <ListItemText primary={patient.name} />
              <Button onClick={() => handleOpenForm(patient)}>Edit</Button>
            </ListItem>
          ))}
        </List>
        <Button variant="contained" onClick={() => handleOpenForm()}>
          Add Patient
        </Button>
      </Paper>

      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>{currentPatient.id ? 'Edit Patient' : 'Add Patient'}</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            value={currentPatient.name}
            onChange={(e) => handleInputChange(e, 'name')}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Information"
            fullWidth
            multiline
            rows={4}
            value={currentPatient.info}
            onChange={(e) => handleInputChange(e, 'info')}
            sx={{ mb: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button onClick={handleSavePatient}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDetailsDialog} onClose={handleCloseDetailsDialog} fullWidth maxWidth="md">
        <DialogTitle>{selectedPatient ? `Edit Details of ${selectedPatient.name}` : 'Patient Details'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Information</Typography>
            <TextField
              label="Information"
              fullWidth
              multiline
              rows={4}
              value={selectedPatient?.info}
              onChange={(e) => handleDetailsInputChange(e, 'info')}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">History</Typography>
            <TextField
              label="History"
              fullWidth
              multiline
              rows={4}
              value={selectedPatient?.history}
              onChange={(e) => handleDetailsInputChange(e, 'history')}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Medical Notes</Typography>
            <TextField
              label="Medical Notes"
              fullWidth
              multiline
              rows={4}
              value={selectedPatient?.medicalNotes}
              onChange={(e) => handleDetailsInputChange(e, 'medicalNotes')}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Past Appointments</Typography>
            <TextField
              label="Past Appointments"
              fullWidth
              multiline
              rows={4}
              value={selectedPatient?.pastAppointments}
              onChange={(e) => handleDetailsInputChange(e, 'pastAppointments')}
              sx={{ mb: 2 }}
            />
          </Box>

          <Box sx={{ mb: 2 }}>
            <Typography variant="h6">Treatments</Typography>
            <TextField
              label="Treatments"
              fullWidth
              multiline
              rows={4}
              value={selectedPatient?.treatments}
              onChange={(e) => handleDetailsInputChange(e, 'treatments')}
              sx={{ mb: 2 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDetailsDialog}>Cancel</Button>
          <Button
            onClick={async () => {
              try {
                await axios.put(`http://localhost:5000/receptionists/patients/${selectedPatient.id}`, selectedPatient);
                setPatients(
                  patients.map(p => (p.id === selectedPatient.id ? selectedPatient : p))
                );
                handleCloseDetailsDialog();
              } catch (error) {
                console.error("Error updating patient", error);
              }
            }}
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PatientManagement;
