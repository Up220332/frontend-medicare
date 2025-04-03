import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, Box, Paper, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid'; 
import interactionPlugin from '@fullcalendar/interaction'; 
import axios from 'axios';

const AppointmentSchedule = () => {
  const [isClient, setIsClient] = useState(false);
  const [appointments, setAppointments] = useState([]);
  const [selectedAppointment, setSelectedAppointment] = useState(null); 
  const [updatedAppointment, setUpdatedAppointment] = useState({}); 

  useEffect(() => {
    setIsClient(true);  
    fetchAppointments(); 
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  if (!isClient) {
    return null;
  }

  const calendarEvents = appointments.map((appointment) => ({
    id: appointment.id,
    title: `${appointment.patientName} - ${appointment.doctorName} - ${appointment.time} - ${appointment.cost}`,
    date: appointment.date,
  }));

  const handleEventClick = (info) => {
    const appointment = appointments.find((app) => app.id === parseInt(info.event.id));
    setSelectedAppointment(appointment);
    setUpdatedAppointment(appointment);
  };

  const handleCloseDialog = () => {
    setSelectedAppointment(null); 
  };

  const handleEditAppointment = async () => {
    try {
      await axios.put(`http://localhost:3001/api/appointments/${updatedAppointment.id}`, updatedAppointment);
      fetchAppointments(); // Refresca las citas luego de la edición
      setSelectedAppointment(null); 
    } catch (error) {
      console.error('Error updating appointment:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    return `${day}/${month}/${year}`;
  };

  const getCostAsNumber = (cost) => {
    return parseFloat(cost.replace('$', '').trim());
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const totalDay = appointments
    .filter((appointment) => appointment.date === getCurrentDate()) 
    .reduce((acc, appointment) => acc + getCostAsNumber(appointment.cost), 0);

  const totalMonth = appointments
    .filter((appointment) => appointment.date.startsWith(getCurrentDate().slice(0, 7))) 
    .reduce((acc, appointment) => acc + getCostAsNumber(appointment.cost), 0);

  const totalWeek = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      const today = new Date();
      const diffTime = Math.abs(today - appointmentDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      return diffDays <= 7; 
    })
    .reduce((acc, appointment) => acc + getCostAsNumber(appointment.cost), 0);

  return (
    <Container>
      <Paper elevation={3} sx={{ p: 2, mb: 3, marginTop: '35px' }}>
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={calendarEvents}
          eventClick={handleEventClick} 
          eventContent={(eventInfo) => (
            <div>
              <strong>{eventInfo.event.title}</strong> 
            </div>
          )}
        />
      </Paper>

      <Dialog open={Boolean(selectedAppointment)} onClose={handleCloseDialog}>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          {selectedAppointment && (
            <Box>
              <TextField
                label="Patient"
                name="patientName"
                value={updatedAppointment.patientName || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Doctor"
                name="doctorName"
                value={updatedAppointment.doctorName || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Date"
                name="date"
                value={updatedAppointment.date || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Time"
                name="time"
                value={updatedAppointment.time || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Cost"
                name="cost"
                value={updatedAppointment.cost || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone"
                name="phone"
                value={updatedAppointment.phone || ''}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
          <Button onClick={handleEditAppointment} color="primary">
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      <Paper elevation={3} sx={{ p: 2, mt: 3, marginBottom: '35px' }}>
        <Typography variant="h6">Earnings of the Day: ${totalDay.toFixed(2)}</Typography>
        <Typography variant="h6">Earnings of the Week: ${totalWeek.toFixed(2)}</Typography>
        <Typography variant="h6">Earnings of the Month: ${totalMonth.toFixed(2)}</Typography>
      </Paper>
    </Container>
  );
};

export default AppointmentSchedule;
