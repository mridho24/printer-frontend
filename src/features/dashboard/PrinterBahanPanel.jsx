import { useMemo, useState } from 'react';
import PrinterRow from './PrinterRow.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { Input, Select } from '../../components/ui/FormControls.jsx';

const MAKS_AWAL = 6;

function cocokCari(printer, kata) {
  if (!kata) return true;
  return [printer.tipe, printer.merek, printer.jenis_nama]
    .filter(Boolean)
    .some((nilai) => String(nilai).toLowerCase().includes(kata));
}

/**
 * Daftar bahan per tipe printer dalam bentuk akordeon.
 *
 * Hanya 6 baris pertama yang tampil supaya puluhan printer tidak memenuhi
 * layar. Pencarian, filter jenis, dan urutan bekerja pada seluruh data, bukan
 * hanya yang sedang terlihat.
 */
export default function PrinterBahanPanel({ printer }) {
  const [cari, setCari] = useState('');
  const [jenisId, setJenisId] = useState('');
  const [urut, setUrut] = useState('total');
  const [semua, setSemua] = useState(false);
  const [terbuka, setTerbuka] = useState(null);

  // Filter atau urutan baru berarti daftar kembali ke ringkasan awal.
  function resetRingkasan() {
    setSemua(false);
    setTerbuka(null);
  }

  const daftarJenis = useMemo(() => {
    const peta = new Map();
    for (const item of printer) {
      if (item.jenis_id === null || item.jenis_id === undefined) continue;
      if (!peta.has(item.jenis_id)) {
        peta.set(item.jenis_id, item.jenis_nama ?? `Jenis ${item.jenis_id}`);
      }
    }
    return [...peta.entries()].map(([id, nama]) => ({ id: String(id), nama })).sort((a, b) =>
      a.nama.localeCompare(b.nama),
    );
  }, [printer]);

  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    const saring = printer.filter((item) => {
      if (jenisId && String(item.jenis_id) !== jenisId) return false;
      return cocokCari(item, kata);
    });

    return saring.sort((a, b) =>
      urut === 'tipe' ? a.tipe.localeCompare(b.tipe) : b.total - a.total || a.tipe.localeCompare(b.tipe),
    );
  }, [printer, cari, jenisId, urut]);

  const tampil = semua ? hasil : hasil.slice(0, MAKS_AWAL);
  const adaFilter = cari.trim() !== '' || jenisId !== '' || urut !== 'total';
  const kosong = printer.length === 0;

  function bersihkanFilter() {
    setCari('');
    setJenisId('');
    setUrut('total');
    resetRingkasan();
  }

  return (
    <Card>
      <SectionHeader
        title="Bahan per tipe printer"
        description="Kode untuk printer non-warna, warna untuk printer warna. Tiap tipe dihitung terpisah."
      />

      <div className="grid gap-3 border-b border-line px-4 py-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Input
          label="Cari printer"
          placeholder="Tipe atau merek"
          value={cari}
          onChange={(event) => {
            setCari(event.target.value);
            resetRingkasan();
          }}
        />
        <Select
          label="Jenis"
          value={jenisId}
          onChange={(event) => {
            setJenisId(event.target.value);
            resetRingkasan();
          }}
        >
          <option value="">Semua jenis</option>
          {daftarJenis.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
            </option>
          ))}
        </Select>
        <Select
          label="Urutkan"
          value={urut}
          onChange={(event) => {
            setUrut(event.target.value);
            resetRingkasan();
          }}
        >
          <option value="total">Terbanyak</option>
          <option value="tipe">Tipe A-Z</option>
        </Select>
      </div>

      {hasil.length === 0 ? (
        <div className="px-4 py-10 text-center">
          <p className="text-sm text-muted">
            {kosong
              ? 'Belum ada printer dengan permintaan tercatat.'
              : 'Tidak ada printer yang cocok dengan pencarian atau filter.'}
          </p>
          {adaFilter && (
            <Button variant="secondary" size="sm" className="mt-3" onClick={bersihkanFilter}>
              Hapus filter
            </Button>
          )}
        </div>
      ) : (
        <>
          <ul className="divide-y divide-line">
            {tampil.map((item) => (
              <PrinterRow
                key={item.tipe}
                printer={item}
                terbuka={terbuka === item.tipe}
                onToggle={() => setTerbuka((sekarang) => (sekarang === item.tipe ? null : item.tipe))}
              />
            ))}
          </ul>

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-4 py-3">
            <p className="text-xs text-faint">
              Menampilkan {tampil.length} dari {hasil.length} printer.
            </p>
            {hasil.length > MAKS_AWAL && (
              <Button variant="secondary" size="sm" onClick={() => setSemua((nilai) => !nilai)}>
                {semua ? `Ringkas (${MAKS_AWAL})` : `Tampilkan semua (${hasil.length})`}
              </Button>
            )}
          </div>
        </>
      )}
    </Card>
  );
}
