import { useEffect } from 'react';
import { useRouter } from 'next/router';
import PatientNavbar from './PatientNavbar';

const PatientLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'Patient') {
      router.push('/auth/login'); 
    }
  }, [router]); // Añadido router como dependencia

  return (
    <>
      <PatientNavbar />
      <main>{children}</main>
    </>
  );
};

export default PatientLayout;