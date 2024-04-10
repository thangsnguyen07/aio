import { TodoModule } from './todo.module'
import { NestFactory } from '@nestjs/core'

async function bootstrap() {
  const app = await NestFactory.create(TodoModule)
  await app.listen(3000)
}
bootstrap()
