import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common'

import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class GrpcLoggingInterceptor implements NestInterceptor {
  private logger = new Logger(GrpcLoggingInterceptor.name)
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Grabs the gRPC data/request
    const data = context.switchToRpc().getData()

    // Log before the request is handled
    this.logger.log(`GRPC Request - Payload: ${JSON.stringify(data)}`)

    const now = Date.now()
    return next.handle().pipe(
      tap({
        next: (response) => {
          // Log after the response is generated
          this.logger.log(
            `GRPC Response - Execution Time: ${Date.now() - now}ms \nResponse: ${JSON.stringify(response)}`,
          )
        },
        error: (err) => {
          // Log in case of an error
          this.logger.error(`GRPC Error - Execution Time: ${Date.now() - now}ms`, err)
        },
      }),
    )
  }
}
