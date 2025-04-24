import { CommandBus, QueryBus } from '@nestjs/cqrs'
import { Test, TestingModule } from '@nestjs/testing'

import { CreateUserRequest, GetUserByIdRequest } from 'proto'

import { GetUserByIdQuery } from '../modules/user/domain/use-cases/queries/get-user-by-id.query'
import { UserController } from './user.controller'

describe('UserController', () => {
  let userController: UserController
  let commandBus: CommandBus
  let queryBus: QueryBus

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: QueryBus,
          useValue: {
            execute: jest.fn(), // Mocking the QueryBus
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(), // Mocking the CommandBus
          },
        },
      ],
    }).compile()

    userController = module.get<UserController>(UserController)
    commandBus = module.get<CommandBus>(CommandBus)
    queryBus = module.get<QueryBus>(QueryBus)
  })

  it('should be defined', () => {
    expect(userController).toBeDefined()
  })

  it('should call CommandBus with CreateUserCommand', async () => {
    // Arrange
    const requestData: CreateUserRequest = {
      username: 'johndoe',
      email: 'john@example.com',
      password: 'password',
    }

    // Act
    await userController.createUser(requestData)

    // Assert
    expect(commandBus.execute).toHaveBeenCalledWith(expect.objectContaining(requestData))
  })

  it('should call QueryBus with GetUserByIdQuery', async () => {
    // Arrange
    const id = '123' // Fixed user ID for testing
    const getUserByIdRequest: GetUserByIdRequest = { id }

    const query = new GetUserByIdQuery(getUserByIdRequest)

    // Act
    await userController.getUserById(getUserByIdRequest)

    // Assert
    expect(queryBus.execute).toHaveBeenCalledWith(query)
  })
})
