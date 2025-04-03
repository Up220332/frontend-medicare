import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Box, CircularProgress, 
  Card, Avatar, Dialog, DialogTitle, DialogContent, DialogActions, 
  TextField, Grid, Button, Chip, Paper
} from '@mui/material';
import { 
  CalendarToday, AccessTime, MedicalServices, Edit, Delete, Schedule, Check, Close, Payment
} from '@mui/icons-material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from 'axios';
import { format, parseISO, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

const DoctorSchedule = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updatedAppointment, setUpdatedAppointment] = useState({
    service: '',
    price: 0,
    appointmentDate: '',
    notes: '',
    status: 'scheduled'
  });
  const [openDialog, setOpenDialog] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`http://localhost:3001/api/appointments/doctor/${user.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        console.log("Doctor's Appointments from API:", response.data);
        setAppointments(response.data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const handleEventClick = (info) => {
    const appointment = appointments.find(app => app.id === info.event.id);
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

  const handleStatusChange = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:3001/api/appointments/${selectedAppointment.id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setAppointments(prev =>
        prev.map(app => app.id === selectedAppointment.id ? { ...app, status } : app)
      );
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleDeleteAppointment = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/api/appointments/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(appointments.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting appointment:', error);
    }
  };

  const calendarEvents = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.patientId?.username || 'Paciente'} - ${appointment.service}`,
    start: new Date(appointment.appointmentDate),
    color: appointment.status === 'completed' ? '#4caf50' :
           appointment.status === 'canceled' ? '#f44336' : '#2196f3'
  }));

  // Calcular ganancias incluyendo TODAS las citas
  const today = new Date();
  const currentWeekStart = startOfWeek(today);
  const currentWeekEnd = endOfWeek(today);

  const totalDay = appointments
    .filter(app => new Date(app.appointmentDate).toDateString() === today.toDateString())
    .reduce((sum, app) => sum + Number(app.price), 0);

  const totalWeek = appointments
    .filter(app => isWithinInterval(new Date(app.appointmentDate), { start: currentWeekStart, end: currentWeekEnd }))
    .reduce((sum, app) => sum + Number(app.price), 0);

  const totalMonth = appointments
    .filter(app => new Date(app.appointmentDate).getMonth() === today.getMonth() && new Date(app.appointmentDate).getFullYear() === today.getFullYear())
    .reduce((sum, app) => sum + Number(app.price), 0);

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
          <Typography variant="h4">Doctor's Schedule</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Manage your appointments and earnings
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
          events={calendarEvents}
          eventClick={handleEventClick}
          height="auto"
        />
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Payment sx={{ mr: 1 }} /> Earnings Summary
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">Today</Typography>
              <Typography variant="h6" color="primary">
                ${totalDay.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">This Week</Typography>
              <Typography variant="h6" color="primary">
                ${totalWeek.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper elevation={2} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle1">This Month</Typography>
              <Typography variant="h6" color="primary">
                ${totalMonth.toFixed(2)}
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Card>
    </Container>
  );
};

export default DoctorSchedule;
