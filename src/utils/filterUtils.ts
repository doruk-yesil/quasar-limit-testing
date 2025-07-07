export function generateFilterQuery(filters: Record<string, any>): Record<string, string> {
  const query: Record<string, string> = {}

  for (const field in filters) {
    const filter = filters[field]
    if (!filter || !filter.operator || filter.value === '') continue

    switch (filter.operator) {
      case 'equals':
        query[field] = filter.value
        break
      case 'greater than':
        query[`${field}_gt`] = filter.value
        break
      case 'less than':
        query[`${field}_lt`] = filter.value
        break
    }
  }

  return query
}
