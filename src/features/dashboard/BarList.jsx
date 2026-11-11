import { Badge } from '../../components/ui/Feedback.jsx';
import { cn } from '../../lib/cn.js';

/**
 * Daftar peringkat ringkas untuk membandingkan jumlah.
 *
 * Batang sengaja dibatasi 180px supaya tidak membentang dari ujung ke ujung
 * kartu; yang dibandingkan tetap panjangnya, bukan lebar kartu. Angka jumlah
 * ditulis utuh sebagai dasar keputusan, tanpa persentase.
 *
 * Nomor urut hanya dipakai pada daftar peringkat. Grafik bulan kronologis
 * berjalan menurut waktu, jadi urutannya tidak diberi nomor.
 */
export default function BarList({
  items = [],
  kosong = 'Belum ada data',
  tandaiTeratas = false,
  bernomor = false,
  className,
}) {
  if (items.length === 0) {
    return <p className="text-xs text-muted">{kosong}</p>;
  }

  const maks = Math.max(...items.map((item) => item.total), 1);
  const puncak = Math.max(...items.map((item) => item.total), 0);
  // Tanda "Terbanyak" hanya bermakna jika ada pembanding dan pemenangnya
  // tunggal. Saat seri, semua nilai sama sehingga tidak ada yang menonjol.
  const jumlahPuncak = items.filter((item) => item.total === puncak).length;
  const bolehTandai = tandaiTeratas && items.length > 1 && puncak > 0 && jumlahPuncak === 1;

  return (
    <ul className={cn('space-y-3.5', className)}>
      {items.map((item, indeks) => {
        const teratas = bolehTandai && item.total === puncak;

        return (
          <li key={`${item.nama}-${indeks}`} className="flex items-start gap-3">
            {bernomor && (
              <span
                aria-hidden="true"
                className="w-5 shrink-0 pt-0.5 text-right font-mono text-[11px] tabular-nums text-faint"
              >
                {String(indeks + 1).padStart(2, '0')}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-3">
                <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                  <span className="truncate text-xs text-ink">{item.nama}</span>
                  {teratas && <Badge tone="accent">Terbanyak</Badge>}
                </span>
                <span className="shrink-0 font-mono text-sm font-semibold tabular-nums text-ink">
                  {item.total}
                </span>
              </div>

              <div className="mt-1.5 h-1.5 max-w-[180px] bg-paper" aria-hidden="true">
                <div
                  className={cn('h-full', teratas ? 'bg-accent-strong' : 'bg-accent')}
                  style={{
                    width: item.total > 0 ? `${Math.max((item.total / maks) * 100, 2)}%` : '0%',
                  }}
                />
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
