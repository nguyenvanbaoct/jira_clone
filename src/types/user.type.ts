export interface User {
  _id: string
  email: string
  name?: string
  date_of_birth?: string
  avatar?: string
  address?: string
  phone?: string
  createdAt: string
  updatedAt: string
}
export interface ResponseUser {
  userId?: number
  name?: string
  avatar?: string
  email?: string
  phoneNumber?: string
}
