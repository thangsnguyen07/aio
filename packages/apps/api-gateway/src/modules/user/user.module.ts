import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { AUTH_PACKAGE_NAME, AUTH_SERVICE_NAME } from '@libs/proto/types/auth'
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '@libs/proto/types/user'

import { join } from 'path'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../proto/user.proto'),
          url: '0.0.0.0:5000',
        },
      },
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: AUTH_PACKAGE_NAME,
          protoPath: join(__dirname, '../proto/auth.proto'),
          url: '0.0.0.0:5001',
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
