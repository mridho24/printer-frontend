import { Navigate, NavLink, useParams } from 'react-router-dom';
import { Printer, Tags } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import JenisTab from '../features/jenis/JenisTab.jsx';
import PrinterTab from '../features/printer/PrinterTab.jsx';
import { cn } from '../lib/cn.js';

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
        title="Master Data"
        description="Kelola jenis printer dan daftar printer yang digunakan sebagai sumber data permintaan bahan."
      />

      <Card>
        <div className="flex items-center gap-1 border-b border-slate-200 bg-slate-50/60 px-2 py-2 sm:px-3">
          {TAB.map((item) => {
            const Icon = item.icon;
            const aktif = item.key === tab;
            return (
              <NavLink
                key={item.key}
                to={`/master-data/${item.key}`}
                className={cn(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                  aktif
                    ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
                    : 'text-slate-600 hover:bg-white/70 hover:text-slate-900',
                )}
              >
                <Icon className="h-4 w-4" />
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
