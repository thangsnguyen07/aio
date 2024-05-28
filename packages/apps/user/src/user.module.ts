import { Module } from '@nestjs/common'
import { CqrsModule } from '@nestjs/cqrs'

import { UserController } from './presentation/user.controller'
import { UserService } from './user.service'

@Module({
  imports: [CqrsModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
