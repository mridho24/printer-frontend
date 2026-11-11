import { useState } from 'react';
import BulanChart from './BulanChart.jsx';
import RankingTable from './RankingTable.jsx';
import { deretBulan } from './deretBulan.js';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { Select } from '../../components/ui/FormControls.jsx';
import { formatDaftar } from '../../lib/format.js';

const MAKS_AWAL = 6;
const RINGKAS = 'ringkas';
const SEMUA = 'semua';

/**
 * Bulan permintaan.
 *
 * Pemilih bulan menggantikan tombol "lihat semua" supaya bulan lama bisa
 * dibuka langsung tanpa menggulir deret panjang. Ringkasan 6 bulan tersibuk
 * tetap menjadi tampilan awal karena itu jawaban tercepat untuk "kapan
 * permintaan memuncak".
 */
export default function BulanPanel({ bulanan }) {
  const [tampilan, setTampilan] = useState(RINGKAS);

  const semuaBulan = deretBulan(bulanan);
  const berisi = semuaBulan.filter((item) => item.total > 0);
  const teratas = [...berisi]
    .sort((a, b) => b.total - a.total || a.kunci.localeCompare(b.kunci))
    .slice(0, MAKS_AWAL);
  const pilihan = [...semuaBulan].reverse();
  const dipilih = pilihan.find((item) => item.kunci === tampilan) ?? null;

  const puncak = berisi[0]?.total ?? 0;
  const bulanPuncak = berisi.filter((item) => item.total === puncak);
  const namaPuncak = formatDaftar(bulanPuncak.map((item) => item.nama));

  let keterangan = 'Belum ada permintaan tercatat.';

  if (dipilih) {
    const peringkat = 1 + berisi.filter((item) => item.total > dipilih.total).length;

    if (dipilih.total > 0) {
      keterangan = `${dipilih.nama} mencatat ${dipilih.total} permintaan, peringkat ${peringkat} dari ${berisi.length} bulan berisi.`;
    } else {
      keterangan = `${dipilih.nama} tidak mencatat permintaan. Bulan ini tetap ditampilkan agar urutan waktu tidak bolong.`;
    }
  } else if (tampilan === SEMUA && semuaBulan.length > 0) {
    const awal = semuaBulan[0].nama;
    const akhir = semuaBulan[semuaBulan.length - 1].nama;
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

  if (semuaBulan.length > 0) {
    return (
      <Card>
        <SectionHeader title="Bulan permintaan" description={keterangan} />

        <div className="flex flex-wrap items-end gap-3 border-b border-line px-4 py-3">
          <Select
            label="Tampilan bulan"
            value={tampilan}
            onChange={(event) => setTampilan(event.target.value)}
            className="w-full sm:w-64"
          >
            <optgroup label="Ringkasan">
              <option value={RINGKAS}>6 bulan tersibuk</option>
              <option value={SEMUA}>Semua bulan</option>
            </optgroup>
            <optgroup label="Per bulan">
              {pilihan.map((item) => (
                <option key={item.kunci} value={item.kunci}>
                  {item.nama}
                </option>
              ))}
            </optgroup>
          </Select>
        </div>

        <div className="p-4">
          {dipilih ? (
            <RankingTable
              items={[{ nama: dipilih.nama, total: dipilih.total }]}
              labelHeader="Bulan"
              satuanHeader="Permintaan"
              kosong="Belum ada permintaan tercatat."
            />
          ) : tampilan === SEMUA ? (
            <BulanChart bulanan={bulanan} />
          ) : (
            <RankingTable
              items={teratas.map((item) => ({ nama: item.nama, total: item.total }))}
              labelHeader="Bulan"
              satuanHeader="Permintaan"
              bernomor
              tandaiTeratas
              kosong="Belum ada permintaan tercatat."
            />
          )}
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader title="Bulan permintaan" description={keterangan} />
      <p className="px-4 py-8 text-xs text-muted">Belum ada permintaan tercatat.</p>
    </Card>
  );
}
