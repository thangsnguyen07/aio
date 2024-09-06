import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { RpcExceptionFilter } from './filters/rpc-exception.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new RpcExceptionFilter())

  await app.listen(3000)

  Logger.log('API Gateway is running!')
}
bootstrap()
