import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import type { UserRole } from '../../types/user'

interface ProtectedRouteProps {
    requiredRole?: UserRole
}

export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
    const { isAuthenticated, user } = useAuth()

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" replace />
    }

    if (requiredRole && user?.role !== requiredRole) {
        return <Navigate to="/" replace />
    }

    return <Outlet />
}
