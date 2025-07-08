import type { Employee } from '../types/employee'
import { generateFilterQuery } from '../utils/filterUtils'

export interface QueryParams {
  q?: string
  page: number
  rowsPerPage: number
  sortBy?: string
  descending?: boolean
  filters?: Record<string, any>
}

export async function fetchEmployees(
  params: QueryParams
): Promise<{ data: Employee[]; total: number }> {
  const query = new URLSearchParams()

  query.set('_page', params.page.toString())
  query.set('_per_page', params.rowsPerPage.toString())
  if (params.sortBy) {
    const sortKey = params.descending ? `-${params.sortBy}` : params.sortBy
    query.set('_sort', sortKey)
  }
  query.set('q', params.q || '')

  const filterQuery = generateFilterQuery(params.filters || {})

  for (const [key, value] of Object.entries(filterQuery)) {
    query.set(key, value)
  }

  const url = `http://localhost:3000/employees?${query.toString()}`

  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status} - ${text}`)
  }

  const result = await res.json()
  const total = result.items ?? result.data.length

  return { data: result.data ?? result, total }
}
