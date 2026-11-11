import BarList from './BarList.jsx';
import Card from '../../components/ui/Card.jsx';
import { WARNA_META } from '../../lib/constants.js';

/**
 * Agregat warna untuk satu jenis warna (misalnya seluruh printer Inkjet).
 * Angka tiap warna adalah jumlah permintaan yang memuat warna tersebut,
 * sehingga total persentase bisa melewati 100%.
 */
export default function WarnaCard({ item }) {
  const items = item.warna.map((warna) => ({
    nama: WARNA_META[warna.nama]?.label ?? warna.nama,
    total: warna.total,
  }));

  return (
    <Card>
      <div className="border-b border-line px-4 py-3">
        <h3 className="text-sm font-semibold text-ink">Warna pada {item.nama}</h3>
        <p className="mt-1 text-xs text-muted">
          {item.total} permintaan warna. Satu permintaan bisa memuat lebih dari satu warna.
        </p>
      </div>
      <div className="p-4">
        <BarList items={items} total={item.total} tandaiTeratas />
      </div>
    </Card>
  );
}
