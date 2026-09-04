import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import mesaService from '../../services/mesaService';
import cocinaService from '../../services/cocinaService';

export default function MesaDetalleModal({ mesa, onClose, onMesaUpdated }) {
  const navigate = useNavigate();
  const [pedidoActivo, setPedidoActivo] = useState(null);

  useEffect(() => {
    if (mesa?.pedidoId) {
      const pedidos = cocinaService.getPedidos();
      const match = pedidos.find((p) => p.id === mesa.pedidoId);
      setPedidoActivo(match || null);
    } else {
      setPedidoActivo(null);
    }
  }, [mesa]);

  if (!mesa) return null;

  const { numero, capacidad, estado, inicioAt, totalAcumulado, horaReserva } = mesa;
  const minutos = mesaService.getMinutosOcupada(inicioAt);

  function handleIrAPedido() {
    onClose();
    navigate(`/mesas/${numero}/pedido`);
  }

  function handleLiberarMesa() {
    if (window.confirm(`¿Confirmas liberar la Mesa ${numero}?`)) {
      mesaService.liberarMesa(numero);
      mesaService.registrarActividad({
        mesaNumero: numero,
        tipo: 'pedido_completado',
        titulo: `Mesa ${numero}`,
        descripcion: 'Mesa liberada',
        ordenCodigo: mesa.pedidoId ? `Orden ${mesa.pedidoId}` : '',
        tipoColor: 'verde',
      });
      if (onMesaUpdated) onMesaUpdated();
      onClose();
    }
  }

  function handleSolicitarCuenta() {
    if (mesa.pedidoId) {
      try {
        const raw = localStorage.getItem('lys_pedidos');
        const pedidos = raw ? JSON.parse(raw) : [];
        const actualizados = pedidos.map((p) => {
          if (p.id === mesa.pedidoId) {
            return { ...p, cuentaSolicitada: true };
          }
          return p;
        });
        localStorage.setItem('lys_pedidos', JSON.stringify(actualizados));
        window.dispatchEvent(new Event('storage'));
      } catch (err) {
        console.error(err);
      }
    }

    mesaService.registrarActividad({
      mesaNumero: numero,
      tipo: 'pedido_actualizado',
      titulo: `Mesa ${numero}`,
      descripcion: 'Cuenta solicitada a caja',
      ordenCodigo: mesa.pedidoId || '',
      tipoColor: 'amarillo',
    });

    alert(`Se ha solicitado la cuenta de la Mesa ${numero} para Caja.`);
    if (onMesaUpdated) onMesaUpdated();
    onClose();
  }

  return (
    <div className="mesa-modal-backdrop" onClick={onClose}>
      <div className="mesa-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="mesa-modal-header">
          <div>
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>
              Mesa {numero}
            </h3>
            <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>
              Capacidad: {capacidad} comensales · Zona Salón Principal
            </span>
          </div>
          <span className={`mesa-status-badge ${estado}`}>
            {estado}
          </span>
        </div>

        <div className="mesa-modal-body">
          {estado === 'libre' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: 20 }}>
                Esta mesa se encuentra disponible para nuevos comensales.
              </p>
              <button
                className="btn-nuevo-pedido"
                style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                onClick={handleIrAPedido}
              >
                + Tomar pedido ahora
              </button>
            </div>
          )}

          {estado === 'ocupada' && (
            <div>
              <div style={{ background: '#F8F9FA', padding: 14, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                  <span style={{ color: '#6B7280' }}>Tiempo en mesa:</span>
                  <span style={{ fontWeight: 600 }}>⏱ {minutos} minutos</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                  <span style={{ color: '#6B7280' }}>Total consumido:</span>
                  <span style={{ fontWeight: 700, color: 'var(--ember)', fontFamily: 'IBM Plex Mono' }}>
                    S/ {Number(totalAcumulado || 0).toFixed(2)}
                  </span>
                </div>
                {pedidoActivo && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem' }}>
                    <span style={{ color: '#6B7280' }}>Estado en cocina:</span>
                    <span style={{ fontWeight: 600, textTransform: 'capitalize', color: '#1F8844' }}>
                      {pedidoActivo.estadoCocina?.replace('_', ' ') || 'En espera'}
                    </span>
                  </div>
                )}
              </div>

              {pedidoActivo?.items?.length > 0 && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: '#6B7280', textTransform: 'uppercase' }}>
                    Comanda actual
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: 18, fontSize: '0.85rem', color: '#374151' }}>
                    {pedidoActivo.items.map((it, idx) => (
                      <li key={idx} style={{ marginBottom: 4 }}>
                        {it.cantidad}x {it.nombre} - S/ {(it.precio * it.cantidad).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn-nuevo-pedido"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleIrAPedido}
                >
                  📝 Ver / Agregar a la comanda
                </button>
                <button
                  type="button"
                  style={{
                    padding: '10px',
                    borderRadius: 8,
                    border: '1px solid #E8A33D',
                    background: '#FEF6E8',
                    color: '#C47F17',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                  onClick={handleSolicitarCuenta}
                >
                  💳 Solicitar cuenta para caja
                </button>
                <button
                  type="button"
                  style={{
                    padding: '8px',
                    borderRadius: 8,
                    border: '1px solid var(--line)',
                    background: '#FFF',
                    color: '#6B7280',
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                  onClick={handleLiberarMesa}
                >
                  Liberar mesa manualmente
                </button>
              </div>
            </div>
          )}

          {estado === 'reservada' && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <div style={{ background: '#FEF8EF', padding: 14, borderRadius: 10, marginBottom: 16 }}>
                <span style={{ fontSize: '1.4rem' }}>📅</span>
                <p style={{ margin: '8px 0 0 0', fontWeight: 600, color: '#A16207' }}>
                  Reserva programada para las {horaReserva || '19:30'}
                </p>
                <span style={{ fontSize: '0.8rem', color: '#B45309' }}>
                  Capacidad reservada: {capacidad} personas
                </span>
              </div>
              <button
                className="btn-nuevo-pedido"
                style={{ width: '100%', justifyContent: 'center' }}
                onClick={handleIrAPedido}
              >
                Ingresar comensales y abrir pedido
              </button>
            </div>
          )}
        </div>

        <div className="mesa-modal-footer">
          <button
            type="button"
            style={{
              padding: '8px 16px',
              borderRadius: 8,
              border: '1px solid var(--line)',
              background: '#FFF',
              cursor: 'pointer',
              fontWeight: 500,
            }}
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
