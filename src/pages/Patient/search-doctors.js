import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { Container, Typography, TextField, Grid, Card, CardContent, CardActions, Button, Box, Alert } from '@mui/material';
import Link from 'next/link';
import axios from 'axios';

const SearchDoctors = () => {
  const router = useRouter();
  const [searchSpecialty, setSearchSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(() => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = localStorage.getItem('token');
      const userString = localStorage.getItem('user');
      
      if (!token || !userString) return false;
      
      const user = JSON.parse(userString);
      
      if (user.role?.toLowerCase() !== 'patient') {
        console.error('Access denied: The user is not a patient', user);
        return false;
      }
      
      return { token, user };
    } catch (e) {
      console.error('Error parsing user data:', e);
      return false;
    }
  }, []);

  const fetchDoctors = useCallback(async (token) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Fetching doctors with token:', token);
      
      const response = await axios.get('http://localhost:3001/api/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        validateStatus: (status) => status < 500
      });

      console.log('API Response:', response);

      if (response.status === 401 || response.status === 403) {
        throw new Error(response.data?.message || 'Unauthorized');
      }

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response format');
      }

      setDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      setError(error.message || 'Error loading doctors');
      
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.warn('Invalid session. Verifying before removing...');
        
        setTimeout(() => {
          if (!localStorage.getItem('token')) {
            localStorage.removeItem('user');
            router.push('/auth/login');
          }
        }, 2000);  
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    const authData = checkAuth();
    
    if (!authData) {
      console.log('No valid session - redirecting to login');
      router.push('/auth/login');
      return;
    }
    
    fetchDoctors(authData.token);
  }, [checkAuth, fetchDoctors, router]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Typography variant="h6">Loading doctors...</Typography>
      </Box>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom sx={{ mt: 3 }}>
        Search Doctors
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error.includes('Unauthorized') ? 'You do not have permission to access this page' : error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search by Specialty"
          placeholder="e.g., Cardiology"
          value={searchSpecialty}
          onChange={(e) => setSearchSpecialty(e.target.value)}
        />
      </Box>

      <Grid container spacing={3}>
        {doctors.filter((doctor) =>
          doctor.specialty.toLowerCase().includes(searchSpecialty.toLowerCase())
        ).map((doctor) => (
          <Grid item xs={12} sm={6} md={4} key={doctor._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">Dr. {doctor.username}</Typography>
                <Typography variant="body2"><strong>Specialty:</strong> {doctor.specialty}</Typography>
              </CardContent>
              <CardActions>
                <Link href={`/Patient/doctor-profile/${doctor._id}`} passHref> 
                  <Button size="small" color="primary">See profile</Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SearchDoctors;