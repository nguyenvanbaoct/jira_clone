export interface SuccessResponse<Content> {
  message: string
  content: Content
}

export interface ErrorResponse<Content> {
  message: string
  content?: Content
}

export type NoUndefinedField<T> = {
  // `-?` remove key undefiend
  [P in keyof T]-?: NoUndefinedField<NonNullable<T[P]>>
}
