import {
  AssignUserProjectPayload,
  ProjectDetailResponse,
  ProjectListResponse,
  ResponseProjectCategory,
  UpdateProjectPayload
} from 'src/types/project.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

export const URL_GET_ALL_PROJECT = 'api/Project/getAllProject'
export const URL_GET_PROJECT_DETAIL = '/api/Project/getProjectDetail'
export const URL_GET_PROJECT_CATEGORY = '/api/ProjectCategory'
export const URL_UPDATE_PROJECT = '/api/Project/updateProject'
export const URL_DELETE_PROJECT = 'api/Project/deleteProject'
export const URL_ASSIGN_PROJECT_MEMBER = '/api/Project/assignUserProject'

export interface AssignUsersProjectPayload {
  projectId: number
  userIds: number[]
}

const projectApi = {
  getAllProjects() {
    return http.get<SuccessResponse<ProjectListResponse[]>>(URL_GET_ALL_PROJECT)
  },
  getProjectDetail(id: number) {
    return http.get<SuccessResponse<ProjectDetailResponse>>(`${URL_GET_PROJECT_DETAIL}?id=${id}`)
  },
  getProjectCategory() {
    return http.get<SuccessResponse<ResponseProjectCategory[]>>(URL_GET_PROJECT_CATEGORY)
  },
  updateProject(projectId: number, payload: UpdateProjectPayload) {
    return http.put<SuccessResponse<ProjectDetailResponse>>(`${URL_UPDATE_PROJECT}?projectId=${projectId}`, payload)
  },
  deleteProject(id: number) {
    return http.delete<SuccessResponse<ProjectListResponse[]>>(`${URL_DELETE_PROJECT}?projectId=${id}`)
  },
  assignProjectMember(payload: AssignUsersProjectPayload) {
    return http.post(URL_ASSIGN_PROJECT_MEMBER, payload)
  }
}

export default projectApi
