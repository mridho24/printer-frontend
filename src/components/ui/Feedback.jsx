import { AlertTriangle, Inbox, Loader2, RotateCw } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import Button from './Button.jsx';

const TONE_BADGE = {
  neutral: 'border-line bg-paper text-muted',
  accent: 'border-accent/25 bg-accent-soft text-accent-strong',
  warn: 'border-warn-line bg-warn-soft text-warn',
  danger: 'border-danger-line bg-danger-soft text-danger',
};

/**
 * Label status berbentuk persegi, bukan kapsul: ini data, bukan tombol (R-09, R-11).
 */
export function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm border px-1.5 py-0.5 text-xs font-medium',
        TONE_BADGE[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Spinner({ className }) {
  return (
    <Loader2
      className={cn('h-5 w-5 animate-spin text-accent', className)}
      aria-label="Memuat"
    />
  );
}

export function EmptyState({
  title = 'Belum ada data',
  description,
  icon: Icon = Inbox,
  action,
  className,
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-14 text-center',
        className,
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-paper text-muted">
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, className }) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center px-6 py-12 text-center',
        className,
      )}
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-md border border-danger-line bg-danger-soft text-danger">
        <AlertTriangle className="h-5 w-5" aria-hidden="true" />
      </div>
      <h3 className="text-sm font-semibold text-ink">Gagal memuat data</h3>
      <p className="mt-1 max-w-md text-sm text-muted">
        {error?.message || 'Terjadi kesalahan yang tidak terduga.'}
      </p>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RotateCw} onClick={onRetry} className="mt-4">
          Coba lagi
        </Button>
      )}
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div
      className="animate-pulse divide-y divide-line"
      aria-hidden="true"
      aria-label="Memuat data"
      role="status"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-4">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'h-3 bg-line',
                colIndex === 0 ? 'w-24' : colIndex === columns - 1 ? 'ml-auto w-16' : 'w-full',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function InlineAlert({ tone = 'info', title, children, className }) {
  const gaya = {
    info: 'border-line bg-paper text-ink',
    warning: 'border-warn-line bg-warn-soft text-warn',
    danger: 'border-danger-line bg-danger-soft text-danger',
    success: 'border-accent/25 bg-accent-soft text-accent-strong',
  };

  return (
    <div className={cn('rounded-md border px-4 py-3 text-sm', gaya[tone], className)}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={cn(title && 'mt-0.5')}>{children}</div>
    </div>
  );
}
