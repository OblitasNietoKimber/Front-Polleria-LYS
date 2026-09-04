import React from 'react';

export default function ActividadReciente({ actividades = [], onToggleCollapse }) {
  return (
    <aside className="mesas-activity-sidebar">
      <div className="activity-header">
        <div className="activity-header-left">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" color="#E23A32">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h3 className="activity-title">Actividad reciente</h3>
        </div>
        {onToggleCollapse && (
          <button
            className="activity-toggle-btn"
            onClick={onToggleCollapse}
            title="Ocultar panel"
          >
            ✕
          </button>
        )}
      </div>

      <div className="activity-list">
        {actividades.slice(0, 8).map((item) => (
          <div key={item.id} className="activity-item">
            <div className="activity-item-main">
              <div className={`activity-avatar ${item.tipoColor || 'rojo'}`}>
                {item.tipo === 'pedido_completado' ? '✓' : item.tipo === 'reserva' ? '📅' : '👥'}
              </div>
              <div className="activity-details">
                <span className="activity-item-title">{item.titulo || `Mesa ${item.mesaNumero}`}</span>
                <span className="activity-item-desc">{item.descripcion}</span>
                {item.ordenCodigo && (
                  <span className="activity-item-order">{item.ordenCodigo}</span>
                )}
              </div>
            </div>
            <span className="activity-time">{item.hora}</span>
          </div>
        ))}

        {actividades.length === 0 && (
          <p style={{ fontSize: '0.85rem', color: '#9CA3AF', textAlign: 'center', padding: '20px 0' }}>
            No hay actividades recientes registradas.
          </p>
        )}
      </div>

      <button className="activity-footer-btn" type="button">
        Ver toda la actividad &gt;
      </button>
    </aside>
  );
}
