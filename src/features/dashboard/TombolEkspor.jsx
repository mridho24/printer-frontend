import { Download, FileSpreadsheet } from 'lucide-react';
import Button from '../../components/ui/Button.jsx';
import { eksporCsv, eksporExcel } from './ekspor.js';

/**
 * Ekspor data tab yang sedang tampil. Nama berkas diberi tanggal agar hasil
 * unduhan beberapa periode tidak saling menimpa.
 */
export default function TombolEkspor({ nama, label, kolom, baris }) {
  const siap = baris.length > 0;

  return (
    <div className="flex items-center gap-1" role="group" aria-label={`Ekspor ${label}`}>
      <Button
        variant="ghost"
        size="sm"
        icon={Download}
        disabled={!siap}
        aria-label={`Ekspor ${label} sebagai CSV`}
        onClick={() => eksporCsv(nama, kolom, baris)}
      >
        CSV
      </Button>
      <Button
        variant="ghost"
        size="sm"
        icon={FileSpreadsheet}
        disabled={!siap}
        aria-label={`Ekspor ${label} sebagai Excel`}
        onClick={() => eksporExcel(nama, kolom, baris)}
      >
        Excel
      </Button>
    </div>
  );
}
