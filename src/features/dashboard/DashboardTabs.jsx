import { useRef } from 'react';
import { cn } from '../../lib/cn.js';

/**
 * Pemilih tampilan dashboard.
 *
 * Tiap metrik punya panelnya sendiri supaya halaman tidak menumpuk semua
 * grafik. Tombol memakai pola tab: panah kiri/kanan berpindah tab, dan hanya
 * tab aktif yang masuk urutan Tab.
 */
export default function DashboardTabs({ tabs, active, onChange }) {
  const tombolRef = useRef([]);

  function pilih(key, indeks) {
    onChange(key);
    tombolRef.current[indeks]?.focus();
  }

  function onKeyDown(event, indeks) {
    const terakhir = tabs.length - 1;

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      pilih(tabs[(indeks + 1) % tabs.length].key, (indeks + 1) % tabs.length);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      const sebelumnya = (indeks - 1 + tabs.length) % tabs.length;
      pilih(tabs[sebelumnya].key, sebelumnya);
    } else if (event.key === 'Home') {
      event.preventDefault();
      pilih(tabs[0].key, 0);
    } else if (event.key === 'End') {
      event.preventDefault();
      pilih(tabs[terakhir].key, terakhir);
    }
  }

  return (
    <div
      role="tablist"
      aria-label="Tampilan dashboard"
      aria-orientation="horizontal"
      className="flex flex-wrap gap-x-1 px-2"
    >
      {tabs.map((tab, indeks) => {
        const aktif = tab.key === active;

        return (
          <button
            key={tab.key}
            ref={(elemen) => {
              tombolRef.current[indeks] = elemen;
            }}
            type="button"
            role="tab"
            id={`tab-${tab.key}`}
            aria-selected={aktif}
            aria-controls={aktif ? `panel-${tab.key}` : undefined}
            tabIndex={aktif ? 0 : -1}
            onClick={() => onChange(tab.key)}
            onKeyDown={(event) => onKeyDown(event, indeks)}
            className={cn(
              'inline-flex h-11 items-center border-b-[3px] px-3 text-sm transition-colors',
              aktif
                ? 'border-accent font-semibold text-accent-strong'
                : 'border-transparent font-medium text-muted hover:text-ink',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
