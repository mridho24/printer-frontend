import { useSearchParams } from 'react-router-dom';
import GrafikBulan from './GrafikBulan.jsx';
import TombolEkspor from './TombolEkspor.jsx';
import { deretBulan } from './deretBulan.js';
import { rentangBulan } from './periode.js';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { EmptyState } from '../../components/ui/Feedback.jsx';
import { Select } from '../../components/ui/FormControls.jsx';

const SEMUA = 'semua';

/**
 * Bulan permintaan.
 *
 * Grafik tampil sejak bulan pertama punya data, lalu bertambah sendiri setiap
 * ada bulan baru karena `deretBulan` melengkapi bulan kosong di antaranya
 * dengan nilai nol. Tidak ada ambang jumlah bulan: data satu bulan tetap
 * ditampilkan apa adanya, bukan disembunyikan sampai cukup untuk dibandingkan.
 *
 * Pemilih bulan ada di kepala panel. Tampilan awal memakai "Semua bulan" agar
 * grafik langsung terlihat; memilih satu bulan menggantinya dengan satu angka
 * ringkas. Pemilih disembunyikan bila hanya ada satu bulan.
 */
export default function BulanPanel({ bulanan }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const semuaBulan = deretBulan(bulanan);
  const pilihan = [...semuaBulan].reverse();
  const param = searchParams.get('bulan') || SEMUA;
  const nilai =
    param === SEMUA || !pilihan.some((item) => item.kunci === param) ? SEMUA : param;

  function setTampilan(baru) {
    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        if (baru === SEMUA) berikut.delete('bulan');
        else berikut.set('bulan', baru);
        return berikut;
      },
      { replace: true },
    );
  }
  const dipilih = nilai === SEMUA ? null : (pilihan.find((item) => item.kunci === nilai) ?? null);

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
          <GrafikBulan
            items={itemsBulan}
            kosong="Belum ada permintaan tercatat."
          />
        </div>
      )}
    </Card>
  );
}
