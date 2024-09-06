import { Module, Provider } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { CoreModule } from '@libs/core'
import { GrpcLoggingInterceptor } from '@libs/core/application/interceptors/grpc-logging.interceptor'
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '@libs/proto'

import { join } from 'path'

import { AuthService } from './application/auth.service'
import { commandHandlers } from './application/commands'
import { InjectionToken } from './application/injection-token'

import { AuthController } from './presentation/auth.controller'

const application = [...commandHandlers]

const providers: Provider[] = [
  {
    provide: APP_INTERCEPTOR,
    useClass: GrpcLoggingInterceptor,
  },
  {
    provide: InjectionToken.AUTH_SERVICE,
    useClass: AuthService,
  },
]

@Module({
  imports: [
    CoreModule,
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
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
    ClientsModule.register([
      {
        name: USER_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: USER_PACKAGE_NAME,
          protoPath: join(__dirname, '../proto/user.proto'),
          url: '0.0.0.0:5000',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [...application, ...providers],
})
export class AuthModule {}
