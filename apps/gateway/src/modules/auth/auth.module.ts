import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { PassportModule } from '@nestjs/passport'

import { AUTH_SERVICE_NAME } from 'proto'

import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { AccessTokenStrategy } from './strategies/access-token.strategy'
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy'

@Module({
  imports: [
    ConfigModule,
    PassportModule,
    JwtModule,
    ClientsModule.register([
      {
        name: AUTH_SERVICE_NAME,
        transport: Transport.GRPC,
        options: {
          package: 'auth',
          protoPath: 'node_modules/proto/auth.proto',
          url: '0.0.0.0:5000',
          loader: {
            keepCase: true,
          },
        },
      },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, AccessTokenStrategy, RefreshTokenStrategy],
})
export class AuthModule {}
