import { CATEGORIES } from '../data/categories'

export default function CategoryIcon({ id, size = 22, style }) {
  const category = CATEGORIES.find((item) => item.id === id)
  if (!category) return null

  return (
    <img
      src={category.image}
      alt={category.label}
      style={{ width: size, height: size, objectFit: 'cover', borderRadius: '50%', ...style }}
    />
  )
}
