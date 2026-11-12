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
| `faint` | `#6f685c` | Metadata kecil (jam, kode), 4,9:1 di atas kertas dan 4,7:1 di atas accent-soft sehingga tetap lolos AA. |
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
  13px. Tidak ada teks fungsional di bawah 13px, dan tidak ada label huruf
  kapital dengan letter-spacing lebar.
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
- Perbandingan memakai grafik batang horizontal dengan angka di ujung batang,
  bukan tabel sebagai tampilan utama. Sebelumnya tabel dipilih karena batang
  menuntut pembaca menafsirkan panjang relatif. Keputusan itu diubah karena
  angkanya tetap tercetak di ujung tiap batang, sehingga panjang batang hanya
  membantu memindai urutan, bukan satu-satunya sumber nilai.
- Setiap grafik menyediakan tabel peringkat di balik tombol "Lihat sebagai
  tabel". Tabel itu cadangan untuk pembaca layar, pencetakan, dan pembacaan
  angka persis; ia tidak ditampilkan bersamaan agar data tidak digandakan.
- Grafik memakai satu aksen. Pengecualiannya grafik warna: batang memakai warna
  asli (hitam, biru, kuning, magenta) karena warna adalah data yang diminta,
  bukan dekorasi (R-29, R-39).
- Angka jumlah ditulis utuh dalam mono tebal di kolom kanan, bukan persentase,
  karena pembacanya butuh jumlah nyata, bukan rasio.
- Nomor urut hanya dipakai pada peringkat (jenis, warna, bahan per printer,
  printer teratas). Grafik bulan tidak bernomor karena urutannya waktu, bukan
  peringkat.
- Nilai tertinggi ditandai kata "Terbanyak" di tabel cadangan, bukan warna baru.
  Saat ada seri, tanda itu tidak dipakai. Ini menjaga palet tetap satu aksen
  (R-29).
- Setiap panel dibuka dengan penjelasan apa yang dihitung, bukan kalimat
  kesimpulan yang mengulang angka di grafik. Ringkasan seperti "Laser paling
  sering diminta dengan 20 dari 27 permintaan" dihapus karena hanya mengulang
  baris teratas dan cepat basi saat data berubah.
- Metrik dipecah menjadi satu panel per tombol tampilan. Menumpuk semua data
  dalam satu layar membuat halaman panjang dan tidak punya fokus.
- Tombol tampilan tidak lagi membawa angka jumlah maupun nomor urut. Angka itu
  tidak punya arti yang sama di tiap tab (jenis, printer, bulan, jenis warna)
  sehingga lebih membingungkan daripada membantu, dan nomor urut menyiratkan
  langkah berurutan padahal tab bisa dibuka dalam urutan apa pun.
- Tab aktif ditandai garis bawah 3px dan tebal font lebih tinggi. Pilihan
  pengelompokan warna memakai segmented control dua tombol menyatu agar terbaca
  sebagai satu pilihan, bukan dua tombol terpisah.
- Daftar bahan printer memakai akordeon. Baris tertutup sudah menyebut bahan
  terbanyak, jadi rincian hanya dibuka saat ingin melihat sisanya. Daftar dibagi
  6 printer per halaman supaya tinggi halaman tetap stabil saat printer
  bertambah; pindah halaman menutup rincian yang terbuka, dan pencarian, filter,
  atau urutan baru kembali ke halaman 1. Di atas akordeon, grafik menampilkan 10
  printer dengan permintaan terbanyak sesuai filter aktif, jadi angka grafik dan
  daftar tidak pernah berbeda cakupan.
- Panel warna bisa dikelompokkan per tipe printer atau per jenis warna. Mode
  per tipe dimulai dari "Semua tipe printer" agar seluruh warna langsung
  terlihat, lalu dropdown yang sama mempersempit ke satu tipe. Mode per jenis
  menjawab gabungan seluruh printer dalam satu jenis. Daftar semua tipe tetap
  tersedia di tab bahan per printer.
- Kontrol panel diletakkan di kepala panel, bukan di bar filter tersendiri.
  Tombol kelompok dan dropdown memakai label sebaris, sehingga tidak ada satu
  baris penuh yang hanya berisi label di atas kontrol. Di ponsel kontrol turun
  ke baris berikutnya di dalam kepala panel yang sama.
- Panel bulan memakai dropdown "Tampilan bulan" berisi semua bulan dan tiap
  bulan. Tampilan awal adalah "Semua bulan" agar grafik langsung terlihat;
  memilih satu bulan menggantinya dengan satu angka ringkas. Pemilih bulan
  disembunyikan bila hanya ada satu bulan karena tidak ada yang bisa dipilih.
