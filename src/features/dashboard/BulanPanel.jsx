import { useState } from 'react';
import BarList from './BarList.jsx';
import BulanChart from './BulanChart.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { formatBulan } from '../../lib/format.js';

const MAKS_AWAL = 6;

/**
 * Bulan permintaan.
 *
 * Tampilan awal hanya memuat bulan tersibuk karena itu jawaban langsung untuk
 * "kapan permintaan memuncak". Grafik kronologis lengkap dibuka terpisah agar
 * deret puluhan bulan tidak langsung memenuhi layar.
 */
export default function BulanPanel({ bulanan }) {
  const [semua, setSemua] = useState(false);

  const berisi = bulanan.filter((item) => item.total > 0);
  const teratas = [...berisi]
    .sort((a, b) => b.total - a.total || a.bulan.localeCompare(b.bulan))
    .slice(0, MAKS_AWAL);
  const bisaDibuka = berisi.length > MAKS_AWAL;

  const keterangan = semua
    ? 'Semua bulan berurutan. Bulan tanpa permintaan tetap tampil dengan nilai nol.'
    : berisi.length > MAKS_AWAL
      ? `${MAKS_AWAL} bulan dengan permintaan terbanyak.`
      : berisi.length > 0
        ? `${berisi.length} bulan memiliki permintaan tercatat.`
        : 'Belum ada permintaan tercatat.';

  return (
    <Card>
      <SectionHeader title="Bulan permintaan" description={keterangan} />

      <div className="p-4">
        {semua ? (
          <BulanChart bulanan={bulanan} />
        ) : (
          <BarList
            items={teratas.map((item) => ({
              nama: formatBulan(item.bulan),
              total: item.total,
            }))}
            tandaiTeratas
            bernomor
            kosong="Belum ada permintaan tercatat."
          />
        )}
      </div>

      {bisaDibuka && (
        <div className="flex justify-end border-t border-line px-4 py-3">
          <Button variant="secondary" size="sm" onClick={() => setSemua((nilai) => !nilai)}>
            {semua ? 'Ringkas ke 6 bulan tersibuk' : 'Lihat semua bulan'}
          </Button>
        </div>
      )}
    </Card>
  );
}
