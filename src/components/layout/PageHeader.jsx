import { cn } from '../../lib/cn.js';

/**
 * Kepala halaman dengan garis bawah tipis: memisahkan judul dari isi tanpa
 * perlu kartu atau bayangan.
 */
export default function PageHeader({ kicker, title, description, actions, className }) {
  return (
    <div className={cn('mb-5 border-b border-line pb-4', className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          {kicker && (
            <p className="mb-1 font-mono text-xs font-medium text-accent">{kicker}</p>
          )}
          <h1 className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]">
            {title}
          </h1>
          {description && <p className="mt-1 max-w-2xl text-sm text-muted">{description}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}
