import { Outlet } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'

export default function MainLayout() {
  return (
    <div style={{ minHeight: '100%' }}>
      <SiteHeader />
      <Outlet />
    </div>
  )
}
