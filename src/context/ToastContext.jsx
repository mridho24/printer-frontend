import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { cn } from '../lib/cn.js';
import { ToastContext } from './toastContext.js';

const GAYA = {
  success: {
    icon: CheckCircle2,
    panel: 'border-emerald-200 bg-white',
    iconClass: 'text-emerald-600',
    bar: 'bg-emerald-500',
  },
  error: {
    icon: AlertCircle,
    panel: 'border-rose-200 bg-white',
    iconClass: 'text-rose-600',
    bar: 'bg-rose-500',
  },
  info: {
    icon: Info,
    panel: 'border-blue-200 bg-white',
    iconClass: 'text-blue-600',
    bar: 'bg-blue-500',
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
              className={cn(
                'animate-toast-in pointer-events-auto flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border shadow-lg shadow-slate-900/5 sm:w-96',
                gaya.panel,
              )}
              role="status"
            >
              <div className={cn('h-full w-1 shrink-0 self-stretch', gaya.bar)} />
              <Icon className={cn('mt-3.5 h-5 w-5 shrink-0', gaya.iconClass)} aria-hidden="true" />
              <p className="flex-1 py-3 text-sm leading-6 text-slate-700">{toast.message}</p>
              <button
                type="button"
                onClick={() => remove(toast.id)}
                className="mr-1 mt-2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="Tutup notifikasi"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
