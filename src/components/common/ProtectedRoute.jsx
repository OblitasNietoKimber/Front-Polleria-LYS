import { Navigate } from 'react-router-dom';
import * as authService from '../../service/authService';

/**
 * El control de acceso por rol (cliente/mesera/cocina/caja/administrador)
 * se agregará cuando ese alcance entre al proyecto.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;