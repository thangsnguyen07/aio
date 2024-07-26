import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { join } from 'path'

import { TodoModule } from './todo.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TodoModule, {
    transport: Transport.GRPC,
    options: {
      package: 'user',
      protoPath: join(__dirname, '../proto/todo/todo.proto'),
    },
  })
  await app.listen()
}
bootstrap()
