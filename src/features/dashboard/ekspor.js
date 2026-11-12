import { todayISO } from '../../lib/format.js';

function selCsv(nilai) {
  const teks = String(nilai ?? '');
  if (/[";\r\n]/.test(teks)) return `"${teks.replace(/"/g, '""')}"`;
  return teks;
}

function unduh(nama, tipe, isi) {
  const blob = new Blob([isi], { type: tipe });
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
  unduh(namaBerkas(nama, 'csv'), 'text/csv;charset=utf-8', `\uFEFF${isi}`);
}

function selHtml(nilai) {
  return String(nilai ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/**
 * Excel menerima tabel HTML dengan ekstensi .xls. Cara ini tidak memerlukan
 * pustaka tambahan; angkanya tetap bisa dibuka dan dihitung di Excel.
 */
export function eksporExcel(nama, kolom, baris) {
  const kepala = `<tr>${kolom.map((judul) => `<th>${selHtml(judul)}</th>`).join('')}</tr>`;
  const isi = baris
    .map((barisSel) => `<tr>${barisSel.map((sel) => `<td>${selHtml(sel)}</td>`).join('')}</tr>`)
    .join('');
  const html = `<!doctype html><html><head><meta charset="utf-8"><style>table{border-collapse:collapse}th,td{border:1px solid #999;padding:4px 8px;text-align:left}th{background:#eee}</style></head><body><table>${kepala}${isi}</table></body></html>`;
  unduh(namaBerkas(nama, 'xls'), 'application/vnd.ms-excel;charset=utf-8', `\uFEFF${html}`);
}
