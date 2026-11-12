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

- **Logo**: logo resmi RSUD Zainal Abidin ada di `src/logo/logo_za.jpg`
  (600x300) dan dipasang di `src/components/brand/BrandMark.jsx` setinggi
  40px. Berkas diimpor lewat Vite, bukan disalin ke `public`, supaya ikut
  diproses saat build. Latar putih pada JPG disatukan dengan permukaan header
  memakai `mix-blend-multiply` tanpa mengubah berkasnya. `alt` dikosongkan
  karena nama rumah sakit sudah tertulis di sebelah logo.
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

- Isi dashboard dibatasi kolom 896px dan dipusatkan. Ringkasan tidak perlu
  selebar jendela; kolom sempit membuat angka mudah dipindai.
- Istilah dibedakan secara eksplisit: **jenis** adalah kelompok teknologi
  (Dot Matrix, Inkjet, Laser, Thermal), **tipe atau model** adalah seri printer
  (L135, PO231). Kartu ringkasan menulis "5 model dari 4 jenis" agar angka model
  tidak disalahartikan sebagai jumlah jenis. Penjelasan istilah memakai tombol
  yang bisa dibuka, bukan tooltip hover saja, karena ponsel tidak punya hover.
- Waktu pembaruan terakhir ditulis di samping tombol muat ulang. Saat memuat,
  tombol memakai spinner dan nonaktif; setelah selesai muncul toast singkat
  "Data diperbarui" melalui `aria-live="polite"`.
- Perbandingan memakai tabel peringkat, bukan batang. Batang menuntut pembaca
  menafsirkan panjang relatif, sedangkan tabel menulis angka dan judul kolom
  secara langsung: "Jenis printer" dan "Permintaan". Ini menjawab kebutuhan
  utama dashboard, yaitu data untuk mengambil keputusan.
- Tabel hanya memakai 2-3 kolom pendek, sehingga tetap terbaca di ponsel tanpa
  scroll horizontal. Nomor urut memakai kolom sempit 32px.
- Angka jumlah ditulis utuh dalam mono tebal. Tidak ada persentase karena
  pembacanya butuh jumlah nyata, bukan rasio.
- Nomor urut hanya dipakai pada daftar peringkat (jenis, bulan tersibuk,
  warna, bahan per printer). Tabel bulan kronologis tidak bernomor karena
  urutannya waktu, bukan peringkat.
- Nilai tertinggi ditandai kata "Terbanyak", bukan warna baru. Saat ada seri,
  tanda itu tidak dipakai dan keterangan panel yang menyebutkan nama-nama yang
  sama kuat. Ini menjaga palet tetap satu aksen (R-29).
- Setiap panel dibuka dengan satu kalimat kesimpulan, misalnya "Dot Matrix dan
  Inkjet sama-sama paling sering diminta". Pembaca tidak perlu membandingkan
  angka sendiri untuk tahu jawabannya.
- Metrik dipecah menjadi satu panel per tombol tampilan. Menumpuk semua data
  dalam satu layar membuat halaman panjang dan tidak punya fokus.
- Tombol tampilan tidak lagi membawa angka jumlah. Angka itu tidak punya arti
  yang sama di tiap tab (jenis, printer, bulan, jenis warna) sehingga lebih
  membingungkan daripada membantu.
- Daftar bahan printer memakai akordeon. Baris tertutup sudah menyebut bahan
  terbanyak, jadi rincian hanya dibuka saat ingin melihat sisanya. Daftar dibagi
  6 printer per halaman supaya tinggi halaman tetap stabil saat printer
  bertambah; pindah halaman menutup rincian yang terbuka, dan pencarian, filter,
  atau urutan baru kembali ke halaman 1.
- Panel warna bisa dikelompokkan per tipe printer atau per jenis warna. Mode
  per tipe menjawab "warna apa yang paling sering diminta pada L135" dengan satu
  tipe yang dipilih lewat dropdown, bukan seluruh printer sekaligus. Daftar
  semua tipe tetap tersedia di tab bahan per printer. Mode per jenis menjawab
  gabungan seluruh printer dalam satu jenis. Mode per tipe menjadi tampilan awal
  karena lebih spesifik.
- Kontrol panel diletakkan di kepala panel, bukan di bar filter tersendiri.
  Tombol kelompok dan dropdown memakai label sebaris, sehingga tidak ada satu
  baris penuh yang hanya berisi label di atas kontrol. Di ponsel kontrol turun
  ke baris berikutnya di dalam kepala panel yang sama.
- Panel bulan memakai dropdown "Tampilan bulan" berisi semua bulan dan tiap
  bulan, tanpa ringkasan 6 bulan tersibuk. Tampilan awal adalah bulan terbaru
  yang punya permintaan, jadi panel langsung menampilkan satu angka. Bulan lama
  bisa dibuka langsung tanpa menggulir, dan keterangan menyebut jumlah serta
  peringkat bulan itu.
- Bulan terpilih ditampilkan sebagai satu baris ringkas, bukan tabel satu baris
  dengan judul kolom. Tabel kronologis penuh hanya muncul saat memilih "Semua
  bulan" karena deret panjang tidak langsung menjawab "bulan mana yang ramai".
- Bulan tanpa permintaan tetap bisa dipilih dan ditampilkan dengan nilai nol
  agar jarak waktu tidak menyembunyikan bulan kosong.
- Angka ringkasan ditulis mono dan dipisah garis, bukan kartu ikon, karena yang
  dibaca adalah nilainya, bukan ilustrasinya.
- Form master data printer memberi peringatan lunak, bukan blokir, saat nama
  jenis menyebut merek lain atau saat merek yang sama di data aktif paling
  banyak memakai jenis berbeda. Data lama tetap harus bisa diperbaiki, dan
  kombinasi merek dan jenis tidak bisa divalidasi keras tanpa basis model.

## Implementasi

- Token warna, font, radius, fokus, dan reduced motion: `src/index.css`.
- Kepala bagian bernomor: `src/components/ui/SectionHeader.jsx`.
- Kontrol sebaris dan varian `inline` pada `Select`: `src/components/ui/FormControls.jsx`.
- Tabel peringkat dashboard: `src/features/dashboard/RankingTable.jsx`.
- Pengelompokan warna per tipe/jenis: `src/features/dashboard/WarnaPanel.jsx`.
- Deret bulan berurutan termasuk bulan kosong: `src/features/dashboard/deretBulan.js`.
- Tombol tampilan dashboard: `src/features/dashboard/DashboardTabs.jsx`.
- Baris akordeon bahan printer: `src/features/dashboard/PrinterRow.jsx`.
- Identitas header dan logo resmi: `src/components/brand/BrandMark.jsx`.
- Berkas logo RSUD: `src/logo/logo_za.jpg`.
- Font di-host sendiri dari paket `@fontsource` (IBM Plex Sans dan Plex Mono).

## Larangan lokal

- Tanpa gradien, glow, atau orb.
- Tanpa kartu bayangan di setiap komponen.
- Tanpa badge kapsul berisi label yang sudah dijelaskan judul.
- Tanpa tabel dengan scroll horizontal di ponsel; gunakan daftar kartu.
- Tanpa em dash di teks antarmuka.
