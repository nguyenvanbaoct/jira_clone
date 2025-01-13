import { SuccessResponse } from './utils.type'

export interface AuthResponse {
  statusCode: number
  message: string
  content: {
    id: number
    email: string
    name: string
    avatar: string
    phoneNumber: string
    accessToken: string
  }
  dateTime: string
}

export type RefreshTokenResponse = SuccessResponse<{ accessToken: string }>
