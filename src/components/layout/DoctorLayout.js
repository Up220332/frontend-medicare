import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    
    if (!token || user?.role !== 'Doctor') {
      router.push('/auth/login');
    }
  }, []);

  return (
    <>
      <DoctorNavbar />
      <main>{children}</main>
    </>
  );
};

export default DoctorLayout;
