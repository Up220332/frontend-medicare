import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, Card, CircularProgress, Box, Chip, TextField, Button, MenuItem } from '@mui/material';
import axios from 'axios';
import { AccessTime, Payment, LocationOn, MedicalServices, Person } from '@mui/icons-material';

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [appointmentData, setAppointmentData] = useState({
    date: '',
    time: '',
    service: '',
  });

  const router = useRouter();
  const { id: doctorId } = router.query; // Extraer doctorId de la URL

  useEffect(() => {
    const fetchDoctorInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/doctors/${doctorId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setDoctor(response.data);
      } catch (error) {
        console.error('Error fetching doctor info:', error);
      } finally {
        setLoading(false);
      }
    };

    if (doctorId) {
      fetchDoctorInfo();
    }
  }, [doctorId]);

  const handleInputChange = (event) => {
    setAppointmentData({ ...appointmentData, [event.target.name]: event.target.value });
  };

  const handleConfirmAppointment = async () => {
    if (!appointmentData.date || !appointmentData.time || !appointmentData.service) {
      alert("Por favor, completa todos los campos antes de enviar la cita.");
      return;
    }

    try {
      const patient = JSON.parse(localStorage.getItem('user'));
      const patientId = patient?.id;

      if (!doctorId || !patientId) {
        alert("Error: No se encontró el doctor o el paciente.");
        return;
      }

      const formattedDate = `${appointmentData.date}T${appointmentData.time}:00.000Z`;

      const newAppointment = {
        doctorId,
        patientId,
        service: appointmentData.service,
        price: 30, // Puedes ajustar el precio según el servicio
        appointmentDate: formattedDate,
      };

      await axios.post(`http://localhost:3001/api/appointments`, newAppointment, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      alert('¡Cita creada correctamente!');
      setAppointmentData({ date: '', time: '', service: '' });

    } catch (error) {
      console.error('Error al confirmar cita:', error);
      alert(`Error al crear cita: ${error.response?.data?.message || 'Error inesperado'}`);
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
      <Card sx={{ p: 3, mt: 4 }}>
        <Typography variant="h4">Dr. {doctor?.username || 'Unknown'}</Typography>
        <Typography variant="body1"><strong>Especialidad:</strong> {doctor?.specialty || 'Not specified'}</Typography>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <LocationOn sx={{ mr: 1 }} /> Dirección
        </Typography>
        <Typography variant="body1">{doctor?.address || 'Not specified'}</Typography>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <Person sx={{ mr: 1 }} /> Tipo de Paciente
        </Typography>
        <Typography variant="body1">{doctor?.patientType || 'Not specified'}</Typography>
      </Card>

      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
          <MedicalServices sx={{ mr: 1 }} /> Servicios y Precios
        </Typography>
        {doctor?.services?.length > 0 ? (
          doctor.services.map((service, index) => (
            <Box key={index} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="body2">{service.name} - ${service.price}</Typography>
            </Box>
          ))
        ) : (
          <Typography color="text.secondary">No services registered</Typography>
        )}
      </Card>

      {/* 🔹 FORMULARIO PARA CREAR UNA CITA 🔹 */}
      <Card sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6">Reservar una Cita</Typography>

        <TextField 
          label="Fecha (YYYY-MM-DD)"
          name="date"
          type="date"
          fullWidth
          value={appointmentData.date}
          onChange={handleInputChange}
          sx={{ my: 2 }}
        />

        <TextField 
          label="Hora (HH:MM)"
          name="time"
          type="time"
          fullWidth
          value={appointmentData.time}
          onChange={handleInputChange}
          sx={{ my: 2 }}
        />

        <TextField 
          label="Servicio"
          name="service"
          select
          fullWidth
          value={appointmentData.service}
          onChange={handleInputChange}
          sx={{ my: 2 }}
        >
          {doctor?.services?.map((service, index) => (
            <MenuItem key={index} value={service.name}>{service.name} - ${service.price}</MenuItem>
          ))}
        </TextField>
        <Button variant="contained" onClick={handleConfirmAppointment}>Confirmar Cita</Button>
      </Card>
    </Container>
  );
};

export default DoctorProfile;
