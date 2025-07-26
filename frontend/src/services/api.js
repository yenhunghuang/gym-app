import axios from 'axios';

// eslint-disable-next-line no-undef
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Users API
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const createUser = async (userData) => {
  const response = await api.post('/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Exercises API
export const getExercises = async (category = null) => {
  const url = category ? `/exercises?category=${category}` : '/exercises';
  const response = await api.get(url);
  return response.data;
};

export const createExercise = async (exerciseData) => {
  const response = await api.post('/exercises', exerciseData);
  return response.data;
};

export const updateExercise = async (id, exerciseData) => {
  const response = await api.put(`/exercises/${id}`, exerciseData);
  return response.data;
};

export const deleteExercise = async (id) => {
  const response = await api.delete(`/exercises/${id}`);
  return response.data;
};

// Workouts API
export const getWorkouts = async (userId = null) => {
  const url = userId ? `/workouts?user_id=${userId}` : '/workouts';
  const response = await api.get(url);
  return response.data;
};

export const getWorkoutsBasic = async () => {
  const response = await api.get('/workouts?basic=true');
  return response.data;
};

export const getWorkout = async (id) => {
  const response = await api.get(`/workouts/${id}`);
  return response.data;
};

export const createWorkout = async (workoutData) => {
  const response = await api.post('/workouts', workoutData);
  return response.data;
};

export const updateWorkout = async (id, workoutData) => {
  const response = await api.put(`/workouts/${id}`, workoutData);
  return response.data;
};

export const deleteWorkout = async (id) => {
  const response = await api.delete(`/workouts/${id}`);
  return response.data;
};

export const addExerciseToWorkout = async (workoutId, exerciseData) => {
  const response = await api.post(`/workouts/${workoutId}/exercises`, exerciseData);
  return response.data;
};

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

export default api;