export interface LoginResponse {
  statusCode: number
  message: string
  content: {
    id: number
    email: string
    avatar: string
    phoneNumber: string
    name: string
    accessToken: string
  }
  dateTime: string
}
