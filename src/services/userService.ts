import type { User } from '../types/user'
import api from './api'

export interface UpdateCustomerPayload {
    name?: string
    email?: string
    password?: string
}

export interface UpdateMerchantPayload {
    trade_name?: string
    email?: string
    password?: string
}

export const userService = {
    getCustomerProfile: (id: string): Promise<User> =>
        api.get<User>(`/customers/${id}`).then((r) => r.data),

    updateCustomerProfile: (id: string, payload: UpdateCustomerPayload): Promise<User> =>
        api.put<User>(`/customers/${id}`, payload).then((r) => r.data),

    deleteCustomerAccount: (id: string): Promise<void> =>
        api.delete(`/customers/${id}`).then(() => undefined),

    getMerchantProfile: (id: string): Promise<User> =>
        api.get<User>(`/merchants/${id}`).then((r) => r.data),

    updateMerchantProfile: (id: string, payload: UpdateMerchantPayload): Promise<User> =>
        api.put<User>(`/merchants/${id}`, payload).then((r) => r.data),

    deleteMerchantAccount: (id: string): Promise<void> =>
        api.delete(`/merchants/${id}`).then(() => undefined),
}
