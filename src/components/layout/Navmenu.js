import React, { useState, useContext } from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, IconButton } from '@mui/material';
import { Menu as MenuIcon, Dashboard as DashboardIcon, Search as SearchIcon, 
         Mail as MailIcon, Assignment as AssignmentIcon, 
         CalendarToday as CalendarTodayIcon, Receipt as ReceiptIcon, 
         Person as PersonIcon } from '@mui/icons-material';
import Link from 'next/link';
import { AuthContext } from '../../context/AuthContext';

const NavMenu = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user } = useContext(AuthContext); 

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setOpen(open);
  };

  const menuItemsDoctor = [
    { text: 'Patient Management', icon: <PersonIcon />, link: '/Doctor/patient-management' },
    { text: 'My Schedule', icon: <CalendarTodayIcon />, link: '/Doctor/my-schedule' },
    { text: 'Messaging', icon: <MailIcon />, link: '/Doctor/messaging' },
    { text: 'Prescriptions and Treatments', icon: <ReceiptIcon />, link: '/Doctor/prescriptions-treatments' },
    { text: 'Home', icon: <DashboardIcon />, link: '/Doctor' },
  ];

  const menuItemsReceptionist = [
    { text: 'Patient Management', icon: <PersonIcon />, link: '/Receptionist/patient-management' },
    { text: 'Schedule', icon: <CalendarTodayIcon />, link: '/Receptionist/appointment-schedule' },
    { text: 'Home', icon: <DashboardIcon />, link: '/Receptionist' },
  ];

  const menuItemsPatient = [
    { text: 'Appointment Schedule', icon: <CalendarTodayIcon />, link: '/Patient/appointment-schedule' },
    { text: 'Messaging', icon: <MailIcon />, link: '/Patient/messages' },
    { text: 'My Prescriptions and Treatments', icon: <ReceiptIcon />, link: '/Patient/my-prescriptions-treatments' },
    { text: 'Search Doctor', icon: <SearchIcon />, link: '/Patient/search-doctors' },
    { text: 'Home', icon: <DashboardIcon />, link: '/Patient' },
  ];

  let menuItems = [];
  if (user?.role === 'doctor') {
    menuItems = menuItemsDoctor;
  } else if (user?.role === 'receptionist') {
    menuItems = menuItemsReceptionist;
  } else if (user?.role === 'patient') {
    menuItems = menuItemsPatient;
  }

  return (
    <>
      <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </IconButton>
      <Drawer anchor="left" open={open} onClose={toggleDrawer(false)}>
        <List>
          {menuItems.map((item, index) => (
            <ListItem button key={index} component={Link} href={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
};

export default NavMenu;
