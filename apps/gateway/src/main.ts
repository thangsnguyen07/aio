import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { GrpcExceptionFilter } from '@/common/filters/rpc-exception.filter'
import { GrpcMetadataInterceptor } from '@/common/interceptors/grpc-metadata.interceptor'
import * as compression from 'compression'
import * as cookieParser from 'cookie-parser'
import helmet from 'helmet'

import { AppModule } from './app.module'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)

  app.use(helmet())
  app.use(compression())
  app.use(cookieParser())

  app.enableCors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  app.useGlobalFilters(new GrpcExceptionFilter())
  // app.useGlobalInterceptors(new GrpcMetadataInterceptor())

  await app.listen(3000)
}

bootstrap()
