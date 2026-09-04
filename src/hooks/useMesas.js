import { useState, useEffect, useCallback } from 'react';
import mesaService from '../services/mesaService';

export default function useMesas(zona = 'salon_principal') {
  const [mesas, setMesas] = useState(() => {
    const lista = mesaService.getMesas();
    return zona ? lista.filter((m) => m.zona === zona) : lista;
  });
  const [estadisticas, setEstadisticas] = useState(() => mesaService.getEstadisticasMesas(zona));
  const [actividades, setActividades] = useState(() => mesaService.getActividades());

  const recargar = useCallback(() => {
    const lista = mesaService.getMesas();
    const filtradas = zona ? lista.filter((m) => m.zona === zona) : lista;
    setMesas(filtradas);
    setEstadisticas(mesaService.getEstadisticasMesas(zona));
    setActividades(mesaService.getActividades());
  }, [zona]);

  useEffect(() => {
    // Polling cada 5 segundos para actualizar tiempos y montos en vivo
    const timer = setInterval(recargar, 5000);

    function onStorageEvent(e) {
      if (e.key === 'lys_mesas' || e.key === 'lys_actividades' || e.key === 'lys_pedidos') {
        recargar();
      }
    }

    window.addEventListener('storage', onStorageEvent);
    window.addEventListener('lys_mesas_updated', recargar);
    window.addEventListener('lys_actividades_updated', recargar);

    return () => {
      clearInterval(timer);
      window.removeEventListener('storage', onStorageEvent);
      window.removeEventListener('lys_mesas_updated', recargar);
      window.removeEventListener('lys_actividades_updated', recargar);
    };
  }, [recargar]);

  return {
    mesas,
    estadisticas,
    actividades,
    recargar,
    liberarMesa: (numero) => {
      mesaService.liberarMesa(numero);
      recargar();
    },
    ocuparMesa: (numero, pedidoId, total) => {
      mesaService.ocuparMesa(numero, pedidoId, total);
      recargar();
    },
  };
}
