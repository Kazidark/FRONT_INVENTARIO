import { useState } from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../../services/api/auth.api';
import { toast } from 'react-hot-toast';
import './LoginPage.css';

const HERO_FEATURES = [
  { icon: 'pi-wifi', label: 'Módems, chips y celulares' },
  { icon: 'pi-desktop', label: 'PC, laptops, monitores y tablets' },
  { icon: 'pi-file-excel', label: 'Importación y plantillas Excel' },
  { icon: 'pi-users', label: 'Colaboradores y asignaciones' }
];

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError('');

    const email = form.email.trim();
    const password = form.password;

    if (!email) {
      toast.error('Ingresa tu correo');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      toast.error('Correo inválido');
      return;
    }

    if (!password) {
      toast.error('Ingresa tu contraseña');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Verificando…');

    try {
      const data = await loginRequest({ email, password });
      if (data) {
        const authPayload =
          data && typeof data === 'object'
            ? { ...data, login_email: email }
            : { data, login_email: email };
        login(authPayload);
        toast.success('Bienvenido al inventario TI', { id: toastId });
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Credenciales inválidas';
      toast.error(message, { id: toastId });
      setError(message);
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__shell">
        <section className="login-page__form-panel">
          <div className="login-card" role="region" aria-label="Inicio de sesión">
            <header className="login-card__brand">
              <span className="login-brand-logo" aria-hidden="true">
                <i className="pi pi-box" />
              </span>
              <div className="login-brand-text">
                <span className="login-brand-name">SANNA</span>
                <span className="login-brand-sub">Inventario TI</span>
              </div>
            </header>

            <span className="login-card__accent" aria-hidden="true" />

            <h1 className="login-card__title">Iniciar sesión</h1>
            <p className="login-card__subtitle">Accede con tu correo corporativo</p>

            <form onSubmit={handleSubmit} className="login-form" aria-label="Formulario de inicio de sesión">
              <div className="login-field">
                <label className="login-label" htmlFor="email">
                  Correo electrónico
                </label>
                <div className="login-input-wrap">
                  <i className="pi pi-envelope login-input-icon" aria-hidden="true" />
                  <input
                    id="email"
                    className="login-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="email"
                    placeholder="usuario@sanna.pe"
                  />
                </div>
              </div>

              <div className="login-field">
                <label className="login-label" htmlFor="password">
                  Contraseña
                </label>
                <div className="login-input-wrap">
                  <i className="pi pi-lock login-input-icon" aria-hidden="true" />
                  <input
                    id="password"
                    className="login-input"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
                    autoComplete="current-password"
                    placeholder="Ingrese su contraseña"
                  />
                  <button
                    type="button"
                    className="login-eye-btn"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <i className={`pi ${showPassword ? 'pi-eye' : 'pi-eye-slash'}`} />
                  </button>
                </div>
              </div>

              {error ? (
                <div className="login-error" role="alert">
                  {error}
                </div>
              ) : null}

              <button className="login-submit-btn" disabled={loading} type="submit">
                {loading ? 'Verificando…' : 'Iniciar sesión'}
              </button>

              <button
                type="button"
                className="login-forgot-btn"
                onClick={() => navigate('/forgot-password')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>

            <p className="login-footer">SANNA &copy; {new Date().getFullYear()}</p>
          </div>
        </section>

        <aside className="login-page__hero" aria-label="Información del sistema">
          <div className="login-hero__inner">
            <div className="login-hero__copy">
              <p className="login-hero__kicker">Plataforma corporativa</p>
              <h2 className="login-hero__title">Control total de tu inventario tecnológico</h2>
              <p className="login-hero__desc">
                Registra, asigna y da seguimiento a equipos, chips y colaboradores desde un solo lugar.
              </p>

              <ul className="login-hero__features">
                {HERO_FEATURES.map((item) => (
                  <li key={item.label} className="login-hero__feature">
                    <span className="login-hero__feature-icon" aria-hidden="true">
                      <i className={`pi ${item.icon}`} />
                    </span>
                    <span>{item.label}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="login-hero__preview" aria-hidden="true">
              <div className="login-preview-card">
                <div className="login-preview-card__head">
                  <span className="login-preview-card__dot" />
                  <span className="login-preview-card__dot" />
                  <span className="login-preview-card__dot" />
                  <span className="login-preview-card__title">Inventario TI</span>
                </div>
                <div className="login-preview-stats">
                  <div className="login-preview-stat">
                    <strong>1,248</strong>
                    <span>Equipos</span>
                  </div>
                  <div className="login-preview-stat login-preview-stat--accent">
                    <strong>986</strong>
                    <span>Activos</span>
                  </div>
                  <div className="login-preview-stat">
                    <strong>12</strong>
                    <span>Módulos</span>
                  </div>
                </div>
                <div className="login-preview-rows">
                  <div className="login-preview-row">
                    <span className="login-preview-badge login-preview-badge--ok" />
                    <span className="login-preview-row__label">Módems</span>
                    <span className="login-preview-row__val">342</span>
                  </div>
                  <div className="login-preview-row">
                    <span className="login-preview-badge login-preview-badge--ok" />
                    <span className="login-preview-row__label">Celulares</span>
                    <span className="login-preview-row__val">218</span>
                  </div>
                  <div className="login-preview-row">
                    <span className="login-preview-badge login-preview-badge--warn" />
                    <span className="login-preview-row__label">Tablets</span>
                    <span className="login-preview-row__val">96</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default LoginPage;
