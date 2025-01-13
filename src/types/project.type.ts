import { TaskType } from 'src/types/task.type.api'

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

interface TaskDetail {
  priorityTask: PriorityTask
  taskTypeDetail: TaskType
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
  projectName: string
  description: string
  projectCategory: {
    id: number
  }
  alias: string
  creator: {
    id: number
  }
  id: number
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

export interface AssignUsersProjectPayload {
  projectId: number
  userId: number
}

export interface CreateProjectPayload {
  projectName: string
  description: string
  categoryId: number
  alias: string
}

export interface CreateTaskPayload {
  listUserAsign: number[]
  taskName: string
  description: string
  statusId: string
  originalEstimate: number
  timeTrackingSpent: number
  timeTrackingRemaining: number
  projectId: number
  typeId: number
  priorityId: number
}


