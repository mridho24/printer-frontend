import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import BarChart from './BarChart.jsx';
import PrinterRow from './PrinterRow.jsx';
import TombolEkspor from './TombolEkspor.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import Pagination from '../../components/ui/Pagination.jsx';
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
 * Daftar dibagi 6 printer per halaman supaya puluhan printer tidak memanjangkan
 * halaman. Pencarian, filter jenis, dan urutan bekerja pada seluruh data, bukan
 * hanya yang sedang terlihat.
 */
export default function PrinterBahanPanel({ printer }) {
  const [searchParams, setSearchParams] = useSearchParams();

  const cari = searchParams.get('printer_q') ?? '';
  const jenisId = searchParams.get('printer_jenis') ?? '';
  const urut = searchParams.get('printer_urut') === 'tipe' ? 'tipe' : 'total';
  const halaman = Math.max(1, Number(searchParams.get('printer_page')) || 1);

  /**
   * Pencarian, filter, urutan, dan halaman disimpan di URL agar muat ulang dan
   * tombol kembali membuka daftar yang sama. Mengubah filter menghapus nomor
   * halaman supaya daftar kembali ke halaman 1.
   */
  function ubahParam(perubahan) {
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

  const totalHalaman = Math.max(1, Math.ceil(hasil.length / MAKS_AWAL));
  const halamanAman = Math.min(halaman, totalHalaman);
  const tampil = hasil.slice((halamanAman - 1) * MAKS_AWAL, halamanAman * MAKS_AWAL);
  const adaFilter = cari.trim() !== '' || jenisId !== '' || urut !== 'total';
  const kosong = printer.length === 0;

  // Peringkat grafik selalu urut jumlah terbanyak, apa pun urutan tabel yang
  // dipilih pengguna, dan mengikuti filter yang sedang aktif.
  const peringkatPrinter = useMemo(
    () =>
      [...hasil]
        .sort((a, b) => b.total - a.total || a.tipe.localeCompare(b.tipe))
        .slice(0, 10)
        .map((item) => ({
          nama:
            item.printer_dihapus || item.jenis_dihapus
              ? `${item.tipe} (arsip)`
              : item.tipe,
          total: item.total,
          href: `/permintaan?tipe=${encodeURIComponent(item.tipe)}`,
        })),
    [hasil],
  );

  function bersihkanFilter() {
    ubahParam({
      printer_q: '',
      printer_jenis: '',
      printer_urut: '',
      printer_page: '',
    });
  }

  return (
    <Card>
      <SectionHeader
        title="Bahan per tipe printer"
        description="Kode untuk printer non-warna, warna untuk printer warna. Tiap tipe dihitung terpisah."
        actions={
          <TombolEkspor
            nama="bahan-per-printer"
            label="tabel bahan per printer"
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

      <div className="grid gap-3 border-b border-line px-4 py-3 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <Input
          label="Cari printer"
          placeholder="Tipe atau merek"
          value={cari}
          onChange={(event) => {
            ubahParam({ printer_q: event.target.value, printer_page: '' });
          }}
        />
        <Select
          label="Jenis"
          value={jenisId}
          onChange={(event) => {
            ubahParam({ printer_jenis: event.target.value, printer_page: '' });
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
            ubahParam({ printer_urut: event.target.value === 'tipe' ? 'tipe' : '', printer_page: '' });
          }}
        >
          <option value="total">Terbanyak</option>
          <option value="tipe">Tipe A-Z</option>
        </Select>
      </div>

      {hasil.length > 0 && (
        <div className="border-b border-line px-4 py-4">
          <p className="mb-3 text-xs font-medium text-muted">
            {hasil.length > 10
              ? '10 printer dengan permintaan terbanyak'
              : 'Printer dengan permintaan terbanyak'}
          </p>
          <BarChart
            items={peringkatPrinter}
            labelHeader="Tipe printer"
            satuanHeader="Permintaan"
            bernomor
            tandaiTeratas
            labelTabel="Lihat peringkat sebagai tabel"
          />
        </div>
      )}

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
              <PrinterRow key={item.tipe} printer={item} />
            ))}
          </ul>

          {hasil.length > MAKS_AWAL ? (
            <Pagination
              page={halamanAman}
              totalPage={totalHalaman}
              total={hasil.length}
              limit={MAKS_AWAL}
              satuan="printer"
              onPageChange={(baru) => {
                ubahParam({ printer_page: baru === 1 ? '' : String(baru) });
              }}
            />
          ) : (
            <div className="border-t border-line px-4 py-3 text-xs text-faint">
              Menampilkan {tampil.length} dari {hasil.length} printer.
            </div>
          )}
        </>
      )}
    </Card>
  );
}
