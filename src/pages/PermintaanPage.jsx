import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Plus, RotateCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import SectionHeader from '../components/ui/SectionHeader.jsx';
import { ConfirmDialog } from '../components/ui/Modal.jsx';
import { InlineAlert } from '../components/ui/Feedback.jsx';
import FilterBar from '../features/permintaan/FilterBar.jsx';
import PermintaanFormModal from '../features/permintaan/PermintaanFormModal.jsx';
import PermintaanTable from '../features/permintaan/PermintaanTable.jsx';
import { labelRentang } from '../features/dashboard/periode.js';
import { jenisApi, permintaanApi } from '../api/index.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useFetch } from '../hooks/useFetch.js';
import { useToast } from '../hooks/useToast.js';
import { WARNA_META } from '../lib/constants.js';

/**
 * Halaman permintaan juga bisa dibuka dari dashboard lewat query string,
 * misalnya `?tipe=L135&warna=black`. Nilai awal dibaca sekali dari URL, lalu
 * chip filter menunjukkan cakupan yang sedang aktif agar hasil yang sempit
 * tidak disalahartikan sebagai seluruh data.
 */
export default function PermintaanPage() {
  const toast = useToast();
  const [searchParams, setSearchParams] = useSearchParams();
  const [dari, setDari] = useState(() => searchParams.get('dari') ?? '');
  const [sampai, setSampai] = useState(() => searchParams.get('sampai') ?? '');
  const [q, setQ] = useState(() => searchParams.get('q') ?? '');
  const [jenisId, setJenisId] = useState(() => searchParams.get('jenis_id') ?? '');
  const [tipe, setTipe] = useState(() => searchParams.get('tipe') ?? '');
  const [warna, setWarna] = useState(() => searchParams.get('warna') ?? '');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modal, setModal] = useState({ open: false, item: null });
  const [hapus, setHapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const debouncedQ = useDebounce(q, 400);
  const invalidRange = Boolean(dari && sampai && dari > sampai);

  const { data: daftarJenis } = useFetch(() => jenisApi.list(), []);

  const { data, meta, loading, error, reload } = useFetch(
    () =>
      permintaanApi.list({
        dari,
        sampai,
        q: debouncedQ,
        jenis_id: jenisId || undefined,
        tipe: tipe || undefined,
        warna: warna || undefined,
        page,
        limit,
      }),
    [dari, sampai, debouncedQ, jenisId, tipe, warna, page, limit],
    { enabled: !invalidRange },
  );

  function ubahFilter(field, value) {
    setPage(1);
    if (field === 'dari') setDari(value);
    if (field === 'sampai') setSampai(value);
    if (field === 'q') setQ(value);
    if (field === 'jenis_id') setJenisId(value);
    if (field === 'tipe') setTipe(value);
    if (field === 'warna') setWarna(value);
  }

  function ubahLimit(nilai) {
    setLimit(nilai);
    setPage(1);
  }

  function resetFilter() {
    setDari('');
    setSampai('');
    setQ('');
    setJenisId('');
    setTipe('');
    setWarna('');
    setPage(1);
    setSearchParams(new URLSearchParams(), { replace: true });
  }

  /**
   * Menghapus satu chip sekaligus membersihkan parameternya di URL, supaya
   * muat ulang tidak memunculkan kembali filter yang sudah dilepas.
   */
  function hapusChip(kunci) {
    setPage(1);

    if (kunci === 'tanggal') {
      setDari('');
      setSampai('');
    }
    if (kunci === 'jenis') setJenisId('');
    if (kunci === 'tipe') setTipe('');
    if (kunci === 'warna') setWarna('');

    setSearchParams(
      (sebelum) => {
        const berikut = new URLSearchParams(sebelum);
        if (kunci === 'tanggal') {
          berikut.delete('dari');
          berikut.delete('sampai');
        }
        if (kunci === 'jenis') berikut.delete('jenis_id');
        if (kunci === 'tipe') berikut.delete('tipe');
        if (kunci === 'warna') berikut.delete('warna');
        return berikut;
      },
      { replace: true },
    );
  }

  const chip = [];
  if (dari || sampai) {
    chip.push({ key: 'tanggal', label: `Tanggal: ${labelRentang(dari, sampai)}` });
  }
  if (jenisId) {
    const nama = (daftarJenis ?? []).find((item) => String(item.id) === String(jenisId))?.nama;
    chip.push({ key: 'jenis', label: `Jenis: ${nama ?? `#${jenisId}`}` });
  }
  if (tipe) chip.push({ key: 'tipe', label: `Tipe: ${tipe}` });
  if (warna) {
    chip.push({ key: 'warna', label: `Warna: ${WARNA_META[warna]?.label ?? warna}` });
  }

  async function konfirmasiHapus() {
    if (!hapus) return;
    setMenghapus(true);
    try {
      await permintaanApi.remove(hapus.id);
      toast.success(`Permintaan untuk "${hapus.nama_peminta}" berhasil dihapus.`);
      setHapus(null);

      const sisa = Math.max(0, total - 1);
      const totalPageBaru = Math.max(1, Math.ceil(sisa / limit));
      if (page > totalPageBaru) {
        setPage(totalPageBaru);
      } else {
        reload();
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMenghapus(false);
    }
  }

  const rows = invalidRange ? [] : (data ?? []);
  const total = meta?.total ?? 0;
  const totalPage = meta?.total_page ?? 0;

  return (
    <>
      <PageHeader
        kicker="Buku permintaan"
        title="Permintaan Bahan Printer"
        description="Catat toner, ribbon, tinta, dan bahan printer lain yang diterima Admin IT."
        actions={
          <Button icon={Plus} onClick={() => setModal({ open: true, item: null })}>
            Tambah Permintaan
          </Button>
        }
      />

      <Card className="mb-4">
        <SectionHeader
          index="01"
          title="Filter dan pencarian"
          description="Cari berdasarkan nama peminta, ruang, merek, tipe, atau bahan."
          actions={
            <p className="text-xs text-muted">
              {invalidRange ? (
                'Rentang tidak valid'
              ) : (
                <>
                  <span className="font-mono font-medium text-ink">{total}</span> catatan
                </>
              )}
            </p>
          }
        />
        <div className="p-4">
          <FilterBar
            dari={dari}
            sampai={sampai}
            q={q}
            chips={chip}
            onChange={ubahFilter}
            onHapusChip={hapusChip}
            onReset={resetFilter}
            invalidRange={invalidRange}
          />
        </div>
      </Card>

      <Card>
        <SectionHeader
          index="02"
          title="Daftar permintaan"
          description={
            loading
              ? 'Memuat data...'
              : `Halaman ${meta?.page ?? page} dari ${Math.max(1, totalPage)}`
          }
          actions={
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCw}
              onClick={reload}
              disabled={invalidRange || loading}
            >
              Muat ulang
            </Button>
          }
        />

        {invalidRange ? (
          <div className="p-4">
            <InlineAlert tone="warning" title="Rentang tanggal tidak valid">
              Tanggal &quot;dari&quot; tidak boleh setelah tanggal &quot;sampai&quot;. Perbaiki
              filter untuk menampilkan data.
            </InlineAlert>
          </div>
        ) : (
          <>
            <PermintaanTable
              rows={rows}
              loading={loading}
              error={error}
              onRetry={reload}
              onAdd={() => setModal({ open: true, item: null })}
              onEdit={(item) => setModal({ open: true, item })}
              onDelete={(item) => setHapus(item)}
            />

            {!loading && !error && (
              <Pagination
                page={meta?.page ?? page}
                totalPage={totalPage}
                total={total}
                limit={limit}
                onPageChange={setPage}
                onLimitChange={ubahLimit}
              />
            )}
          </>
        )}
      </Card>

      {modal.open && (
        <PermintaanFormModal
          open={modal.open}
          item={modal.item}
          onClose={() => setModal({ open: false, item: null })}
          onSaved={reload}
        />
      )}

      <ConfirmDialog
        open={Boolean(hapus)}
        title="Hapus permintaan?"
        description={
          hapus
            ? `Permintaan atas nama "${hapus.nama_peminta}" untuk ${hapus.merek ?? ''} ${hapus.tipe ?? ''} pada ${hapus.tanggal} akan dihapus (soft delete). Data tidak tampil lagi pada daftar aktif.`
            : ''
        }
        loading={menghapus}
        onClose={() => setHapus(null)}
        onConfirm={konfirmasiHapus}
      />
    </>
  );
}
