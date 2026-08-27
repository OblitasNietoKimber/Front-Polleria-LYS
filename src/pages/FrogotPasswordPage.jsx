import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../service/authService';
import { validateForgotPasswordForm } from '../service/validators';
import Logo from '../components/common/Logo';

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [loading, setLoading] = useState(false);
  const [devCode, setDevCode] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const fieldErrors = validateForgotPasswordForm({ email });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const { code } = authService.requestPasswordReset(email);
      setDevCode(code);
      setTimeout(() => {
        navigate('/reset-password', { state: { email } });
      }, 1500);
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
          Recupera tu contraseña
        </h1>
        <p style={{ textAlign: 'center', color: '#7A6F65', fontSize: '0.9rem', margin: '0 0 24px' }}>
          Ingresa tu correo y te enviaremos un código de verificación.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Correo electrónico</label>
          <input
            className={`lys-input ${errors.email ? 'err' : ''}`}
            style={{ width: '100%', margin: '6px 0 4px' }}
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errors.email) setErrors({});
            }}
            placeholder="tucorreo@ejemplo.com"
            autoComplete="email"
          />
          {errors.email && <p style={{ color: '#B23A2E', fontSize: '0.8rem', margin: '0 0 12px' }}>{errors.email}</p>}

          {formError && (
            <p style={{ color: '#B23A2E', fontSize: '0.85rem', marginBottom: 14 }}>{formError}</p>
          )}

          {devCode && (
            <p
              className="font-mono"
              style={{
                background: '#FBF3E1',
                border: '1.5px solid var(--gold)',
                borderRadius: 3,
                padding: '10px 12px',
                fontSize: '0.82rem',
                marginBottom: 14,
              }}
            >
              Código de verificación (demo): <strong>{devCode}</strong>. Te redirigimos para
              ingresarlo...
            </p>
          )}

          <button type="submit" className="btn-ember" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar código de recuperación'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 20 }}>
          <Link to="/login" style={{ color: 'var(--ember)', fontWeight: 600 }}>
            Volver a iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;