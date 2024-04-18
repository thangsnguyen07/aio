import { AggregateID } from '../../../ddd/model.base'
import { BaseResponseProps } from '../../domain/types.base'

export class BaseResponseDTO {
  protected id: AggregateID
  protected createdAt: Date
  protected updatedAt: Date
  protected deletedAt: Date | null

  constructor({ id, createdAt, updatedAt, deletedAt }: BaseResponseProps) {
    const now = new Date()

    this.id = id
    this.createdAt = createdAt || now
    this.updatedAt = updatedAt || now
    this.deletedAt = deletedAt || null
  }

  toJson() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    }
  }
}
