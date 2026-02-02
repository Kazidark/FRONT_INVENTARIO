import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    usuario: '',
    password: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post(
        'http://localhost:3001/api/auth/login',
        form
      );
      login(res.data);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* ===== PANEL IZQUIERDO ===== */}
      <div style={styles.left}>
        <div style={styles.brandBox}>
          <h1 style={styles.logo}>Inventario TI</h1>
          <p style={styles.description}>
            Plataforma corporativa para la gestión y control de activos tecnológicos.
          </p>

          <ul style={styles.features}>
            <li>✔ Control centralizado</li>
            <li>✔ Seguridad por roles</li>
            <li>✔ Gestión en tiempo real</li>
            <li>✔ Escalable y auditable</li>
          </ul>
        </div>
      </div>

      {/* ===== PANEL DERECHO ===== */}
      <div style={styles.right}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.title}>Iniciar sesión</h2>
          <p style={styles.subtitle}>
            Accede con tus credenciales corporativas
          </p>

          <div style={styles.field}>
            <label style={styles.label}>Usuario</label>
            <input
              name="usuario"
              value={form.usuario}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Contraseña</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              style={styles.input}
              required
            />
          </div>

          {error && <div style={styles.error}>{error}</div>}

          <button style={styles.button} disabled={loading}>
            {loading ? 'Verificando…' : 'Ingresar'}
          </button>

          <button
            type="button"
            style={styles.link}
            onClick={() => navigate('/forgot-password')}
          >
            ¿Olvidaste tu contraseña?
          </button>
        </form>
      </div>
    </div>
  );
};

/* =========================
   ESTILOS – NIVEL GOOGLE
========================= */
const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '60% 40%',
    height: '100vh',
    background: '#f8fafc'
  },

  /* IZQUIERDA */
  left: {
    background: 'linear-gradient(135deg, #1e8a27, #2ceb25)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    padding: '80px'
  },

  brandBox: {
    maxWidth: 420,
    display: 'flex',
    flexDirection: 'column',
    gap: 24
  },

  logo: {
    fontSize: 36,
    fontWeight: 700
  },

  description: {
    fontSize: 16,
    lineHeight: 1.6,
    opacity: 0.9
  },

  features: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    fontSize: 14,
    opacity: 0.9
  },

  /* DERECHA */
  right: {
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  form: {
    width: '100%',
    maxWidth: 360,
    display: 'flex',
    flexDirection: 'column',
    gap: 18
  },

  title: {
    fontSize: 24,
    fontWeight: 600,
    color: '#0f172a'
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },

  label: {
    fontSize: 13,
    fontWeight: 500,
    color: '#334155'
  },

  input: {
    width: '100%',
    padding: '12px 14px',
    borderRadius: 8,
    border: '1px solid #cbd5e1',
    fontSize: 14,
    outline: 'none'
  },

  button: {
    marginTop: 10,
    padding: '12px',
    borderRadius: 8,
    border: 'none',
    background: '#2563eb',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },

  link: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: 13,
    cursor: 'pointer',
    marginTop: 4,
    alignSelf: 'flex-start'
  },

  error: {
    background: '#fee2e2',
    color: '#991b1b',
    padding: '8px 10px',
    borderRadius: 6,
    fontSize: 13
  }
};

export default LoginPage;
