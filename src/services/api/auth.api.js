import { api } from '../config';

const unwrap = (payload) => {
  if (payload && typeof payload === 'object' && Array.isArray(payload.result)) {
    return payload.result[0];
  }
  if (payload && typeof payload === 'object' && 'data' in payload) {
    return payload.data;
  }
  return payload;
};

/* =========================
   LOGIN
========================= */
export const loginRequest = async (data) => {
     console.log(data)
  const res = await api.post('/auth/login', data);

  // console.log('[FRONT][LOGIN] raw response:', res.data);
   console.log(res)
  return unwrap(res.data);
};

/* =========================
   SOLICITAR RESET
========================= */
export const forgotPasswordRequest = async (data) => {
  // TODO: si se usa, definir endpoint real en backend
  const res = await api.post('/forgot-password', data);
  return unwrap(res.data);
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPasswordRequest = async (data) => {
  // TODO: si se usa, definir endpoint real en backend
  const res = await api.post('/reset-password', data);
  return unwrap(res.data);
};
