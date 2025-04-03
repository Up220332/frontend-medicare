import React, { useState } from 'react';
import { 
  Container, Box, Typography, 
  TextField, Button, Card, 
  CardContent, Alert, CircularProgress
} from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const NewPatientPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const doctorId = JSON.parse(localStorage.getItem('user')).id;

      const patientResponse = await axios.post('http://localhost:3001/api/patients', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      await axios.post('http://localhost:3001/api/medicalhistories', {
        doctorId,
        patientId: patientResponse.data._id,
        diagnosis: 'Paciente nuevo',
        prescription: 'Por determinar'
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setSuccess('Paciente creado y asociado correctamente');
      setTimeout(() => {
        router.push('/Doctor/patient-management');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear paciente');
    } finally {
      setLoading(false);
    }
  };

  return (
      <Container maxWidth="md">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom>
            Añadir Nuevo Paciente
          </Typography>
          <Typography color="text.secondary">
            Completa los datos del paciente para asociarlo a tu lista
          </Typography>
        </Box>

        <Card elevation={3}>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {error && (
                  <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                  </Alert>
                )}
                {success && (
                  <Alert severity="success" sx={{ mb: 2 }}>
                    {success}
                  </Alert>
                )}

                <TextField
                  label="Nombre Completo"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                  <Button
                    variant="outlined"
                    onClick={() => router.push('/Doctor/patient-management')}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={loading}
                  >
                    {loading ? <CircularProgress size={24} /> : 'Guardar Paciente'}
                  </Button>
                </Box>
              </Box>
            </form>
          </CardContent>
        </Card>
      </Container>
  );
};

export default NewPatientPage;