import React from 'react';
import { Box, Typography, Button, Grid } from '@mui/material';
import Link from 'next/link';
import { Chat as ChatIcon, LocalHospital as LocalHospitalIcon, Event as EventIcon, Search as SearchIcon,} from '@mui/icons-material';

const HomePage = () => {
  return (
    <Box>
      <Box
        sx={{
          backgroundImage: 'url(images/medical-background.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          color: '#fff',
          backgroundColor: 'rgba(23, 134, 181, 0.30)',
          backgroundBlendMode: 'multiply',
          marginLeft: '-187px',
          marginRight: '-184px',
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold', fontSize: '3rem' }}>
          MediCare
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom sx={{ mb: 4 }}>
          Tool that makes your medical life easier.
        </Typography>

        <Box sx={{ display: 'flex', gap: 3 }}>
          <Link href="/auth/login" passHref>
            <Button
              variant="contained"
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                backgroundColor: '#1976d2',
                '&:hover': { backgroundColor: '#1565c0' },
              }}
            >
              LOGIN
            </Button>
          </Link>
          <Link href="/auth/register-type" passHref>
            <Button
              variant="outlined"
              sx={{
                py: 2,
                px: 4,
                fontSize: '1.2rem',
                color: '#fff',
                borderColor: '#fff',
                '&:hover': { borderColor: '#ddd' },
              }}
            >
              REGISTER
            </Button>
          </Link>
        </Box>
      </Box>

      <Box sx={{ py: 8, px: 3, backgroundColor: '#f5f5f5', color: '#333', marginLeft: '-187px',marginRight: '-184px',}}>
        <Typography variant="h4" component="h2" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 6 }}>
          Features
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <ChatIcon sx={{ fontSize: '3rem', color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom>
              Messaging
              </Typography>
              <Typography variant="body1">
              Communicate securely with your doctors and patients.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <LocalHospitalIcon sx={{ fontSize: '3rem', color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom>
                Prescription and Medical Records
              </Typography>
              <Typography variant="body1">
                Access your prescriptions and medical treatments at any time.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <EventIcon sx={{ fontSize: '3rem', color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom>
                Appointments
              </Typography>
              <Typography variant="body1">
                Schedule and manage your appointments with your doctors.
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ textAlign: 'center' }}>
              <SearchIcon sx={{ fontSize: '3rem', color: '#1976d2', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom>
                Find Doctors
              </Typography>
              <Typography variant="body1">
                Search for doctors and specialists in your area.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default HomePage;