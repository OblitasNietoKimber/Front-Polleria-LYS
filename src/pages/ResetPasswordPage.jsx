import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import * as authService from '../services/authService';
import { validateResetPasswordForm } from '../services/validators';
import Logo from '../components/common/Logo';

function Field({ label, name, type = 'text', value, onChange, error, placeholder, autoComplete }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>{label}</label>
      <input
        className={`lys-input ${error ? 'err' : ''}`}
        style={{ width: '100%', margin: '6px 0 4px' }}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />
      {error && <p style={{ color: '#B23A2E', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
    </div>
  );
}

function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefilledEmail = location.state?.email || '';

  const [form, setForm] = useState({
    email: prefilledEmail,
    code: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const fieldErrors = validateResetPasswordForm(form);
    if (!form.email) fieldErrors.email = 'Ingresa tu correo electrónico.';
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      authService.resetPassword(form);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lys-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 400, background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 10px 30px rgba(27,21,18,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo size="md" />
        </div>
        <h1 className="font-display" style={{ fontSize: '1.4rem', textAlign: 'center', margin: '0 0 6px' }}>
          Restablecer contraseña
        </h1>
        <p style={{ textAlign: 'center', color: '#7A6F65', fontSize: '0.9rem', margin: '0 0 24px' }}>
          Ingresa el código que te enviamos y tu nueva contraseña.
        </p>

        {success ? (
          <p style={{ color: 'var(--ink)', fontSize: '0.95rem', textAlign: 'center' }}>
            Tu contraseña se actualizó correctamente. Te redirigimos al inicio de sesión...
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <Field
              label="Correo electrónico"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="tucorreo@ejemplo.com"
              autoComplete="email"
            />
            <Field
              label="Código de verificación"
              name="code"
              value={form.code}
              onChange={handleChange}
              error={errors.code}
              placeholder="123456"
            />
            <Field
              label="Nueva contraseña"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              error={errors.password}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <Field
              label="Confirmar nueva contraseña"
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              placeholder="••••••••"
              autoComplete="new-password"
            />

            {formError && (
              <p style={{ color: '#B23A2E', fontSize: '0.85rem', marginBottom: 14 }}>{formError}</p>
            )}

            <button type="submit" className="btn-ember" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Guardando...' : 'Restablecer contraseña'}
            </button>

            <p style={{ textAlign: 'center', marginTop: 16, fontSize: '0.82rem' }}>
              <Link to="/forgot-password" style={{ color: 'var(--ember)', fontWeight: 600 }}>
                Reenviar código
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;