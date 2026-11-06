import { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Loader2 } from 'lucide-react';
import { jenisApi, permintaanApi, printerApi, warnaApi } from '../../api/index.js';
import { fieldErrors } from '../../api/client.js';
import { WARNA, WARNA_META } from '../../lib/constants.js';
import { isDaftarWarna, pecahBahan, todayISO } from '../../lib/format.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import {
  CheckboxCard,
  Field,
  Input,
  ReadOnlyValue,
  Select,
} from '../../components/ui/FormControls.jsx';
import { Badge, ErrorState, InlineAlert } from '../../components/ui/Feedback.jsx';

function buatFormAwal(item) {
  const pakaiWarna =
    Boolean(item?.pakai_warna) || (item ? isDaftarWarna(item.bahan, WARNA) : false);

  return {
    jenis_id: item?.jenis_id ? String(item.jenis_id) : '',
    printer_tipe: item?.printer_tipe ?? '',
    warna: pakaiWarna
      ? pecahBahan(item?.bahan)
          .map((warna) => warna.toLowerCase())
          .filter((warna) => WARNA.includes(warna))
      : [],
    tanggal: item?.tanggal ?? todayISO(),
    nama_peminta: item?.nama_peminta ?? '',
    nama_ruang: item?.nama_ruang ?? '',
  };
}

