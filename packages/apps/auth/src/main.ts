import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AUTH_PACKAGE_NAME } from '@libs/proto/types/auth'

import { join } from 'path'

import { AuthModule } from './auth.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../proto/auth.proto'),
      url: 'localhost:5001',
    },
  })

  await app.listen()
}
bootstrap()
