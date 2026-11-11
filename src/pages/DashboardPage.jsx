import { useNavigate, useSearchParams } from 'react-router-dom';
import { Plus, RotateCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import { EmptyState, ErrorState } from '../components/ui/Feedback.jsx';
import BulanPanel from '../features/dashboard/BulanPanel.jsx';
import DashboardTabs from '../features/dashboard/DashboardTabs.jsx';
import JenisPanel from '../features/dashboard/JenisPanel.jsx';
import PrinterBahanPanel from '../features/dashboard/PrinterBahanPanel.jsx';
import RingkasanStrip from '../features/dashboard/RingkasanStrip.jsx';
import WarnaPanel from '../features/dashboard/WarnaPanel.jsx';
import { dashboardApi } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';

const TAMPILAN_AWAL = 'jenis';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, loading, error, reload } = useFetch(() => dashboardApi.ringkasan(), []);

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

  function pilihTampilan(key) {
    const berikut = new URLSearchParams(searchParams);
    berikut.set('tampilan', key);
    setSearchParams(berikut, { replace: true });
  }

  return (
    <div className="mx-auto w-full max-w-4xl">
      <PageHeader
        kicker="Papan pantau"
        title="Dashboard Permintaan"
        description="Ringkasan permintaan bahan printer yang tercatat, dihitung dari data aktif."
        actions={
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            onClick={reload}
            disabled={loading}
          >
            Muat ulang
          </Button>
        }
      />

      {loading && !data ? (
        <DashboardSkeleton />
      ) : error ? (
        <Card>
          <ErrorState error={error} onRetry={reload} />
        </Card>
      ) : total === 0 ? (
        <Card>
          <EmptyState
            title="Belum ada permintaan tercatat"
            description="Dashboard akan terisi setelah permintaan bahan printer pertama dicatat."
            action={
              <Button icon={Plus} onClick={() => navigate('/permintaan')}>
                Catat permintaan
              </Button>
            }
          />
        </Card>
      ) : (
        <>
          <RingkasanStrip ringkasan={ringkasan} />

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
        </>
      )}
    </div>
  );
}
