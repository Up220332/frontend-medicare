import React, { useEffect } from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardActions } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  People as PatientsIcon,
  CalendarToday as ScheduleIcon,
  Message as MessagingIcon,
  LocalPharmacy as PrescriptionsIcon,
} from '@mui/icons-material';

const DoctorHomePage = () => {
  const router = useRouter();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || user.role !== 'Doctor') {
      router.push('/auth/login');
    }
  }, []);

  const tools = [
    {
      title: 'My Schedule',
      description: 'Organize your appointments easily.',
      icon: <ScheduleIcon fontSize="large" />,
      path: '/Doctor/my-schedule',
    },
    {
      title: 'Prescriptions',
      description: 'Prescribe medications digitally.',
      icon: <PrescriptionsIcon fontSize="large" />,
      path: '/Doctor/prescriptions-treatments',
    },
  ];

  return (
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Welcome, Dr. {user?.username}
          </Typography>
          <Typography variant="body1" color="text.secondary">
           Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
           </Typography>
        </Box>

        <Grid container spacing={3}>
          {tools.map((tool, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2, color: 'primary.main' }}>
                    {tool.icon}
                  </Box>
                  <Typography gutterBottom variant="h6" component="h2">
                    {tool.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {tool.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                  <Link href={tool.path} passHref>
                    <Button size="small" variant="contained">
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

export default DoctorHomePage;
