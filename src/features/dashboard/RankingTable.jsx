import { Badge } from '../../components/ui/Feedback.jsx';
import { cn } from '../../lib/cn.js';

/**
 * Tabel peringkat untuk membandingkan jumlah.
 *
 * Angka ditulis sebagai kolom tersendiri supaya langsung terbaca sebagai data,
 * bukan panjang batang yang harus ditafsirkan. Tabel juga memberi judul kolom,
 * sehingga pembaca tahu angka itu menghitung apa.
 */
export default function RankingTable({
  items = [],
  labelHeader = 'Nama',
  satuanHeader = 'Jumlah',
  kosong = 'Belum ada data',
  bernomor = false,
  tandaiTeratas = false,
  padat = false,
  className,
}) {
  if (items.length === 0) {
    return <p className="text-xs text-muted">{kosong}</p>;
  }

  const puncak = Math.max(...items.map((item) => item.total), 0);
  const jumlahPuncak = items.filter((item) => item.total === puncak).length;
  // Tanda "Terbanyak" hanya bermakna jika ada pembanding dan pemenangnya
  // tunggal. Saat seri, tidak ada satu pun yang menonjol.
  const bolehTandai = tandaiTeratas && items.length > 1 && puncak > 0 && jumlahPuncak === 1;
  const sel = padat ? 'py-1.5' : 'py-2.5';

  return (
    <table className={cn('w-full text-[13px]', className)}>
      <thead>
        <tr className="border-b border-line text-left text-[11px] font-medium text-muted">
          {bernomor && (
            <th scope="col" className={cn('w-8 pr-2 font-medium', sel)}>
              No
            </th>
          )}
          <th scope="col" className={cn('pr-3 font-medium', sel)}>
            {labelHeader}
          </th>
          <th scope="col" className={cn('pl-3 text-right font-medium', sel)}>
            {satuanHeader}
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-line">
        {items.map((item, indeks) => {
          const teratas = bolehTandai && item.total === puncak;

          return (
            <tr key={`${item.nama}-${indeks}`}>
              {bernomor && (
                <td
                  className={cn(
                    'pr-2 align-top font-mono text-[11px] tabular-nums text-faint',
                    sel,
                  )}
                >
                  {String(indeks + 1).padStart(2, '0')}
                </td>
              )}
              <td className={cn('break-words pr-3 align-top', sel)}>
                <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="text-ink">{item.nama}</span>
                  {teratas && <Badge tone="accent">Terbanyak</Badge>}
                </span>
              </td>
              <td
                className={cn(
                  'pl-3 text-right align-top font-mono text-sm font-semibold tabular-nums text-ink',
                  sel,
                )}
              >
                {item.total}
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
