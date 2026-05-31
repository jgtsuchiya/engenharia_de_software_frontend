import type { Product } from '../types/product'
import api from './api'

export const productService = {
    getAll: (): Promise<Product[]> =>
        api.get<Product[]>('/products').then((r) => r.data),

    getById: (id: string): Promise<Product> =>
        api.get<Product>(`/products/${id}`).then((r) => r.data),

    create: (data: Omit<Product, 'id' | 'createdAt'>): Promise<Product> =>
        api.post<Product>('/products', data).then((r) => r.data),

    update: (id: string, data: Partial<Omit<Product, 'id' | 'createdAt'>>): Promise<Product> =>
        api.put<Product>(`/products/${id}`, data).then((r) => r.data),

    remove: (id: string): Promise<void> =>
        api.delete(`/products/${id}`),
}
