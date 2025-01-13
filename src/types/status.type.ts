export interface Status {
  statusId: string
  statusName: string
  alias: string
  deleted: string
}

export interface StatusResponse {
  statusCode: number
  content: Status[]
  dateTime: string
}
