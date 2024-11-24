import { ExecutionContext, createParamDecorator } from '@nestjs/common'

import { JwtUser } from '../modules/auth/interfaces/jwt-user.interface'

export const CurrentUser = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user = request.user as JwtUser
  return user
})
