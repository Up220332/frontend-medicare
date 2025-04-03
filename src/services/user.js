import axios from 'axios';

export const registerPatient = async (userName, email, password, dob) => {
  try {
    const response = await axios.post('http://localhost:3001/api/patients', {
      username: userName,
      email: email,
      password: password,
      dob: dob,
    });

    return response.data;  
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Registration failed');
  }
};

export const registerDoctor = async (userName, email, password, specialty) => {
  try {
    const response = await axios.post('http://localhost:3001/api/doctors', {
      username: userName,
      email: email,
      password: password,
      specialty: specialty,
    });

    return response.data;  
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Registration failed');
  }
};

export const registerReceptionist = async (userName, email, password) => {
  try {
    const response = await axios.post('http://localhost:3001/api/receptionists', {
      username: userName,
      email: email,
      password: password,
    });

    return response.data; 
  } catch (error) {
    throw new Error(error.response ? error.response.data.message : 'Registration failed');
  }
};
