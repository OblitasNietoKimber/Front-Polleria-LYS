import { useState, useMemo } from 'react';
import { Clock, CheckCircle2, Utensils, Calendar, X } from 'lucide-react';

export default function ActividadModal({ actividades = [], onClose }) {
  const [filtroTipo, setFiltroTipo] = useState('todos');

  const actividadesFiltradas = useMemo(() => {
    if (filtroTipo === 'todos') return actividades;
    return actividades.filter((act) => act.tipo === filtroTipo);
  }, [actividades, filtroTipo]);

  function renderIcono(tipo) {
    switch (tipo) {
      case 'pedido_completado':
        return <CheckCircle2 size={18} strokeWidth={2.2} />;
      case 'reserva':
        return <Calendar size={18} strokeWidth={2.2} />;
      default:
        return <Utensils size={18} strokeWidth={2.2} />;
    }
  }

  return (
    <div className="mesa-modal-backdrop" onClick={onClose}>
      <div
        className="mesa-modal-card"
        style={{ maxWidth: 560, maxHeight: '85vh', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mesa-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ background: '#FDECEC', color: 'var(--ember)', padding: 6, borderRadius: 8, display: 'flex' }}>
              <Clock size={20} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700 }}>
                Historial de Actividad del Salón
              </h3>
              <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
                Eventos registrados hoy en el turno
              </span>
            </div>
          </div>
          <button
            type="button"
            className="activity-toggle-btn"
            onClick={onClose}
            title="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Filtros por tipo de actividad */}
        <div style={{ padding: '12px 22px', borderBottom: '1px solid var(--line)', display: 'flex', gap: 8, background: '#FAF9F7' }}>
          {[
            { id: 'todos', label: 'Todas' },
            { id: 'pedido_creado', label: 'Pedidos nuevos' },
            { id: 'pedido_completado', label: 'Completados' },
            { id: 'reserva', label: 'Reservas' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFiltroTipo(tab.id)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: filtroTipo === tab.id ? '1px solid var(--ember)' : '1px solid var(--line)',
                background: filtroTipo === tab.id ? 'var(--ember)' : '#FFF',
                color: filtroTipo === tab.id ? '#FFF' : 'var(--ink)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Lista completa scrollable */}
        <div style={{ padding: 22, overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {actividadesFiltradas.map((item) => (
            <div
              key={item.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 16px',
                background: '#F9FAFB',
                border: '1px solid #ECE7E1',
                borderRadius: 12,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div className={`activity-avatar ${item.tipoColor || 'rojo'}`} style={{ width: 38, height: 38 }}>
                  {renderIcono(item.tipo)}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <span style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--ink)' }}>
                    {item.titulo || `Mesa ${item.mesaNumero}`}
                  </span>
                  <span style={{ fontSize: '0.82rem', color: '#4B5563' }}>
                    {item.descripcion}
                  </span>
                  {item.ordenCodigo && (
                    <span style={{ fontSize: '0.75rem', fontFamily: 'IBM Plex Mono, monospace', color: 'var(--ember)', fontWeight: 600 }}>
                      {item.ordenCodigo}
                    </span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#9CA3AF', fontWeight: 500 }}>
                {item.hora}
              </span>
            </div>
          ))}

          {actividadesFiltradas.length === 0 && (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: '#9CA3AF' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>No hay eventos que coincidan con este filtro.</p>
            </div>
          )}
        </div>

        <div className="mesa-modal-footer">
          <button
            type="button"
            className="btn-borrador"
            style={{ padding: '8px 18px', maxWidth: 100 }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

