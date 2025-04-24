import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { GrpcClientService } from '@/common/services/grpc-client.service'
import { USER_SERVICE_NAME } from 'proto'

import { UserController } from './user.controller'
import { UserService } from './user.service'

@Module({
  imports: [
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: 'node_modules/proto/user.proto',
          url: '0.0.0.0:5000',
        },
      },
    ]),
  ],
  controllers: [UserController],
  providers: [UserService, GrpcClientService],
})
export class UserModule { }
