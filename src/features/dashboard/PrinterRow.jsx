import { ChevronDown } from 'lucide-react';
import RankingTable from './RankingTable.jsx';
import { Badge } from '../../components/ui/Feedback.jsx';
import { WARNA_META } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

const MAKS_BAHAN = 5;

/**
 * Satu baris printer yang bisa dibuka.
 *
 * Baris tertutup sudah menjawab bahan apa yang paling sering diminta untuk
 * tipe tersebut, jadi membuka rincian hanya perlu saat ingin melihat sisanya.
 * Satu baris terbuka pada satu waktu supaya daftar tetap pendek.
 */
export default function PrinterRow({ printer, terbuka, onToggle }) {
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
  const rincianId = `rincian-printer-${encodeURIComponent(printer.tipe)}`;

  return (
    <li>
      <button
        type="button"
        aria-expanded={terbuka}
        aria-controls={rincianId}
        onClick={onToggle}
        className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-paper active:bg-line/40"
      >
        <ChevronDown
          className={cn(
            'mt-0.5 h-4 w-4 shrink-0 text-faint transition-transform',
            terbuka && 'rotate-180',
          )}
          aria-hidden="true"
        />

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="truncate font-mono text-sm font-semibold text-ink">
              {printer.tipe}
            </span>
            {printer.printer_dihapus && <Badge tone="warn">Printer diarsipkan</Badge>}
            {printer.jenis_dihapus && <Badge tone="warn">Jenis diarsipkan</Badge>}
          </span>
          <span className="mt-0.5 block truncate text-xs text-muted">
            {printer.merek} &middot; {printer.jenis_nama ?? 'Jenis tidak diketahui'}
          </span>
          <span className="mt-1 block text-xs text-ink">{ringkasBahan}</span>
        </span>

        <span className="shrink-0 self-center">
          <Badge tone="neutral">
            <span className="font-mono font-semibold tabular-nums">{printer.total}</span>
            <span className="ml-1 font-normal">permintaan</span>
          </Badge>
        </span>
      </button>

      {terbuka && (
        <div
          id={rincianId}
          role="region"
          aria-label={`Rincian bahan ${printer.tipe}`}
          className="border-t border-line bg-paper px-4 py-3.5"
        >
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
        </div>
      )}
    </li>
  );
}
