import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { ClipboardList, Database, Gauge } from 'lucide-react';
import BrandMark from '../brand/BrandMark.jsx';
import { cn } from '../../lib/cn.js';

/*
 * Ikon dipilih karena merujuk langsung ke isi menunya, bukan karena bentuknya:
 * Gauge = papan pantau angka, ClipboardList = daftar permintaan yang dicatat,
 * Database = kumpulan data induk. Tidak ada ikon hiasan di navigasi.
 */
const NAVIGASI = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: Gauge,
    cocok: (pathname) => pathname.startsWith('/dashboard'),
  },
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
      <div className="h-[3px] bg-accent" aria-hidden="true" />

      <header className="sticky top-0 z-30 border-b border-line bg-surface">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center gap-x-8 gap-y-1 px-4 py-2.5 sm:px-6 lg:px-8">
          <BrandMark className="py-1" />

          <nav
            aria-label="Navigasi utama"
            className="order-3 -mx-1 flex w-full flex-wrap items-stretch gap-x-1 sm:order-none sm:mx-0 sm:w-auto sm:gap-x-0"
          >
            {NAVIGASI.map((item) => {
              const aktif = item.cocok(pathname);
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
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
          </nav>

          <p className="ml-auto border-l border-line pl-3 text-xs font-medium text-muted">
            Admin IT
          </p>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-surface">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-faint sm:px-6 lg:px-8">
          <p>Aplikasi pencatatan permintaan bahan printer</p>
          <p className="font-mono">Admin IT &middot; Internal RSUD</p>
        </div>
      </footer>
    </div>
  );
}
