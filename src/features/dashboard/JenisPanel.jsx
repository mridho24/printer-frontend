import BarList from './BarList.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';

/**
 * Peringkat jenis printer. Panel ini yang tampil pertama karena menjawab
 * pertanyaan paling umum: jenis printer mana yang paling sering diminta.
 */
export default function JenisPanel({ jenis }) {
  return (
    <Card>
      <SectionHeader
        title="Jenis printer paling sering diminta"
        description={`${jenis.length} jenis memiliki permintaan tercatat.`}
      />
      <div className="p-4">
        <BarList
          items={jenis.map((item) => ({
            nama: item.jenis_dihapus ? `${item.nama} (arsip)` : item.nama,
            total: item.total,
          }))}
          tandaiTeratas
          bernomor
          kosong="Belum ada jenis dengan permintaan tercatat."
        />
      </div>
    </Card>
  );
}
