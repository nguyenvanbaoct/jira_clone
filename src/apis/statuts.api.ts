import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export interface StatusType {
  statusId: string
  statusName: string
  alias: string
  deleted: string
}

const statusApi = {
  getAllStatus() {
    return http.get<SuccessResponse<StatusType[]>>('api/Status/getAll')
  }
}

export default statusApi
