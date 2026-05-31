export type UserRole = 'client' | 'admin'
export type UserType = 'individual' | 'store'

export interface User {
    id: string
    name: string
    email: string
    role: UserRole
    phone: string
    userType: UserType
}
