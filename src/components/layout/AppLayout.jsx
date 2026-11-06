import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ClipboardList, Database, Printer, ShieldCheck } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const NAVIGASI = [
  {
    to: '/master-data/jenis',
    label: 'Master Data',
    icon: Database,
    cocok: (pathname) => pathname.startsWith('/master-data'),
  },
  {
    to: '/permintaan',
    label: 'Permintaan',
    icon: ClipboardList,
    cocok: (pathname) => pathname.startsWith('/permintaan'),
  },
];

export default function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-600/30">
              <Printer className="h-5 w-5" />
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold tracking-tight text-slate-900">Bahan Printer</p>
              <p className="text-[11px] font-medium text-slate-500">RSUD Zainal Abidin</p>
            </div>
          </div>

          <nav className="order-3 -mx-1 flex w-full items-center gap-1 overflow-x-auto pb-0.5 sm:order-2 sm:mx-0 sm:w-auto sm:pb-0">
            {NAVIGASI.map((item) => {
              const aktif = item.cocok(pathname);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={cn(
                    'inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
                    aktif
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            <span className="text-xs font-semibold text-slate-600">Admin IT</span>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500 sm:px-6">
          <p>Aplikasi Pencatatan Permintaan Bahan Printer</p>
          <p>Admin IT &middot; Internal RSUD</p>
        </div>
      </footer>
    </div>
  );
}
