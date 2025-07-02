import { Injectable, NotFoundException } from '@nestjs/common'

import { paginatedResponse } from '@app/common'

import { CreateUserDto, GetUsersDto } from './dto'
import { UserEntity } from './entities/user.entity'
import { UsersRepository } from './users.repository'

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  // ******* Controller Handlers *******
  async index(currentUserId: number, query: GetUsersDto) {
    const { items, totalCount } = await this.usersRepository.findAndPaginate({
      ...query,
      userIdsToExclude: [currentUserId]
    })

    return paginatedResponse(items, totalCount, query.page, query.perPage)
  }

  async find(userId: number) {
    const user = await this.getById(userId)

    if (!user) {
      throw new NotFoundException()
    }

    return user
  }

  // ******* ******* ******* *******

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.usersRepository.createAndSave(createUserDto)
  }

  async getById(userId: number): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id: userId } })
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } })
  }

  async getByToken(token: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { token } })
  }

  async updateById(userid: number, updateUserDto: Partial<UserEntity>): Promise<UserEntity | null> {
    await this.usersRepository.update({ id: userid }, updateUserDto)
    return this.getById(userid)
  }
}
