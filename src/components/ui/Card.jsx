import { cn } from '../../lib/cn.js';

export default function Card({ children, className }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-900/[0.03]',
        className,
      )}
    >
      {children}
    </div>
  );
}
