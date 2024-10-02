import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common'
import { RpcException } from '@nestjs/microservices'

import { Metadata } from '@grpc/grpc-js'
import { CoreModuleOptions } from 'src/core.module'

@Injectable()
export class GrpcGuard implements CanActivate {
  constructor(@Inject('CORE_MODULE_OPTIONS') private options: CoreModuleOptions) {}

  canActivate(context: ExecutionContext): boolean {
    const validApiKey = this.options.grpcApiKey
    const metadata: Metadata = context.switchToRpc().getContext()

    const apiKey = metadata.get('grpc-api-key')[0]

    if (!apiKey || apiKey !== validApiKey) {
      throw new RpcException('Invalid API Key')
    }
    return true
  }
}
