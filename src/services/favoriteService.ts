import type { Product } from '../types/product'
import api from './api'

export const favoriteService = {
    getAll: (customerId: string): Promise<Product[]> =>
        api.get<Product[]>(`/customers/${customerId}/favorites`).then((r) => r.data),

    add: (customerId: string, productId: string): Promise<void> =>
        api.post(`/customers/${customerId}/favorites`, { productId }).then(() => undefined),

    remove: (customerId: string, productId: string): Promise<void> =>
        api.delete(`/customers/${customerId}/favorites/${productId}`).then(() => undefined),
}
