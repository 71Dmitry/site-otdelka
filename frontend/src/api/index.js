import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// перехват ошибки 403 если токен просрочен
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // токен невалидный - выход
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// публ маршруты
export const getServices = () => api.get('/services');
export const getServiceTypes = () => api.get('/service-types');
export const getMasters = () => api.get('/masters');
export const login = (data) => api.post('/login', data);
export const register = (data) => api.post('/register', data);
export const getClientBookings = (id) => api.get(`/client-bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const cancelBooking = (bookingId) => api.put(`/bookings/${bookingId}/cancel`);

// админ заявки
export const getAllBookings = () => api.get('/admin/bookings');
export const addBooking = (data) => api.post('/admin/bookings', data);
export const updateBooking = (id, data) => api.put(`/admin/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/admin/bookings/${id}`);

// админ услуги
export const getAllServicesAdmin = () => api.get('/admin/services');
export const addService = (data) => api.post('/admin/services', data);
export const updateService = (id, data) => api.put(`/admin/services/${id}`, data);
export const deleteService = (id) => api.delete(`/admin/services/${id}`);

// админ мастера
export const getAllMastersAdmin = () => api.get('/admin/masters');
export const addMaster = (data) => api.post('/admin/masters', data);
export const updateMaster = (id, data) => api.put(`/admin/masters/${id}`, data);
export const deleteMaster = (id) => api.delete(`/admin/masters/${id}`);


// админ клиенты
export const getAllClients = () => api.get('/admin/clients');
export const addClient = (data) => api.post('/admin/clients', data);
export const updateClient = (id, data) => api.put(`/admin/clients/${id}`, data);
export const deleteClient = (id) => api.delete(`/admin/clients/${id}`);

// админ категории
export const getAllCategories = () => api.get('/admin/categories');
export const addCategory = (name) => api.post('/admin/categories', { Наименование: name });
export const deleteCategory = (id) => api.delete(`/admin/categories/${id}`);

// админ типы услуг
export const getAllServiceTypesAdmin = () => api.get('/admin/service-types');
export const addServiceType = (data) => api.post('/admin/service-types', data);
export const deleteServiceType = (id) => api.delete(`/admin/service-types/${id}`);

// профиль клиента
export const updateProfile = (clientId, data) => api.put(`/client/profile/${clientId}`, data);
export const updatePassword = (clientId, data) => api.put(`/client/password/${clientId}`, data);
// Расписание мастера
export const getMasterSchedule = (masterId) => api.get(`/schedule/${masterId}`);
export default api;