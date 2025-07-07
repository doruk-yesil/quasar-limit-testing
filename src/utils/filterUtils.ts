export function generateFilterQuery(filters: Record<string, any>): Record<string, string> {
  const query: Record<string, string> = {}

  for (const field in filters) {
    const filter = filters[field]
    if (!filter || !filter.operator || filter.value === '') continue
    console.log('Filter check:', {
        field,
        operator: filter.operator,
        type: typeof filter.operator,
        equalsIsFalse: filter.operator === 'is false',
        equalsIsTrue: filter.operator === 'is true'
    })
    switch (filter.operator) {
      case 'equals':
        query[field] = filter.value
        break
      case 'not equals':
        query[`${field}_ne`] = filter.value
        break
      case 'greater than':
        query[`${field}_gt`] = filter.value
        break
      case 'less than':
        query[`${field}_lt`] = filter.value
        break
      case 'greater than or equal':
        query[`${field}_gte`] = filter.value
        break
      case 'less than or equal':
        query[`${field}_lte`] = filter.value
        break
      case 'between':
        if (filter.value && filter.value2) {
          query[`${field}_gte`] = filter.value
          query[`${field}_lte`] = filter.value2
        }
        break
      case 'is':
        query[field] = filter.value
        break
      case 'is_true':
        console.log('🏁 MATCHED is true')
        query[field] = 'true'
        break
      case 'is_false':
        console.log('🏁 MATCHED is false')
        query[field] = 'false'
        break
      // case 'contains':
      // case 'not contains':
      //   -> desteklenmiyor
    }
  }

  return query
}
