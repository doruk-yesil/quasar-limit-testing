export interface FilterItem {
  operator: string
  value: any
}

export function generateFilterQuery(filters: Record<string, FilterItem[]>): Record<string, string> {
  const query: Record<string, string> = {}

  for (const field in filters) {
    const fieldFilters = filters[field]
    if (!Array.isArray(fieldFilters)) continue

    fieldFilters.forEach(filter => {
      if (!filter.operator || filter.value === '') return

      switch (filter.operator) {
        case 'equals':
          query[field] = `${filter.value}`
          break

        case 'greater than':
          query[`${field}_gt`] = `${filter.value}`
          break

        case 'less than':
          query[`${field}_lt`] = `${filter.value}`
          break
      }
    })
  }

  return query
}
