import { useMemo, useState, type ReactNode } from 'react'
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '../ui/button'
import { EmptyState, Select } from '../ui/primitives'

export interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
  sortValue?: (row: T) => string | number
  className?: string
}
export function DataTable<T extends { id: string }>({
  data,
  columns,
  pageSize = 6,
  label,
}: {
  data: T[]
  columns: Column<T>[]
  pageSize?: number
  label: string
}) {
  const [sort, setSort] = useState<{ key: string; direction: 1 | -1 } | null>(null)
  const [requestedPage, setPage] = useState(1)
  const [size, setSize] = useState(pageSize)
  const pages = Math.max(1, Math.ceil(data.length / size))
  const page = Math.min(requestedPage, pages)
  const sorted = useMemo(() => {
    const accessor = columns.find((column) => column.key === sort?.key)?.sortValue
    if (!sort || !accessor) return data
    return [...data].sort((a, b) => {
      const left = accessor(a)
      const right = accessor(b)
      return (
        (typeof left === 'number' && typeof right === 'number'
          ? left - right
          : String(left).localeCompare(String(right))) * sort.direction
      )
    })
  }, [columns, data, sort])
  const visible = sorted.slice((page - 1) * size, page * size)
  return (
    <div className="data-table">
      <div className="table-scroll">
        <table aria-label={label}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={column.className}
                  aria-sort={
                    sort?.key === column.key
                      ? sort.direction === 1
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  {column.sortValue ? (
                    <button
                      onClick={() => {
                        setSort({
                          key: column.key,
                          direction: sort?.key === column.key && sort.direction === 1 ? -1 : 1,
                        })
                        setPage(1)
                      }}
                    >
                      {column.label}
                      {sort?.key === column.key ? (
                        sort.direction === 1 ? (
                          <ArrowUp size={12} />
                        ) : (
                          <ArrowDown size={12} />
                        )
                      ) : (
                        <ArrowUpDown size={11} />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={column.key} className={column.className}>
                    {column.render(row)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length === 0 && <EmptyState />}
      <div className="table-pagination">
        <span>
          Showing{' '}
          <strong>
            {data.length === 0 ? 0 : (page - 1) * size + 1}–{Math.min(page * size, data.length)}
          </strong>{' '}
          of <strong>{data.length}</strong> results
        </span>
        <div>
          <Select
            label={`${label} rows per page`}
            value={size}
            onChange={(event) => {
              setSize(Number(event.target.value))
              setPage(1)
            }}
          >
            <option value={6}>6 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
          </Select>
          <Button
            size="icon"
            variant="outline"
            aria-label="Previous page"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft size={14} />
          </Button>
          <span className="page-number">
            {page} / {pages}
          </span>
          <Button
            size="icon"
            variant="outline"
            aria-label="Next page"
            disabled={page === pages}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  )
}
