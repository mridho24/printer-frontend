# Printer Frontend

Antarmuka Admin IT untuk mengelola master data jenis/printer dan mencatat
permintaan bahan printer.

Stack: **React 19 + Vite 8 + Tailwind CSS 4 + React Router (HashRouter)**.

## Prasyarat

- Node.js 20+
- Backend berjalan (lihat `../printer-backend/README.md`)

## Konfigurasi

Salin `.env.example` menjadi `.env`:

```env
VITE_API_BASE_URL=/api
```

Saat development, Vite mem-proxy `/api` ke `http://localhost:3000`
(lihat `vite.config.js`). Jika backend berada di origin lain, isi URL penuh,
misalnya `VITE_API_BASE_URL=http://192.168.1.10:3000/api`.

## Menjalankan

```bash
npm install
npm run dev
```

Buka `http://localhost:5173`.

## Script

| Perintah | Fungsi |
|---|---|
| `npm run dev` | Development server + hot reload |
| `npm run build` | Build produksi ke folder `dist/` |
| `npm run preview` | Melihat hasil build secara lokal |
| `npm run lint` | Pemeriksaan kode (oxlint) |

## Halaman

- `#/dashboard`: ringkasan pemantauan permintaan (halaman default)
- `#/permintaan`: daftar + form tambah/edit permintaan
- `#/master-data/jenis`: tab master data jenis
- `#/master-data/printer`: tab master data printer

Dashboard memakai tombol tampilan supaya satu layar hanya memuat satu metrik:
jenis printer, bahan per tipe printer, bulan, atau warna. Pilihan disimpan di
URL (`#/dashboard?tampilan=bahan`), jadi muat ulang dan tombol kembali membuka
tampilan yang sama. Perbandingan ditulis sebagai grafik batang horizontal dengan
angka di ujung batang; tabel peringkat tersedia di balik tombol **Lihat sebagai
tabel** sebagai cadangan untuk pembaca layar, pencetakan, atau pembacaan angka
persis. Batang memakai satu aksen; hanya grafik warna yang memakai warna asli
karena warnanya sendiri adalah data.

Kartu ringkasan membedakan **jenis** (kelompok teknologi, misalnya Inkjet) dari
**tipe atau model** (seri printer, misalnya L135). Kartu "Tipe printer diminta"
menulis "5 model dari 4 jenis" dan menyediakan penjelasan istilah yang bisa
dibuka dengan tombol, jadi angka kartu tidak terbaca sebagai selisih data.
Waktu pembaruan terakhir ditulis di samping tombol **Muat ulang**. Saat memuat,
tombol menampilkan spinner dan tidak bisa ditekan; setelah selesai muncul toast
"Data diperbarui" lewat `aria-live="polite"`.

- Daftar bahan per printer menampilkan rincian lima bahan teratas langsung di
  tiap baris, tanpa akordeon, dengan pagination 6 printer per halaman. Rincian
  yang selalu terbuka menghilangkan satu klik untuk melihat isi baris, sementara
  pagination menjaga tinggi halaman tetap stabil. Pencarian tipe/merek, filter
  jenis, dan urutan bekerja pada semua printer lalu kembali ke halaman 1 saat
  diubah. Di atas daftar, grafik menampilkan 10 printer dengan permintaan
  terbanyak sesuai filter yang sedang aktif.
- Panel bulan punya dropdown **Tampilan bulan** berisi **Semua bulan** dan tiap
  bulan. Tampilan awal adalah **Semua bulan** agar grafik langsung terlihat;
  memilih satu bulan menggantinya dengan satu angka ringkas, termasuk bulan
  bernilai nol. Grafik baru muncul bila data mencakup minimal tiga bulan; di
  bawah itu panel menampilkan keadaan kosong yang menyebut rentang dan jumlah
  datanya. Pemilih bulan disembunyikan bila hanya ada satu bulan.
- Panel warna bisa dikelompokkan **per tipe printer** (default) atau **per jenis
  warna**. Mode per tipe memulai dari **Semua tipe printer**, lalu dropdown
  yang sama bisa mempersempit ke satu tipe. Daftar seluruh tipe ada di tab bahan
  per printer. Panel hanya muncul jika ada printer yang memakai warna.
- Dropdown dan tombol kelompok pada panel bulan dan warna berada di kepala
  panel, bukan di bar filter terpisah, supaya tidak memakan tinggi layar.
- **Filter periode** di atas dashboard berlaku untuk semua panel sekaligus:
  semua data (default), 7 hari terakhir, 30 hari terakhir, bulan ini, atau
  rentang kustom. Angka ringkasan, grafik, perhatian, dan permintaan terbaru
  selalu memakai rentang yang sama, sehingga tidak ada angka dari cakupan waktu
  berbeda. Pilihan disimpan di URL (`periode`, `dari`, `sampai`). Saat rentang
  terbalik, dashboard menampilkan pesan dan tombol **Tampilkan semua data**,
  bukan angka yang menyesatkan. Bila periode sebelumnya berisi data, kartu
  ringkasan menampilkan delta jumlah terhadap periode sepanjang itu.
- **Perlu perhatian** menandai bahan yang sama diminta minimal dua kali untuk
  printer yang sama dalam 30 hari terakhir, misalnya kemungkinan pencatatan
  ganda. Jendela 30 hari sengaja tetap dan tidak ikut filter periode global
  karena tugasnya meninjau kemungkinan duplikat, bukan membandingkan tren. Tiap
  temuan menaut ke daftar permintaan dengan filter tipe, pencarian bahan, dan
  rentang 30 hari tersebut.
