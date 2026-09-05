import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, Calendar, CheckCircle2 } from 'lucide-react';
import mesaService from '../../services/mesaService';
import cocinaService from '../../services/cocinaService';

export default function MesaDetalleModal({ mesa, onClose, onMesaUpdated }) {
  const navigate = useNavigate();

  const [modoReserva, setModoReserva] = useState(false);
  const [clienteNombre, setClienteNombre] = useState('');
  const [horaReservaInput, setHoraReservaInput] = useState('20:00');
  const [comensalesReserva, setComensalesReserva] = useState(() => mesa?.capacidad || 4);
  const [telefonoReserva, setTelefonoReserva] = useState('');
  const [errorReserva, setErrorReserva] = useState('');

  const pedidoActivo = useMemo(() => {
    if (!mesa?.pedidoId) return null;
    const pedidos = cocinaService.getPedidos();
    return pedidos.find((p) => p.id === mesa.pedidoId) || null;
  }, [mesa]);

  if (!mesa) return null;

  const { numero, capacidad, estado, inicioAt, totalAcumulado, horaReserva } = mesa;
  const minutos = mesaService.getMinutosOcupada(inicioAt);

  function handleIrAPedido() {
    onClose();
    navigate(`/mesas/${numero}/pedido`);
  }

  function handleConfirmarReserva() {
    if (!clienteNombre.trim()) {
      setErrorReserva('Por favor ingresa el nombre del cliente o familia.');
      return;
    }
    mesaService.reservarMesa(numero, {
      cliente: clienteNombre.trim(),
      hora: horaReservaInput,
      comensales: comensalesReserva,
      telefono: telefonoReserva.trim(),
    });
    mesaService.registrarActividad({
      mesaNumero: numero,
      tipo: 'reserva',
      titulo: `Mesa ${numero}`,
      descripcion: `Reserva confirmada a nombre de ${clienteNombre.trim()}`,
      ordenCodigo: `${horaReservaInput} hrs`,
      tipoColor: 'amarillo',
    });
    window.dispatchEvent(new Event('storage'));
    if (onMesaUpdated) onMesaUpdated();
    onClose();
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

  function handleCancelarReserva() {
    if (window.confirm(`¿Confirmas cancelar la reserva de la Mesa ${numero}?`)) {
      mesaService.liberarMesa(numero);
      mesaService.registrarActividad({
        mesaNumero: numero,
        tipo: 'reserva',
        titulo: `Mesa ${numero}`,
        descripcion: 'Reserva cancelada · Mesa liberada',
        ordenCodigo: 'Cancelada',
        tipoColor: 'amarillo',
      });
      if (onMesaUpdated) onMesaUpdated();
      onClose();
    }
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
              Capacidad: {capacidad} comensales · Zona {mesa.zona === 'terraza' ? 'Terraza' : mesa.zona === 'segundo_piso' ? 'Segundo piso' : 'Salón principal'}
            </span>
          </div>
          <span className={`mesa-status-badge ${estado}`}>
            {estado}
          </span>
        </div>

        <div className="mesa-modal-body">
          {estado === 'libre' && !modoReserva && (
            <div style={{ textAlign: 'center', padding: '16px 0' }}>
              <p style={{ color: '#4B5563', fontSize: '0.95rem', marginBottom: 20 }}>
                Esta mesa se encuentra disponible para nuevos comensales.
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  className="btn-nuevo-pedido"
                  style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
                  onClick={handleIrAPedido}
                >
                  + Tomar pedido ahora
                </button>
                <button
                  type="button"
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1.5px solid #F59E0B',
                    background: '#FFFBEB',
                    color: '#B45309',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.9rem',
                  }}
                  onClick={() => setModoReserva(true)}
                >
                  <Calendar size={16} />
                  <span>Reservar esta mesa</span>
                </button>
              </div>
            </div>
          )}

          {estado === 'libre' && modoReserva && (
            <div style={{ background: '#FFFBEB', border: '1.5px solid #FDE68A', padding: '16px', borderRadius: '12px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', color: '#B45309' }}>
                <Calendar size={18} />
                <h4 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700 }}>Nueva reserva · Mesa {numero}</h4>
              </div>

              {errorReserva && (
                <div style={{ color: '#DC2626', fontSize: '0.82rem', marginBottom: '10px' }}>
                  {errorReserva}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#78350F', marginBottom: '4px' }}>
                    Nombre del cliente / grupo:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: Familia López, Carlos Vega..."
                    value={clienteNombre}
                    onChange={(e) => {
                      setClienteNombre(e.target.value);
                      if (errorReserva) setErrorReserva('');
                    }}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#78350F', marginBottom: '4px' }}>
                      Hora programada:
                    </label>
                    <input
                      type="time"
                      value={horaReservaInput}
                      onChange={(e) => setHoraReservaInput(e.target.value)}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#78350F', marginBottom: '4px' }}>
                      Comensales:
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="16"
                      value={comensalesReserva}
                      onChange={(e) => setComensalesReserva(Math.max(1, parseInt(e.target.value) || 1))}
                      style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#78350F', marginBottom: '4px' }}>
                    Teléfono de contacto (opcional):
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej: 987 654 321"
                    value={telefonoReserva}
                    onChange={(e) => setTelefonoReserva(e.target.value)}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #D1D5DB', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    type="button"
                    onClick={handleConfirmarReserva}
                    style={{ flex: 1, padding: '10px', background: '#D97706', color: '#FFF', border: 'none', borderRadius: '8px', fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Guardar reserva
                  </button>
                  <button
                    type="button"
                    onClick={() => setModoReserva(false)}
                    style={{ padding: '10px 14px', background: '#FFF', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '0.9rem', cursor: 'pointer' }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}

          {estado === 'ocupada' && (
            <div>
              <div style={{ background: '#F8F9FA', padding: 14, borderRadius: 10, marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: '0.88rem' }}>
                  <span style={{ color: '#6B7280' }}>Tiempo en mesa:</span>
                  <span style={{ fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={14} style={{ color: '#718096' }} />
                    {minutos} minutos
                  </span>
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
                  Ver / Agregar a la comanda
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
                  Solicitar cuenta para caja
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
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ background: '#FEF8EF', border: '1px solid #FDE6C8', padding: 16, borderRadius: 12, marginBottom: 16, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12, borderBottom: '1px solid #FCE3BD', paddingBottom: 10 }}>
                  <div style={{ background: '#FDE68A', color: '#92400E', padding: 6, borderRadius: 8, display: 'flex' }}>
                    <Calendar size={20} />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.02rem', color: '#92400E', fontWeight: 700 }}>
                      Reserva programada
                    </h4>
                    <span style={{ fontSize: '0.78rem', color: '#B45309' }}>
                      Mesa reservada y apartada
                    </span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.86rem', marginBottom: 10 }}>
                  <div>
                    <span style={{ color: '#8C827A', display: 'block', fontSize: '0.76rem' }}>Cliente:</span>
                    <strong style={{ color: 'var(--ink)' }}>{mesa.clienteReserva || 'Cliente'}</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8C827A', display: 'block', fontSize: '0.76rem' }}>Hora:</span>
                    <strong style={{ color: '#D97706' }}>{horaReserva || '20:00'} hrs</strong>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '0.86rem' }}>
                  <div>
                    <span style={{ color: '#8C827A', display: 'block', fontSize: '0.76rem' }}>Comensales:</span>
                    <strong style={{ color: 'var(--ink)' }}>{mesa.comensalesReserva || capacidad} personas</strong>
                  </div>
                  <div>
                    <span style={{ color: '#8C827A', display: 'block', fontSize: '0.76rem' }}>Teléfono:</span>
                    <span style={{ color: '#4B5563' }}>{mesa.telefonoReserva || 'Sin registrar'}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <button
                  className="btn-nuevo-pedido"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleIrAPedido}
                >
                  <CheckCircle2 size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
                  Llegó el cliente · Sentar y abrir pedido
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
                  onClick={handleCancelarReserva}
                >
                  Cancelar / Liberar reserva
                </button>
              </div>
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

