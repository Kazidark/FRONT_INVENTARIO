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
  const res = await api.post('/auth/login', data);
  return unwrap(res.data);
};

/* =========================
   SOLICITAR CÓDIGO (correo)
========================= */
export const forgotPasswordRequest = async (data) => {
  const res = await api.post('/auth/forgot-password', data);
  return res.data;
};

/* =========================
   VALIDAR CÓDIGO DE 6 DÍGITOS
========================= */
export const verifyRecoveryCodeRequest = async (data) => {
  const res = await api.post('/auth/verify-recovery-code', data);
  return res.data;
};

/* =========================
   NUEVA CONTRASEÑA (email + código + newPassword)
========================= */
export const resetPasswordRequest = async (data) => {
  const body = {
    email: data.email,
    code: String(data.code ?? '').trim(),
    newPassword: data.newPassword ?? data.password,
  };
  const res = await api.post('/auth/reset-password', body);
  return res.data;
};
