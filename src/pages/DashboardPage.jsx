import { useNavigate } from 'react-router-dom';
import { Plus, RotateCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { EmptyState, ErrorState } from '../components/ui/Feedback.jsx';
import BarList from '../features/dashboard/BarList.jsx';
import BahanPrinterCard from '../features/dashboard/BahanPrinterCard.jsx';
import BulanChart from '../features/dashboard/BulanChart.jsx';
import RingkasanStrip from '../features/dashboard/RingkasanStrip.jsx';
import WarnaCard from '../features/dashboard/WarnaCard.jsx';
import { dashboardApi } from '../api/index.js';
import { useFetch } from '../hooks/useFetch.js';
import { formatBulan } from '../lib/format.js';

function DashboardSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="Memuat dashboard">
      <div className="h-[76px] animate-pulse rounded-lg border border-line bg-surface" />
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="h-72 animate-pulse rounded-lg border border-line bg-surface" />
        <div className="h-72 animate-pulse rounded-lg border border-line bg-surface" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <div className="h-60 animate-pulse rounded-lg border border-line bg-surface" />
        <div className="h-60 animate-pulse rounded-lg border border-line bg-surface" />
        <div className="h-60 animate-pulse rounded-lg border border-line bg-surface" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { data, loading, error, reload } = useFetch(() => dashboardApi.ringkasan(), []);

  const ringkasan = data?.ringkasan;
  const total = ringkasan?.total_permintaan ?? 0;
  const jenis = data?.jenis ?? [];
  const printer = data?.printer ?? [];
  const warna = (data?.warna ?? []).filter((item) => item.warna.length > 0);
  const bulanan = data?.bulanan ?? [];

  const bulanTersibuk = [...bulanan]
    .sort((a, b) => b.total - a.total || a.bulan.localeCompare(b.bulan))
    .slice(0, 3)
    .filter((item) => item.total > 0);
  const keteranganBulan =
    bulanTersibuk.length > 0
      ? `Tiga bulan tersibuk: ${bulanTersibuk
          .map((item) => `${formatBulan(item.bulan)} (${item.total})`)
          .join(', ')}.`
      : 'Belum ada data bulanan.';

  return (
    <>
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

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <SectionHeader
                index="01"
                title="Jenis printer paling sering diminta"
                description={`${jenis.length} jenis memiliki permintaan tercatat.`}
              />
              <div className="p-4">
                <BarList
                  items={jenis.map((item) => ({
                    nama: item.jenis_dihapus ? `${item.nama} (arsip)` : item.nama,
                    total: item.total,
                  }))}
                  total={total}
                  tandaiTeratas
                />
              </div>
            </Card>

            <Card>
              <SectionHeader
                index="02"
                title="Bulan permintaan"
                description={keteranganBulan}
              />
              <div className="p-4">
                <BulanChart bulanan={bulanan} total={total} />
              </div>
            </Card>
          </div>

          <section className="mt-6">
            <SectionHeader
              index="03"
              title="Bahan per tipe printer"
              description="Kode untuk printer non-warna, warna untuk printer warna. Tiap tipe dihitung terpisah."
              className="px-0"
            />
            <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {printer.map((item) => (
                <BahanPrinterCard key={item.tipe} printer={item} />
              ))}
            </div>
          </section>

          {warna.length > 0 && (
            <section className="mt-6">
              <SectionHeader
                index="04"
                title="Warna per jenis warna"
                description="Jumlah permintaan yang memuat tiap warna. Satu permintaan bisa berisi beberapa warna."
                className="px-0"
              />
              <div className="mt-4 grid gap-4 lg:grid-cols-2">
                {warna.map((item) => (
                  <WarnaCard key={item.jenis_id} item={item} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
