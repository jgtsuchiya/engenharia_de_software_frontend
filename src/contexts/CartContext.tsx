import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Cart, CartItem } from '../types/cart'
import type { Product } from '../types/product'

interface CartContextType {
    cart: Cart
    addItem: (product: Product, quantity?: number) => void
    removeItem: (productId: string) => void
    clearCart: () => void
}

const emptyCart: Cart = { items: [], total: 0 }

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [cart, setCart] = useState<Cart>(() => {
        const stored = localStorage.getItem('cart')
        return stored ? (JSON.parse(stored) as Cart) : emptyCart
    })

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cart))
    }, [cart])

    function addItem(product: Product, quantity = 1) {
        setCart((prev) => {
            const existing = prev.items.find((i) => i.product.id === product.id)
            const items: CartItem[] = existing
                ? prev.items.map((i) =>
                    i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i,
                )
                : [...prev.items, { product, quantity }]
            const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
            return { items, total }
        })
    }

    function removeItem(productId: string) {
        setCart((prev) => {
            const items = prev.items.filter((i) => i.product.id !== productId)
            const total = items.reduce((acc, i) => acc + i.product.price * i.quantity, 0)
            return { items, total }
        })
    }

    function clearCart() {
        setCart(emptyCart)
    }

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, clearCart }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCartContext() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCartContext must be used within CartProvider')
    return ctx
}
