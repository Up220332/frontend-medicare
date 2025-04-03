import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, 
  Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, 
  Paper, CircularProgress, Button,
  Chip, TextField, Avatar, Alert
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';
import { Search as SearchIcon, Person } from '@mui/icons-material';

const PatientManagement = () => {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');

        const { data: appointmentsResponse } = await axios.get('http://localhost:3001/api/appointments/doctor', {
          headers: { Authorization: `Bearer ${token}` }
        });

        setAppointments(appointmentsResponse);

        const patientIds = [...new Set(appointmentsResponse.map(a => a.patientId))];

        const patientsData = await Promise.all(
          patientIds.map(patientId => 
            axios.get(`http://localhost:3001/api/patients/${patientId}`, {
              headers: { Authorization: `Bearer ${token}` }
            }).then(res => res.data)
          )
        );

        const patientsWithAppointments = patientsData.map(patient => {
          const patientAppointments = appointmentsResponse.filter(a => a.patientId === patient.id);
          const lastAppointment = patientAppointments.length > 0 
            ? patientAppointments.reduce((latest, current) => 
                new Date(current.appointmentDate) > new Date(latest.appointmentDate) ? current : latest
              )
            : null;

          return {
            ...patient,
            lastAppointment: lastAppointment?.appointmentDate,
            appointmentId: lastAppointment?._id
          };
        });

        setPatients(patientsWithAppointments);
        setError(null);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Error al cargar los datos. Por favor intenta nuevamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
    );
  }

  if (error) {
    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
          <Button 
            variant="contained" 
            onClick={() => window.location.reload()}
            startIcon={<Person />}
          >
            Reintentar
          </Button>
        </Container>
    );
  }

  return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Typography variant="h4" component="h1">
            Gestión de Pacientes
          </Typography>
          <Button 
            variant="contained" 
            onClick={() => router.push('/Doctor/patient-management/new')}
            startIcon={<Person />}
          >
            Nuevo Paciente
          </Button>
        </Box>

        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Buscar por nombre o email..."
            InputProps={{
              startAdornment: <SearchIcon color="action" sx={{ mr: 1 }} />
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Paciente</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Contacto</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Última Cita</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="right">Acciones</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPatients.length > 0 ? (
                filteredPatients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ width: 40, height: 40, mr: 2 }}>
                          {patient.username?.charAt(0) || <Person />}
                        </Avatar>
                        <Box>
                          <Typography fontWeight="medium">{patient.username}</Typography>
                          {patient.gender && (
                            <Chip 
                              label={patient.gender} 
                              size="small" 
                              sx={{ mt: 0.5 }}
                            />
                          )}
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography>{patient.email}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {patient.phone || 'Sin teléfono'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {patient.lastAppointment ? 
                        new Date(patient.lastAppointment).toLocaleDateString() : 
                        'Sin citas'}
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => router.push(`/Doctor/patient-management/${patient.id}`)}
                        sx={{ mr: 1 }}
                      >
                        Historial
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => router.push(`/Doctor/patient-management/${patient.id}/appointment`)}
                      >
                        Nueva Cita
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      {searchTerm ? 'No se encontraron pacientes' : 'No tienes pacientes registrados'}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
  );
};

export default PatientManagement;
