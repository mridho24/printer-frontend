# Arah desain: Buku catatan lab

Panduan ini berlaku untuk seluruh antarmuka Bahan Printer RSUD Zainal Abidin.
Setiap keputusan visual wajib punya alasan satu baris di sini (R-31). Kalau
sebuah teknik tidak bisa dijelaskan alasannya, teknik itu tidak dipakai.

## Design Read

> Aplikasi pencatatan internal untuk Admin IT RSUD Zainal Abidin, gaya buku
> catatan lab (ledger resmi), dial ENERGY 1 / RHYTHM 2 / MOTION 1.

- **ENERGY 1**: ini alat kerja yang dipakai berulang setiap hari, bukan halaman
  promosi. Tidak ada hero, tidak ada ajakan emosional.
- **RHYTHM 2**: ritme dasarnya tenang, dengan satu pembeda di setiap layar
  (indeks bagian dan kepala tabel), bukan variasi komposisi di semua blok.
- **MOTION 1**: hanya hover, fokus, dan transisi masuk modal/toast. Tidak ada
  animasi dekoratif.

## Palet

Maksimal tiga warna inti ditambah satu aksen (R-29). Abu-abu netral tidak
dihitung sebagai warna inti.

| Token | Nilai | Alasan |
| --- | --- | --- |
| `paper` | `#f4f1ea` | Latar kertas hangat, memisahkan aplikasi dari layar SaaS putih dan mengurangi silau saat shift panjang. |
| `surface` | `#fdfbf6` | Permukaan dokumen di atas kertas; kontras lembut tanpa perlu bayangan. |
| `ink` | `#1b1a17` | Tinta hampir hitam dengan sedikit hangat, kontras 16:1 di atas permukaan. |
| `muted` | `#57534a` | Teks sekunder, 7,4:1 di atas permukaan. |
| `faint` | `#736d60` | Metadata kecil (jam, kode), tetap 4,9:1 sehingga lolos AA. |
| `line` | `#ddd7c9` | Garis pemisah 1px sebagai pengganti bayangan. |
| `line-strong` | `#c4bda9` | Batas kontrol (input, tombol sekunder) agar terbaca sebagai elemen yang bisa disentuh. |
| `accent` | `#0f6b5f` | Satu aksen untuk aksi utama dan state aktif; teal institusional, bukan biru default. |
| `accent-strong` | `#0a4f46` | Hover dan teks di atas aksen lembut, 7:1. |
| `accent-soft` | `#e7f0ed` | Latar state aktif dan sorotan baris. |
| `warn` | `#8a5a00` | Status peringatan (rentang tanggal salah, data printer terhapus). |
| `danger` | `#a02c2c` | Tindakan merusak (hapus) dan state gagal. |

Warna status hanya untuk informasi status. Tidak dipakai sebagai dekorasi.

## Tipografi

- **IBM Plex Sans** untuk seluruh teks. Alasan: humanis-teknis, x-height besar
  sehingga nyaman untuk tabel padat, dan tidak termasuk pilihan default model
  (Inter, Geist, Space Grotesk) (R-06).
- **IBM Plex Mono** untuk angka, tanggal, kode tipe printer, dan indeks bagian.
  Alasan: lebar angka seragam membuat kolom tanggal dan jumlah sejajar.
- Skala: judul halaman 24-28px, judul bagian 14px, isi tabel 13px, metadata
  11-12px. Tidak ada label huruf kapital dengan letter-spacing lebar.
- Angka di tabel memakai `tabular-nums`.

Font di-host sendiri lewat `@fontsource` supaya aplikasi tetap tampil benar di
jaringan internal yang tidak membuka Google Fonts (R-40).

## Radius

| Konteks | Radius | Alasan |
| --- | --- | --- |
| Tombol, input, tab | 3px | Terbaca sebagai kontrol presisi, bukan kapsul. |
| Kartu dan modal | 6px | Cukup lembut untuk wadah besar, tetap satu keluarga dengan kontrol. |
| Badge dan chip | 2px | Menandai data, bukan tombol. |

Tidak ada elemen berbentuk pil kecuali switch (bentuknya memang mengikuti
gerakan tuas) (R-11).

## Elevasi

- Permukaan dipisahkan dengan garis 1px `line`, bukan bayangan (R-12).
- Hanya dua elemen yang boleh terangkat: modal dan toast, karena keduanya
  memang berada di atas halaman yang sedang dipakai.
- Tidak ada glassmorphism. Header memakai permukaan solid dan garis bawah
  (R-10).

