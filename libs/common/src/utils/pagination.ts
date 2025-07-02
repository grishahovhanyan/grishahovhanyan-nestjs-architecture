import { getSortOrderFromQuery, OrderObject } from '@app/common'

import { envService } from './get-env'

export enum PageTypes {
  users = 'users'
}

export const DEFAULT_PAGE_SIZE = 50
export const MAX_PAGE_SIZE = 200

export const DEFAULT_PAGE_SIZES = {
  [PageTypes.users]: envService.getEnvNumber('USERS_PAGE_SIZE', DEFAULT_PAGE_SIZE)
}

export const MAX_PAGE_SIZES = {
  [PageTypes.users]: envService.getEnvNumber('USERS_MAX_PAGE_SIZE', MAX_PAGE_SIZE)
}

export function getPerPage(type: string, querySize?: number) {
  const defaultSize = DEFAULT_PAGE_SIZES[type] ?? DEFAULT_PAGE_SIZE
  const maxSize = MAX_PAGE_SIZES[type] ?? MAX_PAGE_SIZE

  return +querySize && +querySize <= maxSize ? +querySize : defaultSize
}

export function getPagesForResponse(totalCount: number, page: number, perPage: number) {
  const numPages = Math.ceil(totalCount / perPage)

  return {
    next: page + 1 > numPages ? null : page + 1,
    previous: page - 1 < 1 ? null : page - 1,
    current: page,
    numPages,
    perPage
  }
}

export function getPaginationAndSortOrder(
  query: { page?: number; perPage?: number; ordering?: string },
  pageSizeType: string,
  allowedSortFields: string[] = []
): { page: number; perPage: number; order: OrderObject } {
  const page = +query.page || 1
  const perPage = getPerPage(pageSizeType, +query.perPage)
  const order = getSortOrderFromQuery(query.ordering?.split(',') ?? [], allowedSortFields)

  return { page, perPage, order }
}

export function paginatedResponse(items, totalCount: number, page: number, perPage: number) {
  return {
    pages: getPagesForResponse(totalCount, page, perPage),
    count: items.length,
    items
  }
}
