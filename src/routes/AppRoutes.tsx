import { Routes, Route } from 'react-router-dom'
import ProtectedRoute from '../components/common/ProtectedRoute'
import ClientLayout from '../layouts/ClientLayout'
import AdminLayout from '../layouts/AdminLayout'

import LoginPage from '../pages/auth/LoginPage'
import RegisterPage from '../pages/auth/RegisterPage'
import PasswordRecoveryPage from '../pages/auth/PasswordRecoveryPage'

import ProductListPage from '../pages/client/ProductListPage'
import ProductDetailPage from '../pages/client/ProductDetailPage'
import FavoritesPage from '../pages/client/FavoritesPage'
import CartPage from '../pages/client/CartPage'
import ProfilePage from '../pages/client/ProfilePage'

import AdminProductListPage from '../pages/admin/AdminProductListPage'
import AdminProductFormPage from '../pages/admin/AdminProductFormPage'
import HomePage from '../pages/HomePage'

export default function AppRoutes() {
    return (
        <Routes>
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/recovery" element={<PasswordRecoveryPage />} />

            <Route element={<ClientLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductListPage />} />
                <Route path="/products/:id" element={<ProductDetailPage />} />

                <Route element={<ProtectedRoute />}>
                    <Route path="/favorites" element={<FavoritesPage />} />
                    <Route path="/cart" element={<CartPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            <Route element={<ProtectedRoute requiredRole="admin" />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin/products" element={<AdminProductListPage />} />
                    <Route path="/admin/products/new" element={<AdminProductFormPage />} />
                    <Route path="/admin/products/:id/edit" element={<AdminProductFormPage />} />
                </Route>
            </Route>
        </Routes>
    )
}
