import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Geofence endpoints
export const geofenceAPI = {
  getAll: () => api.get('/geofence'),
  getById: (id) => api.get(`/geofence/${id}`),
  create: (data) => api.post('/geofence', data),
  update: (id, data) => api.put(`/geofence/${id}`, data),
  delete: (id) => api.delete(`/geofence/${id}`),
};

// Vessel endpoints
export const vesselAPI = {
  getAll: (page = 1, limit = 20) => api.get(`/vessels?page=${page}&limit=${limit}`),
  getById: (mmsi) => api.get(`/vessels/${mmsi}`),
  getInBbox: (bbox) => api.get(`/vessels/bbox/${bbox}`),
  getHistory: (mmsi) => api.get(`/vessels/history/${mmsi}`),
  delete: (mmsi) => api.delete(`/vessels/${mmsi}`),
};

// Anomaly endpoints
export const anomalyAPI = {
  getAll: (params) => api.get('/anomalies', { params }),
  getById: (id) => api.get(`/anomalies/${id}`),
  create: (data) => api.post('/anomalies', data),
  update: (id, data) => api.put(`/anomalies/${id}`, data),
  delete: (id) => api.delete(`/anomalies/${id}`),
  sendAlert: (id, phoneNumber) => api.post(`/anomalies/${id}/alert`, { phoneNumber }),
};

// AI Agent endpoints
export const aiAPI = {
  query: (query) => api.post('/ai/query', { query }),
};

export default {
  geofence: geofenceAPI,
  vessel: vesselAPI,
  anomaly: anomalyAPI,
  ai: aiAPI,
}; 