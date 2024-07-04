import { AggregateID } from '../../ddd/model.base'

export interface BaseResponseProps {
  id: AggregateID
  createdAt: Date
  updatedAt: Date
  deletedAt: Date | null
}
