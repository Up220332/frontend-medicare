import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        backgroundColor: '#1976d2', 
        color: '#fff', 
        textAlign: 'center',
        marginTop: 'auto', 
      }}
    >
      <Typography variant="body2">
        &copy; {new Date().getFullYear()} MediCare
      </Typography>
    </Box>
  );
};

export default Footer;