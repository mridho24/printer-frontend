import { Navigate, NavLink, useParams } from 'react-router-dom';
import { Printer, Tags } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import JenisTab from '../features/jenis/JenisTab.jsx';
import PrinterTab from '../features/printer/PrinterTab.jsx';
import { cn } from '../lib/cn.js';

/* Ikon mewakili isi tab: Tags untuk daftar jenis, Printer untuk daftar printer. */
const TAB = [
  { key: 'jenis', label: 'Jenis', icon: Tags },
  { key: 'printer', label: 'Printer', icon: Printer },
];

export default function MasterDataPage() {
  const { tab } = useParams();

  if (!TAB.some((item) => item.key === tab)) {
    return <Navigate to="/master-data/jenis" replace />;
  }

  return (
    <>
      <PageHeader
        kicker="Data induk"
        title="Master Data"
        description="Kelola jenis printer dan daftar printer yang menjadi sumber data permintaan bahan."
      />

      <Card>
        <div className="flex items-stretch gap-1 overflow-x-auto border-b border-line px-2">
          {TAB.map((item) => {
            const Icon = item.icon;
            const aktif = item.key === tab;
            return (
              <NavLink
                key={item.key}
                to={`/master-data/${item.key}`}
                aria-current={aktif ? 'page' : undefined}
                className={cn(
                  'inline-flex h-11 shrink-0 items-center gap-2 border-b-2 px-3 text-sm font-medium transition-colors',
                  aktif
                    ? 'border-accent text-accent-strong'
                    : 'border-transparent text-muted hover:text-ink',
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </NavLink>
            );
          })}
        </div>

        {tab === 'jenis' ? <JenisTab /> : <PrinterTab />}
      </Card>
    </>
  );
}
