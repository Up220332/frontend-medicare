import React, { useState, useEffect } from 'react';
import { 
  Container, Box, Typography, 
  Tabs, Tab, Card, CardContent,
  List, ListItem, ListItemText,
  Divider, Chip, Button, CircularProgress
} from '@mui/material';
import { 
  MedicalInformation as MedicalIcon,
  CalendarToday as CalendarIcon,
  Person as PersonIcon,
  LocalHospital as HospitalIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';

const PatientDetailPage = () => {
  const [patient, setPatient] = useState(null);
  const [medicalHistory, setMedicalHistory] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [patientRes, historyRes] = await Promise.all([
          axios.get(`http://localhost:3001/api/patients/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get(`http://localhost:3001/api/medicalhistories?patientId=${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);
        
        setPatient(patientRes.data);
        setMedicalHistory(historyRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
    );
  }

  return (
      <Container maxWidth="lg">
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <PersonIcon sx={{ mr: 1, fontSize: 32 }} />
          <Typography variant="h4">{patient?.name}</Typography>
          <Chip 
            label={patient?.gender || 'No especificado'} 
            sx={{ ml: 2 }} 
          />
        </Box>

        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Información General" icon={<PersonIcon />} />
          <Tab label="Historial Médico" icon={<MedicalIcon />} />
          <Tab label="Citas" icon={<CalendarIcon />} />
        </Tabs>
        <Divider sx={{ mb: 3 }} />

        {activeTab === 0 && (
          <Card>
            <CardContent>
              <List>
                <ListItem>
                  <ListItemText 
                    primary="Email" 
                    secondary={patient?.email || 'No especificado'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Teléfono" 
                    secondary={patient?.phone || 'No especificado'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Edad" 
                    secondary={patient?.age || 'No especificado'} 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="Alergias" 
                    secondary={patient?.allergies?.join(', ') || 'Ninguna registrada'} 
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Box>
            {medicalHistory.length > 0 ? (
              medicalHistory.map((record) => (
                <Card key={record._id} sx={{ mb: 2 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {new Date(record.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography paragraph>
                      <strong>Diagnóstico:</strong> {record.diagnosis}
                    </Typography>
                    <Typography>
                      <strong>Tratamiento:</strong> {record.prescription}
                    </Typography>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Box textAlign="center" py={4}>
                <HospitalIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
                <Typography color="text.secondary">
                  No hay historial médico registrado
                </Typography>
              </Box>
            )}
          </Box>
        )}

        <Box sx={{ mt: 3 }}>
          <Button 
            variant="outlined" 
            onClick={() => router.push('/Doctor/patients')}
          >
            Volver a la lista
          </Button>
        </Box>
      </Container>
  );
};

export default PatientDetailPage;