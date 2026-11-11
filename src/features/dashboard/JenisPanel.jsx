import RankingTable from './RankingTable.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { formatDaftar } from '../../lib/format.js';

/**
 * Peringkat jenis printer. Panel ini tampil pertama karena menjawab pertanyaan
 * paling umum: jenis printer mana yang paling sering diminta bahannya.
 *
 * Keterangan panel ditulis sebagai kesimpulan, bukan sekadar jumlah baris,
 * supaya pembaca tidak perlu membandingkan angka sendiri.
 */
export default function JenisPanel({ jenis }) {
  const total = jenis.reduce((jumlah, item) => jumlah + item.total, 0);
  const puncak = Math.max(...jenis.map((item) => item.total), 0);
  const teratas = jenis.filter((item) => item.total === puncak);
  const namaTeratas = formatDaftar(teratas.map((item) => item.nama));

  let keterangan = 'Belum ada jenis dengan permintaan tercatat.';
  if (jenis.length === 1) {
    keterangan = `${namaTeratas} satu-satunya jenis dengan ${total} permintaan.`;
  } else if (teratas.length === 1) {
    keterangan = `${namaTeratas} paling sering diminta dengan ${puncak} dari ${total} permintaan.`;
  } else if (teratas.length === 2) {
    keterangan = `${namaTeratas} sama-sama paling sering diminta, masing-masing ${puncak} dari ${total} permintaan.`;
  } else if (teratas.length > 2) {
    keterangan = `${teratas.length} jenis sama-sama paling sering diminta, masing-masing ${puncak} dari ${total} permintaan.`;
  }

  return (
    <Card>
      <SectionHeader title="Jenis printer paling sering diminta" description={keterangan} />
      <div className="p-4">
        <RankingTable
          items={jenis.map((item) => ({
            nama: item.jenis_dihapus ? `${item.nama} (arsip)` : item.nama,
            total: item.total,
          }))}
          labelHeader="Jenis printer"
          satuanHeader="Permintaan"
          bernomor
          tandaiTeratas
          kosong="Belum ada jenis dengan permintaan tercatat."
        />
      </div>
    </Card>
  );
}
