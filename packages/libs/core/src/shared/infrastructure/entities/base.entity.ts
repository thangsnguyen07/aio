import {
  CreateDateColumn,
  DataSource,
  DeleteDateColumn,
  BaseEntity as OrmBaseEntity,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

import { Order, getOrder } from '../decorators/order.decorator'

export abstract class BaseEntity extends OrmBaseEntity {
  @Order(9999)
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @Order(9999)
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @Order(9999)
  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  @Order(9999)
  @VersionColumn()
  version: number

  static useDataSource(dataSource: DataSource) {
    OrmBaseEntity.useDataSource.call(this, dataSource)
    const meta = dataSource.entityMetadatasMap.get(this)
    if (meta != null) {
      // reorder columns here
      meta.columns = [...meta.columns].sort((x, y) => {
        const orderX = getOrder((x.target as any).prototype, x.propertyName)
        const orderY = getOrder((y.target as any).prototype, y.propertyName)
        return orderX - orderY
      })
    }
  }
}
