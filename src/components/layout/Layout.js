import React, { useState, useContext } from 'react';
import NavBar from './NavBar';
import Footer from './Footer';
import { Container, Typography, Box } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext) || {}; 

  const handleError = (message) => {
    setError(message);
    setTimeout(() => setError(null), 5000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isAuthenticated && <NavBar />} 
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
