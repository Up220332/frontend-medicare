import React from 'react';
import { 
  AppBar, Toolbar, Typography, Button, 
  Box, Avatar, Menu, MenuItem, IconButton 
} from '@mui/material';
import { 
  Menu as MenuIcon,
  AccountCircle as ProfileIcon,
  ExitToApp as LogoutIcon,
  CalendarToday as ScheduleIcon,
  LocalPharmacy as PrescriptionsIcon
} from '@mui/icons-material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';

const PatientNavbar = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = JSON.parse(localStorage.getItem('user'));

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('auth/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Box sx={{ display: 'flex', alignItems: 'center', mr: 3 }}>
          <Image src="/images/logo.png" alt="Logo MediCare" width={50} height={50} style={{ marginRight: '10px' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: '#FFFFFF' }}>
            MediCare
          </Typography>
        </Box>

        <Box sx={{ display: { xs: 'none', md: 'flex' }, flexGrow: 1 }}>

        <Link href="/Patient" passHref>
            <Button sx={{ color: '#FFFFFF', fontWeight: router.pathname.includes('appointment') ? 'bold' : 'normal' }} >
              Home
            </Button>
          </Link>

          <Link href="/Patient/appointment-schedule" passHref>
            <Button sx={{ color: '#FFFFFF', fontWeight: router.pathname.includes('appointment') ? 'bold' : 'normal' }} startIcon={<ScheduleIcon />}>
              My Appointments
            </Button>
          </Link>

          <Link href="/Patient/my-prescriptions-treatments" passHref>
            <Button sx={{ color: '#FFFFFF', fontWeight: router.pathname.includes('prescription') ? 'bold' : 'normal' }} startIcon={<PrescriptionsIcon />}>
              My Prescriptions
            </Button>
          </Link>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ mr: 1, color: '#FFFFFF', display: { xs: 'none', sm: 'block' } }}>
            {user?.username}
          </Typography>
          
          <IconButton size="large" edge="end" onClick={handleMenu} color="inherit">
            {user?.username ? (
              <Avatar sx={{ width: 32, height: 32 }}>
                {user.username.charAt(0)}
              </Avatar>
            ) : (
              <ProfileIcon />
            )}
          </IconButton>
          
          <Menu anchorEl={anchorEl} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} keepMounted transformOrigin={{ vertical: 'top', horizontal: 'right' }} open={Boolean(anchorEl)} onClose={handleClose}>
            <MenuItem onClick={() => router.push('/Patient/profile')}>
              <ProfileIcon sx={{ mr: 1 }} /> Profile
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 1 }} /> Logout
            </MenuItem>
          </Menu>

          <IconButton size="large" edge="start" color="inherit" sx={{ display: { md: 'none' }, ml: 1 }} onClick={handleMenu}>
            <MenuIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default PatientNavbar;
