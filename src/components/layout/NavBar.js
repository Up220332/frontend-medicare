'use client'; // Esto es crucial para Next.js 13+
import React, { useState, useEffect, useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Image from 'next/image';
import dynamic from 'next/dynamic';

// Carga los componentes dinámicamente
const DynamicNavMenu = dynamic(() => import('./Navmenu'), { ssr: false });

const NavBar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const renderNavBarContent = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Image 
          src="/images/logo.png" 
          alt="Logo MediCare" 
          width={50} 
          height={50} 
          style={{ marginRight: '10px' }} 
          priority
        />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#fff' }}>
          MediCare
        </Typography>
      </Box>
    );
  };

  if (!mounted) return null; // Evita renderizado en servidor

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: '#1976d2',
        boxShadow: 'none',
      }}
    >
      <Toolbar>
        {renderNavBarContent()}
        {isAuthenticated && <DynamicNavMenu />}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;