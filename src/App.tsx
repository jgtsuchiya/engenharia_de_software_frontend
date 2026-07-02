import { BrowserRouter } from 'react-router-dom'
import { ConfigProvider } from 'antd'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { FavoriteProvider } from './contexts/FavoriteContext'
import AppRoutes from './routes/AppRoutes'

export default function App() {
  return (
    <ConfigProvider theme={{
        token: {
          fontFamily: "Nunito"
        }}}>
      <BrowserRouter>
        <AuthProvider>
          <FavoriteProvider>
            <CartProvider>
              <AppRoutes />
            </CartProvider>
          </FavoriteProvider>
        </AuthProvider>
      </BrowserRouter>
    </ConfigProvider>
  )
}
