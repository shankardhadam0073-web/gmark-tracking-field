import axios from 'axios';

// Ensure the backend runs on port 5159 per launchSettings.json
const BASE_URL = 'http://localhost:5159/api';

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Products API ---
export const getProducts = () => api.get('/products').then(res => res.data);

// --- Employees API ---
export const getEmployees = () => api.get('/employees').then(res => res.data);
export const getEmployee = (id) => api.get(`/employees/${id}`).then(res => res.data);
export const createEmployee = (data) => api.post('/employees', data).then(res => res.data);
export const updateEmployee = (id, data) => api.put(`/employees/${id}`, data).then(res => res.data);
export const deleteEmployee = (id) => api.delete(`/employees/${id}`).then(res => res.data);

// --- Auth API ---
export const loginEmployee = (data) => api.post('/auth/employee-login', data).then(res => res.data);

// --- OrderBookings API ---
export const getOrderBookings = () => api.get('/orderbookings').then(res => res.data);
export const getOrderBooking = (id) => api.get(`/orderbookings/${id}`).then(res => res.data);
export const createOrderBooking = (data) => api.post('/orderbookings', data).then(res => res.data);
export const updateOrderBooking = (id, data) => api.put(`/orderbookings/${id}`, data).then(res => res.data);
export const deleteOrderBooking = (id) => api.delete(`/orderbookings/${id}`).then(res => res.data);
export const deliverOrderBooking = (id) => api.put(`/orderbookings/${id}/deliver`).then(res => res.data);

export const getEmployeeOrderBookings = (employeeId) => api.get(`/orderbookings/employee/${employeeId}`).then(res => res.data);
export const getEmployeePendingOrders = (employeeId) => api.get(`/orderbookings/employee/${employeeId}/pending`).then(res => res.data);
export const getEmployeeDeliveredOrders = (employeeId) => api.get(`/orderbookings/employee/${employeeId}/delivered`).then(res => res.data);

// --- FieldVisits API ---
export const getFieldVisits = () => api.get('/fieldvisits').then(res => res.data);
export const getFieldVisit = (id) => api.get(`/fieldvisits/${id}`).then(res => res.data);
export const createFieldVisit = (data) => api.post('/fieldvisits', data).then(res => res.data);
export const updateFieldVisit = (id, data) => api.put(`/fieldvisits/${id}`, data).then(res => res.data);
export const deleteFieldVisit = (id) => api.delete(`/fieldvisits/${id}`).then(res => res.data);

// --- Reports API ---
export const getDailyReport = () => api.get('/reports/daily').then(res => res.data);
export const getEmployeeDailyReport = (employeeId) => api.get(`/reports/daily/${employeeId}`).then(res => res.data);
export const getMonthlyReport = () => api.get('/reports/monthly').then(res => res.data);
export const getEmployeeMonthlyReport = (employeeId) => api.get(`/reports/monthly/${employeeId}`).then(res => res.data);

export default api;
