import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <ConfigProvider>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
}
