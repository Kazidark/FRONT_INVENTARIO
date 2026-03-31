import {
  Children,
  cloneElement,
  createRef,
  forwardRef,
  isValidElement,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useAuth } from '../../../shared/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../../../services/api/auth.api';
import { toast } from 'react-hot-toast';
import { gsap } from 'gsap';
import './LoginPage.css';
import './CardSwap.css';

// React Bits (CardSwap) - variante JS + CSS (inline en esta página)
const Card = forwardRef(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`cardswap-card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

const makeSlot = (i, distX, distY, total) => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el, slot, skew) =>
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });

const cardSwapImg1 = '/img/inventory-dashboard.jpg';
const cardSwapImg2 = '/img/cloud-network.jpg';
const cardSwapImg3 = '/img/data-analytics.jpg';

const CardSwap = ({
  width = 380,
  height = 260,
  cardDistance = 34,
  verticalDistance = 34,
  delay = 3200,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => createRef()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));
  const tlRef = useRef(null);
  const intervalRef = useRef();
  const container = useRef(null);

  useEffect(() => {
    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        y: '+=500',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        undefined,
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    swap();
    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      const pause = () => {
        tlRef.current?.pause();
        clearInterval(intervalRef.current);
      };
      const resume = () => {
        tlRef.current?.play();
        intervalRef.current = window.setInterval(swap, delay);
      };
      node.addEventListener('mouseenter', pause);
      node.addEventListener('mouseleave', resume);
      return () => {
        node.removeEventListener('mouseenter', pause);
        node.removeEventListener('mouseleave', resume);
        clearInterval(intervalRef.current);
      };
    }

    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) =>
    isValidElement(child)
      ? cloneElement(child, {
          key: i,
          ref: refs[i],
          style: { width, height, ...(child.props.style ?? {}) },
          onClick: (e) => {
            child.props.onClick?.(e);
            onCardClick?.(i);
          }
        })
      : child
  );

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: ''
  });

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
      toast.error('Ingresa tu email');
      return;
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      toast.error('Email inválido');
      return;
    }

    if (!password) {
      toast.error('Ingresa tu contraseña');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Verificando…');

    try {
      // console.log('[FRONT][LOGIN PAGE] submit:', { email: form.email });
      const data = await loginRequest({ email, password });
      // console.log('[FRONT][LOGIN PAGE] login ok, data:', data);
       if(data){    
        setLoading(false);
        
         toast.success('Bienvenido al sistemas de inventario');
         setTimeout(() => {
           const authPayload =
             data && typeof data === 'object'
               ? { ...data, login_email: email }
               : { data, login_email: email };
           login(authPayload);
           navigate('/dashboard', { replace: true });
         }, 3000);
          
       }

     
    } catch (err) {
      // console.log('[FRONT][LOGIN PAGE] login error:', err);
      const message = err.response?.data?.message || 'Credenciales inválidas';
      toast.error(message);
      setError(message);
    } finally {
      toast.dismiss(toastId);
      setLoading(false);
    }
  };

  return (
    <div className="loginBg">
      <div className="loginLayout">
        <div className="loginLeft">
          <div className="loginCard" role="region" aria-label="Login">
            <div className="loginCardBrand">
              <svg className="loginLogo" viewBox="0 0 40 40" aria-hidden="true">
                <rect width="40" height="40" rx="10" fill="#10b981" />
                <path d="M12 20h6v-6h4v6h6v4h-6v6h-4v-6h-6z" fill="#fff" />
              </svg>
              <div className="loginBrandText">
                <span className="loginBrandName">SANNA</span>
                <span className="loginBrandSub">Sistema de Inventario</span>
              </div>
            </div>

            <div className="loginCardDivider" />

            <h2 className="loginTitle">Bienvenido de vuelta</h2>
            <p className="loginSubtitle">Ingrese sus credenciales para continuar</p>

            <form onSubmit={handleSubmit} className="loginForm" aria-label="Formulario de inicio de sesión">
              <div className="loginField">
                <label className="loginLabel" htmlFor="email">Correo electrónico</label>
                <div className="loginInputWrap">
                  <svg className="loginInputIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M12 12a4.5 4.5 0 1 0-4.5-4.5A4.5 4.5 0 0 0 12 12Zm0 2.25c-4.18 0-7.5 2.06-7.5 4.5V21h15v-2.25c0-2.44-3.32-4.5-7.5-4.5Z" />
                  </svg>
                  <input
                    id="email"
                    className="loginInput"
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

              <div className="loginField">
                <div className="loginLabelRow">
                  <label className="loginLabel" htmlFor="password">Contraseña</label>
                  {!form.password && (
                    <span className="loginRequired" aria-live="polite">Obligatorio</span>
                  )}
                </div>
                <div className="loginInputWrap">
                  <svg className="loginInputIcon" viewBox="0 0 24 24" aria-hidden="true">
                    <path fill="currentColor" d="M17 9h-1V7a4 4 0 0 0-8 0v2H7a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2Zm-7-2a2 2 0 0 1 4 0v2h-4V7Z" />
                  </svg>
                  <input
                    id="password"
                    className="loginInput"
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
                    className="loginEyeBtn"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={loading}
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  >
                    <svg viewBox="0 0 24 24" width="20" height="20">
                      {showPassword ? (
                        <path fill="currentColor" d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7Zm0 11a4 4 0 1 1 4-4 4 4 0 0 1-4 4Z" />
                      ) : (
                        <path fill="currentColor" d="M2.1 3.51 3.52 2.1l18.38 18.38-1.41 1.41-3.02-3.02A10.74 10.74 0 0 1 12 19c-7 0-10-7-10-7a18 18 0 0 1 4.2-5.47L2.1 3.51ZM12 7a4.94 4.94 0 0 1 5 5 4.78 4.78 0 0 1-.24 1.53l-1.84-1.84A2.98 2.98 0 0 0 12 9a2.73 2.73 0 0 0-.69.09L9.6 7.38A5.1 5.1 0 0 1 12 7Zm0 10a5 5 0 0 1-5-5 4.92 4.92 0 0 1 .41-1.98l1.63 1.63A3.07 3.07 0 0 0 9 12a3 3 0 0 0 3 3 3.07 3 0 0 0 .35 0l1.63 1.63A4.92 4.92 0 0 1 12 17Z" />
                      )}
                    </svg>
                  </button>
                </div>
              </div>

              {error && (
                <div className="loginError" role="alert">{error}</div>
              )}

              <button className="loginSubmitBtn" disabled={loading} type="submit">
                {loading ? 'Verificando...' : 'Iniciar Sesión'}
              </button>

              <button
                type="button"
                className="loginForgotBtn"
                onClick={() => navigate('/forgot-password')}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </form>

            <p className="loginFooter">SANNA &copy; {new Date().getFullYear()}</p>
          </div>
        </div>

        <aside className="loginRight" aria-label="Animación">
          <CardSwap easing="elastic" delay={3200} pauseOnHover={false} width={640} height={410}>
            <Card customClass="loginSwapCard loginSwapCard--a">
              <div className="loginSwapFrame">
                <div className="loginSwapFrameTop">
                  <div className="loginSwapFrameTopLeft">
                    <span className="loginSwapFrameDot loginSwapFrameDot--blue" aria-hidden="true" />
                    <span className="loginSwapFrameDot loginSwapFrameDot--red" aria-hidden="true" />
                    <span className="loginSwapFrameDot loginSwapFrameDot--yellow" aria-hidden="true" />
                  </div>
                  <span className="loginSwapFrameLabel">Efectividad</span>
                  <span className="loginSwapFrameBadge">En linea</span>
                </div>
                <div className="loginSwapFrameMedia">
                  <img
                    src={cardSwapImg1}
                    alt="Captura del sistema de inventario"
                    className="loginSwapPreview"
                    loading="lazy"
                  />
                </div>
              </div>
            </Card>

            <Card customClass="loginSwapCard loginSwapCard--b">
              <div className="loginSwapFrame">
                <div className="loginSwapFrameTop">
                  <div className="loginSwapFrameTopLeft">
                    <span className="loginSwapFrameDot loginSwapFrameDot--blue" aria-hidden="true" />
                    <span className="loginSwapFrameDot loginSwapFrameDot--red" aria-hidden="true" />
                    <span className="loginSwapFrameDot loginSwapFrameDot--yellow" aria-hidden="true" />
                  </div>
                  <span className="loginSwapFrameLabel">Estrategia</span>
                  <span className="loginSwapFrameBadge">En linea</span>
                </div>
                <div className="loginSwapFrameMedia">
                  <img
                    src={cardSwapImg2}
                    alt="Comunicación en la nube"
                    className="loginSwapPreview"
                    loading="lazy"
                  />
                </div>
              </div>
            </Card>

            <Card customClass="loginSwapCard loginSwapCard--c">
              <div className="loginSwapFrame">
                <div className="loginSwapFrameTop">
                  <div className="loginSwapFrameTopLeft">
                    <span className="loginSwapFrameDot loginSwapFrameDot--blue" aria-hidden="true" />
                    <span className="loginSwapFrameDot loginSwapFrameDot--red" aria-hidden="true" />
                    <span className="loginSwapFrameDot loginSwapFrameDot--yellow" aria-hidden="true" />
                  </div>
                  <span className="loginSwapFrameLabel">Compromiso</span>
                  <span className="loginSwapFrameBadge">En linea</span>
                </div>
                <div className="loginSwapFrameMedia">
                  <img
                    src={cardSwapImg3}
                    alt="Tecnología y conexión"
                    className="loginSwapPreview"
                    loading="lazy"
                  />
                </div>
              </div>
            </Card>
          </CardSwap>
        </aside>
      </div>
    </div>
  );
};

export default LoginPage;
