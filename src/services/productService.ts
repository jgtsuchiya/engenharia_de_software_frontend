import type { Product, ProductFilters, CreateProductPayload, UpdateProductPayload } from '../types/product'
import api from './api'

export const productService = {
    getAll: (filters?: ProductFilters): Promise<Product[]> => {
        const params: Record<string, string | number> = {}
        if (filters?.name) params.name = filters.name
        if (filters?.category) params.category = filters.category
        if (filters?.minPrice !== undefined) params.minPrice = filters.minPrice
        if (filters?.maxPrice !== undefined) params.maxPrice = filters.maxPrice
        if (filters?.merchantId) params.merchantId = filters.merchantId
        if (filters?.sortBy) params.sortBy = filters.sortBy
        if (filters?.order) params.order = filters.order
        return api.get<Product[]>('/products', { params }).then((r) => r.data)
    },

    getById: (id: string): Promise<Product> =>
        api.get<Product>(`/products/${id}`).then((r) => r.data),

    create: (data: CreateProductPayload): Promise<Product> =>
        api.post<Product>('/products', data).then((r) => r.data),

    update: (id: string, data: UpdateProductPayload): Promise<Product> =>
        api.put<Product>(`/products/${id}`, data).then((r) => r.data),

    remove: (id: string): Promise<void> =>
        api.delete(`/products/${id}`),
}
