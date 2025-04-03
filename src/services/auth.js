import api from '../config/services';
import axios from 'axios';

export const login = async (email, password) => {
  try {
    console.log('Datos enviados:', { email, password });
    const response = await axios.post('http://localhost:3001/api/auth/login', { 
      email, 
      password 
    });
    
    console.log('Respuesta recibida:', response.data);

    if (!response.data.token || !response.data.user) {
      throw new Error('Respuesta del servidor incompleta');
    }

    return {
      token: response.data.token,
      user: {
        id: response.data.user._id || response.data.user.id,
        role: response.data.user.role,
        username: response.data.user.userName || response.data.user.username,
        email: response.data.user.email
      }
    };
  } catch (error) {
    console.error('Error durante login:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Error al iniciar sesión'
    );
  }
};

export const register = async (userName, email, password, role) => {
  try {
    const data = { userName, email, password, role };
    const response = await api.post('/auth/register', data);
    
    return {
      token: response.data.token,
      user: {
        id: response.data.user._id,
        role: response.data.user.role,
        username: response.data.user.userName,
        email: response.data.user.email
      }
    };
  } catch (error) {
    console.error('Registration error:', error.message);
    throw new Error(
      error.response?.data?.message || 
      'Error al registrar el usuario'
    );
  }
};

export const refreshToken = async (token) => {
  try {
    const response = await api.post('/auth/refresh-token', { token });
    
    if (!response.data.token) {
      throw new Error('Token no recibido');
    }
    
    return {
      newToken: response.data.token,
      user: response.data.user 
    };
  } catch (error) {
    console.error('Error al refrescar token:', error);
    throw new Error(
      error.response?.data?.message || 
      'La sesión ha expirado. Por favor inicia sesión nuevamente'
    );
  }
};

export const getCurrentUser = () => {
  try {
    const user = JSON.parse(localStorage.getItem('user'));
    return user || null;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};