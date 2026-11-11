import { formatBulan } from '../../lib/format.js';

/**
 * Melengkapi deret bulan yang bolong dengan nilai 0 agar perbandingan antar
 * bulan tetap terbaca sebagai urutan waktu, bukan lompatan.
 *
 * `kunci` menyimpan bulan mentah "YYYY-MM" supaya pemilih bulan bisa memakai
 * nilai yang sama tanpa menebak dari label.
 */
export function deretBulan(bulanan) {
  const urut = [...bulanan].sort((a, b) => a.bulan.localeCompare(b.bulan));
  if (urut.length === 0) return [];

  const peta = new Map(urut.map((item) => [item.bulan, item.total]));
  const [tahunAwal, bulanAwal] = urut[0].bulan.split('-').map(Number);
  const [tahunAkhir, bulanAkhir] = urut[urut.length - 1].bulan.split('-').map(Number);

  if (!tahunAwal || !bulanAwal || !tahunAkhir || !bulanAkhir) return [];

  const awal = tahunAwal * 12 + (bulanAwal - 1);
  const akhir = tahunAkhir * 12 + (bulanAkhir - 1);
  const hasil = [];

  for (let indeks = awal; indeks <= akhir && hasil.length < 600; indeks += 1) {
    const tahun = Math.floor(indeks / 12);
    const bulan = (indeks % 12) + 1;
    const kunci = `${tahun}-${String(bulan).padStart(2, '0')}`;
    hasil.push({ kunci, nama: formatBulan(kunci), total: peta.get(kunci) ?? 0 });
  }

  return hasil;
}
