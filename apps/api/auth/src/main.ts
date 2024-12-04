import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { AuthModule } from './auth.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AuthModule, {
    transport: Transport.GRPC,
    options: {
      package: 'auth',
      protoPath: 'node_modules/proto/auth.proto',
      url: '0.0.0.0:5000',
    },
  })

  await app.listen()

  Logger.log('Auth microservice is running!')
}
bootstrap()
