import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Grid, Card, CardContent, CircularProgress, Alert } from '@mui/material';
import { useRouter } from 'next/router';
import axios from 'axios';

const PatientProfile = () => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const router = useRouter();

  const fetchPatient = async (id, token) => {
    try {
      setLoading(true);
      
      const headers = { Authorization: `Bearer ${token}` };
      console.log("Enviando solicitud con headers:", headers); 

      const response = await axios.get(`http://localhost:3001/api/patients/${id}`, { headers });

      console.log("Datos del paciente recibidos:", response.data);
      setPatient(response.data);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        dob: response.data.dob,
      });
    } catch (err) {
      console.error("Error al obtener el perfil:", err);
      setError("Error al cargar el perfil del paciente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    console.log("Ejecutando validación de autenticación...");

    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    console.log("Token almacenado en localStorage:", storedToken);
    console.log("Usuario almacenado en localStorage:", storedUser);

    if (!storedToken || !storedUser || storedUser.role !== "Patient") {
      console.warn("Redirigiendo al login por falta de autenticación...");
      router.replace("/auth/login");
      return;
    }

    fetchPatient(storedUser.id, storedToken);
  }, [router]);

  const handleEdit = async () => {
    try {
      setLoading(true);
      const headers = { Authorization: `Bearer ${localStorage.getItem("token")}` };

      console.log("Enviando datos de actualización:", formData);

      await axios.put(`http://localhost:3001/api/patients/${patient._id}`, formData, { headers });

      setEditing(false);
      fetchPatient(patient._id, localStorage.getItem("token"));
    } catch (err) {
      console.error("Error al actualizar el perfil:", err);
      setError("Error al actualizar los datos.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <CircularProgress sx={{ display: "block", margin: "auto", mt: 5 }} />
      </Container>
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
    <Container>
      <Typography variant="h4" sx={{ mt: 3 }}>
        Perfil del Paciente
      </Typography>

      {editing ? (
        <Grid container spacing={3} sx={{ mt: 3 }}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Nombre"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Correo Electrónico"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Fecha de Nacimiento"
              type="date"
              value={formData.dob}
              onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleEdit}>
              Guardar Cambios
            </Button>
            <Button onClick={() => setEditing(false)} sx={{ ml: 2 }}>
              Cancelar
            </Button>
          </Grid>
        </Grid>
      ) : (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Typography variant="h6">Nombre: {patient?.username}</Typography>
            <Typography variant="body1">Correo: {patient?.email}</Typography>
            <Typography variant="body1">Fecha de nacimiento: {patient?.dob}</Typography>
          </CardContent>
          <Button variant="contained" color="primary" onClick={() => setEditing(true)} sx={{ mb: 2 }}>
            Editar Perfil
          </Button>
        </Card>
      )}
    </Container>
  );
};

export default PatientProfile;
