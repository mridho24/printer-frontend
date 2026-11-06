import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Printer, RotateCw, Trash2 } from 'lucide-react';
import { printerApi, jenisApi } from '../../api/index.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import {
  Badge,
  EmptyState,
  ErrorState,
  InlineAlert,
  TableSkeleton,
} from '../../components/ui/Feedback.jsx';
import PrinterFormModal from './PrinterFormModal.jsx';

export default function PrinterTab() {
  const toast = useToast();
  const [jenisFilter, setJenisFilter] = useState('');
  const [modal, setModal] = useState({ open: false, item: null });
  const [hapus, setHapus] = useState(null);
  const [menghapus, setMenghapus] = useState(false);

  const jenis = useFetch(() => jenisApi.list(), []);
  const printer = useFetch(
    () => printerApi.list({ jenis_id: jenisFilter || undefined }),
    [jenisFilter],
  );

  const daftarJenis = useMemo(() => jenis.data ?? [], [jenis.data]);
  const daftarPrinter = printer.data ?? [];
  const jenisTerpilih = daftarJenis.find((item) => item.id === Number(jenisFilter));

  function bukaTambah() {
    setModal({ open: true, item: null });
  }

  async function konfirmasiHapus() {
    if (!hapus) return;
    setMenghapus(true);
    try {
      await printerApi.remove(hapus.tipe);
      toast.success(`Printer "${hapus.merek} ${hapus.tipe}" berhasil dihapus.`);
      setHapus(null);
      printer.reload();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setMenghapus(false);
    }
  }

  const jenisKosong = !jenis.loading && !jenis.error && daftarJenis.length === 0;

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-4 py-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-800">Daftar Printer</h2>
          <p className="mt-0.5 text-xs text-slate-500">
            {printer.loading ? 'Memuat data...' : `${daftarPrinter.length} printer aktif`}
            {jenisTerpilih ? ` pada jenis ${jenisTerpilih.nama}` : ''}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={jenisFilter}
            onChange={(event) => setJenisFilter(event.target.value)}
            aria-label="Filter jenis printer"
            className="h-10 min-w-40 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/15"
          >
            <option value="">Semua jenis</option>
            {daftarJenis.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nama}
              </option>
            ))}
          </select>
          <Button icon={Plus} onClick={bukaTambah} disabled={jenisKosong}>
            Tambah Printer
          </Button>
        </div>
      </div>

      {jenisKosong && (
        <div className="px-4 pt-4">
          <InlineAlert tone="warning" title="Belum ada jenis printer">
            Tambahkan jenis printer terlebih dahulu di tab{' '}
            <Link to="/master-data/jenis" className="font-semibold underline underline-offset-2">
              Jenis
            </Link>
            .
          </InlineAlert>
        </div>
      )}

      {printer.loading ? (
        <TableSkeleton rows={4} columns={5} />
      ) : printer.error ? (
        <ErrorState error={printer.error} onRetry={printer.reload} />
      ) : daftarPrinter.length === 0 ? (
        <EmptyState
          icon={Printer}
          title={jenisTerpilih ? 'Belum ada printer untuk jenis ini' : 'Belum ada data printer'}
          description={
            jenisTerpilih
              ? `Jenis ${jenisTerpilih.nama} belum memiliki printer. Tambahkan printer untuk jenis ini.`
              : 'Tambahkan printer beserta kode bahan agar dapat dipilih pada form permintaan.'
          }
          action={
            !jenisKosong && (
              <Button icon={Plus} onClick={bukaTambah}>
                Tambah Printer
              </Button>
            )
          }
        />
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-4 py-3">Merek</th>
                  <th className="px-4 py-3">Tipe</th>
                  <th className="px-4 py-3">Jenis</th>
                  <th className="px-4 py-3">Kode Bahan</th>
                  <th className="px-4 py-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {daftarPrinter.map((item) => (
                  <tr key={item.tipe} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">{item.merek}</td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-700">{item.tipe}</td>
                    <td className="px-4 py-3 text-slate-600">{item.jenis_nama}</td>
                    <td className="px-4 py-3">
                      {item.pakai_warna ? (
                        <Badge tone="violet">Pilih warna</Badge>
                      ) : (
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
                          {item.kode || '-'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit printer"
                          aria-label={`Edit ${item.tipe}`}
                          onClick={() => setModal({ open: true, item })}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Hapus printer"
                          aria-label={`Hapus ${item.tipe}`}
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

          <div className="flex items-center justify-end gap-2 border-t border-slate-200 px-4 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCw}
              onClick={() => {
                jenis.reload();
                printer.reload();
              }}
            >
              Muat ulang
            </Button>
          </div>
        </>
      )}

      {modal.open && (
        <PrinterFormModal
          item={modal.item}
          jenisList={daftarJenis}
          defaultJenisId={jenisFilter}
          onClose={() => setModal({ open: false, item: null })}
          onSaved={printer.reload}
        />
      )}

      <ConfirmDialog
        open={Boolean(hapus)}
        title="Hapus printer?"
        description={
          hapus
            ? `Printer "${hapus.merek} ${hapus.tipe}" akan dihapus (soft delete). Printer tidak lagi muncul pada pilihan permintaan baru, tetapi riwayat permintaan lama tetap menampilkan data printer ini.`
            : ''
        }
        loading={menghapus}
        onClose={() => setHapus(null)}
        onConfirm={konfirmasiHapus}
      />
    </div>
  );
}
