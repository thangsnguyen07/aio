import { HttpStatus, Injectable } from '@nestjs/common'

import { status as GrpcStatus } from '@grpc/grpc-js'

@Injectable()
export class ErrorStatusMapper {
  grpcToHttpMapper(status: GrpcStatus): HttpStatus {
    let httpStatus: HttpStatus

    switch (status) {
      case GrpcStatus.OK:
        httpStatus = HttpStatus.OK
        break

      case GrpcStatus.CANCELLED:
        httpStatus = HttpStatus.METHOD_NOT_ALLOWED
        break

      case GrpcStatus.UNKNOWN:
        httpStatus = HttpStatus.BAD_GATEWAY
        break

      case GrpcStatus.INVALID_ARGUMENT:
        httpStatus = HttpStatus.BAD_REQUEST
        break

      case GrpcStatus.DEADLINE_EXCEEDED:
        httpStatus = HttpStatus.REQUEST_TIMEOUT
        break

      case GrpcStatus.NOT_FOUND:
        httpStatus = HttpStatus.NOT_FOUND
        break

      case GrpcStatus.ALREADY_EXISTS:
        httpStatus = HttpStatus.CONFLICT
        break

      case GrpcStatus.PERMISSION_DENIED:
        httpStatus = HttpStatus.FORBIDDEN
        break

      case GrpcStatus.RESOURCE_EXHAUSTED:
        httpStatus = HttpStatus.TOO_MANY_REQUESTS
        break

      case GrpcStatus.FAILED_PRECONDITION:
        httpStatus = HttpStatus.PRECONDITION_REQUIRED
        break

      case GrpcStatus.ABORTED:
        httpStatus = HttpStatus.METHOD_NOT_ALLOWED
        break

      case GrpcStatus.OUT_OF_RANGE:
        httpStatus = HttpStatus.PAYLOAD_TOO_LARGE
        break

      case GrpcStatus.UNIMPLEMENTED:
        httpStatus = HttpStatus.NOT_IMPLEMENTED
        break

      case GrpcStatus.INTERNAL:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        break

      case GrpcStatus.UNAVAILABLE:
        httpStatus = HttpStatus.NOT_FOUND
        break

      case GrpcStatus.DATA_LOSS:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        break

      case GrpcStatus.UNAUTHENTICATED:
        httpStatus = HttpStatus.UNAUTHORIZED
        break

      default:
        httpStatus = HttpStatus.INTERNAL_SERVER_ERROR
        break
    }

    return httpStatus
  }
}
