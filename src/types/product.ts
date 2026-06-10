export interface Product {
    id: string
    merchantId: string
    categoryId: number
    name: string
    description: string
    currentPrice: number
    stockQuantity: number
    createdAt: string
    updatedAt: string
}

export type SortBy = 'name' | 'price'
export type SortOrder = 'asc' | 'desc'

export interface ProductFilters {
    name?: string
    category?: number
    minPrice?: number
    maxPrice?: number
    merchantId?: string
    sortBy?: SortBy
    order?: SortOrder
}

export interface CreateProductPayload {
    categoryId: number
    name: string
    description: string
    currentPrice: number
    stockQuantity: number
}

export type UpdateProductPayload = Partial<CreateProductPayload>
