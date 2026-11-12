import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CalendarRange, Plus, RotateCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { EmptyState, ErrorState } from '../components/ui/Feedback.jsx';
import BulanPanel from '../features/dashboard/BulanPanel.jsx';
import DashboardTabs from '../features/dashboard/DashboardTabs.jsx';
import FilterPeriode from '../features/dashboard/FilterPeriode.jsx';
import JenisPanel from '../features/dashboard/JenisPanel.jsx';
import PerluPerhatian from '../features/dashboard/PerluPerhatian.jsx';
import PermintaanTerbaru from '../features/dashboard/PermintaanTerbaru.jsx';
import PrinterBahanPanel from '../features/dashboard/PrinterBahanPanel.jsx';
import RingkasanStrip from '../features/dashboard/RingkasanStrip.jsx';
import WarnaPanel from '../features/dashboard/WarnaPanel.jsx';
import { labelRentang, rentangPeriode } from '../features/dashboard/periode.js';
import { dashboardApi } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { useToast } from '../hooks/useToast.js';
import { formatWaktuLokal } from '../lib/format.js';

const TAMPILAN_AWAL = 'jenis';
const PERIODE_AWAL = 'semua';

function DashboardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Memuat dashboard">
      <div className="h-[76px] animate-pulse rounded-lg border border-line bg-surface" />
      <div className="h-[52px] animate-pulse rounded-lg border border-line bg-surface" />
      <div className="h-80 animate-pulse rounded-lg border border-line bg-surface" />
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();

  const periode = searchParams.get('periode') || PERIODE_AWAL;
  const { dari, sampai } = rentangPeriode(periode, {
    dari: searchParams.get('dari') ?? '',
    sampai: searchParams.get('sampai') ?? '',
  });
  const invalidPeriode = Boolean(dari && sampai && dari > sampai);

  const { data, loading, error, reload, updatedAt } = useFetch(
    () => dashboardApi.ringkasan({ dari: dari || undefined, sampai: sampai || undefined }),
    [dari, sampai],
    { enabled: !invalidPeriode },
  );

  const menungguMuatUlangRef = useRef(false);
  const updatedRef = useRef(updatedAt);

  // Notifikasi hanya muncul setelah tombol Muat ulang ditekan, bukan saat
  // pemuatan pertama atau saat filter berubah.
  useEffect(() => {
    if (!menungguMuatUlangRef.current) {
      updatedRef.current = updatedAt;
      return;
    }
    if (error) {
      menungguMuatUlangRef.current = false;
      toast.error('Gagal memperbarui data.');
      return;
    }
    if (updatedAt && updatedAt !== updatedRef.current) {
      updatedRef.current = updatedAt;
      menungguMuatUlangRef.current = false;
      toast.success('Data diperbarui');
    }
  }, [updatedAt, error, toast]);

  function muatUlang() {
    menungguMuatUlangRef.current = true;
    reload();
  }

  function ubahPeriode(nilai) {
    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        berikut.set('periode', nilai);

        if (nilai === 'kustom') {
          const sekarang = rentangPeriode(sebelum.get('periode') ?? PERIODE_AWAL, {
            dari: sebelum.get('dari') ?? '',
            sampai: sebelum.get('sampai') ?? '',
          });
          const cadangan = rentangPeriode('30');
          berikut.set('dari', sekarang.dari || cadangan.dari);
          berikut.set('sampai', sekarang.sampai || cadangan.sampai);
        } else {
          berikut.delete('dari');
          berikut.delete('sampai');
        }

        return berikut;
      },
      { replace: true },
    );
  }

  function ubahTanggal(field, nilai) {
    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        berikut.set('periode', 'kustom');
        if (nilai) berikut.set(field, nilai);
        else berikut.delete(field);
        return berikut;
      },
      { replace: true },
    );
  }

  function resetPeriode() {
    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        berikut.set('periode', PERIODE_AWAL);
        berikut.delete('dari');
        berikut.delete('sampai');
        return berikut;
      },
      { replace: true },
    );
  }

  function pilihTampilan(key) {
    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        berikut.set('tampilan', key);
        return berikut;
      },
      { replace: true },
    );
  }

  const ringkasan = data?.ringkasan;
  const total = ringkasan?.total_permintaan ?? 0;
  const jenis = data?.jenis ?? [];
  const printer = data?.printer ?? [];
  const warna = (data?.warna ?? []).filter((item) => item.warna.length > 0);
  const printerWarna = printer.filter((item) => item.pakai_warna && item.bahan.length > 0);
  const bulanan = data?.bulanan ?? [];

  const tabs = [
    { key: 'jenis', label: 'Jenis printer' },
    { key: 'bahan', label: 'Bahan per printer' },
    { key: 'bulan', label: 'Bulan' },
    ...(printerWarna.length > 0 ? [{ key: 'warna', label: 'Warna' }] : []),
  ];

  const diminta = searchParams.get('tampilan');
  const aktif = tabs.some((tab) => tab.key === diminta) ? diminta : TAMPILAN_AWAL;

  const adaPeriode = Boolean(dari || sampai);
  const parameterPermintaan = new URLSearchParams();
  if (dari) parameterPermintaan.set('dari', dari);
  if (sampai) parameterPermintaan.set('sampai', sampai);
  const tautanPermintaan = `/permintaan${
    parameterPermintaan.toString() ? `?${parameterPermintaan.toString()}` : ''
  }`;

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        kicker="Ringkasan"
        title="Dashboard Permintaan"
        description="Ringkasan permintaan bahan printer yang tercatat, dihitung dari data aktif."
        actions={
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {updatedAt && (
              <p className="text-xs text-muted" role="status">
                Diperbarui: {formatWaktuLokal(updatedAt)}
              </p>
            )}
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCw}
              onClick={muatUlang}
              loading={loading}
              disabled={invalidPeriode}
            >
              Muat ulang
            </Button>
          </div>
        }
      />

      <FilterPeriode
        periode={periode}
        dari={dari}
        sampai={sampai}
        onChangePeriode={ubahPeriode}
        onChangeTanggal={ubahTanggal}
        invalid={invalidPeriode}
      />

      {invalidPeriode ? (
        <Card>
          <EmptyState
            icon={CalendarRange}
            title="Rentang tanggal belum valid"
            description="Tanggal awal harus sebelum atau sama dengan tanggal akhir. Perbaiki rentang pada filter periode di atas."
            action={
              <Button variant="secondary" onClick={resetPeriode}>
                Tampilkan semua data
              </Button>
            }
          />
        </Card>
      ) : loading && !data ? (
        <DashboardSkeleton />
      ) : error ? (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      ) : total === 0 ? (
        <Card>
          <EmptyState
            icon={CalendarRange}
            title={
              adaPeriode ? 'Tidak ada permintaan pada periode ini' : 'Belum ada permintaan tercatat'
            }
            description={
              adaPeriode
                ? `Tidak ada catatan antara ${labelRentang(dari, sampai)}. Pilih periode lain untuk melihat data.`
                : 'Dashboard akan terisi setelah permintaan bahan printer pertama dicatat.'
            }
            action={
              adaPeriode ? (
                <Button variant="secondary" onClick={resetPeriode}>
                  Tampilkan semua data
                </Button>
              ) : (
                <Button icon={Plus} onClick={() => navigate('/permintaan')}>
                  Catat permintaan
                </Button>
              )
            }
          />
        </Card>
      ) : (
        <>
          <RingkasanStrip
            ringkasan={ringkasan}
            pembanding={data?.pembanding}
            periodeAktif={adaPeriode}
          />

          <PerluPerhatian perhatian={data?.perhatian} />

          <Card className="mb-4">
            <DashboardTabs tabs={tabs} active={aktif} onChange={pilihTampilan} />
          </Card>

          <div
            role="tabpanel"
            id={`panel-${aktif}`}
            aria-labelledby={`tab-${aktif}`}
            tabIndex={0}
          >
            {aktif === 'jenis' && <JenisPanel jenis={jenis} />}
            {aktif === 'bahan' && <PrinterBahanPanel printer={printer} />}
            {aktif === 'bulan' && <BulanPanel bulanan={bulanan} />}
            {aktif === 'warna' && <WarnaPanel warna={warna} printer={printerWarna} />}
          </div>

          <PermintaanTerbaru items={data?.terbaru ?? []} tautan={tautanPermintaan} />
        </>
      )}
    </div>
  );
}
