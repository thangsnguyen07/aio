import { Module } from '@nestjs/common'

import { RequestContextModule } from 'nestjs-request-context'

import { UserModule } from './modules/user/user.module'

@Module({
  imports: [RequestContextModule, UserModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
