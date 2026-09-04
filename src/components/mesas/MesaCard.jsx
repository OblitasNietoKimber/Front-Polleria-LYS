import React from 'react';
import MesaIlustracion from './MesaIlustracion';
import mesaService from '../../services/mesaService';

export default function MesaCard({ mesa, onClick }) {
  const { numero, capacidad, forma, estado, inicioAt, totalAcumulado, horaReserva } = mesa;

  const minutos = estado === 'ocupada' ? mesaService.getMinutosOcupada(inicioAt) : 0;
  const montoFormateado = totalAcumulado ? Number(totalAcumulado).toFixed(2) : '0.00';

  return (
    <div
      className={`mesa-card mesa-${estado}`}
      onClick={() => onClick(mesa)}
      role="button"
      tabIndex={0}
      title={`Mesa ${numero} - ${estado}`}
    >
      <div className="mesa-card-header">
        <span className="mesa-numero">Mesa {numero}</span>
        <span className={`mesa-status-badge ${estado}`}>
          {estado}
        </span>
      </div>

      <div className="mesa-visual-wrapper">
        <MesaIlustracion capacidad={capacidad} forma={forma} estado={estado} />
      </div>

      <div className="mesa-card-footer">
        <span className="mesa-capacidad-tag">
          {capacidad} {capacidad === 1 ? 'persona' : 'personas'}
        </span>

        {estado === 'ocupada' && (
          <div className="mesa-info-ocupada">
            <span className="mesa-tiempo">
              ⏱ {minutos} min
            </span>
            <span className="mesa-total-soles">
              S/ {montoFormateado}
            </span>
          </div>
        )}

        {estado === 'reservada' && (
          <div className="mesa-info-reservada">
            ⏱ {horaReserva || 'Hoy'}
          </div>
        )}
      </div>
    </div>
  );
}
