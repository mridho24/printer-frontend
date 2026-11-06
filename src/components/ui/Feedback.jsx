import { AlertTriangle, Inbox, Loader2, RotateCw } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import Button from './Button.jsx';

const TONE_BADGE = {
  neutral: 'border-slate-200 bg-slate-100 text-slate-700',
  blue: 'border-blue-200 bg-blue-50 text-blue-700',
  green: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  amber: 'border-amber-200 bg-amber-50 text-amber-700',
  rose: 'border-rose-200 bg-rose-50 text-rose-700',
  violet: 'border-violet-200 bg-violet-50 text-violet-700',
};

export function Badge({ children, tone = 'neutral', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold',
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
      className={cn('h-5 w-5 animate-spin text-blue-600', className)}
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
    <div className={cn('flex flex-col items-center justify-center px-6 py-14 text-center', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center', className)}>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-50 text-rose-500">
        <AlertTriangle className="h-6 w-6" />
      </div>
      <h3 className="text-sm font-semibold text-slate-800">Gagal memuat data</h3>
      <p className="mt-1 max-w-md text-sm text-slate-500">
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
    <div className="animate-pulse divide-y divide-slate-100">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex items-center gap-4 px-4 py-4">
          {Array.from({ length: columns }).map((__, colIndex) => (
            <div
              key={colIndex}
              className={cn(
                'h-3 rounded bg-slate-200',
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
    info: 'border-blue-200 bg-blue-50 text-blue-800',
    warning: 'border-amber-200 bg-amber-50 text-amber-800',
    danger: 'border-rose-200 bg-rose-50 text-rose-800',
    success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  };

  return (
    <div className={cn('rounded-xl border px-4 py-3 text-sm', gaya[tone], className)}>
      {title && <p className="font-semibold">{title}</p>}
      <div className={cn(title && 'mt-0.5')}>{children}</div>
    </div>
  );
}