- Grafik bulan baru ditampilkan bila data mencakup minimal tiga bulan. Dengan
  satu atau dua bulan, grafik hanya memperbesar selisih kecil dan menyiratkan
  tren yang belum ada; panel menampilkan keadaan kosong yang menyebut rentang
  serta jumlah datanya.
- Bulan tanpa permintaan tetap muncul di grafik dan tabel dengan nilai nol agar
  jarak waktu tidak menyembunyikan bulan kosong.
- Angka ringkasan ditulis mono dan dipisah garis, bukan kartu ikon, karena yang
  dibaca adalah nilainya, bukan ilustrasinya.
- Filter periode global dipakai bersama oleh semua panel, bukan filter per tab.
  Angka yang tampak berdampingan harus berasal dari cakupan waktu yang sama;
  filter terpisah per panel membuat pembaca membandingkan dua periode tanpa
  sadar. Preset dihitung dari tanggal perangkat, bukan dari data terakhir, agar
  arti "7 hari terakhir" tidak bergeser hanya karena ada data lama. Rentang yang
  sedang aktif selalu ditulis sebagai label, termasuk "Semua data tercatat".
- Delta ringkasan hanya muncul bila periode pembanding berisi data. Periode
  pembanding adalah rentang sepanjang itu tepat sebelum rentang terpilih.
  Menampilkan "0" atau panah turun dari dasar kosong akan menyiratkan perubahan
  yang tidak pernah terjadi.
- "Perlu perhatian" diletakkan di atas tab karena isinya tindak lanjut, bukan
  metrik. Temuan dikelompokkan per tipe printer dan bahan, bukan per bahan saja:
  warna yang sama pada printer berbeda adalah pemakaian normal. Jendela 30 hari
  sengaja tetap dan tidak ikut filter global karena tujuannya menandai
  kemungkinan pencatatan ganda. Strip tidak ditampilkan saat tidak ada temuan;
  peringatan yang selalu ada akan kehilangan makna.
- "Permintaan terbaru" menampilkan lima catatan pada periode terpilih supaya
  angka ringkasan punya contoh yang bisa ditelusuri. Tautan "Lihat semua"
  membawa rentang yang sama ke daftar permintaan, bukan membuang filter tanpa
  penjelasan.
- Grafik bisa ditelusuri dengan mengklik seluruh baris batang, bukan hanya
  labelnya. Tujuan drill-down ditulis di query string agar hasil yang sempit
  bisa dimuat ulang dan dibagikan. Halaman permintaan menampilkan chip filter
  aktif karena hasil yang tersaring tanpa penanda mudah disalahartikan sebagai
  seluruh data; melepas chip juga membersihkan URL supaya muat ulang tidak
  memunculkan kembali filter yang sudah dilepas.
- Ekspor mengikuti tab yang sedang tampil dan memakai data yang terlihat, bukan
  seluruh isi basis data. CSV memakai titik koma dan BOM agar terbuka langsung
  di Excel berlokal Indonesia; Excel memakai tabel HTML `.xls` agar tidak
  menambah dependensi. Nama berkas memuat tab dan tanggal unduh supaya hasil
  beberapa periode tidak saling menimpa.
- Rentang tidak valid, periode kosong, dan kegagalan muat masing-masing punya
  keadaan sendiri. Rentang terbalik tidak boleh menampilkan angka lama seolah
  masih berlaku; dashboard menjelaskan kesalahannya dan menyediakan tombol
  kembali ke semua data.
- Tab dan filter panel disimpan di URL, bukan hanya di state komponen. Tampilan
  hasil saring harus bisa dimuat ulang, dibagikan, dan dibuka kembali dengan
  tombol kembali; state yang hilang saat muat ulang membuat pengguna mengira
  data berubah. Nilai bawaan dihilangkan dari URL agar alamat tetap pendek.
- Saat panel dimuat ulang, isi panel diganti kerangka, bukan seluruh halaman.
  Ringkasan di atas tetap terlihat dan tab tetap bisa dipilih, sehingga pengguna
  tidak kehilangan konteks hanya karena satu permintaan data berjalan.
- Kegagalan muat ulang ditampilkan di dalam tab aktif dengan tombol "Coba lagi".
  Panel yang gagal tidak menghapus pilihan tab atau filter, karena pengguna
  biasanya ingin mencoba ulang tampilan yang sama, bukan memulai dari awal.
- Tombol tab membungkus ke baris berikutnya di ponsel, bukan memakai scroll
  horizontal. Scroll horizontal pada navigasi mudah tidak terlihat dan membuat
  tab terakhir tampak tidak ada; membungkus menjaga semua pilihan terjangkau.
- Label "Admin IT" ditulis sebagai teks biasa karena belum ada menu akun di
  baliknya. Chevron hanya boleh muncul bila benar-benar membuka sesuatu.
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
