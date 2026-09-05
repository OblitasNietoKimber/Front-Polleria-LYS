import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Users,
  ArrowLeft,
  Trash2,
  ClipboardList,
  BookmarkCheck,
  ChefHat,
  Search,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { PRODUCTS } from '../data/products';
import mesaService from '../services/mesaService';
import authService from '../services/authService';
import '../styles/nuevoPedido.css';

function NuevoPedidoForm({ numeroNormalizado }) {
  const navigate = useNavigate();
  const todasLasMesas = useMemo(() => mesaService.getMesas(), []);
  const mesaActual = useMemo(() => {
    return todasLasMesas.find((m) => String(m.numero).padStart(2, '0') === numeroNormalizado) || null;
  }, [todasLasMesas, numeroNormalizado]);

  const [comensales, setComensales] = useState(() => mesaActual?.comensalesReserva || mesaActual?.capacidad || 4);
  const [categoriaActiva, setCategoriaActiva] = useState('pollos');
  const [busqueda, setBusqueda] = useState('');
  const [toastMsg, setToastMsg] = useState('');

  // Carga los productos de esta mesa si ya tiene una orden activa
  const [itemsComanda, setItemsComanda] = useState(() => {
    if (!mesaActual?.pedidoId) return [];
    try {
      const raw = localStorage.getItem('lys_pedidos');
      const pedidos = raw ? JSON.parse(raw) : [];
      const pedidoExistente = pedidos.find((p) => p.id === mesaActual.pedidoId);
      return pedidoExistente?.items || [];
    } catch {
      return [];
    }
  });

  const [observaciones, setObservaciones] = useState(() => {
    if (!mesaActual?.pedidoId) return '';
    try {
      const raw = localStorage.getItem('lys_pedidos');
      const pedidos = raw ? JSON.parse(raw) : [];
      const pedidoExistente = pedidos.find((p) => p.id === mesaActual.pedidoId);
      return pedidoExistente?.observaciones || '';
    } catch {
      return '';
    }
  });

  // Verificar si hay un borrador previo guardado para esta mesa
  const [borradorPendiente, setBorradorPendiente] = useState(() => {
    if (mesaActual?.pedidoId) return null; // Si ya tiene pedido activo en cocina no mostrar borrador viejo
    try {
      const raw = localStorage.getItem(`lys_borrador_mesa_${numeroNormalizado}`);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const [meseraNombre] = useState(() => {
    const usuario = authService.getCurrentUser();
    return usuario?.nombre ? `${usuario.nombre} ${usuario.apellido || ''}`.trim() : 'Ana Rodríguez';
  });

  // Filtrar productos
  const productosFiltrados = useMemo(() => {
    return PRODUCTS.filter((prod) => {
      const matchCat = categoriaActiva === 'todos' || prod.category === categoriaActiva;
      const matchSearch = prod.name.toLowerCase().includes(busqueda.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [categoriaActiva, busqueda]);

  // Manipulación de comanda
  function handleAgregarItem(producto) {
    setItemsComanda((prev) => {
      const index = prev.findIndex((it) => it.id === producto.id || it.nombre === producto.name);
      if (index > -1) {
        const copia = [...prev];
        copia[index] = { ...copia[index], cantidad: copia[index].cantidad + 1 };
        return copia;
      }
      return [
        ...prev,
        {
          id: producto.id,
          nombre: producto.name,
          precio: producto.price,
          cantidad: 1,
          imagen: producto.image,
        },
      ];
    });
  }

  function handleModificarCantidad(index, delta) {
    setItemsComanda((prev) => {
      const nueva = [...prev];
      const actual = nueva[index].cantidad + delta;
      if (actual <= 0) {
        return nueva.filter((_, i) => i !== index);
      }
      nueva[index] = { ...nueva[index], cantidad: actual };
      return nueva;
    });
  }

  function handleEliminarItem(index) {
    setItemsComanda((prev) => prev.filter((_, i) => i !== index));
  }

  function handleLimpiarComanda() {
    if (itemsComanda.length === 0) return;
    if (window.confirm('¿Deseas vaciar todos los productos de esta comanda?')) {
      setItemsComanda([]);
    }
  }

  // Cálculos financieros
  const total = itemsComanda.reduce((acc, it) => acc + it.cantidad * it.precio, 0);
  const subtotal = total / 1.18;
  const igv = total - subtotal;

  function handleCambiarMesa(nuevoNumero) {
    navigate(`/mesas/${nuevoNumero}/pedido`);
  }

  function handleGuardarBorrador() {
    if (itemsComanda.length === 0) {
      alert('Agrega al menos un producto a la comanda antes de guardar un borrador.');
      return;
    }
    // Guardar borrador local
    localStorage.setItem(`lys_borrador_mesa_${numeroNormalizado}`, JSON.stringify({
      items: itemsComanda,
      observaciones,
      comensales,
      guardadoAt: new Date().toISOString(),
    }));
    setToastMsg(`Borrador de Mesa ${numeroNormalizado} guardado con éxito`);
    setTimeout(() => setToastMsg(''), 3000);
  }

  function handleRestaurarBorrador() {
    if (!borradorPendiente) return;
    setItemsComanda(borradorPendiente.items || []);
    setObservaciones(borradorPendiente.observaciones || '');
    if (borradorPendiente.comensales) {
      setComensales(borradorPendiente.comensales);
    }
    setBorradorPendiente(null);
    setToastMsg('Borrador restaurado en la comanda');
    setTimeout(() => setToastMsg(''), 3000);
  }

  function handleDescartarBorrador() {
    localStorage.removeItem(`lys_borrador_mesa_${numeroNormalizado}`);
    setBorradorPendiente(null);
  }

  function handleEnviarCocina() {
    if (itemsComanda.length === 0) {
      alert('La comanda está vacía. Selecciona al menos un producto.');
      return;
    }

    try {
      const rawPedidos = localStorage.getItem('lys_pedidos');
      const pedidos = rawPedidos ? JSON.parse(rawPedidos) : [];

      // Si ya existía un pedido de esta mesa se actualiza, si no, se crea uno nuevo
      const pedidoExistenteId = mesaActual?.pedidoId;
      const nuevoId = pedidoExistenteId || `PED-${1000 + pedidos.length + 1}`;

      const nuevoPedido = {
        id: nuevoId,
        mesa: Number(numeroNormalizado),
        cliente: `Mesa ${numeroNormalizado}`,
        mesera: meseraNombre,
        comensales: Number(comensales),
        estadoCocina: 'nuevo', // Notifica a cocina
        estado: 'pendiente',   // Notifica a caja
        observaciones: observaciones.trim(),
        items: itemsComanda.map((it) => ({
          id: it.id,
          nombre: it.nombre,
          cantidad: it.cantidad,
          precio: it.precio,
          observacion: '',
        })),
        subtotal: Number(subtotal.toFixed(2)),
        igv: Number(igv.toFixed(2)),
        total: Number(total.toFixed(2)),
        createdAt: new Date().toISOString(),
      };

      let pedidosActualizados;
      if (pedidoExistenteId) {
        pedidosActualizados = pedidos.map((p) => (p.id === pedidoExistenteId ? nuevoPedido : p));
      } else {
        pedidosActualizados = [...pedidos, nuevoPedido];
      }

      localStorage.setItem('lys_pedidos', JSON.stringify(pedidosActualizados));

      // Limpiar cualquier borrador pendiente de esta mesa
      localStorage.removeItem(`lys_borrador_mesa_${numeroNormalizado}`);

      // Actualizar mesa a ocupada
      mesaService.ocuparMesa(numeroNormalizado, nuevoId, total);

      // Registrar actividad
      mesaService.registrarActividad({
        mesaNumero: numeroNormalizado,
        tipo: 'pedido_creado',
        titulo: `Mesa ${numeroNormalizado}`,
        descripcion: pedidoExistenteId ? 'Comanda actualizada y enviada a cocina' : 'Nuevo pedido enviado a cocina',
        ordenCodigo: `Orden #${nuevoId}`,
        tipoColor: 'rojo',
      });

      // Disparar storage para sincronizar panel de cocina y mesas
      window.dispatchEvent(new Event('storage'));

      alert(`¡Pedido de Mesa ${numeroNormalizado} enviado a Cocina con éxito!`);
      navigate('/mesas');
    } catch (err) {
      console.error('Error al enviar a cocina:', err);
      alert('Ocurrió un error al enviar el pedido a cocina.');
    }
  }

  return (
    <div className="pedido-screen">
      {/* Toast flotante de confirmación */}
      {toastMsg && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '24px',
          background: '#065F46',
          color: '#FFF',
          padding: '12px 20px',
          borderRadius: '10px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.18)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.92rem',
          fontWeight: '600',
          zIndex: 9999,
        }}>
          <CheckCircle2 size={20} color="#34D399" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Banner de borrador guardado pendiente de restaurar */}
      {borradorPendiente && (
        <div className="borrador-banner">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <AlertCircle size={20} color="#D97706" />
            <span>
              Tienes un borrador pendiente de <strong>{borradorPendiente.items.length} productos</strong> para la Mesa {numeroNormalizado}.
            </span>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleRestaurarBorrador}
              style={{
                padding: '6px 14px',
                background: '#D97706',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '0.88rem',
              }}
            >
              Restaurar borrador
            </button>
            <button
              type="button"
              onClick={handleDescartarBorrador}
              style={{
                padding: '6px 12px',
                background: 'transparent',
                color: '#92400E',
                border: '1px solid #FCE3BD',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '0.88rem',
              }}
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      {/* Header superior */}
      <header className="pedido-header">
        <div className="pedido-header-title-area">
          <button
            type="button"
            className="btn-volver-mesas"
            onClick={() => navigate('/mesas')}
            title="Volver al plano de mesas"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="pedido-title">
              {mesaActual?.estado === 'ocupada' ? 'Modificar comanda' : 'Nuevo pedido'} · Mesa {numeroNormalizado}
            </h1>
            <div className="pedido-meta">
              <div className="comensales-control" title="Ajusta el número de personas si se agregaron sillas extra a la mesa">
                <Users size={16} style={{ color: '#4B5563' }} />
                <button
                  type="button"
                  className="comensales-btn"
                  onClick={() => setComensales((prev) => Math.max(1, prev - 1))}
                  title="Disminuir comensales"
                >
                  -
                </button>
                <span style={{ fontWeight: '700', minWidth: '18px', textAlign: 'center', fontSize: '0.92rem' }}>
                  {comensales}
                </span>
                <button
                  type="button"
                  className="comensales-btn"
                  onClick={() => setComensales((prev) => Math.min(16, prev + 1))}
                  title="Aumentar comensales (sillas extras)"
                >
                  +
                </button>
                <span style={{ fontSize: '0.82rem', color: '#6B7280' }}>personas</span>
              </div>
              <span>·</span>
              <span>Mesera: <strong>{meseraNombre}</strong></span>
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.85rem', color: '#6B7280', marginRight: 8, fontWeight: 500 }}>
            Cambiar mesa:
          </label>
          <select
            className="pedido-mesa-select"
            value={numeroNormalizado}
            onChange={(e) => handleCambiarMesa(e.target.value)}
          >
            {todasLasMesas.map((m) => (
              <option key={m.id} value={m.numero}>
                Mesa {m.numero} ({m.estado})
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Cuerpo principal */}
      <div className="pedido-layout">
        {/* Columna Izquierda: Catálogo de Productos */}
        <section className="catalogo-container">
          {/* Buscador de platos */}
          <div className="catalogo-search-box">
            <Search size={18} style={{ position: 'absolute', left: 14, color: '#9CA3AF', pointerEvents: 'none' }} />
            <input
              type="text"
              className="catalogo-search-input"
              placeholder="Buscar productos de la carta..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          {/* Categorías */}
          <div className="catalogo-categories">
            {[
              { id: 'pollos', label: 'Pollos y Brasas' },
              { id: 'combos', label: 'Combos y Guarniciones' },
              { id: 'bebidas', label: 'Bebidas' },
              { id: 'postres', label: 'Postres' },
              { id: 'todos', label: 'Todos los productos' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`cat-tab-btn ${categoriaActiva === cat.id ? 'active' : ''}`}
                onClick={() => setCategoriaActiva(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Grid de Platos */}
          <div className="platos-grid">
            {productosFiltrados.map((prod) => (
              <div key={prod.id} className="plato-card">
                <div className="plato-img-wrapper">
                  <img src={prod.image} alt={prod.name} className="plato-img" loading="lazy" />
                </div>
                <div className="plato-info">
                  <span className="plato-nombre">{prod.name}</span>
                  <div className="plato-precio-row">
                    <span className="plato-precio">S/ {prod.price.toFixed(2)}</span>
                    <button
                      type="button"
                      className="btn-add-item"
                      title="Agregar a la comanda"
                      onClick={() => handleAgregarItem(prod)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Columna Derecha: Panel de la Comanda */}
        <aside className="comanda-panel">
          <div className="comanda-header">
            <h3 className="comanda-title">Pedido Mesa {numeroNormalizado}</h3>
            {itemsComanda.length > 0 && (
              <button
                type="button"
                className="btn-clear-comanda"
                onClick={handleLimpiarComanda}
                title="Vaciar comanda"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Lista de productos en la comanda */}
          <div className="comanda-items-list">
            {itemsComanda.map((it, idx) => (
              <div key={idx} className="comanda-item">
                <div className="comanda-item-info">
                  <span className="comanda-item-nombre">{it.nombre}</span>
                  <span className="comanda-item-unitario">
                    S/ {it.precio.toFixed(2)} c/u
                  </span>
                </div>

                {/* Control de cantidad */}
                <div className="comanda-stepper">
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleModificarCantidad(idx, -1)}
                    title="Disminuir"
                  >
                    -
                  </button>
                  <span className="stepper-qty">{it.cantidad}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleModificarCantidad(idx, 1)}
                    title="Aumentar"
                  >
                    +
                  </button>
                </div>

                <span className="comanda-item-total">
                  S/ {(it.cantidad * it.precio).toFixed(2)}
                </span>

                <button
                  type="button"
                  className="btn-remove-item"
                  onClick={() => handleEliminarItem(idx)}
                  title="Eliminar plato"
                >
                  ✕
                </button>
              </div>
            ))}

            {itemsComanda.length === 0 && (
              <div style={{ textAlign: 'center', padding: '36px 10px', color: '#9CA3AF' }}>
                <ClipboardList size={38} strokeWidth={1.5} style={{ margin: '0 auto 10px', display: 'block', color: '#CBD5E1' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 500 }}>
                  Aún no hay productos en la comanda.
                </p>
                <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
                  Selecciona platos de la carta a la izquierda.
                </span>
              </div>
            )}
          </div>

          {/* Observaciones a Cocina */}
          <div className="comanda-obs-area">
            <div className="comanda-obs-label">
              <span>Observaciones a cocina</span>
              <span style={{ color: '#9CA3AF', fontWeight: 'normal' }}>
                {observaciones.length}/120
              </span>
            </div>
            <textarea
              className="comanda-obs-input"
              rows="2"
              maxLength="120"
              placeholder="Ej: Sin ají, pollo bien dorado, papas crocantes..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          {/* Desglose de totales */}
          <div className="comanda-totales">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>S/ {subtotal.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>IGV (18%):</span>
              <span>S/ {igv.toFixed(2)}</span>
            </div>
            <div className="total-row destacado">
              <span>Total:</span>
              <span>S/ {total.toFixed(2)}</span>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="comanda-acciones">
            <button
              type="button"
              className="btn-borrador"
              onClick={handleGuardarBorrador}
              title="Guardar comanda como borrador para continuar luego"
            >
              <BookmarkCheck size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Guardar borrador
            </button>
            <button
              type="button"
              className="btn-enviar-cocina"
              onClick={handleEnviarCocina}
              title="Enviar comanda a la pantalla de cocina"
            >
              <ChefHat size={18} style={{ display: 'inline', verticalAlign: 'middle', marginRight: '6px' }} />
              Enviar a cocina
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function NuevoPedidoPage() {
  const { id: mesaParam } = useParams();
  const numeroNormalizado = String(mesaParam || '01').padStart(2, '0');

  // El key={numeroNormalizado} asegura que al cambiar de mesa se resetee y cargue la comanda correcta
  return <NuevoPedidoForm key={numeroNormalizado} numeroNormalizado={numeroNormalizado} />;
}
