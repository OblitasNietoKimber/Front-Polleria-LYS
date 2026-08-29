import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import orderService, { ORDER_STATUS_STEPS } from '../../services/orderService'
import { money } from '../../utils/currency'

export default function OrderCard({ order }) {
  const navigate = useNavigate()
  const statusKey = orderService.getOrderStatus(order)
  const statusLabel = ORDER_STATUS_STEPS.find((s) => s.key === statusKey)?.label

  const date = new Date(order.createdAt).toLocaleString('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <button className="order-card" onClick={() => navigate(`/pedidos/${order.id}`)}>
      <div className="order-card-main">
        <span className="order-card-id font-mono">{order.id}</span>
        <span className="order-card-date">{date}</span>
        <span className="order-card-status">{statusLabel}</span>
      </div>
      <div className="order-card-side">
        <span className="order-card-total font-mono">{money(order.total)}</span>
        <ChevronRight size={18} color="var(--smoke)" />
      </div>
    </button>
  )
}