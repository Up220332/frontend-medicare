import React from 'react';
import { Typography, Container, Button, Box, Stack } from '@mui/material';
import Link from 'next/link';
import {
  LocalHospital as DoctorIcon,
  Person as PatientIcon,
  AssignmentInd as ReceptionistIcon,
} from '@mui/icons-material';

const RegisterTypePage = () => {
  return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Register as:
      </Typography>
      <Box sx={{ mt: 4, maxWidth: '400px', margin: '0 auto' }}>
        <Stack spacing={2}>
          <Link href="/auth/register?type=Doctor" passHref>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <DoctorIcon />
              Doctor
            </Button>
          </Link>
          <Link href="/auth/register?type=Patient" passHref>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <PatientIcon />
              Patient
            </Button>
          </Link>
          <Link href="/auth/register?type=Receptionist" passHref>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 2 }}
            >
              <ReceptionistIcon />
              Receptionist
            </Button>
          </Link>
        </Stack>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2">
          You already have an account? <a href="/auth/login">Login</a>
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterTypePage;