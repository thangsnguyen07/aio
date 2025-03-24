import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { ExceptionStatusMapper } from 'src/utils/exception-status.mapper'

@Injectable()
export class GrpcExceptionInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((error) => {
        const status = ExceptionStatusMapper.fromExceptionCodeToGrpcStatus(error?.code)

        const grpcError = new RpcException({
          code: Number.isInteger(error?.code) ? error?.code : status,
          message: error.details || error.message || 'Internal server error',
          details: {
            originalError: {
              name: error.name,
              code: error.code,
              message: error.message,
              stack: error.stack,
            },
            timestamp: new Date().toISOString(),
          },
        })

        return throwError(() => grpcError)
      }),
    )
  }
}