- **Permintaan terbaru** menampilkan lima catatan terakhir pada periode
  terpilih. Bagian ini hanya ada di tab **Jenis printer**; tab bahan, bulan, dan
  warna sudah punya rincian sendiri sehingga daftar ringkas di bawahnya hanya
  menambah gulir. **Lihat semua** membawa rentang yang sama ke halaman
  permintaan.
- Grafik dan daftar bisa ditelusuri: batang jenis, printer, bulan, dan warna
  menaut ke `#/permintaan` dengan query string (`jenis_id`, `tipe`, `warna`,
  `dari`, `sampai`). Halaman permintaan membaca query itu, mengirimnya ke API,
  dan menampilkan chip filter aktif. Chip bisa dilepas satu per satu; melepas
  chip juga membersihkan parameternya di URL. Baris printer yang dibuka punya
  tautan **Lihat semua permintaan tipe ini**.
- Setiap tab punya tombol ekspor **CSV** dan **Excel** untuk data tab yang
  sedang tampil. CSV memakai pemisah titik koma dan BOM agar langsung terbuka
  rapi di Excel berlokal Indonesia. Excel memakai `.xlsx` asli yang ditulis
  `write-excel-file` di browser; pustakanya dimuat saat tombol ditekan supaya
  bundel awal tetap kecil. Nama berkas memuat tab dan tanggal unduh.
- Halaman **Permintaan** punya tombol **Ekspor semua data** di kepala halaman.
  Tombol ini mengabaikan pencarian, filter, dan paginasi yang sedang aktif, lalu
  mengunduh satu sheet **Rekap** berisi seluruh permintaan aktif dengan kolom
  `NO`, `TANGGAL`, `NAMA RUANG`, `MEREK PRINTER`, `BLACK`, `MAGENTA`, `BLUE`,
  `YELLOW`, `KODE BAHAN`, `PENERIMA`, dan `TANDA TANGAN`. Urutannya kronologis
  naik, satu judul dan subjudul di atas tabel, orientasi landscape, baris kepala
  beku, dan kolom tanda tangan sengaja kosong untuk ditandatangani setelah
  dicetak.
- **Semua keadaan panel tersimpan di URL**: tab (`tampilan`), periode
  (`periode`, `dari`, `sampai`), bulan (`bulan`), pengelompokan warna
  (`warna_mode`, `warna_tipe`), serta pencarian/filter/urutan/halaman printer
  (`printer_q`, `printer_jenis`, `printer_urut`, `printer_page`). Muat ulang,
  tombol kembali, dan tautan yang dibagikan membuka tampilan yang sama.
- Saat data lama masih ditampilkan dan panel dimuat ulang, isi panel diganti
  kerangka (skeleton). Kegagalan muat ulang menampilkan pesan di dalam tab aktif
  dengan tombol **Coba lagi**, tanpa menghapus pilihan tab. Panel yang tidak
  punya data menampilkan keadaan kosongnya sendiri, misalnya bulan kurang dari
  tiga atau belum ada permintaan warna.
- Di lebar 360px tombol tampilan membungkus ke baris berikutnya, bukan membuat
  scroll horizontal. Semua halaman diuji tanpa scroll horizontal pada lebar itu.

Semua angka dihitung dari permintaan aktif; riwayat printer/jenis yang sudah
di-soft-delete tetap dihitung dan ditandai arsip.

## Perilaku penting

- Form permintaan mengikuti `pakai_warna` dari data jenis/printer:
  - `true` → checkbox black, blue, yellow, magenta (minimal satu).
  - `false` → kode bahan read-only dari data printer, `bahan` tidak dikirim.
- Printer yang sudah di-soft-delete tidak muncul di pilihan baru, tetapi tetap
  tampil pada riwayat dan tetap bisa dipakai saat mengedit permintaan lama.
- Bahan pada permintaan lama adalah snapshot; perubahan kode printer tidak
  mengubah riwayat.
- Error backend (`error.message` dan `error.details`) ditampilkan sebagai pesan
  umum dan error per field.
- Filter tanggal, pencarian debounce, dan paginasi mengikuti kontrak API.
  Filter periode dari dashboard dikirim sebagai `dari`/`sampai`, filter
  drill-down sebagai `jenis_id`, `tipe`, atau `warna`.
- Form printer menampilkan peringatan lunak bila nama jenis menyebut merek lain
  atau bila merek yang sama di data aktif paling banyak memakai jenis berbeda.
  Peringatan tidak memblokir penyimpanan karena data lama tetap harus bisa
  diperbaiki tanpa terhalang.

## Struktur

```
src/
  api/                 Klien fetch + endpoint per resource
  components/layout/   Topbar, layout, page header
  components/ui/       Button, form controls, modal, tabel, toast, dll.
  context/             Toast provider
  features/dashboard/  Tab tampilan, rincian bahan printer, grafik bulan, ekspor
  features/jenis/      Tab & modal jenis
  features/printer/    Tab & modal printer
  features/permintaan/ Form, tabel, filter permintaan
  hooks/               useFetch, useDebounce
  lib/                 Konstanta warna, format tanggal, cn
  pages/               Halaman utama
```

## Build & deploy

```bash
npm run build
```

Hasil build ada di `dist/`. Karena memakai `base: './'` dan `HashRouter`,
folder `dist/` bisa langsung diletakkan di subfolder Apache mana pun tanpa
konfigurasi rewrite, misalnya `C:\xampp\htdocs\printer\`.

Jika frontend dan API berada di origin yang sama melalui reverse proxy,
gunakan `VITE_API_BASE_URL=/api` sebelum build. Jika API diproxy ke
`/printer-api`, build dengan `VITE_API_BASE_URL=/printer-api`.

Panduan lengkap deployment ada di [`../SETUP.md`](../SETUP.md).
