import { useState } from 'react';
import RankingTable from './RankingTable.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { Select } from '../../components/ui/FormControls.jsx';
import { WARNA_META } from '../../lib/constants.js';
import { formatDaftar } from '../../lib/format.js';
import { cn } from '../../lib/cn.js';

const MAKS_AWAL = 4;

const MODE = [
  { key: 'tipe', label: 'Per tipe printer' },
  { key: 'jenis', label: 'Per jenis warna' },
];

function labelWarna(nama) {
  return WARNA_META[nama]?.label ?? nama;
}

function kesimpulanWarna(warna) {
  if (warna.length === 0) return 'Belum ada warna tercatat.';

  const puncak = Math.max(...warna.map((item) => item.total));
  const teratas = warna.filter((item) => item.total === puncak).map((item) => item.nama);

  if (warna.length === 1) {
    return `Hanya ${teratas[0]} yang diminta (${puncak} permintaan).`;
  }
  if (teratas.length === 1) {
    return `${teratas[0]} paling sering diminta (${puncak} permintaan).`;
  }
  return `${formatDaftar(teratas)} masing-masing diminta ${puncak} kali.`;
}

/**
 * Warna permintaan.
 *
 * Mode per tipe printer menampilkan satu tipe pilihan pengguna supaya panel
 * tidak memanjang saat printer warna bertambah. Daftar seluruh tipe tetap bisa
 * dibaca di panel bahan per printer. Mode per jenis warna menampilkan gabungan
 * seluruh tipe dalam satu jenis.
 */
export default function WarnaPanel({ warna, printer }) {
  const [mode, setMode] = useState('tipe');
  const [tipeTerpilih, setTipeTerpilih] = useState('');
  const [semua, setSemua] = useState(false);

  const perJenis = [...warna]
    .map((item) => ({
      kunci: `jenis-${item.jenis_id}`,
      judul: item.nama,
      meta: null,
      total: item.total,
      satuanTotal: 'permintaan warna',
      warna: item.warna.map((warnaItem) => ({
        nama: labelWarna(warnaItem.nama),
        total: warnaItem.total,
      })),
    }))
    .sort((a, b) => b.total - a.total || a.judul.localeCompare(b.judul));

  const perPrinter = printer
    .filter((item) => item.bahan.length > 0)
    .map((item) => ({
      kunci: `printer-${item.tipe}`,
      judul: item.tipe,
      meta: `${item.merek} · ${item.jenis_nama ?? 'Jenis tidak diketahui'}`,
      total: item.total,
      satuanTotal: 'permintaan',
      arsip: item.printer_dihapus || item.jenis_dihapus,
      warna: item.bahan.map((warnaItem) => ({
        nama: labelWarna(warnaItem.nama),
        total: warnaItem.total,
      })),
    }))
    .sort((a, b) => b.total - a.total || a.judul.localeCompare(b.judul));

  const printerAktif =
    perPrinter.find((item) => item.judul === tipeTerpilih) ?? perPrinter[0] ?? null;
  const tampil =
    mode === 'tipe'
      ? printerAktif
        ? [printerAktif]
        : []
      : semua
        ? perJenis
        : perJenis.slice(0, MAKS_AWAL);
  const bisaDibuka = mode === 'jenis' && perJenis.length > MAKS_AWAL;

  function pilihMode(key) {
    setMode(key);
    setSemua(false);
  }

  const keterangan =
    mode === 'tipe'
      ? 'Pilih satu tipe printer. Satu permintaan bisa memuat lebih dari satu warna. Semua tipe printer ada di tab Bahan per printer.'
      : 'Warna digabung per jenis. Satu permintaan bisa memuat lebih dari satu warna.';

  return (
    <Card>
      <SectionHeader title="Warna paling sering diminta" description={keterangan} />

      <div className="flex flex-wrap items-end gap-3 border-b border-line px-4 py-3">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="text-xs font-medium text-muted">Kelompokkan</span>
          <div className="flex flex-wrap gap-1" role="group" aria-label="Kelompokkan data warna">
            {MODE.map((item) => {
              const aktif = item.key === mode;

              return (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={aktif}
                  onClick={() => pilihMode(item.key)}
                  className={cn(
                    'inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium transition-colors max-lg:h-11',
                    aktif
                      ? 'border-accent bg-accent-soft text-accent-strong'
                      : 'border-line-strong bg-surface text-muted hover:text-ink',
                  )}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {mode === 'tipe' && printerAktif && (
          <Select
            label="Tipe printer"
            value={printerAktif.judul}
            onChange={(event) => setTipeTerpilih(event.target.value)}
            className="w-full sm:ml-auto sm:w-72"
          >
            {perPrinter.map((item) => (
              <option key={item.judul} value={item.judul}>
                {item.judul} ({item.meta}
                {item.arsip ? ', arsip' : ''})
              </option>
            ))}
          </Select>
        )}
      </div>

      {tampil.length === 0 ? (
        <p className="px-4 py-8 text-xs text-muted">Belum ada permintaan warna tercatat.</p>
      ) : (
        <div className="divide-y divide-line">
          {tampil.map((item) => (
            <section key={item.kunci} className="p-4">
              <div className="mb-1 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="min-w-0">
                  <h3
                    className={cn(
                      'text-sm font-semibold text-ink',
                      mode === 'tipe' && 'font-mono',
                    )}
                  >
                    {item.judul}
                  </h3>
                  {item.meta && (
                    <p className="text-xs text-muted">
                      {item.meta}
                      {item.arsip && ' · arsip'}
                    </p>
                  )}
                </div>
                <p className="text-xs text-muted">
                  {item.total} {item.satuanTotal}
                </p>
              </div>

              <p className="mb-2 text-xs text-ink">{kesimpulanWarna(item.warna)}</p>

              <RankingTable
                items={item.warna}
                labelHeader="Warna"
                satuanHeader="Permintaan"
                bernomor
                tandaiTeratas
                padat
                kosong="Belum ada warna tercatat."
              />
            </section>
          ))}
        </div>
      )}

      {bisaDibuka && (
        <div className="flex justify-end border-t border-line px-4 py-3">
          <Button variant="secondary" size="sm" onClick={() => setSemua((nilai) => !nilai)}>
            {semua ? 'Ringkas' : `Tampilkan semua (${perJenis.length})`}
          </Button>
        </div>
      )}
    </Card>
  );
}
