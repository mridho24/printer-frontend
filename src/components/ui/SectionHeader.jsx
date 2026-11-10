import { cn } from '../../lib/cn.js';

/**
 * Kepala bagian bergaya entri buku catatan: nomor mono kecil, judul, lalu
 * keterangan. Nomornya motif identitas aplikasi, bukan hiasan.
 */
export default function SectionHeader({ index, title, description, actions, className }) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-start justify-between gap-3 border-b border-line px-4 py-3',
        className,
      )}
    >
      <div className="min-w-0">
        <div className="flex items-baseline gap-2">
          {index && (
            <span className="font-mono text-[11px] font-medium tabular-nums text-accent">
              {index}
            </span>
          )}
          <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        </div>
        {description && <p className="mt-1 text-xs text-muted">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
