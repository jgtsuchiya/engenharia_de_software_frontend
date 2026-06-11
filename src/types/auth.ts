import type { User } from './user'

export interface LoginPayload {
    email: string
    password: string
    role: 'customer' | 'merchant'
}

export interface RegisterCustomerPayload {
    name: string
    email: string
    password: string
    role: 'customer'
}

export interface RegisterMerchantPayload {
    trade_name: string
    document: string
    email: string
    password: string
    role: 'merchant'
}

export type RegisterPayload = RegisterCustomerPayload | RegisterMerchantPayload

export interface AuthResponse {
    token: string
    user: User
}

export interface RecoverPayload {
    email: string
    role: 'customer' | 'merchant'
}

export interface ResetPasswordPayload {
    email: string
    code: string
    new_password: string
    role: 'customer' | 'merchant'
}
