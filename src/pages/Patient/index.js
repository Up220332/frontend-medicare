import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Button, Box, Grid, 
  Card, CardContent, CardActions, CircularProgress,
  Alert, Chip
} from '@mui/material';
import {
  CalendarToday as ScheduleIcon,
  Message as MessagingIcon,
  LocalPharmacy as PrescriptionsIcon,
  Search as SearchIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const PatientHomePage = () => {
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      console.log("Token en PatientHomePage:", token); 
      console.log("User en PatientHomePage:", user);  

      if (!token || !user || user.role !== 'Patient') {
        console.warn("Token no encontrado o rol incorrecto, redirigiendo al login...");
        router.push('/auth/login');
        return;
      }

      fetchData(user.id, token);
    }
  }, []);

  const fetchData = async (patientId, token) => {
    try {
      setLoading(true);
      setError(null);

      const headers = { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      const [patientRes, appointmentsRes, messagesRes, prescriptionsRes] = await Promise.all([
        axios.get(`http://localhost:3001/api/patients/${patientId}`, { headers }).catch(() => ({ data: null })),
        axios.get(`http://localhost:3001/api/appointments/${patientId}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`http://localhost:3001/api/messages/${patientId}`, { headers }).catch(() => ({ data: [] })),
        axios.get(`http://localhost:3001/api/prescriptions/${patientId}`, { headers }).catch(() => ({ data: [] }))
      ]);

      setPatient(patientRes.data);
      setAppointments(appointmentsRes.data);
      setMessages(messagesRes.data);
      setPrescriptions(prescriptionsRes.data);

    } catch (err) {
      console.error('Error obteniendo datos del paciente:', err);
      setError('Error al cargar los datos. Inténtalo nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) fetchData(user.id, token);
  };

  const tools = [
    {
      title: 'Medical Appointments',
      description: 'Manage your upcoming medical appointments.',
      icon: <ScheduleIcon fontSize="large" color="primary" />,
      path: '/Patient/appointment-schedule',
      newItems: appointments.filter(a => a.status === 'pending').length
    },
    {
      title: 'Prescriptions',
      description: 'Your treatments and medications.',
      icon: <PrescriptionsIcon fontSize="large" color="primary" />,
      path: '/Patient/my-prescriptions-treatments',
      newItems: prescriptions.filter(p => p.status === 'active').length
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4
      }}>
        {patient ? (
          <Box>
            <Typography variant="h4" component="h1">
              Welcome, {patient.username}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>
        ) : (
          <Typography variant="h4" component="h1">
            Patient Dashboard
          </Typography>
        )}

        <Link href="/Patient/search-doctors" passHref>
          <Button 
            variant="contained" 
            startIcon={<SearchIcon />}
            size="large"
          >
            Search Doctors
          </Button>
        </Link>
      </Box>

      {error && (
        <Alert 
          severity="error" 
          sx={{ mb: 3 }}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={refreshData}
              endIcon={<WarningIcon />}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Feature cards */}
      <Grid container spacing={3}>
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              transition: 'transform 0.3s',
              '&:hover': {
                transform: 'translateY(-5px)',
                boxShadow: 3
              }
            }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  {tool.icon}
                  {tool.newItems > 0 && (
                    <Chip 
                      label={`${tool.newItems} new(s)`} 
                      color="secondary" 
                      size="small"
                    />
                  )}
                </Box>
                <Typography variant="h6" component="h3" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {tool.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Link href={tool.path} passHref>
                  <Button variant="contained" fullWidth size="medium">
                    Access
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default PatientHomePage;
