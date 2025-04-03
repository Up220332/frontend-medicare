import React, { useEffect, useState } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '../theme';
import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import DoctorLayout from '../components/layout/DoctorLayout';
import PatientLayout from '../components/layout/PatientLayout'; 
import { GlobalProvider } from '../context/GlobalContext';
import { AuthProvider } from '../context/AuthContext';

const MyApp = ({ Component, pageProps }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUser(JSON.parse(localStorage.getItem("user")));
    }
  }, []);

  const LayoutComponent = user?.role === "Doctor" ? DoctorLayout 
                        : user?.role === "Patient" ? PatientLayout 
                        : Layout;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <GlobalProvider>
          <LayoutComponent>
            <Component {...pageProps} />
          </LayoutComponent>
        </GlobalProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default MyApp;
