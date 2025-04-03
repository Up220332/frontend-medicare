import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DoctorNavbar from './DoctorNavbar';

const DoctorLayout = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") { // 💡 Verificamos si estamos en el cliente
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      if (!token || user?.role !== 'Doctor') {
        router.push('/auth/login');
      }
    }
  }, [router]); // ✅ Se ejecuta solo en el cliente

  return (
    <>
      <DoctorNavbar />
      <main>{children}</main>
    </>
  );
};

export default DoctorLayout;
