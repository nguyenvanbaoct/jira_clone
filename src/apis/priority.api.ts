import { PriorityResponse } from 'src/types/priority.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const URL_GET_ALL_PRIORITY = 'api/Priority/getAll'

const priorityApi = {
  getAllPriority() {
    return http.get<SuccessResponse<PriorityResponse[]>>(URL_GET_ALL_PRIORITY)
  }
}

export default priorityApi
