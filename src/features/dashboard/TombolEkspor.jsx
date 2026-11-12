import { useState } from 'react';
import { Download, FileSpreadsheet } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { useToast } from '../../hooks/useToast.js';
import { eksporCsv, eksporExcel } from './ekspor.js';

/**
 * Ekspor data tab yang sedang tampil. Nama berkas diberi tanggal agar hasil
 * unduhan beberapa periode tidak saling menimpa. Berkas Excel dibuat di
 * browser, jadi tombol dinonaktifkan selama proses agar tidak terunduh ganda.
 */
export default function TombolEkspor({ nama, label, kolom, baris }) {
  const toast = useToast();
  const [sibuk, setSibuk] = useState(false);
  const siap = baris.length > 0 && !sibuk;

  async function ekspor(jenis) {
    if (!siap) return;
    setSibuk(true);

    try {
      if (jenis === 'csv') {
        eksporCsv(nama, kolom, baris);
      } else {
        await eksporExcel(nama, kolom, baris);
      }
    } catch (err) {
      toast.error(
        err?.message
          ? `Gagal membuat berkas Excel: ${err.message}`
          : 'Gagal membuat berkas Excel. Coba lagi.',
      );
    } finally {
      setSibuk(false);
    }
  }

  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Ekspor ${label}`}>
      <Button
        variant="ghost"
        size="sm"
        icon={Download}
        disabled={!siap}
        aria-busy={sibuk}
        aria-label={`Ekspor ${label} sebagai CSV`}
        onClick={() => ekspor('csv')}
      >
        CSV
      </Button>
      <Button
        variant="ghost"
        size="sm"
        icon={FileSpreadsheet}
        disabled={!siap}
        aria-busy={sibuk}
        aria-label={`Ekspor ${label} sebagai Excel`}
        onClick={() => ekspor('excel')}
      >
        Excel
      </Button>
    </div>
  );
}