## Gerak

- Transisi 140-160ms, hanya opacity dan geser 4-6px.
- Modal masuk 140ms, toast 160ms, hover 120ms.
- Semua gerak berhenti pada `prefers-reduced-motion: reduce` (R-39).

## Motif identitas

- **Indeks bagian**: setiap blok besar diberi nomor mono kecil (`01`, `02`) di
  samping judulnya, seperti urutan entri di buku catatan.
- **Garis ganda di kepala halaman**: satu garis tipis di bawah judul halaman,
  satu strip 3px aksen di tepi atas jendela sebagai penanda "dokumen".
- Label status ditulis sebagai kata, bukan titik berwarna.

## Aset

- **Logo**: belum tersedia. `src/components/brand/BrandMark.jsx` memakai
  monogram `ZA` sebagai **placeholder** yang ditandai `TODO` di kode, bukan
  logo resmi. Untuk menggantinya, taruh file resmi di
  `public/logo-rsud.svg`, lalu ganti isi `BrandMark` dengan
  `<img src="/logo-rsud.svg" alt="RSUD Zainal Abidin" width="36" height="36" />`.
  Ruang dan perataan header tidak perlu diubah lagi.
- **Favicon**: `public/favicon.svg` memakai mark garis buku catatan, bukan logo
  Vite bawaan.
- **Ilustrasi**: tidak dipakai. Aplikasi ini bekerja dengan data nyata, bukan
  gambar hiasan (R-22).
- **Avatar pengguna**: tidak dipakai. Peran ditulis sebagai teks.

## Ukuran sentuh

- Di bawah lebar 1024px, semua tombol, tautan, dan select minimal 44px tinggi
  supaya bisa ditekan dengan jempol (R-03).
- Di layar pointer yang lebih lebar, kontrol memakai ukuran padat (36-40px)
  demi kepadatan tabel; ini pilihan sadar, bukan kelalaian.

## Dashboard

- Perbandingan memakai batang horizontal karena labelnya panjang dan beragam
  (nama kode, tipe printer, bulan). Panjang batang yang dibandingkan, bukan
  warna kategori, sehingga tetap terbaca tanpa membedakan warna (R-39).
- Semua batang memakai aksen yang sama; nilai tertinggi ditandai kata
  "Terbanyak", bukan warna baru. Ini menjaga palet tetap satu aksen (R-29).
- Metrik dipecah menjadi satu panel per tombol tampilan. Menumpuk semua grafik
  dalam satu layar membuat halaman panjang dan tidak punya fokus; dengan satu
  panel, tiap layar menjawab satu pertanyaan.
- Angka pada tombol tampilan menunjukkan jumlah data, supaya isi panel sudah
  terbaca sebelum dibuka.
- Daftar bahan printer memakai akordeon. Baris tertutup sudah menyebut bahan
  terbanyak, jadi rincian hanya dibuka saat ingin melihat sisanya. Enam baris
  pertama cukup untuk pembacaan awal; "Tampilkan semua" membuka seluruh daftar
  tanpa berpindah halaman.
- Panel bulan memprioritaskan bulan tersibuk. Grafik kronologis penuh adalah
  tampilan kedua karena deret panjang tidak langsung menjawab "bulan mana yang
  ramai".
- Bulan tanpa permintaan tetap ditampilkan sebagai batang nol agar jarak waktu
  tidak menyembunyikan bulan kosong.
- Angka ringkasan ditulis mono dan dipisah garis, bukan kartu ikon, karena yang
  dibaca adalah nilainya, bukan ilustrasinya.

## Implementasi

- Token warna, font, radius, fokus, dan reduced motion: `src/index.css`.
- Kepala bagian bernomor: `src/components/ui/SectionHeader.jsx`.
- Batang dashboard: `src/features/dashboard/BarList.jsx`.
- Tombol tampilan dashboard: `src/features/dashboard/DashboardTabs.jsx`.
- Baris akordeon bahan printer: `src/features/dashboard/PrinterRow.jsx`.
- Placeholder logo: `src/components/brand/BrandMark.jsx`.
- Font di-host sendiri dari paket `@fontsource` (IBM Plex Sans dan Plex Mono).

## Larangan lokal

- Tanpa gradien, glow, atau orb.
- Tanpa kartu bayangan di setiap komponen.
- Tanpa badge kapsul berisi label yang sudah dijelaskan judul.
- Tanpa tabel dengan scroll horizontal di ponsel; gunakan daftar kartu.
- Tanpa em dash di teks antarmuka.
