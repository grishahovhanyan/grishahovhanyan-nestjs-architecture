import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'

import { BaseRepository } from '@app/database'

import { GetUsersDto } from './dto'
import { UserEntity } from './entities/user.entity'

@Injectable()
export class UsersRepository extends BaseRepository<UserEntity> {
  constructor(dataSource: DataSource) {
    super(dataSource, UserEntity)
  }

  async findAndPaginate(findAndPaginateDto: GetUsersDto) {
    const {
      page,
      perPage,
      order,
      searchText,
      birthDateGte,
      birthDateLte,
      ageGte,
      ageLte,
      userIdsToExclude,
      userIdsToInclude
    } = findAndPaginateDto

    let queryBuilder = this.getRepository().createQueryBuilder('user')

    if (searchText?.trim()) {
      const formattedSearchText = `%${searchText.trim()}%`
      queryBuilder.andWhere("CONCAT(user.firstName, ' ', user.lastName) ILIKE :searchText", {
        searchText: formattedSearchText
      })
    }

    if (userIdsToExclude?.length) {
      queryBuilder.andWhere('user.id NOT IN (:...userIdsToExclude)', { userIdsToExclude })
    }

    if (userIdsToInclude?.length) {
      queryBuilder.andWhere('user.id IN (:...userIdsToInclude)', { userIdsToInclude })
    }

    if (birthDateGte) {
      queryBuilder.andWhere('user.birthDate >= :birthDateGte', { birthDateGte: new Date(birthDateGte) })
    }

    if (birthDateLte) {
      queryBuilder.andWhere('user.birthDate <= :birthDateLte', { birthDateLte: new Date(birthDateLte) })
    }

    if (ageGte) {
      const currentDate = new Date()
      const birthDateLteForAgeGte = new Date(currentDate.setFullYear(currentDate.getFullYear() - ageGte))
      queryBuilder.andWhere('user.birthDate <= :birthDateLteForAgeGte', { birthDateLteForAgeGte })
    }

    if (ageLte) {
      const currentDate = new Date()
      const birthDateGteForAgeLte = new Date(currentDate.setFullYear(currentDate.getFullYear() - ageLte - 1))
      queryBuilder.andWhere('user.birthDate >= :birthDateGteForAgeLte', { birthDateGteForAgeLte })
    }

    queryBuilder = this.addOrderToQueryBuilder(queryBuilder, 'user', order)

    return this.paginateQueryBuilder(queryBuilder, { page, limit: perPage })
  }
}
