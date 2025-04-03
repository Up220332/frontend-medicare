import React from 'react';
import { Container, Typography } from '@mui/material';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <LoginForm />
    </Container>
  );
};

export default LoginPage;
