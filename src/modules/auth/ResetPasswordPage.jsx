import { useState } from 'react';
import { resetPasswordRequest } from '../../api/auth.api';
import { useNavigate, useParams } from 'react-router-dom';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await resetPasswordRequest({
        token,
        password
      });

      setMessage(res.message);

      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setMessage(
        error.response?.data?.message || 'Error al cambiar contraseña'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>🔑 Nueva contraseña</h2>
        <p style={styles.subtitle}>
          Establece una contraseña segura
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button style={styles.button} disabled={loading}>
            {loading ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </form>

        {message && <p style={styles.msg}>{message}</p>}
      </div>
    </div>
  );
};

const styles = {
  bg: {
    height: '100vh',
    backgroundImage:
      'url(https://images.unsplash.com/photo-1517430816045-df4b7de11d1d)',
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
    background: 'linear-gradient(135deg, #16a34a, #15803d)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer'
  },
  msg: {
    marginTop: 16,
    fontSize: 14,
    color: '#16a34a'
  }
};

export default ResetPasswordPage;
