import { Injectable } from '@nestjs/common'
import {
  DataSource,
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  QueryRunner,
  Repository,
  SelectQueryBuilder,
  UpdateResult
} from 'typeorm'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'

import { OrderObject } from '@app/common'

@Injectable()
export class BaseRepository<T> {
  constructor(
    private dataSource: DataSource,
    private entity: new () => T
  ) {}

  protected getRepository(): Repository<T> {
    return this.dataSource.manager.getRepository(this.entity)
  }

  createQueryBuilder(alias?: string, queryRunner?: QueryRunner): SelectQueryBuilder<T> {
    return this.getRepository().createQueryBuilder(alias, queryRunner)
  }

  async findAndCount(options: FindManyOptions<T>): Promise<[T[], number]> {
    return this.getRepository().findAndCount(options)
  }

  async createAndSave(createInput: DeepPartial<T>): Promise<T> {
    const instance = this.getRepository().create(createInput)
    await this.getRepository().save(instance)

    return instance
  }

  async bulkCreate(bulkCreateInput: DeepPartial<T>[]) {
    return this.getRepository().save(this.getRepository().create(bulkCreateInput))
  }

  async find(options: FindManyOptions<T> = {}): Promise<T[]> {
    return this.getRepository().find(options)
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.getRepository().findOne(options)
  }

  async update(conditions: FindOptionsWhere<T>, updateInput: QueryDeepPartialEntity<T>) {
    return this.getRepository().update(conditions, updateInput)
  }

  async delete(conditions: FindOptionsWhere<T>) {
    return this.getRepository().delete(conditions)
  }

  async softDelete(criteria: FindOptionsWhere<T>): Promise<UpdateResult> {
    return this.getRepository().softDelete(criteria)
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.getRepository().count(options)
  }

  addSelectToQueryBuilder(
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    select: string[] | undefined
  ): SelectQueryBuilder<T> {
    if (select?.length) {
      queryBuilder.select(select.map((column) => `${alias}.${column}`))
    }

    return queryBuilder
  }

  addOrderToQueryBuilder(
    queryBuilder: SelectQueryBuilder<T>,
    alias: string,
    order: OrderObject
  ): SelectQueryBuilder<T> {
    if (order && typeof order === 'object' && Object.keys(order).length) {
      Object.entries(order).forEach(([key, value]) => {
        queryBuilder.addOrderBy(`${alias}.${key}`, value)
      })
    }

    return queryBuilder
  }

  async paginateQueryBuilder(
    queryBuilder: SelectQueryBuilder<T>,
    pagination: { page?: number; limit?: number }
  ): Promise<{
    items: T[]
    totalCount: number
    page: number
    limit: number
  }> {
    const { page, limit } = pagination

    const take = limit
    const skip = (page - 1) * limit

    queryBuilder.take(take).skip(skip)

    const [items, totalCount] = await queryBuilder.getManyAndCount()

    return { items, totalCount, page, limit }
  }
}
