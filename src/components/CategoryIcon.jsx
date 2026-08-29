import { Flame } from 'lucide-react'
import { CATEGORIES } from '../data/categories'

export default function CategoryIcon({ id, size = 22, style }) {
  const category = CATEGORIES.find((item) => item.id === id)
  const Icon = category ? category.icon : Flame

  return <Icon size={size} style={style} strokeWidth={1.8} />
}
