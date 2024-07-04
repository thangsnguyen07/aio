import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

import { TodoModule } from './todo.module'

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(TodoModule, {
    transport: Transport.GRPC,
    options: {
      client: {
        brokers: ['localhost:9092'],
      },
      consumer: {
        groupId: 'todo-consumer',
      },
    },
  })
  await app.listen()
}
bootstrap()
