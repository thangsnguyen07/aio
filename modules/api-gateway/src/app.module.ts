import { TodoController } from './todo/todo.controller'
import { TodoService } from './todo/todo.service'
import { Module } from '@nestjs/common'
import { ClientsModule, Deserializer, Serializer, Transport } from '@nestjs/microservices'

class CustomSerializer implements Serializer {
  serialize(value: any): any {
    // Serialize your class instance to a buffer
    // Implement serialization logic here
    return Buffer.from(JSON.stringify(value))
  }
}

class CustomDeserializer implements Deserializer {
  deserialize(data: Buffer): any {
    const stringifiedData = data.toString()

    return stringifiedData
  }
}

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'TODO_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'todo',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'todo-consumer',
          },
          // parser: { keepBinary: true },
          // serializer: new CustomSerializer(),
          // deserializer: new CustomDeserializer(),
        },
      },
    ]),
  ],
  controllers: [TodoController],
  providers: [TodoService],
})
export class AppModule {}
