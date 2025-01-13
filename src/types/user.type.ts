export interface User {
  id: number
  email: string
  name: string
  avatar: string
  phoneNumber: string
  accessToken: string
}
export interface ResponseUser {
  userId?: number
  name?: string
  avatar?: string
  email?: string
  phoneNumber?: string
}
