import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

@Entity({ name: 'user_account' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @Column({ name: 'email' })
  email: string

  @Column({ name: 'password' })
  password: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  @VersionColumn()
  version: number
}
