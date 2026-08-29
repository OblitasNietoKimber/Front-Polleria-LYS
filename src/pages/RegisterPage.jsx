import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import * as authService from '../services/authService';
import { validateRegisterForm } from '../services/validators';
import Logo from '../components/common/Logo';

const initialForm = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  password: '',
  confirmPassword: '',
};

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

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
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

    const fieldErrors = validateRegisterForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      authService.register(form);
      authService.login({ email: form.email, password: form.password });
      navigate('/profile');
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="lys-root" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#fff', borderRadius: 16, padding: '32px 28px', boxShadow: '0 10px 30px rgba(27,21,18,0.08)' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
          <Logo size="md" />
        </div>
        <h1 className="font-display" style={{ fontSize: '1.4rem', textAlign: 'center', margin: '0 0 6px' }}>
          Crea tu cuenta
        </h1>
        <p style={{ textAlign: 'center', color: '#7A6F65', fontSize: '0.9rem', margin: '0 0 24px' }}>
          Regístrate para hacer pedidos y guardar tus datos en Leñas y Sabores.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <Field
              label="Nombre"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              error={errors.nombre}
              placeholder="Juan"
              autoComplete="given-name"
            />
            <Field
              label="Apellido"
              name="apellido"
              value={form.apellido}
              onChange={handleChange}
              error={errors.apellido}
              placeholder="Pérez"
              autoComplete="family-name"
            />
          </div>

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
            label="Teléfono"
            name="telefono"
            type="tel"
            value={form.telefono}
            onChange={handleChange}
            error={errors.telefono}
            placeholder="987 654 321"
            autoComplete="tel"
          />
          <Field
            label="Contraseña"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <Field
            label="Confirmar contraseña"
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.85rem', marginTop: 20 }}>
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" style={{ color: 'var(--ember)', fontWeight: 600 }}>
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;