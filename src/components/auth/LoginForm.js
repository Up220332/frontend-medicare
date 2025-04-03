import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Link as MuiLink } from '@mui/material';
import { login } from '../../services/auth';
import { useRouter } from 'next/router';
import Link from 'next/link'; // Importación añadida para Next.js Link

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
      const { token, user } = await login(credentials.email, credentials.password);
      
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        role: user.role,
        email: user.email,
        username: user.username
      }));
  
      const redirectPath = {
        'Doctor': '/Doctor',
        'Patient': '/Patient',
        'Receptionist': '/Receptionist'
      }[user.role] || '/';
      
      router.push(redirectPath);
    } catch (err) {
      setError(err.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    console.log('Estado del formulario actualizado:', credentials);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Email"
        name="email"
        type="email"
        fullWidth
        margin="normal"
        required
        value={credentials.email}
        onChange={handleChange}
      />
      
      <TextField
        label="Password"
        name="password"
        type="password"
        fullWidth
        margin="normal"
        required
        value={credentials.password}
        onChange={handleChange}
      />
      
      {error && (
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      )}

      <Button 
        type="submit" 
        variant="contained" 
        fullWidth 
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? 'Cargando...' : 'Iniciar sesión'}
      </Button>
      
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        <MuiLink component={Link} href="/auth/register" underline="hover">
          Don&apos;t have an account? Sign up
        </MuiLink>
      </Box>
    </Box>
  );
};

export default LoginForm;