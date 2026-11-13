import BarChart from './BarChart.jsx';
import TombolEkspor from './TombolEkspor.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';

/**
 * Peringkat jenis printer. Panel ini tampil pertama karena menjawab pertanyaan
 * paling umum: jenis printer mana yang paling sering diminta bahannya.
 *
 * Keterangan panel menjelaskan apa yang dihitung, bukan mengulang angka yang
 * sudah terlihat di batang dan tabel.
 */
export default function JenisPanel({ jenis }) {
  const items = jenis.map((item) => ({
    nama: item.jenis_dihapus ? `${item.nama} (arsip)` : item.nama,
    total: item.total,
    href: item.jenis_id ? `/permintaan?jenis_id=${item.jenis_id}` : undefined,
  }));

  return (
    <Card>
      <SectionHeader
        title="Jenis printer paling sering diminta"
        description="Jumlah permintaan bahan per kelompok jenis printer, dihitung sekali untuk setiap permintaan."
        actions={
          <TombolEkspor
            nama="jenis-printer"
            label="tabel jenis printer"
            kolom={['Jenis printer', 'Permintaan']}
            baris={items.map((item) => [item.nama, item.total])}
          />
        }
      />
      <div className="p-4">
        <BarChart
          items={items}
          bernomor
          kosong="Belum ada jenis dengan permintaan tercatat."
        />
      </div>
    </Card>
  );
}
