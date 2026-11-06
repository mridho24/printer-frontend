const NAMA_BULAN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'Mei',
  'Jun',
  'Jul',
  'Agu',
  'Sep',
  'Okt',
  'Nov',
  'Des',
];

/**
 * Format tanggal ISO (YYYY-MM-DD) menjadi "4 Nov 2026" tanpa pergeseran zona waktu.
 */
export function formatTanggal(value) {
  if (!value) return '-';
  const bagian = String(value).slice(0, 10).split('-');
  if (bagian.length !== 3) return String(value);
  const [tahun, bulan, hari] = bagian.map(Number);
  if (!tahun || !bulan || !hari) return String(value);
  return `${hari} ${NAMA_BULAN[bulan - 1]} ${tahun}`;
}

/**
 * Format DATETIME "YYYY-MM-DD HH:mm:ss" menjadi "4 Nov 2026, 10.30".
 */
export function formatWaktu(value) {
  if (!value) return '-';
  const teks = String(value);
  const tanggal = formatTanggal(teks);
  const jam = teks.slice(11, 16);
  return jam ? `${tanggal}, ${jam.replace(':', '.')}` : tanggal;
}

/**
 * Tanggal hari ini menurut waktu lokal, bukan UTC.
 */
export function todayISO() {
  const sekarang = new Date();
  const lokal = new Date(sekarang.getTime() - sekarang.getTimezoneOffset() * 60000);
  return lokal.toISOString().slice(0, 10);
}

export function pecahBahan(value) {
  return String(value ?? '')
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export function isDaftarWarna(value, daftarWarna) {
  const potongan = pecahBahan(value);
  if (potongan.length === 0) return false;
  return potongan.every((item) => daftarWarna.includes(item.toLowerCase()));
}
