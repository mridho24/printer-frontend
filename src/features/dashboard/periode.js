import { formatTanggal, todayISO } from '../../lib/format.js';

export const OPSI_PERIODE = [
  { value: 'semua', label: 'Semua data' },
  { value: '7', label: '7 hari terakhir' },
  { value: '30', label: '30 hari terakhir' },
  { value: 'bulan', label: 'Bulan ini' },
  { value: 'kustom', label: 'Rentang kustom' },
];

function isoLokal(date) {
  const lokal = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return lokal.toISOString().slice(0, 10);
}

export function geserHari(iso, hari) {
  const tanggal = new Date(`${iso}T00:00:00Z`);
  tanggal.setUTCDate(tanggal.getUTCDate() + hari);
  return tanggal.toISOString().slice(0, 10);
}

/**
 * Menerjemahkan pilihan periode menjadi rentang tanggal untuk API.
 * Preset dihitung dari tanggal perangkat, bukan dari data terakhir, supaya
 * arti "7 hari terakhir" tidak berubah hanya karena ada data lama.
 */
export function rentangPeriode(periode, kustom = {}) {
  const hariIni = todayISO();

  if (periode === '7') return { dari: geserHari(hariIni, -6), sampai: hariIni };
  if (periode === '30') return { dari: geserHari(hariIni, -29), sampai: hariIni };
  if (periode === 'bulan') {
    const [tahun, bulan] = hariIni.split('-').map(Number);
    const awal = `${tahun}-${String(bulan).padStart(2, '0')}-01`;
    return { dari: awal, sampai: isoLokal(new Date(tahun, bulan, 0)) };
  }
  if (periode === 'kustom') {
    return { dari: kustom.dari || '', sampai: kustom.sampai || '' };
  }
  return { dari: '', sampai: '' };
}

/** Rentang satu bulan "YYYY-MM", dipakai untuk drill-down grafik bulan. */
export function rentangBulan(kunci) {
  const [tahun, bulan] = String(kunci).split('-').map(Number);
  if (!tahun || !bulan) return { dari: '', sampai: '' };
  const awal = `${tahun}-${String(bulan).padStart(2, '0')}-01`;
  return { dari: awal, sampai: isoLokal(new Date(tahun, bulan, 0)) };
}

export function labelRentang(dari, sampai) {
  if (dari && sampai) {
    return dari === sampai
      ? formatTanggal(dari)
      : `${formatTanggal(dari)} – ${formatTanggal(sampai)}`;
  }
  if (dari) return `Sejak ${formatTanggal(dari)}`;
  if (sampai) return `Sampai ${formatTanggal(sampai)}`;
  return 'Semua data tercatat';
}
