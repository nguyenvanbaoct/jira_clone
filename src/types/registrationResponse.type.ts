export interface RegistrationResponse {
  statusCode: number
  message: string
  content: {
    email: string
    passWord: string
    name: string
    phoneNumber: string
  }
  dateTime: string
}
