import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CqrsModule } from '@nestjs/cqrs'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'

import { CoreModule } from '@libs/core'
import { USER_PACKAGE_NAME, USER_SERVICE_NAME } from '@libs/proto'

import { join } from 'path'

import { commandHandlers } from './application/commands'

import { AuthController } from './presentation/auth.controller'

const application = [...commandHandlers]

@Module({
  imports: [
    CoreModule,
    CqrsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.registerAsync({
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
          url: 'localhost:5000',
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [...application],
})
export class AuthModule {}
