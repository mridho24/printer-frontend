import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { ToastContext } from './toastContext.js';

const GAYA = {
  success: {
    icon: CheckCircle2,
    iconClass: 'text-accent',
    bar: 'bg-accent',
  },
  error: {
    icon: AlertCircle,
    iconClass: 'text-danger',
    bar: 'bg-danger',
  },
  info: {
    icon: Info,
    iconClass: 'text-muted',
    bar: 'bg-line-strong',
  },
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((daftar) => daftar.filter((toast) => toast.id !== id));
  }, []);

  const push = useCallback(
    (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      setToasts((daftar) => [...daftar, { id, message, type }]);
      setTimeout(() => remove(id), 4500);
    },
    [remove],
  );

  const value = useMemo(
    () => ({
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
      info: (message) => push(message, 'info'),
    }),
    [push],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed inset-x-0 top-4 z-[70] flex flex-col items-end gap-2 px-4 sm:right-4 sm:left-auto sm:px-0"
        aria-live="polite"
      >
        {toasts.map((toast) => {
          const gaya = GAYA[toast.type] || GAYA.info;
          const Icon = gaya.icon;
          return (
            <div
              key={toast.id}
              className="animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-md border border-line bg-surface shadow-[0_16px_40px_-24px_rgba(27,26,23,0.45)] sm:w-96"
              role="status"
            >
              <div className={cn('w-[3px] shrink-0 self-stretch', gaya.bar)} aria-hidden="true" />
              <Icon
                className={cn('mt-3.5 h-4.5 w-4.5 shrink-0', gaya.iconClass)}
                aria-hidden="true"
              />
              <p className="flex-1 py-3 text-sm leading-6 text-ink">{toast.message}</p>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                className="mt-1.5 mr-1.5 flex h-9 w-9 items-center justify-center rounded-md text-faint transition-colors hover:bg-paper hover:text-ink max-lg:h-11 max-lg:w-11"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
