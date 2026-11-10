import { useState } from 'react';
import { Pencil, Plus, Tags, Trash2 } from 'lucide-react';
import { jenisApi } from '../../api/index.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import { Badge, EmptyState, ErrorState, TableSkeleton } from '../../components/ui/Feedback.jsx';
import JenisFormModal from './JenisFormModal.jsx';

function Aksi({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        title="Edit jenis"
        aria-label={`Edit ${item.nama}`}
        onClick={() => onEdit(item)}
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="dangerGhost"
        size="icon"
        title="Hapus jenis"
        aria-label={`Hapus ${item.nama}`}
        onClick={() => onDelete(item)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

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
      <SectionHeader
        index="01"
        title="Daftar jenis printer"
        description={loading ? 'Memuat data...' : `${daftar.length} jenis aktif`}
        actions={
          <Button icon={Plus} onClick={() => setModal({ open: true, item: null })}>
            Tambah Jenis
          </Button>
        }
      />

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
        <>
          <ul className="divide-y divide-line md:hidden">
            {daftar.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{item.nama}</p>
                  <p className="font-mono text-[11px] text-faint">{item.label_kode || '-'}</p>
                  <div className="mt-1.5">
                    {item.pakai_warna ? (
                      <Badge tone="accent">Pilih warna</Badge>
                    ) : (
                      <Badge>{item.label_kode || 'Kode bahan'}</Badge>
                    )}
                  </div>
                </div>
                <Aksi
                  item={item}
                  onEdit={(dataItem) => setModal({ open: true, item: dataItem })}
                  onDelete={setHapus}
                />
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-line bg-paper text-left text-[11px] font-medium text-muted">
                  <th scope="col" className="px-4 py-2.5">
                    Nama
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Label kode
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Perilaku bahan
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {daftar.map((item) => (
                  <tr key={item.id} className="transition-colors hover:bg-paper/70">
                    <td className="px-4 py-2.5 font-medium text-ink">{item.nama}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted">
                      {item.label_kode || '-'}
                    </td>
                    <td className="px-4 py-2.5">
                      {item.pakai_warna ? (
                        <Badge tone="accent">Pilih warna</Badge>
                      ) : (
                        <Badge>{item.label_kode || 'Kode bahan'}</Badge>
                      )}
                    </td>
                    <td className="px-2 py-2">
                      <Aksi
                        item={item}
                        onEdit={(dataItem) => setModal({ open: true, item: dataItem })}
                        onDelete={setHapus}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
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
