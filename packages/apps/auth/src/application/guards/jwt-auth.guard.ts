import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import { RpcException } from '@nestjs/microservices'

import { TokenRequest } from '@libs/proto/types/auth'

import { status } from '@grpc/grpc-js'

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: TokenRequest = context.switchToHttp().getRequest()

    if (!request.token) {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Invalid token',
      })
    }

    try {
      const payload = await this.jwtService.verifyAsync(request.token, {
        secret: this.configService.get('JWT_SECRET'),
      })

      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      // request['user'] = payload
    } catch {
      throw new RpcException({
        code: status.PERMISSION_DENIED,
        message: 'Invalid token',
      })
    }

    return true
  }
}
