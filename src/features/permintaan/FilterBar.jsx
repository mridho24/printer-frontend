import { RotateCcw, Search } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { InlineAlert } from '../../components/ui/Feedback.jsx';

export default function FilterBar({
  dari,
  sampai,
  q,
  onChange,
  onReset,
  invalidRange,
  className,
}) {
  return (
    <div className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.6fr)_auto]">
        <div className="space-y-1.5">
          <label htmlFor="filter-dari" className="block text-sm font-medium text-slate-700">
            Dari tanggal
          </label>
          <input
            id="filter-dari"
            type="date"
            value={dari}
            max={sampai || undefined}
            onChange={(event) => onChange('dari', event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-sampai" className="block text-sm font-medium text-slate-700">
            Sampai tanggal
          </label>
          <input
            id="filter-sampai"
            type="date"
            value={sampai}
            min={dari || undefined}
            onChange={(event) => onChange('sampai', event.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="filter-q" className="block text-sm font-medium text-slate-700">
            Pencarian
          </label>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="filter-q"
              type="search"
              value={q}
              onChange={(event) => onChange('q', event.target.value)}
              placeholder="Cari peminta, ruang, merek, tipe, atau bahan..."
              className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-9 pr-3 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
            />
          </div>
        </div>

        <div className="flex items-end">
          <Button variant="secondary" icon={RotateCcw} onClick={onReset} className="w-full lg:w-auto">
            Reset
          </Button>
        </div>
      </div>

      {invalidRange && (
        <InlineAlert tone="warning" className="mt-3">
          Tanggal &quot;dari&quot; tidak boleh setelah tanggal &quot;sampai&quot;.
        </InlineAlert>
      )}
    </div>
  );
}
