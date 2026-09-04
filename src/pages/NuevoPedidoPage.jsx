import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../data/products';
import mesaService from '../../src/services/mesaService';
import authService from '../../src/services/authService';
import '../styles/nuevoPedido.css';

export default function NuevoPedidoPage() {
  const { id: mesaParam } = useParams();
  const navigate = useNavigate();

  const numeroNormalizado = String(mesaParam || '01').padStart(2, '0');
  const [mesaActual, setMesaActual] = useState(null);
  const [todasLasMesas, setTodasLasMesas] = useState([]);
  const [comensales, setComensales] = useState(4);
  const [categoriaActiva, setCategoriaActiva] = useState('pollos');
  const [busqueda, setBusqueda] = useState('');
  const [itemsComanda, setItemsComanda] = useState([]);
  const [observaciones, setObservaciones] = useState('');
  const [meseraNombre, setMeseraNombre] = useState('Ana Rodríguez');

  // Cargar datos de la mesa y sesión
  useEffect(() => {
    const lista = mesaService.getMesas();
    setTodasLasMesas(lista);

    const match = lista.find((m) => String(m.numero).padStart(2, '0') === numeroNormalizado);
    if (match) {
      setMesaActual(match);
      setComensales(match.capacidad || 4);

      // Si la mesa ya tiene un pedido activo, cargamos sus productos para poder agregar más
      if (match.pedidoId) {
        try {
          const raw = localStorage.getItem('lys_pedidos');
          const pedidos = raw ? JSON.parse(raw) : [];
          const pedidoExistente = pedidos.find((p) => p.id === match.pedidoId);
          if (pedidoExistente && pedidoExistente.items) {
            setItemsComanda(pedidoExistente.items);
            if (pedidoExistente.observaciones) {
              setObservaciones(pedidoExistente.observaciones);
            }
          }
        } catch (err) {
          console.error(err);
        }
      }
    }

    const usuario = authService.getCurrentUser();
    if (usuario && usuario.nombre) {
      setMeseraNombre(`${usuario.nombre} ${usuario.apellido || ''}`.trim());
    }
  }, [numeroNormalizado]);

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
      alert('Agrega al menos un producto para guardar un borrador.');
      return;
    }
    // Guardar borrador local
    localStorage.setItem(`lys_borrador_mesa_${numeroNormalizado}`, JSON.stringify({
      items: itemsComanda,
      observaciones,
      comensales,
      guardadoAt: new Date().toISOString(),
    }));
    alert(`Borrador guardado para la Mesa ${numeroNormalizado}.`);
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

      // Disparar storage para sincronizar panel de cocina
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
      {/* Header superior */}
      <header className="pedido-header">
        <div className="pedido-header-title-area">
          <button
            type="button"
            className="btn-volver-mesas"
            onClick={() => navigate('/mesas')}
            title="Volver al plano de mesas"
          >
            ←
          </button>
          <div>
            <h1 className="pedido-title">
              {mesaActual?.estado === 'ocupada' ? 'Modificar comanda' : 'Nuevo pedido'} · Mesa {numeroNormalizado}
            </h1>
            <div className="pedido-meta">
              <span>
                👥 <input
                  type="number"
                  min="1"
                  max="12"
                  value={comensales}
                  onChange={(e) => setComensales(Math.max(1, parseInt(e.target.value) || 1))}
                  style={{ width: '44px', padding: '2px 4px', borderRadius: 4, border: '1px solid var(--line)', textAlign: 'center' }}
                /> comensales
              </span>
              <span>·</span>
              <span>Mesera: <strong>{meseraNombre}</strong></span>
            </div>
          </div>
        </div>

        <div>
          <label style={{ fontSize: '0.8rem', color: '#6B7280', marginRight: 8 }}>
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
          <input
            type="text"
            className="catalogo-search-input"
            placeholder="🔍 Buscar productos de la carta..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          {/* Categorías */}
          <div className="catalogo-categories">
            {[
              { id: 'pollos', label: '🍗 Pollos' },
              { id: 'combos', label: '🍟 Combos y Guarniciones' },
              { id: 'bebidas', label: '🥤 Bebidas' },
              { id: 'postres', label: '🍮 Postres' },
              { id: 'todos', label: '🍽 Todos' },
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
                🗑
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
                  >
                    -
                  </button>
                  <span className="stepper-qty">{it.cantidad}</span>
                  <button
                    type="button"
                    className="stepper-btn"
                    onClick={() => handleModificarCantidad(idx, 1)}
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
              <div style={{ textAlign: 'center', padding: '30px 10px', color: '#9CA3AF' }}>
                <span style={{ fontSize: '2rem' }}>📋</span>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
                  Aún no hay productos en la comanda.
                </p>
              </div>
            )}
          </div>

          {/* Observaciones a Cocina */}
          <div className="comanda-obs-area">
            <div className="comanda-obs-label">
              <span>Observaciones</span>
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
            >
              💾 Guardar borrador
            </button>
            <button
              type="button"
              className="btn-enviar-cocina"
              onClick={handleEnviarCocina}
            >
              👨‍🍳 Enviar a cocina
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
