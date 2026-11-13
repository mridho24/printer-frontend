import { formatBulanPanjang, pecahBahan, todayISO } from '../../lib/format.js';

const GARIS_HEADER = {
  borderColor: '#9a9386',
  borderStyle: 'thin',
  backgroundColor: '#f1e3c3',
  fontWeight: 'bold',
  align: 'center',
  verticalAlign: 'center',
  wrap: true,
};

const GARIS_SEL = {
  borderColor: '#c9c4b8',
  borderStyle: 'thin',
  verticalAlign: 'center',
};

function selCsv(nilai) {
  const teks = String(nilai ?? '');
  if (/[";\r\n]/.test(teks)) return `"${teks.replace(/"/g, '""')}"`;
  return teks;
}

function unduhBlob(nama, blob) {
  const url = URL.createObjectURL(blob);
  const tautan = document.createElement('a');
  tautan.href = url;
  tautan.download = nama;
  document.body.appendChild(tautan);
  tautan.click();
  tautan.remove();
  URL.revokeObjectURL(url);
}

function namaBerkas(nama, ekstensi) {
  return `${nama}-${todayISO()}.${ekstensi}`;
}

/**
 * CSV dengan pemisah titik koma dan BOM, format yang dibuka langsung oleh
 * Excel berlokal Indonesia tanpa dialog pemisah kolom.
 */
export function eksporCsv(nama, kolom, baris) {
  const isi = [kolom, ...baris].map((barisSel) => barisSel.map(selCsv).join(';')).join('\r\n');
  unduhBlob(
    namaBerkas(nama, 'csv'),
    new Blob([`\uFEFF${isi}`], { type: 'text/csv;charset=utf-8' }),
  );
}

let pemuatExcel = null;

/**
 * Pustaka xlsx dimuat saat tombol ekspor ditekan, bukan saat halaman dibuka,
 * supaya bundel awal dashboard tidak ikut membawa penulis spreadsheet.
 */
async function muatPenulisExcel() {
  if (!pemuatExcel) {
    pemuatExcel = import('write-excel-file/browser').then((modul) => modul.default ?? modul);
  }
  return pemuatExcel;
}

function selExcel(nilai) {
  if (nilai instanceof Date) {
    return { value: nilai, type: Date, format: 'dd/mm/yyyy', align: 'center', ...GARIS_SEL };
  }
  if (typeof nilai === 'number') {
    return { value: nilai, type: Number, align: 'right', ...GARIS_SEL };
  }
  return {
    value: nilai === null || nilai === undefined ? '' : String(nilai),
    type: String,
    ...GARIS_SEL,
  };
}

function lebarOtomatis(kolom, baris) {
  return kolom.map((judul, indeks) => {
    const panjang = baris.reduce(
      (maks, barisSel) => Math.max(maks, String(barisSel[indeks] ?? '').length),
      String(judul).length,
    );
    return { width: Math.min(42, Math.max(9, panjang + 2)) };
  });
}

/**
 * Menulis tabel Excel asli (.xlsx). Judul dan subjudul opsional dipakai oleh
 * rekap buku permintaan; ekspor per tab cukup memakai baris kepala kolom.
 */
export async function eksporXlsx({
  nama,
  sheet = 'Data',
  judul,
  subjudul,
  kolom,
  baris,
  lebar,
  orientasi = 'landscape',
}) {
  const tulisExcel = await muatPenulisExcel();
  const jumlahKolom = kolom.length;
  const data = [];

  if (judul) {
    data.push([
      {
        value: judul,
        columnSpan: jumlahKolom,
        fontWeight: 'bold',
        fontSize: 14,
        align: 'center',
        verticalAlign: 'center',
      },
      ...Array(jumlahKolom - 1).fill(null),
    ]);
  }

  if (subjudul) {
    data.push([
      {
        value: subjudul,
        columnSpan: jumlahKolom,
        align: 'center',
        verticalAlign: 'center',
        textColor: '#5b5548',
      },
      ...Array(jumlahKolom - 1).fill(null),
    ]);
  }

  if (judul || subjudul) {
    data.push(Array(jumlahKolom).fill(null));
  }

  data.push(kolom.map((label) => ({ value: label, ...GARIS_HEADER })));
  for (const barisSel of baris) {
    data.push(barisSel.map((nilai) => selExcel(nilai)));
  }

  const kepala = (judul ? 1 : 0) + (subjudul ? 1 : 0) + (judul || subjudul ? 1 : 0);

  const blob = await tulisExcel(data, {
    sheet,
    columns: lebar ?? lebarOtomatis(kolom, baris),
    stickyRowsCount: kepala + 1,
    orientation: orientasi,
    showGridLines: false,
  }).toBlob();

  unduhBlob(nama, blob);
}

/**
 * Ekspor tabel tab dashboard. Nama berkas memuat tab dan tanggal unduh.
 */
export function eksporExcel(nama, kolom, baris) {
  return eksporXlsx({
    nama: namaBerkas(nama, 'xlsx'),
    kolom,
    baris,
    sheet: 'Data',
    lebar: lebarOtomatis(kolom, baris),
  });
}

function labelPeriode(rows) {
  const bulan = [...new Set(rows.map((item) => String(item.tanggal ?? '').slice(0, 7)))]
    .filter((kunci) => /^\d{4}-\d{2}$/.test(kunci))
    .sort();

  if (bulan.length === 0) return '';
  const awal = formatBulanPanjang(bulan[0]);
  const akhir = formatBulanPanjang(bulan[bulan.length - 1]);
  return awal === akhir ? awal : `${awal} sampai ${akhir}`;
}

function tanggalExcel(iso) {
  const teks = String(iso ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(teks)) return '';
  return new Date(`${teks}T12:00:00`);
}

/**
 * Rekap seluruh permintaan dengan susunan kolom seperti buku catatan manual:
 * nomor, tanggal, ruang, jenis printer, merek printer, empat kolom warna, kode
 * bahan, penerima, dan kolom tanda tangan kosong. Tanggal ditulis sebagai
 * tanggal Excel supaya bisa diurutkan dan difilter, bukan teks.
 */
export function eksporLogbook(rows) {
  const kolom = [
    'NO',
    'TANGGAL',
    'NAMA RUANG',
    'JENIS PRINTER',
    'MEREK PRINTER',
    'BLACK',
    'MAGENTA',
    'BLUE',
    'YELLOW',
    'KODE BAHAN',
    'PENERIMA',
    'TANDA TANGAN',
  ];

  const baris = rows.map((item, indeks) => {
    const warna = item.pakai_warna ? pecahBahan(item.bahan).map((nilai) => nilai.toLowerCase()) : [];

    return [
      indeks + 1,
      tanggalExcel(item.tanggal),
      item.nama_ruang ?? '',
      item.jenis_nama ?? '',
      [item.merek, item.tipe].filter(Boolean).join(' '),
      warna.includes('black') ? '\u2713' : '-',
      warna.includes('magenta') ? '\u2713' : '-',
      warna.includes('blue') ? '\u2713' : '-',
      warna.includes('yellow') ? '\u2713' : '-',
      item.pakai_warna ? '' : (item.bahan ?? ''),
      item.nama_peminta ?? '',
      '',
    ];
  });

  return eksporXlsx({
    nama: namaBerkas('rekap-permintaan', 'xlsx'),
    sheet: 'Rekap',
    judul: 'REKAP PERMINTAAN BAHAN PRINTER',
    subjudul: ['RSUD ZA', labelPeriode(rows)].filter(Boolean).join(' \u00b7 '),
    kolom,
    baris,
    lebar: [
      { width: 6 },
      { width: 12 },
      { width: 22 },
      { width: 16 },
      { width: 24 },
      { width: 9 },
      { width: 10 },
      { width: 8 },
      { width: 9 },
      { width: 15 },
      { width: 18 },
      { width: 18 },
    ],
  });
}
