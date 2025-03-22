import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { ChatModule } from './chat.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(ChatModule, {
    transport: Transport.GRPC,
    options: {
      package: 'chat',
      protoPath: 'node_modules/proto/chat.proto',
      url: '0.0.0.0:5003',
    },
  })
  await app.listen()

  Logger.log('Chat microservice is running!')
}
bootstrap()
