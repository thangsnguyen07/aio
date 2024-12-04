import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { config } from 'dotenv'

import { UserModule } from './user.module'

config()

async function bootstrap(): Promise<void> {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(UserModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: 'node_modules/proto/user.proto',
      url: '0.0.0.0:5001',
    },
  })

  await app.listen()

  Logger.log('User microservice is running!')
}
bootstrap()
