import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import BarChart from './BarChart.jsx';
import TombolEkspor from './TombolEkspor.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { Input, Select } from '../../components/ui/FormControls.jsx';

const MAKS_TAMPIL = 5;
const ID_GRAFIK = 'grafik-printer-terbanyak';

function cocokCari(printer, kata) {
  if (!kata) return true;
  return [printer.tipe, printer.merek, printer.jenis_nama]
    .filter(Boolean)
    .some((nilai) => String(nilai).toLowerCase().includes(kata));
}

/**
 * Printer dengan permintaan terbanyak.
 *
 * Grafik batang diurutkan dari jumlah permintaan terbanyak. Secara awal hanya
 * 5 printer teratas yang tampil supaya halaman tetap pendek; tombol
 * "Lihat semua" membuka seluruh printer. Pencarian dan filter jenis bekerja
 * pada seluruh data, bukan hanya yang sedang terlihat. Tiap batang menjadi
 * tautan ke daftar permintaan tipe printer itu.
 */
export default function PrinterBahanPanel({ printer }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [semua, setSemua] = useState(false);

  const cari = searchParams.get('printer_q') ?? '';
  const jenisId = searchParams.get('printer_jenis') ?? '';

  /**
   * Pencarian dan filter disimpan di URL agar muat ulang dan tombol kembali
   * membuka tampilan yang sama. Mengubah salah satunya melipat grafik kembali
   * ke 5 teratas.
   */
  function ubahParam(perubahan) {
    setSemua(false);
    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        for (const [kunci, nilai] of Object.entries(perubahan)) {
          if (nilai) berikut.set(kunci, nilai);
          else berikut.delete(kunci);
        }
        return berikut;
      },
      { replace: true },
    );
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

  // Selalu urut jumlah terbanyak; tipe A-Z hanya memutus keseimbangan.
  const hasil = useMemo(() => {
    const kata = cari.trim().toLowerCase();
    return printer
      .filter((item) => {
        if (jenisId && String(item.jenis_id) !== jenisId) return false;
        return cocokCari(item, kata);
      })
      .sort((a, b) => b.total - a.total || a.tipe.localeCompare(b.tipe));
  }, [printer, cari, jenisId]);

  const peringkatPrinter = useMemo(
    () =>
      hasil.map((item) => ({
        nama:
          item.printer_dihapus || item.jenis_dihapus
            ? `${item.tipe} (arsip)`
            : item.tipe,
        total: item.total,
        href: `/permintaan?tipe=${encodeURIComponent(item.tipe)}`,
      })),
    [hasil],
  );

  const bisaDibuka = peringkatPrinter.length > MAKS_TAMPIL;
  const tampil = semua ? peringkatPrinter : peringkatPrinter.slice(0, MAKS_TAMPIL);
  const adaFilter = cari.trim() !== '' || jenisId !== '';
  const kosong = printer.length === 0;

  const judulGrafik = !bisaDibuka
    ? 'Printer dengan permintaan terbanyak'
    : semua
      ? 'Semua printer, dari permintaan terbanyak'
      : `${MAKS_TAMPIL} printer dengan permintaan terbanyak`;

  function bersihkanFilter() {
    ubahParam({
      printer_q: '',
      printer_jenis: '',
    });
  }

  return (
    <Card>
      <SectionHeader
        title="Tipe printer"
        description="Jumlah permintaan per tipe printer. Pilih satu batang untuk melihat daftar permintaannya."
        actions={
          <TombolEkspor
            nama="tipe-printer"
            label="tabel tipe printer"
            kolom={['Tipe printer', 'Merek', 'Jenis', 'Permintaan']}
            baris={hasil.map((item) => [
              item.tipe,
              item.merek,
              item.jenis_nama ?? '',
              item.total,
            ])}
          />
        }
      />

      <div className="grid gap-3 border-b border-line px-4 py-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <Input
          label="Cari printer"
          placeholder="Tipe atau merek"
          value={cari}
          onChange={(event) => {
            ubahParam({ printer_q: event.target.value });
          }}
        />
        <Select
          label="Jenis"
          value={jenisId}
          onChange={(event) => {
            ubahParam({ printer_jenis: event.target.value });
          }}
        >
          <option value="">Semua jenis</option>
          {daftarJenis.map((item) => (
            <option key={item.id} value={item.id}>
              {item.nama}
            </option>
          ))}
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
        <div className="px-4 py-4">
          <p className="mb-3 text-xs font-medium text-muted">{judulGrafik}</p>

          <div id={ID_GRAFIK}>
            <BarChart
              items={tampil}
              bernomor
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 border-t border-line pt-3">
            <p className="text-xs text-faint">
              Menampilkan {tampil.length} dari {peringkatPrinter.length} printer.
            </p>
            {bisaDibuka && (
              <Button
                variant="secondary"
                size="sm"
                aria-expanded={semua}
                aria-controls={ID_GRAFIK}
                onClick={() => setSemua((nilai) => !nilai)}
              >
                {semua ? 'Ringkas' : `Lihat semua (${peringkatPrinter.length})`}
              </Button>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}