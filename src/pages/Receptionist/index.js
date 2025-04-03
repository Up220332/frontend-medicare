import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import Link from 'next/link';
import {
  People as PatientsIcon,
  CalendarToday as ScheduleIcon,
} from '@mui/icons-material';

const ReceptionistHomePage = () => {
  const tools = [
    {
      title: 'Patient Management',
      description: 'Manage patient records and information efficiently.',
      icon: <PatientsIcon fontSize="large" />,
      path: '/Receptionist/patient-management',
    },
    {
      title: 'Appointment Schedule',
      description: 'Organize and manage appointments for patients and doctors.',
      icon: <ScheduleIcon fontSize="large" />,
      path: '/Receptionist/appointment-schedule',
    },
  ];

  return (
    <Container>
      <Grid container spacing={3} sx={{ mt: 2 }}>
        {tools.map((tool, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                  {tool.icon}
                </Box>
                <Typography variant="h6" component="h2" gutterBottom>
                  {tool.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {tool.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Link href={tool.path} passHref>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                  >
                    Access
                  </Button>
                </Link>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ReceptionistHomePage;
