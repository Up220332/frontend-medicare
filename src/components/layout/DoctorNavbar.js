'use client'; // Para Next.js 13+
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const DoctorNavbar = () => {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [mounted, setMounted] = useState(false); // Nueva variable de control

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && mounted) {
      const userData = localStorage.getItem('user');
      setUser(userData ? JSON.parse(userData) : null);
    }
  }, [mounted]);

  // Evitar renderizado si el componente no está montado
  if (!mounted) return null;
  if (!user || user.role !== 'Doctor') return null;

  return (
    <nav>
      <p>Bienvenido, Dr. {user.username}</p>
    </nav>
  );
};

export default DoctorNavbar;
