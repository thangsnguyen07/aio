import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'

import { JwtUser } from '@/modules/auth/interfaces/jwt-user.interface'
import { Metadata } from '@grpc/grpc-js'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class GrpcMetadataInterceptor implements NestInterceptor {
  private readonly logger = new Logger(GrpcMetadataInterceptor.name)

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest()
    const user: JwtUser = request.user

    if (user) {
      const metadata = new Metadata()
      metadata.set('userId', user.sub)
      metadata.set('jwt', request.headers.authorization?.replace('Bearer ', ''))

      request.grpcMetadata = metadata
    }

    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.debug(`Request processed with metadata: ${user?.sub || 'no user'}`, {
            userId: user?.sub,
            timestamp: new Date().toISOString(),
          })
        },
      }),
    )
  }
}
