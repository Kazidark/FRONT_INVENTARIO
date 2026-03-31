import { useState } from 'react';
import { forgotPasswordRequest } from '../../../services/api/auth.api';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await forgotPasswordRequest({ email }); // ✅ CLAVE
      setMessage(res.message);
    } catch (error) {
      setMessage(
        error.response?.data?.message ||
        'Error al procesar la solicitud'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔐 Recuperar contraseña</h2>
        <p style={styles.subtitle}>
          Ingresa tu correo registrado y te enviaremos un enlace seguro
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? 'Enviando…' : 'Enviar enlace'}
          </button>
        </form>

        {message && <p style={styles.msg}>{message}</p>}

        <button
          style={styles.link}
          onClick={() => navigate('/login')}
        >
          ⬅ Volver al login
        </button>
      </div>
    </div>
  );
};

const styles = {
  bg: {
    height: '100vh',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1518770660439-4636190af475)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    width: 420,
    padding: 36,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.95)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937'
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 20,
    color: '#4b5563'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14
  },
  input: {
    padding: 14,
    borderRadius: 10,
    border: '1px solid #d1d5db',
    fontSize: 14
  },
  button: {
    padding: 14,
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb, #1e40af)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  msg: {
    marginTop: 16,
    fontSize: 14,
    color: '#2563eb'
  },
  link: {
    marginTop: 20,
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    fontSize: 13
  }
};

export default ForgotPasswordPage;
