import axios from 'axios';

const patientApi = axios.create({
  baseURL: 'http://localhost:3001/api/patient', 
});

const appointmentsApi = axios.create({
  baseURL: 'http://localhost:3002/api/appointments', 
});

const prescriptionsApi = axios.create({
  baseURL: 'http://localhost:3003/api/prescriptions', 
});

export { patientApi, appointmentsApi, prescriptionsApi };
