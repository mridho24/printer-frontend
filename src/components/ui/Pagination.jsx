import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/cn.js';

function TombolHalaman({ children, onClick, disabled, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={cn(
        'inline-flex h-9 w-9 items-center justify-center rounded-md border transition-colors max-lg:h-11 max-lg:w-11',
        disabled
          ? 'border-line bg-paper text-faint'
          : 'border-line-strong bg-surface text-ink hover:bg-paper',
      )}
    >
      {children}
    </button>
  );
}

export default function Pagination({
  page = 1,
  totalPage = 0,
  total = 0,
  limit = 10,
  onPageChange,
  onLimitChange,
}) {
  const halamanAman = Math.max(1, totalPage);
  const awal = total === 0 ? 0 : (page - 1) * limit + 1;
  const akhir = Math.min(page * limit, total);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3 text-xs text-muted">
      <div className="flex flex-wrap items-center gap-3">
        <span className="tabular-nums">
          Menampilkan <span className="font-mono font-medium text-ink">{awal}</span> sampai{' '}
          <span className="font-mono font-medium text-ink">{akhir}</span> dari{' '}
          <span className="font-mono font-medium text-ink">{total}</span> catatan
        </span>
        {onLimitChange && (
          <label className="flex items-center gap-1.5 border-l border-line pl-3">
            <span>Baris</span>
            <select
              value={limit}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="h-9 rounded-sm border border-line-strong bg-surface px-1.5 font-mono text-xs text-ink max-lg:h-11"
            >
              {[10, 25, 50].map((nilai) => (
                <option key={nilai} value={nilai}>
                  {nilai}
                </option>
              ))}
            </select>
          </label>
        )}
      </div>

      <div className="flex items-center gap-2">
        <span className="tabular-nums">
          Halaman <span className="font-mono font-medium text-ink">{page}</span> dari{' '}
          <span className="font-mono font-medium text-ink">{halamanAman}</span>
        </span>
        <TombolHalaman
          label="Halaman sebelumnya"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
        </TombolHalaman>
        <TombolHalaman
          label="Halaman berikutnya"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= halamanAman || total === 0}
        >
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </TombolHalaman>
      </div>
    </div>
  );
}
