import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import CuriosidadesPage from './pages/CuriosidadesPage'
import CarrinhoPage from './pages/CarrinhoPage'
import CheckoutPage from './pages/CheckoutPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminProdutos from './pages/AdminProdutos'

function RotaAdmin({ children }) {
  const { session, role } = useAuth()
  if (!session) return <Navigate to="/login" replace />
  if (role !== 'admin') return <Navigate to="/" replace />
  return children
}

function AppRoutes() {
  const { session, role } = useAuth()

  return (
    <Routes>
      {/* Páginas públicas */}
      <Route path="/" element={<ShopPage />} />
      <Route path="/shop" element={<HomePage />} />
      <Route path="/curiosidades" element={<CuriosidadesPage />} />
      <Route path="/carrinho" element={<CarrinhoPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/loja" element={<Navigate to="/" replace />} />
      <Route path="/login" element={
        session
          ? <Navigate to={role === 'admin' ? '/admin' : '/'} replace />
          : <LoginPage />
      } />

      {/* Área admin — protegida */}
      <Route path="/admin" element={<RotaAdmin><AdminDashboard /></RotaAdmin>} />
      <Route path="/admin/produtos" element={<RotaAdmin><AdminProdutos /></RotaAdmin>} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
