import { Global, Module } from '@nestjs/common'

import { RequestContextModule } from 'nestjs-request-context'

@Global()
@Module({
  imports: [RequestContextModule],
  providers: [],
  exports: [RequestContextModule],
})
export class CoreModule {}
