import { Inject } from '@nestjs/common'
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RpcException } from '@nestjs/microservices'

import { SuccessResponseDto } from '@libs/core/shared/presentation/dtos/response.dto'

import { status } from '@grpc/grpc-js'
import { User } from 'apps/user/src/domain/user.model'
import { UserRepositoryPort } from 'apps/user/src/domain/user.repository.port'
import * as bcrypt from 'bcrypt'

import { InjectionToken } from '../../injection-token'
import { CreateUserCommand } from './create-user.command'

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(InjectionToken.USER_REPOSITORY) private readonly repository: UserRepositoryPort,
  ) {}
  async execute(command: CreateUserCommand): Promise<any> {
    const { email, password } = command

    const isUserExist = await this.repository.findOneByEmail(email)

    if (isUserExist) {
      throw new RpcException({
        code: status.ALREADY_EXISTS,
        message: 'User with this email already exists',
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = User.create({ email, password: hashedPassword })

    await this.repository.save(user)

    return new SuccessResponseDto(
      {
        id: user.id,
        email: user.getProps().email,
      },
      200,
      'User created successfully',
    )
  }
}
