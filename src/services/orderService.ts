import type { CheckoutPayload, CheckoutResponse, Order } from '../types/order'
import api from './api'

export const orderService = {
    checkout: (customerId: string, payload: CheckoutPayload): Promise<CheckoutResponse> =>
        api
            .post<CheckoutResponse>(`/customers/${customerId}/orders/checkout`, payload)
            .then((r) => r.data),

    listOrders: (customerId: string): Promise<Order[]> =>
        api.get<Order[]>(`/customers/${customerId}/orders`).then((r) => r.data),
}
