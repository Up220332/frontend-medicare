'use client'; // Esto es crucial para Next.js 13+
import React, { useState, useContext } from 'react';
import dynamic from 'next/dynamic';
import { Container, Typography, Box, CircularProgress } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Footer from './Footer';

// Carga el NavBar dinámicamente sin SSR
const DynamicNavBar = dynamic(() => import('./NavBar'), {
  ssr: false,
  loading: () => (
    <Box sx={{ height: '64px' }}> {/* Altura aproximada del NavBar */}
      <CircularProgress />
    </Box>
  )
});

const Layout = ({ children }) => {
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext) || {}; 

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthenticated && <DynamicNavBar />}
      <Container component="main" sx={{ flexGrow: 1 }}>
        {error && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body1" color="error">
              {error}
            </Typography>
          </Box>
        )}
        {React.cloneElement(children, { handleError })}
      </Container>
      <Footer />
    </div>
  );
};

export default Layout;