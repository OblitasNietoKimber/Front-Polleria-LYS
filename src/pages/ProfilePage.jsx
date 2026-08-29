import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import Logo from '../components/common/Logo';
import * as authService from '../services/authService';
import {
  validatePersonalDataForm,
  validateChangePasswordForm,
} from '../services/validators';

function Field({ label, name, type = 'text', value, onChange, error, autoComplete, disabled }) {
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
        autoComplete={autoComplete}
        disabled={disabled}
      />
      {error && <p style={{ color: '#B23A2E', fontSize: '0.8rem', margin: 0 }}>{error}</p>}
    </div>
  );
}

// --- Pestaña: Datos personales -------------------------------------------

function DatosTab({ user, onUpdated }) {
  const [form, setForm] = useState({
    nombre: user.nombre || '',
    apellido: user.apellido || '',
    telefono: user.telefono || '',
  });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const fieldErrors = validatePersonalDataForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      const updatedUser = authService.updateProfile(form);
      onUpdated(updatedUser);
      setSaved(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-panel">
      <h2>Datos personales</h2>
      <p className="profile-panel-subtitle">
        Esta información se usa para tus pedidos y para identificarte en Leñas y Sabores.
      </p>

      {saved && <div className="profile-success-banner">Tus datos se actualizaron correctamente.</div>}

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 420 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Field label="Nombre" name="nombre" value={form.nombre} onChange={handleChange} error={errors.nombre} />
          <Field label="Apellido" name="apellido" value={form.apellido} onChange={handleChange} error={errors.apellido} />
        </div>

        <Field label="Correo electrónico" name="email" value={user.email} onChange={() => {}} disabled />
        <p style={{ marginTop: -12, marginBottom: 16, fontSize: '0.76rem', color: 'var(--smoke)' }}>
          El correo no se puede editar por ahora.
        </p>

        <Field
          label="Teléfono"
          name="telefono"
          type="tel"
          value={form.telefono}
          onChange={handleChange}
          error={errors.telefono}
        />

        {formError && <p style={{ color: '#B23A2E', fontSize: '0.85rem', marginBottom: 14 }}>{formError}</p>}

        <button type="submit" className="btn-ember" disabled={loading}>
          {loading ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}

// --- Pestaña: Privacidad y seguridad -------------------------------------

function PrivacidadTab() {
  const initialForm = { currentPassword: '', newPassword: '', confirmPassword: '' };
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
    setSaved(false);
  }

  function handleSubmit(e) {
    e.preventDefault();
    setFormError('');

    const fieldErrors = validateChangePasswordForm(form);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) return;

    setLoading(true);
    try {
      authService.changePassword(form);
      setForm(initialForm);
      setSaved(true);
    } catch (err) {
      setFormError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="profile-panel">
      <h2>Privacidad y seguridad</h2>
      <p className="profile-panel-subtitle">
        Cambia tu contraseña periódicamente para mantener tu cuenta segura.
      </p>

      {saved && <div className="profile-success-banner">Tu contraseña se actualizó correctamente.</div>}

      <form onSubmit={handleSubmit} noValidate style={{ maxWidth: 420 }}>
        <Field
          label="Contraseña actual"
          name="currentPassword"
          type="password"
          value={form.currentPassword}
          onChange={handleChange}
          error={errors.currentPassword}
          autoComplete="current-password"
        />
        <Field
          label="Nueva contraseña"
          name="newPassword"
          type="password"
          value={form.newPassword}
          onChange={handleChange}
          error={errors.newPassword}
          autoComplete="new-password"
        />
        <Field
          label="Confirmar nueva contraseña"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        {formError && <p style={{ color: '#B23A2E', fontSize: '0.85rem', marginBottom: 14 }}>{formError}</p>}

        <button type="submit" className="btn-ember" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar contraseña'}
        </button>
      </form>
    </div>
  );
}

// --- Pestaña: Preferencias ------------------------------------------------

function PreferenciasTab({ user, onUpdated }) {
  const [preferencias, setPreferencias] = useState(
    user.preferencias || { notificacionesEmail: true, notificacionesPromos: true }
  );

  function toggle(key) {
    const updated = { ...preferencias, [key]: !preferencias[key] };
    setPreferencias(updated);
    const updatedUser = authService.updatePreferences(updated);
    onUpdated(updatedUser);
  }

  return (
    <div className="profile-panel">
      <h2>Preferencias</h2>
      <p className="profile-panel-subtitle">
        Elige qué notificaciones quieres recibir de Leñas y Sabores.
      </p>

      <div style={{ maxWidth: 460 }}>
        <div className="profile-toggle-row">
          <div className="profile-toggle-label">
            <strong>Notificaciones por correo</strong>
            <span>Confirmaciones y estado de tus pedidos.</span>
          </div>
          <button
            type="button"
            className={`profile-switch${preferencias.notificacionesEmail ? ' on' : ''}`}
            onClick={() => toggle('notificacionesEmail')}
            aria-pressed={preferencias.notificacionesEmail}
            aria-label="Notificaciones por correo"
          />
        </div>

        <div className="profile-toggle-row">
          <div className="profile-toggle-label">
            <strong>Ofertas y promociones</strong>
            <span>Novedades y descuentos de la pollería.</span>
          </div>
          <button
            type="button"
            className={`profile-switch${preferencias.notificacionesPromos ? ' on' : ''}`}
            onClick={() => toggle('notificacionesPromos')}
            aria-pressed={preferencias.notificacionesPromos}
            aria-label="Ofertas y promociones"
          />
        </div>
      </div>
    </div>
  );
}

// --- Página principal -----------------------------------------------------

const TABS = [
  { id: 'datos', label: 'Datos personales' },
  { id: 'privacidad', label: 'Privacidad y seguridad' },
  { id: 'preferencias', label: 'Preferencias' },
];

function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [tab, setTab] = useState('datos');

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  function handleLogout() {
    authService.logout();
    navigate('/login', { replace: true });
  }

  const initials = `${user?.nombre?.[0] || ''}${user?.apellido?.[0] || ''}`.toUpperCase();

  return (
    <div className="profile-shell">
      <header className="profile-topbar">
        <Logo size="sm" />
      </header>

      <div className="profile-content">
        <nav className="profile-sidebar">
          <div className="profile-sidebar-header">
            <div className="profile-avatar">{initials || 'LS'}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>
                {user.nombre} {user.apellido}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--smoke)' }}>{user.email}</div>
            </div>
          </div>

          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`profile-menu-item${tab === t.id ? ' active' : ''}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}

          <button type="button" className="profile-menu-item danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
        </nav>

        {tab === 'datos' && <DatosTab user={user} onUpdated={setUser} />}
        {tab === 'privacidad' && <PrivacidadTab />}
        {tab === 'preferencias' && <PreferenciasTab user={user} onUpdated={setUser} />}
      </div>
    </div>
  );
}

export default ProfilePage;