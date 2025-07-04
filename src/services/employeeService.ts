import type { Employee } from '../types/employee'

export interface QueryParams {
  q?: string
  page: number
  rowsPerPage: number
  sortBy?: string
  descending?: boolean
}

export async function fetchEmployees(params: QueryParams): Promise<Employee[]> {
  const query = new URLSearchParams({
    q: params.q || '',
    _page: params.page.toString(),
    _per_page: params.rowsPerPage.toString(),
    _sort: params.sortBy || '',
    _order: params.descending ? 'desc' : 'asc'
  })

  const res = await fetch(`http://localhost:3000/employees?${query}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status} - ${text}`)
  }
  const result = await res.json()
  return result.data
}
