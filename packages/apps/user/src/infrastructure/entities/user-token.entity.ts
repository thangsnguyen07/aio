import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VersionColumn,
} from 'typeorm'

import { UserEntity } from './user.entity'

@Entity({ name: 'user_token' })
export class UserTokenEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string

  @OneToOne(() => UserEntity, (user) => user.id, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  @Column({ name: 'user_id', unique: true })
  userId: string

  @Column({ name: 'refresh_token' })
  refreshToken: string

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date | null

  @VersionColumn()
  version: number
}
