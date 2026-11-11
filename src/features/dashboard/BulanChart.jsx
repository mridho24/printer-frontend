import RankingTable from './RankingTable.jsx';
import { deretBulan } from './deretBulan.js';

export default function BulanChart({ bulanan }) {
  return (
    <RankingTable
      items={deretBulan(bulanan)}
      labelHeader="Bulan"
      satuanHeader="Permintaan"
      tandaiTeratas
      kosong="Belum ada permintaan tercatat."
    />
  );
}
