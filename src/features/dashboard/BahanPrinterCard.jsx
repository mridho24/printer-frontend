import BarList from './BarList.jsx';
import Card from '../../components/ui/Card.jsx';
import { Badge } from '../../components/ui/Feedback.jsx';
import { WARNA_META } from '../../lib/constants.js';

const MAKS_BAHAN = 5;

/**
 * Ringkasan satu tipe printer: berapa kali diminta dan bahan apa yang paling
 * sering. Untuk printer non-warna, bahan adalah kode snapshot saat permintaan
 * dibuat. Untuk printer warna, bahan adalah warna yang dipilih.
 */
export default function BahanPrinterCard({ printer }) {
  const tampil = printer.bahan.slice(0, MAKS_BAHAN).map((item) => ({
    nama: printer.pakai_warna ? (WARNA_META[item.nama]?.label ?? item.nama) : item.nama,
    total: item.total,
  }));
  const sisa = printer.bahan.length - tampil.length;
  const judulBahan = printer.pakai_warna
    ? 'Warna paling sering diminta'
    : `${printer.label_kode || 'Kode bahan'} paling sering diminta`;

  return (
    <Card>
      <div className="border-b border-line px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-mono text-sm font-semibold text-ink">{printer.tipe}</h3>
            <p className="mt-0.5 truncate text-xs text-muted">
              {printer.merek} &middot; {printer.jenis_nama ?? 'Jenis tidak diketahui'}
            </p>
          </div>
          <div className="shrink-0 text-right">
            <p className="font-mono text-sm font-semibold tabular-nums text-ink">{printer.total}</p>
            <p className="text-[11px] text-faint">permintaan</p>
          </div>
        </div>

        {(printer.printer_dihapus || printer.jenis_dihapus) && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {printer.printer_dihapus && <Badge tone="warn">Printer diarsipkan</Badge>}
            {printer.jenis_dihapus && <Badge tone="warn">Jenis diarsipkan</Badge>}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="mb-2.5 text-[11px] font-medium text-muted">{judulBahan}</p>
        <BarList
          items={tampil}
          total={printer.total}
          tandaiTeratas
          kosong="Belum ada bahan tercatat."
        />
        {sisa > 0 && (
          <p className="mt-2.5 text-[11px] text-faint">
            +{sisa} {printer.pakai_warna ? 'warna' : 'kode'} lain
          </p>
        )}
      </div>
    </Card>
  );
}
