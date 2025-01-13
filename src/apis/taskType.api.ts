import { TaskType } from 'src/types/task.type.api'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const URL_GET_ALL_TASK_TYPE = 'api/TaskType/getAll'

const taskTypeApi = {
  getAllTaskType() {
    return http.get<SuccessResponse<TaskType[]>>(URL_GET_ALL_TASK_TYPE)
  }
}

export default taskTypeApi
