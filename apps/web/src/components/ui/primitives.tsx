import type { ReactNode, SelectHTMLAttributes } from 'react'
import { AlertCircle, ChevronDown, Search, X } from 'lucide-react'
import * as Dialog from '@radix-ui/react-dialog'
import { cn } from '../../utils/cn'
import type { Severity } from '../../types'
import { Button } from './button'

export function SeverityBadge({ severity }: { severity: Severity }) {
  return (
    <span className={cn('severity-badge', `severity-${severity.toLowerCase()}`)}>
      <span />
      {severity}
    </span>
  )
}
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        'status-badge',
        ['Active', 'Connected', 'Resolved', 'Contained'].includes(status)
          ? 'status-green'
          : status === 'Open'
            ? 'status-red'
            : 'status-muted',
      )}
    >
      <span />
      {status}
    </span>
  )
}
export function Select({
  label,
  children,
  className,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement> & { label: string }) {
  return (
    <div className={cn('select-wrap', className)}>
      <select aria-label={label} {...props}>
        {children}
      </select>
      <ChevronDown size={13} aria-hidden="true" />
    </div>
  )
}
export function SearchBar({
  value,
  onChange,
  placeholder = 'Search indicators, sources, countries...',
  label = 'Search intelligence',
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label?: string
}) {
  return (
    <div className="search-field">
      <Search size={16} />
      <input
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button aria-label="Clear search" onClick={() => onChange('')}>
          <X size={14} />
        </button>
      )}
    </div>
  )
}
export function SectionHeading({
  title,
  description,
  action,
  icon,
}: {
  title: string
  description?: string
  action?: ReactNode
  icon?: ReactNode
}) {
  return (
    <div className="section-heading">
      <div>
        <h2>
          {icon}
          {title}
        </h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  )
}
export function PageHeading({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string
  title: string
  description: string
  actions?: ReactNode
}) {
  return (
    <div className="page-heading">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>
          {title}
          <span className="demo-label">DEMO WORKSPACE</span>
        </h1>
        <p>{description}</p>
      </div>
      {actions && <div className="heading-actions">{actions}</div>}
    </div>
  )
}
export function EmptyState({
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  action,
}: {
  title?: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="empty-state">
      <Search size={27} />
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </div>
  )
}
export function QueryState({ error, loading }: { error: Error | null; loading: boolean }) {
  if (error)
    return (
      <div role="alert" className="notice danger">
        <AlertCircle size={16} />
        Unable to load demonstration data: {error.message}
      </div>
    )
  if (loading)
    return (
      <div role="status" className="loading-state">
        <span className="spinner" />
        Loading demonstration data...
      </div>
    )
  return null
}
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description: string
  children: ReactNode
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog-content">
          <div className="dialog-heading">
            <div>
              <Dialog.Title>{title}</Dialog.Title>
              <Dialog.Description>{description}</Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close dialog">
                <X size={18} />
              </Button>
            </Dialog.Close>
          </div>
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
