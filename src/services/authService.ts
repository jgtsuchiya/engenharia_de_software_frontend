import type { LoginPayload, RegisterPayload, AuthResponse, RecoverPayload, ResetPasswordPayload } from '../types/auth'
import type { AxiosResponse } from 'axios'
import api from './api'

export const authService = {
    login: (payload: LoginPayload): Promise<AuthResponse> =>
        api.post<AuthResponse>('/auth/login', payload).then((r: AxiosResponse<AuthResponse>) => r.data),

    register: (payload: RegisterPayload): Promise<AuthResponse> =>
        api.post<AuthResponse>('/auth/register', payload).then((r: AxiosResponse<AuthResponse>) => r.data),

    recoverPassword: (payload: RecoverPayload): Promise<void> =>
        api.post('/auth/recover', payload).then(() => undefined),

    resetPassword: (payload: ResetPasswordPayload): Promise<void> =>
        api.post('/auth/recover/reset', payload).then(() => undefined),
}
