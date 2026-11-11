import { useState } from 'react';
import BulanChart from './BulanChart.jsx';
import RankingTable from './RankingTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { formatBulan, formatDaftar } from '../../lib/format.js';

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

  const urut = [...bulanan].sort((a, b) => a.bulan.localeCompare(b.bulan));
  const berisi = urut.filter((item) => item.total > 0);
  const teratas = [...berisi]
    .sort((a, b) => b.total - a.total || a.bulan.localeCompare(b.bulan))
    .slice(0, MAKS_AWAL);
  const bisaDibuka = berisi.length > MAKS_AWAL;

  const puncak = berisi[0]?.total ?? 0;
  const bulanPuncak = berisi.filter((item) => item.total === puncak);
  const namaPuncak = formatDaftar(bulanPuncak.map((item) => formatBulan(item.bulan)));

  let keterangan = 'Belum ada permintaan tercatat.';
  if (semua && urut.length > 0) {
    const awal = formatBulan(urut[0].bulan);
    const akhir = formatBulan(urut[urut.length - 1].bulan);
    keterangan =
      awal === akhir
        ? `Semua permintaan tercatat pada ${awal}.`
        : `Permintaan tercatat dari ${awal} sampai ${akhir}. Bulan tanpa permintaan tetap ditampilkan.`;
  } else if (berisi.length === 1) {
    keterangan = `${namaPuncak} satu-satunya bulan dengan ${puncak} permintaan.`;
  } else if (bulanPuncak.length === 1) {
    keterangan = `${namaPuncak} paling banyak diminta dengan ${puncak} permintaan.`;
  } else if (bulanPuncak.length === 2) {
    keterangan = `${namaPuncak} sama-sama paling banyak diminta, masing-masing ${puncak} permintaan.`;
  } else if (bulanPuncak.length > 2) {
    keterangan = `${bulanPuncak.length} bulan sama-sama paling banyak diminta, masing-masing ${puncak} permintaan.`;
  }

  return (
    <Card>
      <SectionHeader title="Bulan permintaan" description={keterangan} />

      <div className="p-4">
        {semua ? (
          <BulanChart bulanan={bulanan} />
        ) : (
          <RankingTable
            items={teratas.map((item) => ({
              nama: formatBulan(item.bulan),
              total: item.total,
            }))}
            labelHeader="Bulan"
            satuanHeader="Permintaan"
            bernomor
            tandaiTeratas
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
