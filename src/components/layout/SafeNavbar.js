// components/layout/SafeNavbar.js
'use client'; // Esto es crucial para Next.js 13+

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { AppBar, Toolbar, Box } from '@mui/material';

const DynamicNavbar = dynamic(() => import('./DoctorNavbar'), {
  ssr: false,
  loading: () => (
    <AppBar position="static">
      <Toolbar>
        <Box sx={{ width: '100%', height: '64px' }} /> {/* Placeholder */}
      </Toolbar>
    </AppBar>
  )
});

export default function SafeNavbar() {
  return (
    <Suspense fallback={null}>
      <DynamicNavbar />
    </Suspense>
  );
}