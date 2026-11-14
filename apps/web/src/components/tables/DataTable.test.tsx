import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DataTable, type Column } from './DataTable'

const data = Array.from({ length: 15 }, (_, i) => ({
  id: String(i),
  name: `Record ${String(i).padStart(2, '0')}`,
}))
const columns: Column<(typeof data)[number]>[] = [
  { key: 'name', label: 'Name', render: (row) => row.name, sortValue: (row) => row.name },
]
describe('DataTable', () => {
  it('sorts in both directions and exposes sort state', () => {
    render(<DataTable data={data} columns={columns} label="Test records" />)
    fireEvent.click(screen.getByRole('button', { name: 'Name' }))
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'ascending')
    fireEvent.click(screen.getByRole('button', { name: 'Name' }))
    expect(screen.getByRole('columnheader')).toHaveAttribute('aria-sort', 'descending')
    expect(within(screen.getAllByRole('row')[1]).getByText('Record 14')).toBeInTheDocument()
  })
  it('paginates and clamps the current page when filtered records shrink', () => {
    const { rerender } = render(<DataTable data={data} columns={columns} label="Test records" />)
    fireEvent.click(screen.getByRole('button', { name: 'Next page' }))
    expect(screen.getByText('Record 06')).toBeInTheDocument()
    rerender(<DataTable data={data.slice(0, 1)} columns={columns} label="Test records" />)
    expect(screen.getByText('Record 00')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })
  it('renders explicit empty results', () => {
    render(<DataTable data={[]} columns={columns} label="Test records" />)
    expect(screen.getByText('No results found')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })
})
