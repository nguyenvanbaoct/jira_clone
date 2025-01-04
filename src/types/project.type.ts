interface Member {
  userId: number
  name: string
  avatar: string
}

interface Creator {
  id: number
  name: string
}

export interface Project {
  members: Member[]
  creator: Creator
  id: number
  projectName: string
  description: string
  categoryId: number
  categoryName: string
  alias: string
  deleted: boolean
  projectCategory: ProjectCategory
}

export interface ProjectListResponse {
  statusCode: number
  message: string
  content: Project[]
  dateTime: string
}

interface Comment {
  id: number
  idUser: number
  name: string
  avatar: string
  commentContent: string
}

interface Assignee {
  id: number
  avatar: string
  name: string
  alias: string
}

interface PriorityTask {
  priorityId: number
  priority: string
}

interface TaskTypeDetail {
  id: number
  taskType: string
}

interface TaskDetail {
  priorityTask: PriorityTask
  taskTypeDetail: TaskTypeDetail
  assigness: Assignee[]
  lstComment: Comment[]
  taskId: number
  taskName: string
  alias: string
  description: string
  statusId: string
  originalEstimate: number
  timeTrackingSpent: number
  timeTrackingRemaining: number
  typeId: number
  priorityId: number
  projectId: number
}

interface TaskStatus {
  lstTaskDeTail: TaskDetail[]
  statusId: string
  statusName: string
  alias: string
}

interface ProjectCategory {
  id: number
  name: string
}

export interface ProjectContent {
  lstTask: TaskStatus[]
  members: Member[]
  creator: Creator
  id: number
  projectName: string
  description: string
  projectCategory: ProjectCategory
  alias: string
}

export interface DetailedProjectResponse {
  statusCode: number
  message: string
  content: Project
}

export interface ProjectDetailResponse {
  data: {
    statusCode: number
    message: string
    content: Project
  }
}

export interface ResponseProjectCategory {
  id: number
  projectCategoryName: string
}

export interface UpdateProjectPayload {
  id: number
  projectName: string
  creator: number
  description: string
  categoryId: string
}

export interface AssignUserProjectPayload {
  projectId: number
  userId: number
}
