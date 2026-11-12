import { RotateCcw, Search, X } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { InlineAlert } from '../../components/ui/Feedback.jsx';

const GAYA_INPUT =
  'h-10 w-full rounded-md border border-line-strong bg-surface px-3 text-sm text-ink placeholder:text-faint';

export default function FilterBar({
  dari,
  sampai,
  q,
  chips = [],
  onChange,
  onHapusChip,
  onReset,
  invalidRange,
  className,
}) {
  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(2,minmax(0,1fr))_minmax(0,1.6fr)_auto]">
        <div className="space-y-1.5">
          <label htmlFor="filter-dari" className="block text-xs font-medium text-muted">
            Dari tanggal
          </label>
          <input
            id="filter-dari"
            type="date"
            value={dari}
            max={sampai || undefined}
            onChange={(event) => onChange('dari', event.target.value)}
            className={GAYA_INPUT}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-sampai" className="block text-xs font-medium text-muted">
            Sampai tanggal
          </label>
          <input
            id="filter-sampai"
            type="date"
            value={sampai}
            min={dari || undefined}
            onChange={(event) => onChange('sampai', event.target.value)}
            className={GAYA_INPUT}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-q" className="block text-xs font-medium text-muted">
            Pencarian
          </label>
          <div className="relative">
            <Search
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-faint"
              aria-hidden="true"
            />
            <input
              id="filter-q"
              type="search"
              value={q}
              onChange={(event) => onChange('q', event.target.value)}
              placeholder="Cari peminta, ruang, merek, tipe, atau bahan"
              className={`${GAYA_INPUT} pl-9`}
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button variant="secondary" icon={RotateCcw} onClick={onReset} className="w-full lg:w-auto">
            Reset
          </Button>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-xs text-muted">Filter aktif:</span>
          {chips.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => onHapusChip(item.key)}
              aria-label={`Hapus filter ${item.label}`}
              className="inline-flex min-h-8 items-center gap-1.5 rounded-sm border border-line-strong bg-paper px-2 text-xs font-medium text-ink transition-colors hover:border-accent hover:text-accent-strong max-lg:min-h-11"
            >
              {item.label}
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          ))}
        </div>
      )}

      {invalidRange && (
        <InlineAlert tone="warning" className="mt-3">
          Tanggal &quot;dari&quot; tidak boleh setelah tanggal &quot;sampai&quot;.
        </InlineAlert>
      )}
    </div>
  );
}
