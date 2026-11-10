import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const VARIAN = {
  primary: 'bg-accent text-surface hover:bg-accent-strong disabled:bg-accent/40',
  secondary:
    'border border-line-strong bg-surface text-ink hover:bg-paper disabled:text-faint',
  danger: 'bg-danger text-surface hover:bg-danger-strong disabled:bg-danger/40',
  dangerGhost: 'text-danger hover:bg-danger-soft hover:text-danger-strong disabled:text-faint',
  ghost: 'text-muted hover:bg-paper hover:text-ink disabled:text-faint',
};

const UKURAN = {
  sm: 'h-9 gap-1.5 px-3 text-xs max-lg:h-11',
  md: 'h-10 gap-2 px-4 text-sm max-lg:h-11',
  icon: 'h-10 w-10 justify-center p-0 max-lg:h-11 max-lg:w-11',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon: Icon,
  className,
  disabled,
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-md font-medium transition-colors disabled:cursor-not-allowed',
        VARIAN[variant],
        UKURAN[size],
        className,
      )}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        Icon && <Icon className="h-4 w-4" aria-hidden="true" />
      )}
      {children}
    </button>
  );
}
