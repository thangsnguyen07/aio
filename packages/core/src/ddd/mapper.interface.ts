import { BaseModel } from './model.base'

export interface Mapper<DomainModel extends BaseModel<any>, Entity, Response = any> {
  toPersistence(entity: DomainModel): Entity
  toDomain(record: any): DomainModel
  toResponse(entity: DomainModel): Response
}
