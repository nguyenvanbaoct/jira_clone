import { ResponseUser } from 'src/types/user.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const URL_GET_USER = '/api/Users/getUser'

const userApi = {
  getAllUsers() {
    return http.get<SuccessResponse<ResponseUser[]>>(URL_GET_USER)
  }
}

export default userApi
