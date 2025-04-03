import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, 
  Card, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, MenuItem, Button
} from '@mui/material';
import { 
  Schedule, AccessTime, MedicalServices, Edit
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'next/router';

const MySchedule = () => {
  const [state, setState] = useState({
    appointments: [],
    loading: true,
    selectedAppointment: null,
    updatedAppointment: {
      service: '',
      price: 0,
      appointmentDate: '',
      notes: '',
      status: 'scheduled'
    }
  });
  const [openDialog, setOpenDialog] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        
        if (!token || !user) {
          router.push('/auth/login');
          return;
        }

        const response = await axios.get(`http://localhost:3001/api/appointments/patient/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        setState(prev => ({...prev, appointments: response.data, loading: false}));
      } catch (error) {
        console.error('Error fetching appointments:', error);
        setState(prev => ({...prev, loading: false}));
      }
    };

    fetchAppointments();
  }, [router]);

  const handleEventClick = (info) => {
    const appointment = appointments.find(app => app._id === info.event.id);
    setSelectedAppointment(appointment);
    setUpdatedAppointment({
      service: appointment.service,
      price: appointment.price,
      appointmentDate: format(parseISO(appointment.appointmentDate), "yyyy-MM-dd'T'HH:mm"),
      notes: appointment.notes || '',
      status: appointment.status
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedAppointment(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedAppointment(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calendarEvents = appointments.map(appointment => ({
    id: appointment._id,
    title: `${appointment.service} - ${appointment.price}$`,
    start: new Date(appointment.appointmentDate), // 🔹 Convertimos explícitamente a Date
    color: appointment.status === 'completed' ? '#4caf50' :
           appointment.status === 'canceled' ? '#f44336' : '#2196f3'
  }));

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
          <Schedule fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4">My Schedule</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your appointments
          </Typography>
        </Box>
      </Box>

      <Card sx={{ mb: 3, p: 3 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={calendarEvents} // 🔹 Aquí debería incluir la cita del 1 de abril
          eventClick={handleEventClick}
          height="auto"
        />
      </Card>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Appointment</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="Service"
              name="service"
              value={updatedAppointment.service}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Price"
              name="price"
              type="number"
              value={updatedAppointment.price}
              onChange={handleInputChange}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              label="Date & Time"
              name="appointmentDate"
              type="datetime-local"
              value={updatedAppointment.appointmentDate}
              onChange={handleInputChange}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              label="Notes"
              name="notes"
              value={updatedAppointment.notes}
              onChange={handleInputChange}
              margin="normal"
              multiline
              rows={2}
            />
            <TextField
              select
              fullWidth
              label="Status"
              value={updatedAppointment.status}
              onChange={(e) => setUpdatedAppointment({...updatedAppointment, status: e.target.value})}
              margin="normal"
            >
              <MenuItem value="scheduled">Scheduled</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
              <MenuItem value="canceled">Canceled</MenuItem>
            </TextField>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MySchedule;
