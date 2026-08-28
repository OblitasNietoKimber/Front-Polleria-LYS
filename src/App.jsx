import { BrowserRouter, Route, Routes } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          {/* La página real del catálogo se agrega en el siguiente commit. */}
          <Route
            path="/catalogo"
            element={
              <p style={{ maxWidth: 1120, margin: '0 auto', padding: '56px 20px' }}>
                Catálogo próximamente.
              </p>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
