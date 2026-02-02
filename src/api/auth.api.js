import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

/* =========================
   LOGIN
========================= */
export const loginRequest = async (data) => {
  const res = await axios.post(`${API_URL}/login`, data);
  return res.data;
};

/* =========================
   SOLICITAR RESET
========================= */
export const forgotPasswordRequest = async (data) => {
  const res = await axios.post(`${API_URL}/forgot-password`, data);
  return res.data;
};

/* =========================
   RESET PASSWORD
========================= */
export const resetPasswordRequest = async (data) => {
  const res = await axios.post(`${API_URL}/reset-password`, data);
  return res.data;
};
