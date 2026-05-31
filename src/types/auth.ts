import type { User, UserType } from './user'

export interface LoginPayload {
    email: string
    password: string
}

export interface RegisterPayload {
    name: string
    email: string
    password: string
    userType: UserType
    phone: string
}

export interface AuthResponse {
    token: string
    user: User
}
