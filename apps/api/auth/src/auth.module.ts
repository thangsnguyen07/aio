import { Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { TypeOrmModule } from '@nestjs/typeorm'

import { CoreModule, GrpcLoggingInterceptor } from 'core'
import { USER_SERVICE_NAME } from 'proto'

import { AuthService } from './application/auth.service'
import { commandHandlers } from './application/commands'
import { eventHandlers } from './application/event-handlers'
import { InjectionToken } from './application/injection-token'

import { UserTokenEntity } from './infrastructure/entities/user-token.entity'
import { UserTokenRepository } from './infrastructure/repositories/user-token.repository'

import { AuthController } from './presentation/auth.controller'

import { dataSourceOptions } from './configs/typeorm.config'
import { UserTokenMapper } from './user-token.mapper'

const application = [...commandHandlers, ...eventHandlers]

const providers: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: GrpcLoggingInterceptor,
  },
  {
    provide: InjectionToken.AUTH_SERVICE,
    useClass: AuthService,
  },
  {
    provide: InjectionToken.USER_TOKEN_REPOSITORY,
    useClass: UserTokenRepository,
  },
]

@Module({
  imports: [
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    CoreModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        grpcApiKey: configService.get<string>('GRPC_API_KEY'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([UserTokenEntity]),
    TypeOrmModule.forRoot(dataSourceOptions),
    EventEmitterModule.forRoot(),
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'user',
          protoPath: 'node_modules/proto/user.proto',

          url: '0.0.0.0:5001',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [...application, ...providers, UserTokenMapper],
})
export class AuthModule {}
