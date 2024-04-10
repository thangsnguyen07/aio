export interface TodoProps {
  userId: string
  title: string
  description: string
}

export interface CreateTodoProps {
  userId: string
  title: string
  description: string
}

export interface UpdateTodoProps {
  title: string
  description: string
}
