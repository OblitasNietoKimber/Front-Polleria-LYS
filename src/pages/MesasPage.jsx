import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Plus, Search } from 'lucide-react';
import useMesas from '../hooks/useMesas';
import MesaCard from '../components/mesas/MesaCard';
import EstadisticasMesas from '../components/mesas/EstadisticasMesas';
import ActividadReciente from '../components/mesas/ActividadReciente';
import ActividadModal from '../components/mesas/ActividadModal';
import MesaDetalleModal from '../components/mesas/MesaDetalleModal';
import { ZONAS_SALON } from '../data/mesasData';
import '../styles/mesas.css';

export default function MesasPage() {
  const navigate = useNavigate();
  const [zonaSeleccionada, setZonaSeleccionada] = useState('salon_principal');
  const [busqueda, setBusqueda] = useState('');
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);
  const [mostrarModalActividad, setMostrarModalActividad] = useState(false);

  const { mesas, estadisticas, actividades, recargar } = useMesas(zonaSeleccionada);

  // Filtrado de mesas por texto de búsqueda
  const mesasFiltradas = useMemo(() => {
    if (!busqueda.trim()) return mesas;
    const term = busqueda.toLowerCase().trim();
    return mesas.filter(
      (m) =>
        m.numero.toLowerCase().includes(term) ||
        (m.pedidoId && m.pedidoId.toLowerCase().includes(term))
    );
  }, [mesas, busqueda]);

  function handleAbrirNuevoPedido() {
    // Buscar la primera mesa libre disponible o ir a la 01
    const primeraLibre = mesas.find((m) => m.estado === 'libre');
    const num = primeraLibre ? primeraLibre.numero : '01';
    navigate(`/mesas/${num}/pedido`);
  }

  function handleMesaClick(mesa) {
    setMesaSeleccionada(mesa);
  }

  return (
    <div className="mesas-layout">
      {/* Barra superior */}
      <header className="mesas-topbar">
        <div className="mesas-title-area">
          <h1 className="mesas-title">Gestión de mesas</h1>
        </div>

        <div className="mesas-controls">
          {/* Buscador */}
          <div className="mesas-search-box">
            <Search size={16} className="mesas-search-icon" style={{ color: '#9CA3AF' }} />
            <input
              type="text"
              className="mesas-search-input"
              placeholder="Buscar mesa o número de pedido..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Selector de zona */}
          <select
            className="mesas-zone-select"
            value={zonaSeleccionada}
            onChange={(e) => setZonaSeleccionada(e.target.value)}
          >
            {ZONAS_SALON.map((z) => (
              <option key={z.id} value={z.id}>
                {z.nombre}
              </option>
            ))}
          </select>

          {/* Botón para alternar visibilidad de Actividad Reciente */}
          <button
            type="button"
            className={`btn-toggle-actividad ${!sidebarColapsado ? 'activa' : ''}`}
            onClick={() => setSidebarColapsado((prev) => !prev)}
            title={sidebarColapsado ? 'Abrir panel de actividad' : 'Ocultar panel de actividad'}
          >
            <Clock size={16} />
            <span className="btn-toggle-actividad-label">Actividad</span>
            {actividades.length > 0 && (
              <span className="btn-toggle-actividad-badge">{actividades.length}</span>
            )}
          </button>

          {/* Botón Nuevo Pedido */}
          <button
            className="btn-nuevo-pedido"
            type="button"
            onClick={handleAbrirNuevoPedido}
          >
            <Plus size={18} />
            <span>Nuevo pedido</span>
          </button>
        </div>
      </header>

      {/* Tarjetas KPI de Estado */}
      <EstadisticasMesas estadisticas={estadisticas} />

      {/* Contenido Principal: Plano + Actividad */}
      <main className={`mesas-main-content ${sidebarColapsado ? 'sidebar-collapsed' : ''}`}>
        <section className="mesas-floor-plan">
          <div className="mesas-grid">
            {mesasFiltradas.map((mesa) => (
              <MesaCard
                key={mesa.id}
                mesa={mesa}
                onClick={handleMesaClick}
              />
            ))}
          </div>

          {mesasFiltradas.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6B7280' }}>
              {busqueda ? (
                <p style={{ fontSize: '1.05rem', margin: 0 }}>
                  No se encontraron mesas con "{busqueda}".
                </p>
              ) : (
                <div style={{ maxWidth: 360, margin: '0 auto' }}>
                  <span style={{ fontSize: '2.5rem' }}>🏗️</span>
                  <h3 style={{ margin: '12px 0 6px 0', fontSize: '1.1rem', color: 'var(--ink)' }}>
                    Zona en ampliación
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#6B7280', lineHeight: 1.5, margin: '0 0 16px 0' }}>
                    Esta área está reservada para futuras mesas de la pollería. Todas las mesas activas se encuentran en el <strong>Salón principal</strong>.
                  </p>
                  <button
                    type="button"
                    className="btn-nuevo-pedido"
                    style={{ background: '#FFF', color: 'var(--ink)', border: '1px solid var(--line)', boxShadow: 'none' }}
                    onClick={() => setZonaSeleccionada('salon_principal')}
                  >
                    Volver al Salón principal
                  </button>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Panel lateral de actividad */}
        {!sidebarColapsado && (
          <ActividadReciente
            actividades={actividades}
            onToggleCollapse={() => setSidebarColapsado(true)}
            onVerTodo={() => setMostrarModalActividad(true)}
          />
        )}
      </main>

      {/* Modal de detalle de mesa */}
      {mesaSeleccionada && (
        <MesaDetalleModal
          mesa={mesaSeleccionada}
          onClose={() => setMesaSeleccionada(null)}
          onMesaUpdated={recargar}
        />
      )}

      {/* Modal de historial completo de actividad */}
      {mostrarModalActividad && (
        <ActividadModal
          actividades={actividades}
          onClose={() => setMostrarModalActividad(false)}
        />
      )}
    </div>
  );
}

