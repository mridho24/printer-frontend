import { ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { WARNA, WARNA_META } from '../../lib/constants.js';
import { formatTanggal, isDaftarWarna, pecahBahan } from '../../lib/format.js';
import { cn } from '../../lib/cn.js';
import Button from '../../components/ui/Button.jsx';
import { Badge, EmptyState, ErrorState, TableSkeleton } from '../../components/ui/Feedback.jsx';

function Bahan({ bahan }) {
  if (!bahan) return <span className="text-faint">-</span>;

  if (isDaftarWarna(bahan, WARNA)) {
    return (
      <div className="flex flex-wrap gap-1">
        {pecahBahan(bahan).map((warna) => {
          const meta = WARNA_META[warna.toLowerCase()];
          if (!meta) return null;
          return (
            <span
              key={warna}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-sm border px-1.5 py-0.5 text-[11px] font-medium',
                meta.chip,
              )}
            >
              <span className={cn('h-2 w-2 rounded-sm', meta.dot)} aria-hidden="true" />
              {meta.label}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center rounded-sm border border-line bg-paper px-1.5 py-0.5 font-mono text-[11px] font-medium text-ink">
      {bahan}
    </span>
  );
}

function Aksi({ item, onEdit, onDelete }) {
  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon"
        title="Edit permintaan"
        aria-label={`Edit permintaan ${item.nama_peminta}`}
        onClick={() => onEdit(item)}
      >
        <Pencil className="h-4 w-4" aria-hidden="true" />
      </Button>
      <Button
        variant="dangerGhost"
        size="icon"
        title="Hapus permintaan"
        aria-label={`Hapus permintaan ${item.nama_peminta}`}
        onClick={() => onDelete(item)}
      >
        <Trash2 className="h-4 w-4" aria-hidden="true" />
      </Button>
    </div>
  );
}

function Jam({ value }) {
  const jam = value ? String(value).slice(11, 16).replace(':', '.') : '';
  if (!jam) return null;
  return <span className="font-mono text-[11px] text-faint">{jam}</span>;
}

export default function PermintaanTable({
  rows = [],
  loading,
  error,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
}) {
  if (loading) return <TableSkeleton rows={6} columns={7} />;
  if (error) return <ErrorState error={error} onRetry={onRetry} />;

  if (rows.length === 0) {
    return (
      <EmptyState
        icon={ClipboardList}
        title="Tidak ada data permintaan"
        description="Belum ada permintaan yang cocok dengan filter. Tambahkan permintaan baru atau ubah filter pencarian."
        action={
          <Button icon={Plus} onClick={onAdd}>
            Tambah Permintaan
          </Button>
        }
      />
    );
  }

  return (
    <>
      {/* Ponsel dan tablet: satu daftar kartu, bukan tabel yang diperkecil (R-03). */}
      <ul className="grid gap-3 p-3 sm:grid-cols-2 lg:hidden">
        {rows.map((item) => (
          <li key={item.id} className="rounded-md border border-line p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-[13px] font-medium tabular-nums text-ink">
                  {formatTanggal(item.tanggal)}
                </p>
                <Jam value={item.created_at} />
              </div>
              <Aksi item={item} onEdit={onEdit} onDelete={onDelete} />
            </div>

            <dl className="mt-2 space-y-1.5 text-[13px]">
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-faint">Jenis</dt>
                <dd className="min-w-0 text-ink">
                  {item.jenis_nama || '-'}
                  {item.label_kode && (
                    <span className="ml-1.5 font-mono text-[11px] text-faint">
                      {item.label_kode}
                    </span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-faint">Printer</dt>
                <dd className="min-w-0 text-ink">
                  {item.merek || '-'}
                  {item.tipe && (
                    <span className="ml-1.5 font-mono text-[11px] text-muted">{item.tipe}</span>
                  )}
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-faint">Bahan</dt>
                <dd className="min-w-0">
                  <Bahan bahan={item.bahan} />
                </dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-faint">Peminta</dt>
                <dd className="min-w-0 text-ink">{item.nama_peminta}</dd>
              </div>
              <div className="flex gap-2">
                <dt className="w-16 shrink-0 text-faint">Ruang</dt>
                <dd className="min-w-0 text-ink">{item.nama_ruang}</dd>
              </div>
            </dl>

            {item.printer_dihapus && (
              <Badge tone="warn" className="mt-2">
                Printer sudah dihapus
              </Badge>
            )}
          </li>
        ))}
      </ul>

      {/* Layar lebar: tabel penuh dengan angka sejajar. */}
      <div className="hidden lg:block">
        <table className="w-full text-[13px]">
          <thead>
            <tr className="border-b border-line bg-paper text-left text-[11px] font-medium text-muted">
              <th scope="col" className="px-4 py-2.5">
                Tanggal
              </th>
              <th scope="col" className="px-4 py-2.5">
                Jenis
              </th>
              <th scope="col" className="px-4 py-2.5">
                Printer
              </th>
              <th scope="col" className="px-4 py-2.5">
                Bahan
              </th>
              <th scope="col" className="px-4 py-2.5">
                Nama peminta
              </th>
              <th scope="col" className="px-4 py-2.5">
                Ruang
              </th>
              <th scope="col" className="px-4 py-2.5 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map((item) => (
              <tr key={item.id} className="align-top transition-colors hover:bg-paper/70">
                <td className="px-4 py-2.5 whitespace-nowrap">
                  <p className="font-medium tabular-nums text-ink">
                    {formatTanggal(item.tanggal)}
                  </p>
                  <p className="mt-0.5" title="Waktu pencatatan">
                    <Jam value={item.created_at} />
                  </p>
                </td>
                <td className="px-4 py-2.5">
                  <p className="text-ink">{item.jenis_nama || '-'}</p>
                  {item.label_kode && (
                    <p className="font-mono text-[11px] text-faint">{item.label_kode}</p>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <p className="text-ink">{item.merek || '-'}</p>
                  <p className="font-mono text-[11px] text-faint">{item.tipe}</p>
                  {item.printer_dihapus && (
                    <Badge tone="warn" className="mt-1">
                      Printer sudah dihapus
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-2.5">
                  <Bahan bahan={item.bahan} />
                </td>
                <td className="px-4 py-2.5 text-ink">{item.nama_peminta}</td>
                <td className="px-4 py-2.5 text-ink">{item.nama_ruang}</td>
                <td className="px-2 py-2.5">
                  <Aksi item={item} onEdit={onEdit} onDelete={onDelete} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
