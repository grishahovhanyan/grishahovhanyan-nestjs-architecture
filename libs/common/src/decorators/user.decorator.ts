import { createParamDecorator, ExecutionContext } from '@nestjs/common'

import { UserEntity } from '@modules/users/entities/user.entity'

export const RequestUser = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest()
  const user: UserEntity = request.user

  return data ? user?.[data] : user
})
