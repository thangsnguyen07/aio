import { Todo } from './todo.model'
import { RepositoryPort } from '@ddd/core'

export interface TodoRepositoryPort extends RepositoryPort<Todo> {}
