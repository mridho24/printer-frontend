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

- `#/dashboard` — ringkasan pemantauan permintaan (halaman default)
- `#/permintaan` — daftar + form tambah/edit permintaan
- `#/master-data/jenis` — tab master data jenis
- `#/master-data/printer` — tab master data printer

Dashboard menampilkan jenis printer yang paling sering diminta, bahan (kode)
per tipe printer non-warna, warna per tipe printer warna, agregat warna per
jenis warna, dan jumlah permintaan tiap bulan. Semua angka dihitung dari
permintaan aktif; riwayat printer/jenis yang sudah di-soft-delete tetap
dihitung dan ditandai arsip.

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

## Struktur

```
src/
  api/                 Klien fetch + endpoint per resource
  components/layout/   Topbar, layout, page header
  components/ui/       Button, form controls, modal, tabel, toast, dll.
  context/             Toast provider
  features/dashboard/  Batang ringkasan, kartu bahan printer, grafik bulan
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
