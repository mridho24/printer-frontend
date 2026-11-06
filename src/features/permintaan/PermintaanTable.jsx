import { ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react';
import { WARNA, WARNA_META } from '../../lib/constants.js';
import { formatTanggal, formatWaktu, isDaftarWarna, pecahBahan } from '../../lib/format.js';
import Button from '../../components/ui/Button.jsx';
import { Badge, EmptyState, ErrorState, TableSkeleton } from '../../components/ui/Feedback.jsx';

function TampilanBahan({ bahan }) {
  if (!bahan) return <span className="text-slate-400">-</span>;

  if (isDaftarWarna(bahan, WARNA)) {
    return (
      <div className="flex flex-wrap gap-1">
        {pecahBahan(bahan).map((warna) => {
          const meta = WARNA_META[warna.toLowerCase()];
          if (!meta) return null;
          return (
            <span
              key={warna}
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-semibold ${meta.chip}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
              {meta.label}
            </span>
          );
        })}
      </div>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-mono text-xs font-semibold text-slate-700">
      {bahan}
    </span>
  );
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
    <div className="overflow-x-auto">
      <table className="min-w-[980px] text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            <th className="px-4 py-3">Tanggal</th>
            <th className="px-4 py-3">Jenis</th>
            <th className="px-4 py-3">Printer</th>
            <th className="px-4 py-3">Bahan</th>
            <th className="px-4 py-3">Nama Peminta</th>
            <th className="px-4 py-3">Ruang</th>
            <th className="px-4 py-3 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((item) => (
            <tr key={item.id} className="align-top transition hover:bg-slate-50/80">
              <td className="px-4 py-3 whitespace-nowrap">
                <p className="font-semibold text-slate-900">{formatTanggal(item.tanggal)}</p>
                <p className="mt-0.5 text-[11px] text-slate-400" title="Waktu pencatatan">
                  {formatWaktu(item.created_at)}
                </p>
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-700">{item.jenis_nama || '-'}</p>
                {item.label_kode && <p className="text-[11px] text-slate-400">{item.label_kode}</p>}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-slate-800">{item.merek || '-'}</p>
                <p className="font-mono text-[11px] text-slate-500">{item.tipe}</p>
                {item.printer_dihapus && (
                  <Badge tone="amber" className="mt-1">
                    Printer sudah dihapus
                  </Badge>
                )}
              </td>
              <td className="px-4 py-3">
                <TampilanBahan bahan={item.bahan} />
              </td>
              <td className="px-4 py-3 text-slate-700">{item.nama_peminta}</td>
              <td className="px-4 py-3 text-slate-700">{item.nama_ruang}</td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Edit permintaan"
                    aria-label={`Edit permintaan ${item.nama_peminta}`}
                    onClick={() => onEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    title="Hapus permintaan"
                    aria-label={`Hapus permintaan ${item.nama_peminta}`}
                    className="text-rose-500 hover:bg-rose-50 hover:text-rose-700"
                    onClick={() => onDelete(item)}
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
  );
}
