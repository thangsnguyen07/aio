import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity('room')
export class RoomEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column()
  name: string

  @Column('simple-array')
  participantIds: string[]

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null
}
