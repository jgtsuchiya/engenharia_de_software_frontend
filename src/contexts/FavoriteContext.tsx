import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types/product'
import { favoriteService } from '../services/favoriteService'
import { useAuthContext } from './AuthContext'

interface FavoriteContextType {
    favorites: Product[]
    loading: boolean
    isFavorited: (productId: string) => boolean
    toggleFavorite: (productId: string) => Promise<void>
}

const FavoriteContext = createContext<FavoriteContextType | undefined>(undefined)

export function FavoriteProvider({ children }: { children: ReactNode }) {
    const { user, isAuthenticated } = useAuthContext()
    const [favorites, setFavorites] = useState<Product[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (!isAuthenticated || !user || user.role !== 'client') {
            setFavorites([])
            return
        }
        setLoading(true)
        favoriteService
            .getAll(user.id)
            .then(setFavorites)
            .catch(() => setFavorites([]))
            .finally(() => setLoading(false))
    }, [isAuthenticated, user])

    const isFavorited = useCallback(
        (productId: string) => favorites.some((p) => p.id === productId),
        [favorites]
    )

    const toggleFavorite = useCallback(
        async (productId: string) => {
            if (!user) return

            if (isFavorited(productId)) {
                setFavorites((prev) => prev.filter((p) => p.id !== productId))
                try {
                    await favoriteService.remove(user.id, productId)
                } catch {
                    const restored = await favoriteService.getAll(user.id)
                    setFavorites(restored)
                }
            } else {
                try {
                    await favoriteService.add(user.id, productId)
                    const updated = await favoriteService.getAll(user.id)
                    setFavorites(updated)
                } catch {
                    // estado não muda em caso de erro
                }
            }
        },
        [user, isFavorited]
    )

    return (
        <FavoriteContext.Provider value={{ favorites, loading, isFavorited, toggleFavorite }}>
            {children}
        </FavoriteContext.Provider>
    )
}

export function useFavoriteContext() {
    const ctx = useContext(FavoriteContext)
    if (!ctx) throw new Error('useFavoriteContext must be used within FavoriteProvider')
    return ctx
}
