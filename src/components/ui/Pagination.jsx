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
        'inline-flex h-8 w-8 items-center justify-center rounded-lg border text-slate-600 transition',
        disabled
          ? 'cursor-not-allowed border-slate-200 bg-slate-50 text-slate-300'
          : 'border-slate-300 bg-white hover:bg-slate-50 hover:text-slate-900',
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
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-4 py-3">
      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
        <span>
          Menampilkan <span className="font-semibold text-slate-700">{awal}</span>–
          <span className="font-semibold text-slate-700">{akhir}</span> dari{' '}
          <span className="font-semibold text-slate-700">{total}</span> data
        </span>
        {onLimitChange && (
          <label className="flex items-center gap-1.5">
            <span className="text-slate-400">|</span>
            <span>Baris</span>
            <select
              value={limit}
              onChange={(event) => onLimitChange(Number(event.target.value))}
              className="h-7 rounded-md border border-slate-300 bg-white px-1.5 text-xs text-slate-700 focus:border-blue-500 focus:outline-none"
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
        <span className="text-xs text-slate-500">
          Halaman <span className="font-semibold text-slate-700">{page}</span> dari{' '}
          <span className="font-semibold text-slate-700">{halamanAman}</span>
        </span>
        <TombolHalaman
          label="Halaman sebelumnya"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </TombolHalaman>
        <TombolHalaman
          label="Halaman berikutnya"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= halamanAman || total === 0}
        >
          <ChevronRight className="h-4 w-4" />
        </TombolHalaman>
      </div>
    </div>
  );
}
