import { useState } from 'react';
import { Plus, RotateCw } from 'lucide-react';
import PageHeader from '../components/layout/PageHeader.jsx';
import Card from '../components/ui/Card.jsx';
import Button from '../components/ui/Button.jsx';
import Pagination from '../components/ui/Pagination.jsx';
import { ConfirmDialog } from '../components/ui/Modal.jsx';
import { InlineAlert } from '../components/ui/Feedback.jsx';
import FilterBar from '../features/permintaan/FilterBar.jsx';
import PermintaanFormModal from '../features/permintaan/PermintaanFormModal.jsx';
import PermintaanTable from '../features/permintaan/PermintaanTable.jsx';
import { permintaanApi } from '../api/index.js';
import { useDebounce } from '../hooks/useDebounce.js';
import { useFetch } from '../hooks/useFetch.js';
import { useToast } from '../hooks/useToast.js';

export default function PermintaanPage() {
  const toast = useToast();
  const [dari, setDari] = useState('');
  const [sampai, setSampai] = useState('');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [modal, setModal] = useState({ open: false, item: null });
  const [hapus, setHapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const debouncedQ = useDebounce(q, 400);
  const invalidRange = Boolean(dari && sampai && dari > sampai);

  const { data, meta, loading, error, reload } = useFetch(
    () => permintaanApi.list({ dari, sampai, q: debouncedQ, page, limit }),
    [dari, sampai, debouncedQ, page, limit],
    { enabled: !invalidRange },
  );

  function ubahFilter(field, value) {
    setPage(1);
    if (field === 'dari') setDari(value);
    if (field === 'sampai') setSampai(value);
    if (field === 'q') setQ(value);
  }

  function ubahLimit(nilai) {
    setLimit(nilai);
    setPage(1);
  }

  function resetFilter() {
    setDari('');
    setSampai('');
    setQ('');
    setPage(1);
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

  const rows = invalidRange ? [] : data ?? [];
  const total = meta?.total ?? 0;
  const totalPage = meta?.total_page ?? 0;

  return (
    <>
      <PageHeader
        title="Permintaan Bahan Printer"
        description="Catat permintaan toner, ribbon, tinta, dan bahan printer lain yang diterima Admin IT."
        actions={
          <Button icon={Plus} onClick={() => setModal({ open: true, item: null })}>
            Tambah Permintaan
          </Button>
        }
      />

      <Card className="mb-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Filter &amp; Pencarian</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              Cari berdasarkan nama peminta, ruang, merek, tipe, atau bahan.
            </p>
          </div>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {invalidRange ? 'Rentang tidak valid' : `${total} data`}
          </span>
        </div>
        <div className="p-4">
          <FilterBar
            dari={dari}
            sampai={sampai}
            q={q}
            onChange={ubahFilter}
            onReset={resetFilter}
            invalidRange={invalidRange}
          />
        </div>
      </Card>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 px-4 py-3">
          <div>
            <h2 className="text-sm font-semibold text-slate-800">Daftar Permintaan</h2>
            <p className="mt-0.5 text-xs text-slate-500">
              {loading ? 'Memuat data...' : `Halaman ${meta?.page ?? page} dari ${Math.max(1, totalPage)}`}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            icon={RotateCw}
            onClick={reload}
            disabled={invalidRange || loading}
          >
            Muat ulang
          </Button>
        </div>

        {invalidRange ? (
          <div className="p-4">
            <InlineAlert tone="warning" title="Rentang tanggal tidak valid">
              Tanggal &quot;dari&quot; tidak boleh setelah tanggal &quot;sampai&quot;. Perbaiki filter
              untuk menampilkan data.
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
