import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import RankingTable from './RankingTable.jsx';
import { Badge } from '../../components/ui/Feedback.jsx';
import { WARNA_META } from '../../lib/constants.js';

const MAKS_BAHAN = 5;

/**
 * Satu baris printer dengan rincian bahan yang selalu terlihat.
 *
 * Rincian tidak disembunyikan di balik akordeon: panel ini dibuka untuk melihat
 * bahan, dan membuka tiap baris satu per satu hanya menambah langkah. Paginasi
 * menjaga daftar tetap pendek tanpa menyembunyikan isi baris.
 */
export default function PrinterRow({ printer }) {
  const puncak = printer.bahan[0];
  const judulBahan = printer.pakai_warna
    ? 'Warna terbanyak'
    : `${printer.label_kode || 'Kode bahan'} terbanyak`;
  const namaPuncak = puncak
    ? printer.pakai_warna
      ? (WARNA_META[puncak.nama]?.label ?? puncak.nama)
      : puncak.nama
    : null;
  const ringkasBahan = puncak
    ? `${judulBahan}: ${namaPuncak} (${puncak.total})`
    : 'Belum ada bahan tercatat.';

  const tampil = printer.bahan.slice(0, MAKS_BAHAN).map((item) => ({
    nama: printer.pakai_warna ? (WARNA_META[item.nama]?.label ?? item.nama) : item.nama,
    total: item.total,
  }));
  const sisa = printer.bahan.length - tampil.length;

  return (
    <li className="px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-mono text-sm font-semibold text-ink">
              {printer.tipe}
            </span>
            {printer.printer_dihapus && <Badge tone="warn">Printer diarsipkan</Badge>}
            {printer.jenis_dihapus && <Badge tone="warn">Jenis diarsipkan</Badge>}
          </div>
          <p className="mt-0.5 truncate text-xs text-muted">
            {printer.merek} &middot; {printer.jenis_nama ?? 'Jenis tidak diketahui'}
          </p>
          <p className="mt-1 text-xs text-ink">{ringkasBahan}</p>
        </div>

        <div className="shrink-0 self-center">
          <Badge tone="neutral">
            <span className="font-mono font-semibold tabular-nums">{printer.total}</span>
            <span className="ml-1 font-normal">permintaan</span>
          </Badge>
        </div>
      </div>

      <div className="mt-3 border-t border-line pt-3">
        <p className="mb-2.5 text-xs font-medium text-muted">
          {printer.pakai_warna
            ? `${MAKS_BAHAN} warna paling sering diminta`
            : `${MAKS_BAHAN} ${printer.label_kode?.toLowerCase() || 'kode'} paling sering diminta`}
        </p>
        <RankingTable
          items={tampil}
          labelHeader={printer.pakai_warna ? 'Warna' : printer.label_kode || 'Kode bahan'}
          satuanHeader="Permintaan"
          bernomor
          tandaiTeratas
          padat
          kosong="Belum ada bahan tercatat."
        />
        {sisa > 0 && (
          <p className="mt-2.5 text-xs text-faint">
            +{sisa} {printer.pakai_warna ? 'warna' : 'kode'} lain
          </p>
        )}

        <Link
          to={`/permintaan?tipe=${encodeURIComponent(printer.tipe)}`}
          className="mt-3 inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-accent-strong transition-colors hover:text-accent max-lg:min-h-11"
        >
          Lihat semua permintaan tipe ini
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </Link>
      </div>
    </li>
  );
}
