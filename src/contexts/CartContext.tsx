import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { Cart, CartItem } from '../types/cart'
import type { Product } from '../types/product'

interface CartContextType {
    cart: Cart
    addItem: (product: Product, quantity?: number) => void
    removeItem: (productId: string) => void
    updateQuantity: (productId: string, quantity: number) => void
    clearCart: () => void
    hasItem: (productId: string) => boolean
}

const emptyCart: Cart = { items: [], total: 0 }

function calcTotal(items: CartItem[]): number {
    return items.reduce((acc, i) => acc + Number(i.product.currentPrice) * i.quantity, 0)
}

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
            return { items, total: calcTotal(items) }
        })
    }

    function removeItem(productId: string) {
        setCart((prev) => {
            const items = prev.items.filter((i) => i.product.id !== productId)
            return { items, total: calcTotal(items) }
        })
    }

    function updateQuantity(productId: string, quantity: number) {
        if (quantity < 1) return
        setCart((prev) => {
            const items = prev.items.map((i) =>
                i.product.id === productId ? { ...i, quantity } : i,
            )
            return { items, total: calcTotal(items) }
        })
    }

    function clearCart() {
        setCart(emptyCart)
    }

    function hasItem(productId: string) {
        return cart.items.some(({product: {id}}) => id === productId)
    }

    return (
        <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart, hasItem }}>
            {children}
        </CartContext.Provider>
    )
}

export function useCartContext() {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCartContext must be used within CartProvider')
    return ctx
}
