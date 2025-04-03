import React, { useEffect, useState } from 'react';
import RegisterForm from '../../components/auth/RegisterForm';
import { useRouter } from 'next/router';

const RegisterPage = ({ handleError }) => {
  const router = useRouter();
  const [userType, setUserType] = useState('');

  useEffect(() => {
    const { type } = router.query;

    if (type) {
      setUserType(type);
    }
  }, [router.query]);

  return <RegisterForm handleError={handleError} userType={userType} />;
};

export default RegisterPage;
