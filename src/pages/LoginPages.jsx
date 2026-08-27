import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../service/authService';
import { validateLoginForm } from '../service/validators';
import Logo from '../components/common/Logo';

function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const fieldErrors = validateLoginForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      authService.login(form);
      navigate('/profile');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lys-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 380, background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 10px 30px rgba(27,21,18,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo size="md" />
        </div>
        <h1 className="font-display" style={{ fontSize: '1.4rem', textAlign: 'center', margin: '0 0 6px' }}>
          Bienvenido de vuelta
        </h1>
        <p style={{ textAlign: 'center', color: '#7A6F65', fontSize: '0.9rem', margin: '0 0 24px' }}>
          Inicia sesión para continuar en Leñas y Sabores.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Correo electrónico</label>
          <input
            className={`lys-input ${errors.email ? 'err' : ''}`}
            style={{ width: '100%', margin: '6px 0 4px' }}
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
          />
          {errors.email && <p style={{ color: '#B23A2E', fontSize: '0.8rem', margin: '0 0 12px' }}>{errors.email}</p>}

          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Contraseña</label>
          <input
            className={`lys-input ${errors.password ? 'err' : ''}`}
            style={{ width: '100%', margin: '6px 0 4px' }}
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <p style={{ color: '#B23A2E', fontSize: '0.8rem', margin: '0 0 12px' }}>{errors.password}</p>}

          <div style={{ textAlign: 'right', margin: '4px 0 18px' }}>
            <Link to="/forgot-password" style={{ fontSize: '0.82rem', color: 'var(--ember)', fontWeight: 600 }}>
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          {formError && <p style={{ color: '#B23A2E', fontSize: '0.85rem', marginBottom: 14 }}>{formError}</p>}

          <button type="submit" className="btn-ember" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Iniciar sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 20 }}>
          ¿Aún no tienes cuenta?{' '}
          <Link to="/register" style={{ color: 'var(--ember)', fontWeight: 600 }}>
            Regístrate
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;