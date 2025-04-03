import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  Paper, 
  Box, 
  Avatar,
  IconButton,
  CircularProgress,
  Alert,
  Divider,
  Chip
} from '@mui/material';
import { PictureAsPdf, MedicalServices } from '@mui/icons-material';
import axios from 'axios';
import jsPDF from 'jspdf';
import { useRouter } from 'next/router';
import { format } from 'date-fns';

const PatientPrescriptions = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      if (typeof window === 'undefined') return;
      
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;

      if (!token || !user) {
        router.push('/auth/login');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const headers = { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        // 1. Obtener información del paciente
        const patientResponse = await axios.get(`http://localhost:3001/api/users/${user.id}`, { headers });
        setPatientInfo(patientResponse.data);

        // 2. Obtener prescripciones con formato consistente
        const prescriptionsResponse = await axios.get('http://localhost:3001/api/prescriptions', { 
          headers,
          params: { patientId: user.id }
        });

        // Transformar datos para formato consistente
        const formattedPrescriptions = prescriptionsResponse.data.map(presc => ({
          ...presc,
          prescriptionDate: format(new Date(presc.prescriptionDate), 'MMM dd, yyyy')
        }));

        setPrescriptions(formattedPrescriptions);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err.response?.data?.message || 'Error loading prescriptions');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  const handleGeneratePDF = (prescription) => {
    const doc = new jsPDF();
    
    // Configuración idéntica al PDF del doctor
    doc.setFont('helvetica', 'normal');
    
    // 1. Título centrado
    doc.setFontSize(18);
    doc.text('Medical Prescription', 105, 25, { align: 'center' });
    
    // 2. Fecha (formato idéntico)
    doc.setFontSize(12);
    doc.text(`Date: ${prescription.prescriptionDate}`, 20, 45);
    
    // 3. Información del paciente
    doc.setFontSize(14);
    doc.text('Patient Information:', 20, 65);
    doc.setFontSize(12);
    doc.text(`Weight: ${prescription.weight || 'N/A'} kg`, 30, 75);
    doc.text(`Height: ${prescription.height || 'N/A'} cm`, 30, 85);
    
    // 4. Detalles de prescripción
    doc.setFontSize(14);
    doc.text('Prescription Details:', 20, 105);
    doc.setFontSize(12);
    doc.text(`Medication: ${prescription.medication}`, 30, 115);
    doc.text(`Dosage: ${prescription.dosage}`, 30, 125);
    
    // 5. Instrucciones con salto de línea
    doc.text('Instructions:', 20, 145);
    const splitInstructions = doc.splitTextToSize(prescription.instructions, 160);
    doc.text(splitInstructions, 30, 155);
    
    // 6. Firma idéntica
    doc.text('Doctor Signature: ________________', 20, 185);
    
    doc.save(`prescription-${prescription._id}.pdf`);
  };

  const downloadPDFFromServer = async (prescriptionId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:3001/api/prescriptions/${prescriptionId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `prescription-${prescriptionId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      // Generar localmente si falla la descarga
      const presc = prescriptions.find(p => p._id === prescriptionId);
      if (presc) handleGeneratePDF(presc);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 4, mt: 4 }}>
        <Avatar sx={{ width: 80, height: 80, mr: 3, bgcolor: 'primary.main' }}>
          <MedicalServices fontSize="large" />
        </Avatar>
        <Box>
          <Typography variant="h4">My Medical Prescriptions</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Complete history of your medical treatments
          </Typography>
        </Box>
      </Box>

      <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
        {prescriptions.length === 0 ? (
          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
            You have no registered medical prescriptions.
          </Typography>
        ) : (
          <List>
            {prescriptions.map((prescription) => (
              <React.Fragment key={prescription._id}>
                <ListItem sx={{ py: 3, flexDirection: 'column', alignItems: 'flex-start' }}>
                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="h6">{prescription.medication}</Typography>
                    <Chip label={prescription.prescriptionDate} size="small" />
                  </Box>
                  
                  <Typography variant="body2" color="text.secondary" paragraph>
                    <strong>Dosage:</strong> {prescription.dosage}
                  </Typography>
                  
                  <Typography variant="body2" paragraph>
                    <strong>Instructions:</strong> {prescription.instructions}
                  </Typography>

                  <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Weight:</strong> {prescription.weight} kg
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <strong>Height:</strong> {prescription.height} cm
                      </Typography>
                    </Box>
                    
                    <Button
                      variant="contained"
                      startIcon={<PictureAsPdf />}
                      onClick={() => downloadPDFFromServer(prescription._id)}
                    >
                      Download PDF
                    </Button>
                  </Box>
                </ListItem>
                <Divider />
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default PatientPrescriptions;