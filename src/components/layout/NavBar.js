import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton } from '@mui/material';
import { AuthContext } from '../../context/AuthContext';
import Image from 'next/image';

const NavBar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const renderNavBarContent = () => {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
        <Image src="/images/logo.png" alt="Logo MediCare" width={50} height={50} style={{ marginRight: '10px' }} />
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: '#fff' }}>
          MediCare
        </Typography>
      </Box>
    );
  };

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
      
        {isAuthenticated && <NavMenu />}
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {isAuthenticated && <SearchBar />}
          {isAuthenticated && <Notifications />}
          {isAuthenticated && <ProfileMenu />}
          {isAuthenticated && (
            <IconButton color="inherit" onClick={logout}>
              Logout
            </IconButton>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
