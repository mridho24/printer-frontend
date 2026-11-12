import { Link } from 'react-router-dom';
import RankingTable from './RankingTable.jsx';
import { WARNA_META } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

const LEBAR_MIN = 1.5;

const BARIS =
  'grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-sm px-1 py-1';

/**
 * Grafik batang horizontal dengan angka di ujung batang.
 *
 * Angka ditulis sebagai kolom kanan, bukan di dalam batang, supaya tetap
 * terbaca saat batangnya pendek dan tidak pernah menimpa label. Tabel peringkat
 * tersedia di balik tombol "Lihat sebagai tabel" sebagai cadangan: pembaca
 * layar, pencetakan, atau siapa pun yang butuh angka persis tidak bergantung
 * pada panjang batang.
 *
 * Warna batang memakai satu aksen. Pengecualiannya grafik warna, yang memakai
 * warna asli karena warna itu sendiri adalah data yang dibaca.
 *
 * Item yang punya `href` menjadi tautan drill-down ke halaman permintaan dengan
 * filter di query string, sehingga hasil yang dibuka bisa dibagikan dan dimuat
 * ulang.
 */
export default function BarChart({
  items = [],
  labelHeader = 'Nama',
  satuanHeader = 'Jumlah',
  bernomor = false,
  tandaiTeratas = false,
  warnaAsli = false,
  kosong = 'Belum ada data',
  labelTabel = 'Lihat sebagai tabel',
}) {
  if (items.length === 0) {
    return <p className="px-4 py-8 text-xs text-muted">{kosong}</p>;
  }

  const puncak = Math.max(...items.map((item) => item.total), 0);

  function isiBaris(item, indeks) {
    const persen = puncak > 0 ? (item.total / puncak) * 100 : 0;
    const lebar = item.total > 0 ? Math.max(persen, LEBAR_MIN) : 0;
    const isi = warnaAsli ? (WARNA_META[item.warna]?.swatch ?? 'bg-accent') : 'bg-accent';

    return (
      <>
        <span className="min-w-0 truncate text-[13px] text-ink" title={item.nama}>
          {bernomor && (
            <span className="mr-1.5 font-mono text-xs tabular-nums text-faint">
              {String(indeks + 1).padStart(2, '0')}
            </span>
          )}
          {item.nama}
          {item.arsip && <span className="ml-1.5 text-xs text-faint">(arsip)</span>}
        </span>

        <span className="row-span-2 self-center font-mono text-[13px] font-semibold tabular-nums text-ink">
          {item.total}
        </span>

        <span className="h-2 overflow-hidden rounded-sm bg-line/60" aria-hidden="true">
          <span
            data-bar
            className={cn('block h-full rounded-sm', isi)}
            style={{ width: `${lebar}%` }}
          />
        </span>
      </>
    );
  }

  return (
    <div>
      <div className="space-y-1.5" data-chart>
        {items.map((item, indeks) =>
          item.href ? (
            <Link
              key={`${item.nama}-${indeks}`}
              to={item.href}
              className={cn(BARIS, 'transition-colors hover:bg-paper')}
            >
              {isiBaris(item, indeks)}
            </Link>
          ) : (
            <div key={`${item.nama}-${indeks}`} className={BARIS}>
              {isiBaris(item, indeks)}
            </div>
          ),
        )}
      </div>

      <details className="mt-4 border-t border-line pt-1">
        <summary className="inline-flex min-h-9 items-center text-xs font-medium text-accent-strong hover:text-accent max-lg:min-h-11">
          {labelTabel}
        </summary>
        <div className="mt-3">
          <RankingTable
            items={items}
            labelHeader={labelHeader}
            satuanHeader={satuanHeader}
            kosong={kosong}
            bernomor={bernomor}
            tandaiTeratas={tandaiTeratas}
            padat
          />
        </div>
      </details>
    </div>
  );
}
