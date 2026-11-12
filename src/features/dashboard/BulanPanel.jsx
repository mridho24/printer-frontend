import { useState } from 'react';
import BulanChart from './BulanChart.jsx';
import { deretBulan } from './deretBulan.js';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { Select } from '../../components/ui/FormControls.jsx';

const SEMUA = 'semua';

/**
 * Bulan permintaan.
 *
 * Pemilih bulan ada di kepala panel supaya tidak perlu satu baris kontrol
 * tersendiri. Tampilan awal memakai bulan terbaru yang punya permintaan, jadi
 * panel langsung menampilkan satu angka. Daftar kronologis lengkap hanya dibuka
 * saat pengguna memilih "Semua bulan".
 */
export default function BulanPanel({ bulanan }) {
  const [tampilan, setTampilan] = useState('');

  const semuaBulan = deretBulan(bulanan);
  const berisi = semuaBulan.filter((item) => item.total > 0);
  const pilihan = [...semuaBulan].reverse();
  const bulanTerbaru = [...berisi].sort((a, b) => a.kunci.localeCompare(b.kunci)).at(-1);
  const nilai = tampilan || bulanTerbaru?.kunci || SEMUA;
  const dipilih = nilai === SEMUA ? null : (pilihan.find((item) => item.kunci === nilai) ?? null);

  let keterangan = 'Belum ada permintaan tercatat.';

  if (dipilih && dipilih.total > 0) {
    const peringkat = 1 + berisi.filter((item) => item.total > dipilih.total).length;
    keterangan = `${dipilih.nama} mencatat ${dipilih.total} permintaan, peringkat ${peringkat} dari ${berisi.length} bulan berisi.`;
  } else if (dipilih) {
    keterangan = `${dipilih.nama} tidak mencatat permintaan.`;
  } else if (semuaBulan.length > 0) {
    const awal = semuaBulan[0].nama;
    const akhir = semuaBulan[semuaBulan.length - 1].nama;
    keterangan =
      awal === akhir
        ? `Semua permintaan tercatat pada ${awal}.`
        : `Permintaan dari ${awal} sampai ${akhir}, termasuk bulan tanpa permintaan.`;
  }

  if (semuaBulan.length === 0) {
    return (
      <Card>
        <SectionHeader title="Bulan permintaan" description={keterangan} />
        <p className="px-4 py-8 text-xs text-muted">Belum ada permintaan tercatat.</p>
      </Card>
    );
  }

  return (
    <Card>
      <SectionHeader
        title="Bulan permintaan"
        description={keterangan}
        actions={
          <Select
            inline
            label="Tampilan bulan"
            value={nilai}
            onChange={(event) => setTampilan(event.target.value)}
            className="w-full sm:w-64"
          >
            <option value={SEMUA}>Semua bulan</option>
            {pilihan.map((item) => (
              <option key={item.kunci} value={item.kunci}>
                {item.nama}
              </option>
            ))}
          </Select>
        }
      />

      {dipilih ? (
        <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 px-4 py-4">
          <p className="text-sm text-ink">{dipilih.nama}</p>
          <p className="text-xs text-muted">
            <span className="font-mono text-sm font-semibold tabular-nums text-ink">
              {dipilih.total}
            </span>{' '}
            permintaan
          </p>
        </div>
      ) : (
        <div className="p-4">
          <BulanChart bulanan={bulanan} />
        </div>
      )}
    </Card>
  );
}