export default function PermintaanFormModal({ open, item, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() => buatFormAwal(item));
  const [jenisList, setJenisList] = useState([]);
  const [warnaList, setWarnaList] = useState(WARNA);
  const [memuatReferensi, setMemuatReferensi] = useState(true);
  const [errorReferensi, setErrorReferensi] = useState(null);
  const [cobaanReferensi, setCobaanReferensi] = useState(0);

  const [printers, setPrinters] = useState([]);
  const [memuatPrinter, setMemuatPrinter] = useState(() => Boolean(item?.jenis_id));
  const [errorPrinter, setErrorPrinter] = useState(null);
  const [cobaanPrinter, setCobaanPrinter] = useState(0);

  const [errors, setErrors] = useState({});
  const [pesanServer, setPesanServer] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  // Muat referensi jenis & daftar warna.
  useEffect(() => {
    let aktif = true;

    Promise.all([jenisApi.list(), warnaApi.list()])
      .then(([hasilJenis, hasilWarna]) => {
        if (!aktif) return;
        setJenisList(hasilJenis?.data ?? []);
        setWarnaList(hasilWarna?.data?.length ? hasilWarna.data : WARNA);
      })
      .catch((err) => {
        if (aktif) setErrorReferensi(err);
      })
      .finally(() => {
        if (aktif) setMemuatReferensi(false);
      });

    return () => {
      aktif = false;
    };
  }, [cobaanReferensi]);

  // Muat printer aktif untuk jenis terpilih. Printer lama yang sudah
  // soft delete tetap disisipkan agar riwayat bisa diedit.
  useEffect(() => {
    const jenisId = form.jenis_id;
    if (!jenisId) return undefined;

    let aktif = true;

    printerApi
      .list({ jenis_id: jenisId })
      .then((hasil) => {
        if (!aktif) return;
        const daftar = [...(hasil?.data ?? [])];
        const perluPrinterLama =
          item?.printer_tipe &&
          String(item.jenis_id) === String(jenisId) &&
          !daftar.some((printer) => printer.tipe === item.printer_tipe);

        if (perluPrinterLama) {
          daftar.unshift({
            tipe: item.printer_tipe,
            merek: item.merek,
            kode: item.pakai_warna ? null : item.bahan,
            pakai_warna: Boolean(item.pakai_warna) || isDaftarWarna(item.bahan, WARNA),
            printer_dihapus: true,
            bahan_lama: item.bahan,
          });
        }

        setPrinters(daftar);
      })
      .catch((err) => {
        if (aktif) setErrorPrinter(err);
      })
      .finally(() => {
        if (aktif) setMemuatPrinter(false);
      });

    return () => {
      aktif = false;
    };
  }, [form.jenis_id, item, cobaanPrinter]);

  const jenisOptions = useMemo(() => {
    const daftar = [...jenisList];
    if (item?.jenis_id && !daftar.some((jenis) => jenis.id === item.jenis_id)) {
      daftar.unshift({
        id: item.jenis_id,
        nama: item.jenis_nama,
        label_kode: item.label_kode,
        pakai_warna: Boolean(item.pakai_warna),
        dihapus: true,
      });
    }
    return daftar;
  }, [jenisList, item]);

  const jenisTerpilih = jenisOptions.find((jenis) => String(jenis.id) === form.jenis_id);
  const printerTerpilih = printers.find((printer) => printer.tipe === form.printer_tipe);
  const modeWarna = Boolean(
    printerTerpilih ? printerTerpilih.pakai_warna : jenisTerpilih?.pakai_warna,
  );
  const printerDihapus = Boolean(printerTerpilih?.printer_dihapus);
  const printerTetap = Boolean(item && item.printer_tipe === form.printer_tipe);

  let kodeTampil = printerTerpilih?.kode || printerTerpilih?.bahan_lama || '';
  if (printerTetap && item?.bahan && !modeWarna) {
    kodeTampil = item.bahan;
  }

  function ubah(field, value) {
    setForm((sebelumnya) => ({ ...sebelumnya, [field]: value }));
    setErrors((sebelumnya) => ({ ...sebelumnya, [field]: undefined }));
  }

  function ubahJenis(value) {
    setForm((sebelumnya) => ({
      ...sebelumnya,
      jenis_id: value,
      printer_tipe: '',
      warna: [],
    }));
    setErrors((sebelumnya) => ({
      ...sebelumnya,
      jenis_id: undefined,
      printer_tipe: undefined,
      warna: undefined,
    }));
    setPrinters([]);
    setErrorPrinter(null);
    setMemuatPrinter(Boolean(value));
  }

  function ubahPrinter(value) {
    setForm((sebelumnya) => ({ ...sebelumnya, printer_tipe: value, warna: [] }));
    setErrors((sebelumnya) => ({ ...sebelumnya, printer_tipe: undefined, warna: undefined }));
  }

  function toggleWarna(warna, dicentang) {
    setForm((sebelumnya) => ({
      ...sebelumnya,
      warna: dicentang
        ? [...sebelumnya.warna.filter((itemWarna) => itemWarna !== warna), warna]
        : sebelumnya.warna.filter((itemWarna) => itemWarna !== warna),
    }));
    setErrors((sebelumnya) => ({ ...sebelumnya, warna: undefined }));
  }

  async function simpan(event) {
    event.preventDefault();
    const kesalahan = {};

    if (!form.jenis_id) kesalahan.jenis_id = 'Pilih jenis printer.';
    if (!form.printer_tipe) kesalahan.printer_tipe = 'Pilih printer yang diminta.';
    if (!form.tanggal) kesalahan.tanggal = 'Tanggal permintaan wajib diisi.';
    if (!form.nama_peminta.trim()) kesalahan.nama_peminta = 'Nama peminta wajib diisi.';
    if (form.nama_peminta.trim().length > 150) kesalahan.nama_peminta = 'Maksimal 150 karakter.';
    if (!form.nama_ruang.trim()) kesalahan.nama_ruang = 'Nama ruang wajib diisi.';
    if (form.nama_ruang.trim().length > 150) kesalahan.nama_ruang = 'Maksimal 150 karakter.';
    if (modeWarna && form.warna.length === 0) {
      kesalahan.warna = 'Pilih minimal satu warna.';
    }

    setErrors(kesalahan);
    if (Object.keys(kesalahan).length > 0) return;

    const payload = {
      printer_tipe: form.printer_tipe,
      tanggal: form.tanggal,
      nama_peminta: form.nama_peminta.trim(),
      nama_ruang: form.nama_ruang.trim(),
    };

    if (modeWarna) {
      payload.warna = WARNA.filter((warna) => form.warna.includes(warna));
    }

    setMenyimpan(true);
    setPesanServer('');
    try {
      if (item) {
        await permintaanApi.update(item.id, payload);
        toast.success(`Permintaan untuk "${payload.nama_peminta}" berhasil diperbarui.`);
      } else {
        await permintaanApi.create(payload);
        toast.success(`Permintaan untuk "${payload.nama_peminta}" berhasil disimpan.`);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      const kesalahanField = fieldErrors(err);
      if (err.code === 'WARNA_WAJIB' || err.code === 'WARNA_TIDAK_VALID') {
        kesalahanField.warna = err.message;
      }
      if (err.code === 'KODE_PRINTER_KOSONG') {
        kesalahanField.printer_tipe = err.message;
      }
      setErrors(kesalahanField);
      setPesanServer(err.message);
    } finally {
      setMenyimpan(false);
    }
  }

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose} disabled={menyimpan}>
        Batal
      </Button>
      <Button
        type="submit"
        form="form-permintaan"
        loading={menyimpan}
        disabled={memuatReferensi || Boolean(errorReferensi)}
      >
        {item ? 'Simpan Perubahan' : 'Simpan Permintaan'}
      </Button>
    </>
  );

  return (
    <Modal
      open={open}
      onClose={menyimpan ? () => {} : onClose}
      title={item ? 'Edit Permintaan' : 'Tambah Permintaan'}
      description="Pilih printer terlebih dahulu. Jenis bahan akan menyesuaikan otomatis."
      size="lg"
      footer={footer}
    >
      {memuatReferensi ? (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-slate-500">
          <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
          Memuat data referensi...
        </div>
      ) : errorReferensi ? (
        <ErrorState
          error={errorReferensi}
          onRetry={() => {
            setMemuatReferensi(true);
            setErrorReferensi(null);
            setCobaanReferensi((nilai) => nilai + 1);
          }}
        />
      ) : (
        <form id="form-permintaan" onSubmit={simpan} className="space-y-5">
          {pesanServer && <InlineAlert tone="danger">{pesanServer}</InlineAlert>}

          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                1
              </span>
              <h3 className="text-sm font-semibold text-slate-800">Printer yang Diminta</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Select
                label="Jenis Printer"
                required
                value={form.jenis_id}
                onChange={(event) => ubahJenis(event.target.value)}
                error={errors.jenis_id}
              >
                <option value="">Pilih jenis</option>
                {jenisOptions.map((jenis) => (
                  <option key={jenis.id} value={jenis.id}>
                    {jenis.nama}
                    {jenis.dihapus ? ' (sudah dihapus)' : ''}
                  </option>
                ))}
              </Select>

              <Select
                label="Printer"
                required
                value={form.printer_tipe}
                onChange={(event) => ubahPrinter(event.target.value)}
                error={errors.printer_tipe}
                disabled={!form.jenis_id || memuatPrinter || Boolean(errorPrinter)}
                hint={
                  form.jenis_id && !memuatPrinter && printers.length === 0
                    ? 'Belum ada printer aktif untuk jenis ini.'
                    : undefined
                }
              >
                <option value="">
                  {memuatPrinter ? 'Memuat printer...' : 'Pilih printer'}
                </option>
                {printers.map((printer) => (
                  <option key={printer.tipe} value={printer.tipe}>
                    {printer.merek} — {printer.tipe}
                    {printer.printer_dihapus ? ' (printer sudah dihapus)' : ''}
                  </option>
                ))}
              </Select>
            </div>

            {errorPrinter && (
              <InlineAlert tone="danger">
                Gagal memuat printer: {errorPrinter.message}
                <button
                  type="button"
                  onClick={() => {
                    setMemuatPrinter(true);
                    setErrorPrinter(null);
                    setCobaanPrinter((nilai) => nilai + 1);
                  }}
                  className="ml-1 font-semibold underline underline-offset-2"
                >
                  Coba lagi
                </button>
              </InlineAlert>
            )}

            {jenisTerpilih?.dihapus && (
              <InlineAlert tone="warning" title="Jenis printer sudah dihapus">
                Jenis ini tidak tersedia untuk permintaan baru. Permintaan lama tetap dapat diedit.
              </InlineAlert>
            )}

            {printerDihapus && (
              <InlineAlert tone="warning" title="Printer sudah dihapus">
                Printer ini tidak lagi muncul pada pilihan permintaan baru. Data riwayat tetap dapat
                disimpan tanpa mengganti printer.
              </InlineAlert>
            )}

            {form.jenis_id && !memuatPrinter && printers.length === 0 && !errorPrinter && (
              <InlineAlert tone="warning">
                Jenis ini belum memiliki printer. Tambahkan printer terlebih dahulu di halaman Master
                Data.
              </InlineAlert>
            )}
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                2
              </span>
              <h3 className="text-sm font-semibold text-slate-800">Bahan yang Diminta</h3>
              {modeWarna && <Badge tone="violet">Pilihan warna</Badge>}
            </div>

            {!form.printer_tipe ? (
              <p className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-5 text-center text-sm text-slate-500">
                Pilih printer terlebih dahulu untuk melihat bahan yang diminta.
              </p>
            ) : modeWarna ? (
              <Field error={errors.warna}>
                <div className="grid gap-2 sm:grid-cols-2">
                  {warnaList.map((warna) => {
                    const meta = WARNA_META[warna] || {
                      label: warna,
                      swatch: 'bg-slate-400',
                    };
                    return (
                      <CheckboxCard
                        key={warna}
                        checked={form.warna.includes(warna)}
                        onChange={(dicentang) => toggleWarna(warna, dicentang)}
                        label={meta.label}
                        swatch={meta.swatch}
                      />
                    );
                  })}
                </div>
                <p className="text-xs text-slate-500">
                  Minimal satu warna. Urutan penyimpanan: black, blue, yellow, magenta.
                </p>
              </Field>
            ) : (
              <ReadOnlyValue
                label={jenisTerpilih?.label_kode || 'Kode Bahan'}
                value={kodeTampil}
                hint="Diambil otomatis dari data printer dan tidak dapat diubah dari form ini."
                placeholder="Printer belum memiliki kode bahan"
              />
            )}
          </section>

          <section className="space-y-4 border-t border-slate-200 pt-5">
            <div className="flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                3
              </span>
              <h3 className="text-sm font-semibold text-slate-800">Data Permintaan</h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <Input
                label="Tanggal"
                type="date"
                required
                value={form.tanggal}
                onChange={(event) => ubah('tanggal', event.target.value)}
                error={errors.tanggal}
              />
              <Input
                label="Nama Peminta"
                required
                maxLength={150}
                placeholder="Contoh: Budi"
                value={form.nama_peminta}
                onChange={(event) => ubah('nama_peminta', event.target.value)}
                error={errors.nama_peminta}
              />
              <Input
                label="Nama Ruang"
                required
                maxLength={150}
                placeholder="Contoh: Ruang IT"
                value={form.nama_ruang}
                onChange={(event) => ubah('nama_ruang', event.target.value)}
                error={errors.nama_ruang}
              />
            </div>
          </section>

          {item && (
            <p className="flex items-start gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
              <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              Bahan pada permintaan lama adalah snapshot. Mengubah kode printer di Master Data tidak
              mengubah bahan pada riwayat ini.
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}
