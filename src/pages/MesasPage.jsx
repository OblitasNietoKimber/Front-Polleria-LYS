import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useMesas from '../hooks/useMesas';
import MesaCard from '../components/mesas/MesaCard';
import EstadisticasMesas from '../components/mesas/EstadisticasMesas';
import ActividadReciente from '../components/mesas/ActividadReciente';
import MesaDetalleModal from '../components/mesas/MesaDetalleModal';
import { ZONAS_SALON } from '../data/mesasData';
import '../styles/mesas.css';

export default function MesasPage() {
  const navigate = useNavigate();
  const [zonaSeleccionada, setZonaSeleccionada] = useState('salon_principal');
  const [busqueda, setBusqueda] = useState('');
  const [sidebarColapsado, setSidebarColapsado] = useState(false);
  const [mesaSeleccionada, setMesaSeleccionada] = useState(null);

  const { mesas, estadisticas, actividades, recargar } = useMesas(zonaSeleccionada);

  // Filtrado por número de mesa o por ID de pedido
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
            <span className="mesas-search-icon">🔍</span>
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
                🏠 {z.nombre}
              </option>
            ))}
          </select>

          {/* Botón Nuevo Pedido */}
          <button
            className="btn-nuevo-pedido"
            type="button"
            onClick={handleAbrirNuevoPedido}
          >
            <span>+</span> Nuevo pedido
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
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9CA3AF' }}>
              <p style={{ fontSize: '1.1rem', margin: 0 }}>
                No se encontraron mesas con "{busqueda}".
              </p>
            </div>
          )}
        </section>

        {/* Panel lateral de actividad */}
        {!sidebarColapsado && (
          <ActividadReciente
            actividades={actividades}
            onToggleCollapse={() => setSidebarColapsado(true)}
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
    </div>
  );
}
