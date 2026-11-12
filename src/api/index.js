import { api, queryString } from './client.js';

export const dashboardApi = {
  ringkasan: (params) => api.get(`/dashboard${queryString(params)}`),
};

export const jenisApi = {
  list: () => api.get('/jenis'),
  create: (data) => api.post('/jenis', data),
  update: (id, data) => api.put(`/jenis/${id}`, data),
  remove: (id) => api.delete(`/jenis/${id}`),
};

export const printerApi = {
  list: (params) => api.get(`/printer${queryString(params)}`),
  create: (data) => api.post('/printer', data),
  update: (tipe, data) => api.put(`/printer/${encodeURIComponent(tipe)}`, data),
  remove: (tipe) => api.delete(`/printer/${encodeURIComponent(tipe)}`),
};

export const permintaanApi = {
  list: (params) => api.get(`/permintaan${queryString(params)}`),
  create: (data) => api.post('/permintaan', data),
  update: (id, data) => api.put(`/permintaan/${id}`, data),
  remove: (id) => api.delete(`/permintaan/${id}`),
};

export const warnaApi = {
  list: () => api.get('/warna'),
};
