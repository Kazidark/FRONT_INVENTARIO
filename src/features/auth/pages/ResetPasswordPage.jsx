import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-hot-toast';
import {
  resetPasswordRequest,
  verifyRecoveryCodeRequest,
} from '../../../services/api/auth.api';
import { useNavigate, useLocation } from 'react-router-dom';

function formatCountdown(ms) {
  if (ms <= 0) return '0:00';
  const totalSec = Math.ceil(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [message, setMessage] = useState('');
  const [codeOk, setCodeOk] = useState(false);
  const [remainingMs, setRemainingMs] = useState(null);
  const expiredToastShown = useRef(false);

  const codeExpiresAt = location.state?.codeExpiresAt;

  useEffect(() => {
    const fromForgot = location.state?.email;
    if (fromForgot) setEmail(fromForgot);
  }, [location.state]);

  useEffect(() => {
    if (!codeExpiresAt || typeof codeExpiresAt !== 'number') {
      setRemainingMs(null);
      return;
    }
    const tick = () => {
      const left = codeExpiresAt - Date.now();
      setRemainingMs(left > 0 ? left : 0);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [codeExpiresAt]);

  const codeExpired = codeExpiresAt != null && remainingMs === 0;
  const hasDeadline = codeExpiresAt != null;

  useEffect(() => {
    if (codeExpired && !expiredToastShown.current) {
      expiredToastShown.current = true;
      toast.error(
        'El tiempo para validar el código se agotó. Solicita un código nuevo.',
        { duration: 6000 },
      );
    }
  }, [codeExpired]);

  const errMsg = (error) => {
    const m = error.response?.data?.message;
    return (Array.isArray(m) ? m[0] : m) || 'Error al procesar la solicitud';
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (codeExpired) {
      toast.error('El código ya no es válido por tiempo. Solicita uno nuevo.');
      return;
    }
    setMessage('');
    setCodeOk(false);
    setVerifying(true);
    const toastId = toast.loading('Validando código…');
    try {
      const res = await verifyRecoveryCodeRequest({
        email: email.trim().toLowerCase(),
        code: code.trim(),
      });
      const msg =
        typeof res?.message === 'string'
          ? res.message
          : 'Código validado correctamente.';
      toast.dismiss(toastId);
      toast.success(msg, { duration: 4000 });
      setMessage(msg);
      setCodeOk(true);
    } catch (error) {
      toast.dismiss(toastId);
      const text = errMsg(error);
      toast.error(text, { duration: 5000 });
      setMessage(text);
    } finally {
      setVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (codeExpired) {
      toast.error('El código expiró. Solicita uno nuevo en Recuperar contraseña.');
      return;
    }
    setMessage('');
    if (password !== confirm) {
      toast.error('Las contraseñas no coinciden.');
      setMessage('Las contraseñas no coinciden.');
      return;
    }
    if (password.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres.');
      setMessage('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    setLoading(true);
    const toastId = toast.loading('Guardando nueva contraseña…');
    try {
      const res = await resetPasswordRequest({
        email: email.trim().toLowerCase(),
        code: code.trim(),
        newPassword: password,
      });
      const msg =
        typeof res?.message === 'string'
          ? res.message
          : 'Contraseña actualizada.';
      toast.dismiss(toastId);
      toast.success(msg, { duration: 3000 });
      setMessage(msg);
      setCodeOk(false);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.dismiss(toastId);
      const text = errMsg(error);
      toast.error(text, { duration: 5000 });
      setMessage(text);
    } finally {
      setLoading(false);
    }
  };

  const timerStyle =
    remainingMs === null
      ? styles.timerNeutral
      : codeExpired
        ? styles.timerExpired
        : remainingMs < 60_000
          ? styles.timerWarn
          : styles.timerOk;

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Nueva contraseña</h2>
        <p style={styles.subtitle}>
          Introduce el código de 6 dígitos que recibiste por correo y tu nueva
          contraseña.
        </p>

        {hasDeadline && (
          <div style={timerStyle} role="status" aria-live="polite">
            {remainingMs === null ? (
              <span>Preparando contador…</span>
            ) : codeExpired ? (
              <span>
                Tiempo agotado — el código ya no se puede validar aquí.
              </span>
            ) : (
              <span>
                Tiempo restante para usar el código:{' '}
                <strong>{formatCountdown(remainingMs)}</strong>
              </span>
            )}
          </div>
        )}

        {!hasDeadline && (
          <p style={styles.hint}>
            Si no ves un contador, entra desde &quot;Recuperar contraseña&quot;
            después de enviar el correo, o vuelve a solicitar el código.
          </p>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="text"
            inputMode="numeric"
            pattern="\d{6}"
            maxLength={6}
            placeholder="Código de 6 dígitos"
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, '').slice(0, 6))
            }
            style={styles.input}
            required
          />
          <button
            type="button"
            style={{
              ...styles.buttonSecondary,
              opacity: codeExpired ? 0.55 : 1,
            }}
            disabled={
              verifying || code.length !== 6 || !email.trim() || codeExpired
            }
            onClick={handleVerifyCode}
          >
            {verifying ? 'Comprobando…' : 'Validar código'}
          </button>

          <input
            type="password"
            placeholder="Nueva contraseña (mín. 8 caracteres)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            required
            minLength={8}
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            style={styles.input}
            required
            minLength={8}
          />

          <button
            type="submit"
            style={{ ...styles.button, opacity: codeExpired ? 0.55 : 1 }}
            disabled={loading || code.length !== 6 || codeExpired}
          >
            {loading ? 'Guardando…' : 'Cambiar contraseña'}
          </button>
        </form>

        {message && (
          <p style={codeOk ? styles.msgOk : styles.msg}>{message}</p>
        )}

        <button
          type="button"
          style={styles.link}
          onClick={() => navigate('/forgot-password')}
        >
          Solicitar nuevo código
        </button>
        <button
          type="button"
          style={{ ...styles.link, marginTop: 8 }}
          onClick={() => navigate('/login')}
        >
          Volver al login
        </button>
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
    justifyContent: 'center',
  },
  card: {
    width: 420,
    padding: 36,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.95)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    backdropFilter: 'blur(10px)',
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 700,
    color: '#1f2937',
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 12,
    color: '#4b5563',
  },
  hint: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 14,
    lineHeight: 1.4,
  },
  timerNeutral: {
    fontSize: 14,
    marginBottom: 16,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(107, 114, 128, 0.12)',
    color: '#374151',
    border: '1px solid rgba(107, 114, 128, 0.25)',
  },
  timerOk: {
    fontSize: 15,
    marginBottom: 16,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(22, 163, 74, 0.12)',
    color: '#14532d',
    border: '1px solid rgba(22, 163, 74, 0.35)',
  },
  timerWarn: {
    fontSize: 15,
    marginBottom: 16,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(234, 179, 8, 0.2)',
    color: '#713f12',
    border: '1px solid rgba(202, 138, 4, 0.45)',
  },
  timerExpired: {
    fontSize: 15,
    marginBottom: 16,
    padding: '10px 14px',
    borderRadius: 10,
    background: 'rgba(185, 28, 28, 0.12)',
    color: '#7f1d1d',
    border: '1px solid rgba(185, 28, 28, 0.35)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  input: {
    padding: 14,
    borderRadius: 10,
    border: '1px solid #d1d5db',
    fontSize: 14,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(135deg, #16a34a, #15803d)',
    color: '#fff',
    fontWeight: 600,
    cursor: 'pointer',
  },
  buttonSecondary: {
    padding: 12,
    borderRadius: 10,
    border: '1px solid #16a34a',
    background: '#fff',
    color: '#15803d',
    fontWeight: 600,
    cursor: 'pointer',
  },
  msg: {
    marginTop: 16,
    fontSize: 14,
    color: '#b91c1c',
  },
  msgOk: {
    marginTop: 16,
    fontSize: 14,
    color: '#16a34a',
  },
  link: {
    marginTop: 16,
    background: 'none',
    border: 'none',
    color: '#2563eb',
    cursor: 'pointer',
    fontSize: 13,
    display: 'block',
    width: '100%',
  },
};

export default ResetPasswordPage;
