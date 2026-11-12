import { useState } from 'react';
import BarChart from './BarChart.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { Select } from '../../components/ui/FormControls.jsx';
import { WARNA_META } from '../../lib/constants.js';
import { cn } from '../../lib/cn.js';

const MAKS_AWAL = 4;
const SEMUA_TIPE = 'semua';

const MODE = [
  { key: 'tipe', label: 'Per tipe printer' },
  { key: 'jenis', label: 'Per jenis warna' },
];

function labelWarna(nama) {
  return WARNA_META[nama]?.label ?? nama;
}

function isiWarna(daftar) {
  return daftar
    .map((item) => ({
      nama: labelWarna(item.nama),
      warna: item.nama,
      total: item.total,
    }))
    .sort((a, b) => b.total - a.total || a.nama.localeCompare(b.nama));
}

/**
 * Warna permintaan.
 *
 * Tampilan awal adalah gabungan seluruh tipe printer warna. Pemilih tipe
 * mempersempit ke satu printer, sedangkan mode per jenis menggabungkan seluruh
 * tipe dalam satu jenis. Grafik memakai warna asli karena warna di sini adalah
 * data, bukan dekorasi.
 */
export default function WarnaPanel({ warna, printer }) {
  const [mode, setMode] = useState('tipe');
  const [tipeTerpilih, setTipeTerpilih] = useState(SEMUA_TIPE);
  const [semua, setSemua] = useState(false);

  const perJenis = [...warna]
    .map((item) => {
      const isi = isiWarna(item.warna);
      return {
        kunci: `jenis-${item.jenis_id}`,
        judul: item.nama,
        meta: null,
        total: isi.reduce((jumlah, warnaItem) => jumlah + warnaItem.total, 0),
        satuanTotal: 'pilihan warna',
        warna: isi,
      };
    })
    .sort((a, b) => b.total - a.total || a.judul.localeCompare(b.judul));

  const perPrinter = printer
    .filter((item) => item.bahan.length > 0)
    .map((item) => ({
      kunci: `printer-${item.tipe}`,
      judul: item.tipe,
      meta: `${item.merek} · ${item.jenis_nama ?? 'Jenis tidak diketahui'}`,
      total: item.bahan.reduce((jumlah, warnaItem) => jumlah + warnaItem.total, 0),
      satuanTotal: 'pilihan warna',
      arsip: item.printer_dihapus || item.jenis_dihapus,
      warna: isiWarna(item.bahan),
    }))
    .sort((a, b) => b.total - a.total || a.judul.localeCompare(b.judul));

  const dipilih = perPrinter.find((item) => item.judul === tipeTerpilih) ?? null;

  // Gabungan seluruh tipe printer warna: hitung ulang per warna supaya angka
  // di grafik selalu menjumlah tepat dari bagian-bagian yang terlihat.
  const gabungan = (() => {
    const hitung = new Map();
    for (const item of perPrinter) {
      for (const warnaItem of item.warna) {
        hitung.set(warnaItem.warna, (hitung.get(warnaItem.warna) ?? 0) + warnaItem.total);
      }
    }
    const isi = [...hitung.entries()]
      .map(([kunci, total]) => ({ nama: labelWarna(kunci), warna: kunci, total }))
      .sort((a, b) => b.total - a.total || a.nama.localeCompare(b.nama));

    return {
      kunci: 'semua-tipe',
      judul: 'Semua tipe printer',
      meta: `${perPrinter.length} tipe printer warna`,
      total: isi.reduce((jumlah, warnaItem) => jumlah + warnaItem.total, 0),
      satuanTotal: 'pilihan warna',
      warna: isi,
    };
  })();

  const tampil =
    mode === 'tipe'
      ? [dipilih ?? gabungan]
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
      ? 'Warna dihitung dari tipe printer yang dipilih, atau dari seluruh tipe bila tidak dipersempit.'
      : 'Warna digabung dari seluruh tipe dalam satu jenis.';

  return (
    <Card>
      <SectionHeader
        title="Warna paling sering diminta"
        description={keterangan}
        actions={
          <>
            <div className="inline-flex" role="group" aria-label="Kelompokkan data warna">
              {MODE.map((item, indeks) => {
                const aktif = item.key === mode;

                return (
                  <button
                    key={item.key}
                    type="button"
                    aria-pressed={aktif}
                    onClick={() => pilihMode(item.key)}
                    className={cn(
                      'inline-flex h-9 items-center border px-3 text-xs font-medium transition-colors max-lg:h-11',
                      indeks === 0 ? 'rounded-l-md' : '-ml-px rounded-r-md',
                      aktif
                        ? 'relative z-10 border-accent bg-accent-soft text-accent-strong'
                        : 'border-line-strong bg-surface text-muted hover:text-ink',
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {mode === 'tipe' && (
              <Select
                inline
                label="Tipe printer"
                value={dipilih ? dipilih.judul : SEMUA_TIPE}
                onChange={(event) => setTipeTerpilih(event.target.value)}
                className="w-full sm:w-52"
              >
                <option value={SEMUA_TIPE}>Semua tipe printer</option>
                {perPrinter.map((item) => (
                  <option key={item.judul} value={item.judul}>
                    {item.judul}
                    {item.arsip ? ' (arsip)' : ''}
                  </option>
                ))}
              </Select>
            )}
          </>
        }
      />

      {tampil.length === 0 || tampil.every((item) => item.warna.length === 0) ? (
        <p className="px-4 py-8 text-xs text-muted">Belum ada permintaan warna tercatat.</p>
      ) : (
        <div className="divide-y divide-line">
          {tampil.map((item) => (
            <section key={item.kunci} className="p-4">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="min-w-0">
                  <h3
                    className={cn(
                      'text-sm font-semibold text-ink',
                      mode === 'tipe' && item.kunci !== 'semua-tipe' && 'font-mono',
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

              <BarChart
                items={item.warna}
                labelHeader="Warna"
                satuanHeader="Permintaan"
                bernomor
                tandaiTeratas
                warnaAsli
                labelTabel="Lihat sebagai tabel"
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
