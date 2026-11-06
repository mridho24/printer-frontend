const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'KESALAHAN', details } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

async function request(path, { method = 'GET', body, signal } = {}) {
  let response;

  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: body !== undefined ? { 'Content-Type': 'application/json' } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    throw new ApiError('Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.', {
      code: 'KONEKSI_GAGAL',
    });
  }

  const teks = await response.text();
  let json = null;

  if (teks) {
    try {
      json = JSON.parse(teks);
    } catch {
      json = null;
    }
  }

  if (!response.ok || !json?.success) {
    const error = json?.error;
    throw new ApiError(error?.message || `Permintaan gagal (HTTP ${response.status})`, {
      status: response.status,
      code: error?.code || 'KESALAHAN_SERVER',
      details: error?.details,
    });
  }

  return json;
}

export const api = {
  get: (path, options) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options) => request(path, { ...options, method: 'PUT', body }),
  delete: (path, options) => request(path, { ...options, method: 'DELETE' }),
};

/**
 * Mengubah error.details dari backend menjadi peta { field: pesan }.
 */
export function fieldErrors(error) {
  const hasil = {};
  if (Array.isArray(error?.details)) {
    for (const detail of error.details) {
      if (detail?.field) hasil[detail.field] = detail.message || 'Tidak valid';
    }
  }
  return hasil;
}

export function queryString(params = {}) {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  }
  const hasil = search.toString();
  return hasil ? `?${hasil}` : '';
}
