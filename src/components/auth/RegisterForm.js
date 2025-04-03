import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Container, TextField, Button, Typography, Box } from '@mui/material';
import { registerPatient, registerDoctor, registerReceptionist } from '../../services/user';

const RegisterForm = ({ handleError, userType }) => {
  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [dob, setDob] = useState(''); 
  const [errors, setErrors] = useState({});
  const router = useRouter();

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!userName) validationErrors.userName = 'User Name is required';
    if (!email) {
      validationErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      validationErrors.email = 'Email is not valid';
    }
    if (!password) validationErrors.password = 'Password is required';

    if (userType === 'Doctor' && !specialty) {
      validationErrors.specialty = 'Specialty is required';
    }

    if (userType === 'Patient' && !dob) {
      validationErrors.dob = 'Date of birth is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      if (userType === 'Patient') {
        await registerPatient(userName, email, password, dob);
      } else if (userType === 'Doctor') {
        await registerDoctor(userName, email, password, specialty);
      } else if (userType === 'Receptionist') {
        await registerReceptionist(userName, email, password);
      }

      router.push('/auth/login'); 
    } catch (error) {
      handleError(error.message || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Register as {userType}
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="User Name"
            fullWidth
            margin="normal"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            error={!!errors.userName}
            helperText={errors.userName}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!errors.password}
            helperText={errors.password}
          />

          {userType === 'Doctor' && (
            <TextField
              label="Specialty"
              fullWidth
              margin="normal"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              error={!!errors.specialty}
              helperText={errors.specialty}
            />
          )}

          {userType === 'Patient' && (
            <TextField
              label="Date of Birth"
              type="date"
              fullWidth
              margin="normal"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              error={!!errors.dob}
              helperText={errors.dob}
              InputLabelProps={{
                shrink: true,
              }}
            />
          )}

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Register
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default RegisterForm;
