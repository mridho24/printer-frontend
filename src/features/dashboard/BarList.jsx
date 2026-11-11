import { Badge } from '../../components/ui/Feedback.jsx';
import { cn } from '../../lib/cn.js';

/**
 * Daftar batang horizontal untuk membandingkan jumlah.
 *
 * Batang memakai satu aksen yang sama supaya panjangnya yang dibandingkan,
 * bukan warna kategori. Nilai teratas ditandai kata "Terbanyak" agar tidak
 * bergantung pada warna saja.
 */
export default function BarList({
  items = [],
  total = 0,
  kosong = 'Belum ada data',
  tandaiTeratas = false,
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
    <ul className={cn('space-y-3', className)}>
      {items.map((item) => {
        const persen = total > 0 ? Math.round((item.total / total) * 1000) / 10 : null;
        const teratas = bolehTandai && item.total === puncak;

        return (
          <li key={item.nama}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="flex min-w-0 flex-wrap items-baseline gap-x-2">
                <span className="truncate text-xs text-ink">{item.nama}</span>
                {teratas && <Badge tone="accent">Terbanyak</Badge>}
              </span>
              <span className="shrink-0 font-mono text-xs tabular-nums text-faint">
                <span className="font-medium text-ink">{item.total}</span>
                {persen !== null && <span className="ml-1.5">{persen}%</span>}
              </span>
            </div>
            <div className="mt-1.5 h-1.5 w-full bg-paper" aria-hidden="true">
              <div
                className={cn('h-full', teratas ? 'bg-accent-strong' : 'bg-accent')}
                style={{
                  width: item.total > 0 ? `${Math.max((item.total / maks) * 100, 2)}%` : '0%',
                }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
