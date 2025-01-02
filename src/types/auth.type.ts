import { Content } from 'src/types/content.type'
import { SuccessResponse } from './utils.type'

export type AuthResponse = SuccessResponse<{
  accessToken: string
  expires: number
  content: Content
  dateTime: string
}>

export type RefreshTokenResponse = SuccessResponse<{ accessToken: string }>
