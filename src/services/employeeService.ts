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
  })

  if (params.sortBy) {
    const sortKey = params.descending ? `-${params.sortBy}` : params.sortBy
    query.set('_sort', sortKey)
  }

  const url = `http://localhost:3000/employees?${query.toString()}`
  console.log('Fetching:', url)

  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`HTTP ${res.status} - ${text}`)
  }

  const result = await res.json()
  return result.data
}

