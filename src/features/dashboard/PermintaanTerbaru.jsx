import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { WARNA_META } from '../../lib/constants.js';
import { formatTanggal, pecahBahan } from '../../lib/format.js';

function labelBahan(item) {
  if (!item.pakai_warna) return item.bahan || '-';
  return pecahBahan(item.bahan)
    .map((warna) => WARNA_META[warna]?.label ?? warna)
    .join(', ');
}

/**
 * Lima catatan terakhir pada periode yang dipilih. Angka pada strip ringkasan
 * hanya berguna jika ada contoh catatan yang bisa ditelusuri; "Lihat semua"
 * membawa periode yang sama ke halaman permintaan lewat query string.
 */
export default function PermintaanTerbaru({ items = [], tautan }) {
  if (items.length === 0) return null;

  return (
    <Card className="mt-4">
      <SectionHeader
        title="Permintaan terbaru"
        description="Lima catatan terakhir pada periode yang dipilih."
        actions={
          <Link
            to={tautan}
            className="inline-flex h-9 items-center gap-1.5 rounded-md px-3 text-xs font-medium text-muted transition-colors hover:bg-paper hover:text-ink max-lg:h-11"
          >
            Lihat semua
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        }
      />

      <ul className="divide-y divide-line">
        {items.map((item) => (
          <li
            key={item.id}
            className="grid gap-1 px-4 py-3 sm:grid-cols-[6.5rem_minmax(0,1fr)_auto] sm:items-baseline sm:gap-3"
          >
            <span className="font-mono text-xs tabular-nums text-muted">
              {formatTanggal(item.tanggal)}
            </span>

            <div className="min-w-0">
              <p className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-mono text-sm font-semibold text-ink">{item.tipe}</span>
                <span className="text-xs text-muted">
                  {item.merek} &middot; {item.jenis_nama ?? 'Jenis tidak diketahui'}
                </span>
                {(item.printer_dihapus || item.jenis_dihapus) && (
                  <span className="text-xs text-faint">(arsip)</span>
                )}
              </p>
              <p className="mt-0.5 text-xs text-ink">{labelBahan(item)}</p>
            </div>

            <div className="min-w-0 text-xs sm:text-right">
              <p className="text-ink">{item.nama_peminta}</p>
              <p className="mt-0.5 text-faint">{item.nama_ruang}</p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  );
}
