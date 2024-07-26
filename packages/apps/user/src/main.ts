import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { USER_PACKAGE_NAME } from '@libs/proto'

import { join } from 'path'

import { UserModule } from './user.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
    transport: Transport.GRPC,
    options: {
      package: USER_PACKAGE_NAME,
      protoPath: join(__dirname, '../proto/user.proto'),
      url: 'localhost:5000',
    },
  })

  await app.listen()
}
bootstrap()
