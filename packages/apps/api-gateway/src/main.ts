import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { RpcExceptionFilter } from './filters/rpc-exception-filter/rpc-exception-filter.filter'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  app.useGlobalFilters(new RpcExceptionFilter())

  await app.listen(3000)
}
bootstrap()
