import type { Product } from './product'

export interface OrderItem {
    id: string
    orderId: string
    productId: string
    quantity: number
    unitPrice: number
    updatedAt: string
    product: Product
}

export interface Order {
    id: string
    customerId: string
    status: 'Pending' | 'Paid' | 'Shipped'
    totalAmount: number
    orderedAt: string
    updatedAt: string
    items: OrderItem[]
}

export interface MerchantInfo {
    id: string
    tradeName: string
    document: string
}

export interface CheckoutResponse {
    order: Order
    merchant: MerchantInfo
}

export interface CheckoutPayload {
    merchantId: string
    items: { productId: string; quantity: number }[]
}
