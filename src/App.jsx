import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import CatalogoPage from './pages/CatalogoPage'
import EntregaPage from './pages/checkout/EntregaPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/catalogo" element={<CatalogoPage />} />
          <Route path="/checkout/entrega" element={<EntregaPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
