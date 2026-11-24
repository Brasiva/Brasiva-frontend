import api from '@/api/config'

export async function fetchAllPages(path) {
  const rows = []
  let page = 1
  while (true) {
    const { data } = await api.get(path, { params: { page } })
    rows.push(...(Array.isArray(data) ? data : data.results || []))
    if (Array.isArray(data)) break
    if (data.total_pages && page < data.total_pages) { page += 1; continue }
    if (data.next) { page += 1; continue }
    break
  }
  return rows
}
