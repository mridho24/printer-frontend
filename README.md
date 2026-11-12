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

- Daftar bahan per printer tampil sebagai akordeon dengan pagination 6 printer
  per halaman, jadi tinggi halaman tetap stabil walaupun printer bertambah.
  Pencarian tipe/merek, filter jenis, dan urutan bekerja pada semua printer lalu
  kembali ke halaman 1 saat diubah. Di atas daftar, grafik menampilkan 10 printer
  dengan permintaan terbanyak sesuai filter yang sedang aktif.
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
  features/dashboard/  Tab tampilan, akordeon bahan printer, grafik bulan
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
