import { OrderObject } from '../types'

export enum SortDirections {
  ascending = 'ASC',
  descending = 'DESC'
}

export const DEFAULT_SORT_FIELDS = ['id']

export const USERS_SORT_FIELDS = ['id', 'registeredAt']

export function getSortOrderFromQuery(queryOrdering: string[], allowedSortFields: string[]): OrderObject {
  const sortOrder = queryOrdering.reduce((orderObject, sortField) => {
    let sortDirection = SortDirections.ascending
    if (sortField.startsWith('-')) {
      sortDirection = SortDirections.descending
      sortField = sortField.slice(1)
    }

    if (allowedSortFields.includes(sortField)) {
      orderObject[sortField] = sortDirection
    }
    return orderObject
  }, {})

  return sortOrder
}

export const getOrderDescription = (sortFields: string[] = DEFAULT_SORT_FIELDS) => `
    Allowed fields: ${sortFields.join(', ')}

    Examples: 
      ?ordering=-id (descending) 
      ?ordering=createdAt (ascending) 
      ?ordering=id,-createdAt`
