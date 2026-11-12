import { useState } from 'react';
import BarChart from './BarChart.jsx';
import TombolEkspor from './TombolEkspor.jsx';
import { deretBulan } from './deretBulan.js';
import { rentangBulan } from './periode.js';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { EmptyState } from '../../components/ui/Feedback.jsx';
import { Select } from '../../components/ui/FormControls.jsx';

const SEMUA = 'semua';
const MIN_BULAN = 3;

/**
 * Bulan permintaan.
 *
 * Grafik bulanan baru berguna saat ada minimal tiga bulan untuk dibandingkan.
 * Di bawah itu panel menampilkan keadaan kosong yang menyebut rentang dan
 * jumlah datanya, bukan grafik dua batang yang membesar-besarkan selisih.
 *
 * Pemilih bulan ada di kepala panel. Tampilan awal memakai "Semua bulan" agar
 * grafik langsung terlihat; memilih satu bulan menggantinya dengan satu angka
 * ringkas. Pemilih disembunyikan bila hanya ada satu bulan.
 */
export default function BulanPanel({ bulanan }) {
  const [tampilan, setTampilan] = useState(SEMUA);

  const semuaBulan = deretBulan(bulanan);
  const pilihan = [...semuaBulan].reverse();
  const nilai =
    tampilan === SEMUA || !pilihan.some((item) => item.kunci === tampilan) ? SEMUA : tampilan;
  const dipilih = nilai === SEMUA ? null : (pilihan.find((item) => item.kunci === nilai) ?? null);
  const total = semuaBulan.reduce((jumlah, item) => jumlah + item.total, 0);

  const ekspor = (
    <TombolEkspor
      nama="bulan-permintaan"
      label="tabel bulan"
      kolom={['Bulan', 'Permintaan']}
      baris={semuaBulan.map((item) => [item.nama, item.total])}
    />
  );

  if (semuaBulan.length === 0) {
    return (
      <Card>
        <SectionHeader
          title="Bulan permintaan"
          description="Jumlah permintaan per bulan, termasuk bulan tanpa permintaan."
          actions={ekspor}
        />
        <EmptyState
          title="Belum ada permintaan tercatat"
          description="Grafik bulanan akan muncul setelah permintaan pertama dicatat."
        />
      </Card>
    );
  }

  if (semuaBulan.length < MIN_BULAN) {
    const awal = semuaBulan[0].nama;
    const akhir = semuaBulan[semuaBulan.length - 1].nama;
    const rentang = awal === akhir ? awal : `${awal} sampai ${akhir}`;

    return (
      <Card>
        <SectionHeader
          title="Bulan permintaan"
          description="Grafik bulanan butuh minimal tiga bulan data agar perbandingan antarbulan bermakna."
          actions={ekspor}
        />
        <EmptyState
          title="Belum cukup bulan untuk grafik"
          description={`Data saat ini mencakup ${semuaBulan.length} bulan (${rentang}) dengan ${total} permintaan. Grafik akan muncul setelah data mencakup minimal tiga bulan.`}
        />
      </Card>
    );
  }

  const itemsBulan = semuaBulan.map((item) => {
    const rentang = rentangBulan(item.kunci);
    return {
      ...item,
      href: `/permintaan?dari=${rentang.dari}&sampai=${rentang.sampai}`,
    };
  });

  return (
    <Card>
      <SectionHeader
        title="Bulan permintaan"
        description="Jumlah permintaan per bulan, termasuk bulan tanpa permintaan."
        actions={
          <>
            {pilihan.length > 1 && (
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
            )}
            {ekspor}
          </>
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
          <BarChart
            items={itemsBulan}
            labelHeader="Bulan"
            satuanHeader="Permintaan"
            kosong="Belum ada permintaan tercatat."
            labelTabel="Lihat sebagai tabel"
          />
        </div>
      )}
    </Card>
  );
}
