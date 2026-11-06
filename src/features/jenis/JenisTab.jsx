import { useState } from 'react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { jenisApi } from '../../api/index.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Badge, EmptyState, ErrorState, TableSkeleton } from '../../components/ui/Feedback.jsx';
import JenisFormModal from './JenisFormModal.jsx';

export default function JenisTab() {
  const toast = useToast();
  const { data, loading, error, reload } = useFetch(() => jenisApi.list(), []);
  const [modal, setModal] = useState({ open: false, item: null });
  const [hapus, setHapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const daftar = data ?? [];

  async function konfirmasiHapus() {
    if (!hapus) return;
    setMenghapus(true);
    try {
      await jenisApi.remove(hapus.id);
      toast.success(`Jenis "${hapus.nama}" berhasil dihapus.`);
      setHapus(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMenghapus(false);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Daftar Jenis Printer</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {loading ? 'Memuat data...' : `${daftar.length} jenis aktif`}
          </p>
        </div>
        <Button icon={Plus} onClick={() => setModal({ open: true, item: null })}>
          Tambah Jenis
        </Button>
      </div>

      {loading ? (
        <TableSkeleton rows={4} columns={4} />
      ) : error ? (
        <ErrorState error={error} onRetry={reload} />
      ) : daftar.length === 0 ? (
        <EmptyState
          icon={Tags}
          title="Belum ada jenis printer"
          description="Tambahkan jenis printer terlebih dahulu sebelum mendaftarkan printer."
          action={
            <Button icon={Plus} onClick={() => setModal({ open: true, item: null })}>
              Tambah Jenis
            </Button>
          }
        />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                <th className="px-4 py-3">Nama</th>
                <th className="px-4 py-3">Label Kode</th>
                <th className="px-4 py-3">Perilaku Bahan</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {daftar.map((item) => (
                <tr key={item.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3 font-medium text-slate-900">{item.nama}</td>
                  <td className="px-4 py-3 text-slate-600">{item.label_kode || '-'}</td>
                  <td className="px-4 py-3">
                    {item.pakai_warna ? (
                      <Badge tone="violet">Pilih warna</Badge>
                    ) : (
                      <Badge tone="blue">{item.label_kode || 'Kode bahan'}</Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Edit jenis"
                        aria-label={`Edit ${item.nama}`}
                        onClick={() => setModal({ open: true, item })}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Hapus jenis"
                        aria-label={`Hapus ${item.nama}`}
                        className="text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => setHapus(item)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal.open && (
        <JenisFormModal
          item={modal.item}
          onClose={() => setModal({ open: false, item: null })}
          onSaved={reload}
        />
      )}

      <ConfirmDialog
        open={Boolean(hapus)}
        title="Hapus jenis printer?"
        description={
          hapus
            ? `Jenis "${hapus.nama}" akan dihapus (soft delete). Printer di bawah jenis ini tidak lagi muncul pada pilihan permintaan baru, tetapi riwayat lama tetap tersimpan.`
            : ''
        }
        loading={menghapus}
        onClose={() => setHapus(null)}
        onConfirm={konfirmasiHapus}
      />
    </div>
  );
}
