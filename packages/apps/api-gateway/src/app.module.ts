import { Module } from '@nestjs/common'

import { RequestContextModule } from 'nestjs-request-context'

import { AuthModule } from './modules/auth/auth.module'
import { UserModule } from './modules/user/user.module'

@Module({
  imports: [RequestContextModule, UserModule, AuthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
