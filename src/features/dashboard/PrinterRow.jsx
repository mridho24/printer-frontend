import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../../components/ui/Feedback.jsx';
import { WARNA_META } from '../../lib/constants.js';

/**
 * Satu baris printer yang ringkas: tipe, merek dan jenis, bahan terbanyak,
 * serta jumlah permintaan.
 *
 * Rincian per kode atau warna tidak ditampilkan di sini. Untuk melihatnya,
 * pengguna membuka daftar permintaan lewat tautan di bawah baris, yang sudah
 * tersaring ke tipe printer ini.
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

      <Link
        to={`/permintaan?tipe=${encodeURIComponent(printer.tipe)}`}
        className="mt-2 inline-flex min-h-9 items-center gap-1.5 text-xs font-medium text-accent-strong transition-colors hover:text-accent max-lg:min-h-11"
      >
        Lihat semua permintaan tipe ini
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </li>
  );
}