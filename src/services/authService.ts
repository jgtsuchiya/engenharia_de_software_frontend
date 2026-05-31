import type { LoginPayload, RegisterPayload, AuthResponse } from '../types/auth'
import api from './api'

export const authService = {
    login: (payload: LoginPayload): Promise<AuthResponse> =>
        api.post<AuthResponse>('/auth/login', payload).then((r) => r.data),

    register: (payload: RegisterPayload): Promise<AuthResponse> =>
        api.post<AuthResponse>('/auth/register', payload).then((r) => r.data),

    recoverPassword: (email: string): Promise<void> =>
        api.post('/auth/recover', { email }),
}
