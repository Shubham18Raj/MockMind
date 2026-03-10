import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

// Automatically attach token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

export const getQuestions = (params) => API.get('/questions', { params });
export const getRandomQuestions = (params) => API.get('/questions/random', { params });

export const startSession = (data) => API.post('/interview/start', data);
export const saveAnswer = (data) => API.post('/interview/answer', data);
export const finishSession = (data) => API.post('/interview/finish', data);

export const getMySessions = () => API.get('/sessions/me');
export const getSessionById = (id) => API.get(`/sessions/${id}`);
export const getLeaderboard = () => API.get('/sessions/leaderboard');

export const evaluateAnswer = (data) => API.post('/ai/evaluate', data);

export const uploadResume = (formData) => API.post('/resume/upload', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});