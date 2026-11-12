import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Plus, Printer, RotateCw, Trash2 } from 'lucide-react';
import { printerApi, jenisApi } from '../../api/index.js';
import { useFetch } from '../../hooks/useFetch.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { ConfirmDialog } from '../../components/ui/Modal.jsx';
import {
  Badge,
  EmptyState,
  ErrorState,
  InlineAlert,
  TableSkeleton,
} from '../../components/ui/Feedback.jsx';
import PrinterFormModal from './PrinterFormModal.jsx';

function KodeBahan({ item }) {
  if (item.pakai_warna) return <Badge tone="accent">Pilih warna</Badge>;
  return (
    <span className="inline-flex items-center rounded-sm border border-line bg-paper px-1.5 py-0.5 font-mono text-xs font-medium text-ink">
      {item.kode || '-'}
    </span>
  );
}

function Aksi({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        title="Edit printer"
        aria-label={`Edit ${item.tipe}`}
        onClick={() => onEdit(item)}
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="dangerGhost"
        size="icon"
        title="Hapus printer"
        aria-label={`Hapus ${item.tipe}`}
        onClick={() => onDelete(item)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

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
  // Daftar lengkap hanya dibutuhkan saat modal terbuka, untuk membandingkan
  // merek dan jenis tanpa terpengaruh filter tabel.
  const semuaPrinter = useFetch(() => printerApi.list(), [], { enabled: modal.open });

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
      <SectionHeader
        index="01"
        title="Daftar printer"
        description={
          `${printer.loading ? 'Memuat data...' : `${daftarPrinter.length} printer aktif`}` +
          (jenisTerpilih ? ` pada jenis ${jenisTerpilih.nama}` : '')
        }
        actions={
          <>
            <select
              value={jenisFilter}
              onChange={(event) => setJenisFilter(event.target.value)}
              aria-label="Filter jenis printer"
              className="h-10 min-w-40 rounded-md border border-line-strong bg-surface px-2 text-sm text-ink max-lg:h-11"
            >
              <option value="">Semua jenis</option>
              {daftarJenis.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nama}
                </option>
              ))}
            </select>
            <Button
              variant="ghost"
              size="icon"
              icon={RotateCw}
              title="Muat ulang"
              aria-label="Muat ulang data printer"
              onClick={() => {
                jenis.reload();
                printer.reload();
              }}
            />
            <Button icon={Plus} onClick={bukaTambah} disabled={jenisKosong}>
              Tambah Printer
            </Button>
          </>
        }
      />

      {jenisKosong && (
        <div className="px-4 pt-4">
          <InlineAlert tone="warning" title="Belum ada jenis printer">
            Tambahkan jenis printer terlebih dahulu di tab{' '}
            <Link
              to="/master-data/jenis"
              className="font-semibold text-warn underline underline-offset-2"
            >
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
          <ul className="divide-y divide-line md:hidden">
            {daftarPrinter.map((item) => (
              <li key={item.tipe} className="flex items-start justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">{item.merek}</p>
                  <p className="font-mono text-xs text-muted">{item.tipe}</p>
                  <p className="mt-1 text-xs text-faint">{item.jenis_nama}</p>
                  <div className="mt-1.5">
                    <KodeBahan item={item} />
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
                <tr className="border-b border-line bg-paper text-left text-xs font-medium text-muted">
                  <th scope="col" className="px-4 py-2.5">
                    Merek
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Tipe
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Jenis
                  </th>
                  <th scope="col" className="px-4 py-2.5">
                    Kode bahan
                  </th>
                  <th scope="col" className="px-4 py-2.5 text-right">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {daftarPrinter.map((item) => (
                  <tr key={item.tipe} className="transition-colors hover:bg-paper/70">
                    <td className="px-4 py-2.5 font-medium text-ink">{item.merek}</td>
                    <td className="px-4 py-2.5 font-mono text-xs text-muted">{item.tipe}</td>
                    <td className="px-4 py-2.5 text-ink">{item.jenis_nama}</td>
                    <td className="px-4 py-2.5">
                      <KodeBahan item={item} />
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
        <PrinterFormModal
          item={modal.item}
          jenisList={daftarJenis}
          printerList={semuaPrinter.data ?? daftarPrinter}
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
