---
to: "src/modules/<%= h.moduleFolderName(name) %>/<%= h.serviceFileName(name) %>.ts"
unless_exists: true
skip_if: <%= !resources.includes('Service') %>
---
<%
  ServiceName = h.ServiceName(name)

  RepositoryName = h.RepositoryName(name)
  repositoryFileName = h.repositoryFileName(name)
  repositoryParamName = h.changeCase.camel(RepositoryName)

  EntityName = h.EntityName(name)
  entitiesFolderName = h.entitiesFolderName(name)
  entityFileName = h.entityFileName(name)

  instanceName = h.instanceName(name)
  instanceId = instanceName + 'Id'
  instanceNamePascal = h.changeCase.pascal(instanceName)

  dtosFolderName = h.dtosFolderName()
  CreateDtoName = h.CreateDtoName(name)
  GetDtoName = h.GetDtoName(name)
  UpdateDtoName = h.UpdateDtoName(name)

  createDtoParamName = h.changeCase.camel(CreateDtoName)
  getDtoParamName = h.changeCase.camel(GetDtoName)
  updateDtoParamName = h.changeCase.camel(UpdateDtoName)

%>import { Injectable, NotFoundException } from '@nestjs/common'

import { paginatedResponse, SUCCESS_RESPONSE } from '@app/common'

import { <%= CreateDtoName %>, <%= GetDtoName %>, <%= UpdateDtoName %> } from './<%= dtosFolderName %>'
import { <%= EntityName %> } from './<%= entitiesFolderName %>/<%= entityFileName %>'
import { <%= RepositoryName %> } from './<%= repositoryFileName %>'

@Injectable()
export class <%= ServiceName %> {
  constructor(private readonly <%= repositoryParamName %>: <%= RepositoryName %>) {}

  // ******* Controller Handlers *******
  async index(currentUserId: number, query: <%= GetDtoName %>) {
    const { items, totalCount } = await this.getAndCount({
      ...query,
      userId: currentUserId
    })

    return paginatedResponse(items, totalCount, query.page, query.perPage)
  }

  async create(currentUserId: number, <%= instanceId %>: number, <%= createDtoParamName %>: <%= CreateDtoName %>) {
    const <%= instanceName %> = await this.create<%= instanceNamePascal %>({ ...<%= createDtoParamName %>, <%= instanceId %> })

    return <%= instanceName %>
  }

  async find(currentUserId: number, <%= instanceId %>: number) {
    const <%= instanceName %> = await this.getById(<%= instanceId %>)

    if (!<%= instanceName %>) {
      throw new NotFoundException()
    }

    return <%= instanceName %>
  }

  async update(currentUserId: number, <%= instanceId %>: number, <%= updateDtoParamName %>: <%= UpdateDtoName %>) {
    const <%= instanceName %> = await this.getById(<%= instanceId %>)

    if (!<%= instanceName %>) {
      throw new NotFoundException()
    }

    if (!Object.keys(<%= updateDtoParamName %>).length) {
      return <%= instanceName %>
    }

    return this.updateById(<%= instanceId %>, <%= updateDtoParamName %>)
  }

  async delete(currentUserId: number, <%= instanceId %>: number) {
    const <%= instanceName %> = await this.getById(<%= instanceId %>)

    if (!<%= instanceName %>) {
      throw new NotFoundException()
    }

    await this.deleteById(<%= instanceId %>)

    return SUCCESS_RESPONSE
  }

  // ******* ******* ******* *******

  async create<%= instanceNamePascal %>(<%= createDtoParamName %>: <%= CreateDtoName %>): Promise< <%= EntityName %> > {
    return this.<%= repositoryParamName %>.createAndSave(<%= createDtoParamName %>)
  }

  async getAndCount(<%= getDtoParamName %>: <%= GetDtoName %>) {
    const { page, perPage, order, searchText, userId } = <%= getDtoParamName %>

    const qb = this.<%= repositoryParamName %>.createQueryBuilder('<%= instanceName %>')

    if (searchText) {
      console.log('Search text:', searchText)
    }

    if (order) {
      for (const [key, orderType] of Object.entries(order)) {
        qb.orderBy(`<%= instanceName %>.${key}`, orderType)
      }
    }

    const [items, totalCount] = await qb
      .setParameter('userId', userId)
      .setParameter('searchPattern', `%${searchText}%`)
      .take(perPage)
      .skip((page - 1) * perPage)
      .getManyAndCount()

    return { items, totalCount }
  }

  async getById(<%= instanceId %>: number): Promise< <%= EntityName %>  | null> {
    return this.<%= repositoryParamName %>.findOne({ where: { id: <%= instanceId %> } })
  }

  async updateById(<%= instanceId %>: number, <%= updateDtoParamName %>: <%= UpdateDtoName %>): Promise< <%= EntityName %>  | null> {
    await this.<%= repositoryParamName %>.update({ id: <%= instanceId %> }, <%= updateDtoParamName %>)
    return await this.getById(<%= instanceId %>)
  }

  async deleteById(<%= instanceId %>: number) {
    return this.<%= repositoryParamName %>.delete({ id: <%= instanceId %> })
  }
}
