import { useState } from 'react';
import { printerApi } from '../../api/index.js';
import { fieldErrors } from '../../api/client.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Input, ReadOnlyValue, Select } from '../../components/ui/FormControls.jsx';
import { InlineAlert } from '../../components/ui/Feedback.jsx';

const FORM_KOSONG = {
  tipe: '',
  jenis_id: '',
  merek: '',
  kode: '',
};

export default function PrinterFormModal({
  item,
  jenisList = [],
  defaultJenisId = '',
  onClose,
  onSaved,
}) {
  const toast = useToast();
  const [form, setForm] = useState(() =>
    item
      ? {
          tipe: item.tipe ?? '',
          jenis_id: String(item.jenis_id ?? ''),
          merek: item.merek ?? '',
          kode: item.kode ?? '',
        }
      : {
          ...FORM_KOSONG,
          jenis_id: String(defaultJenisId || ''),
        },
  );
  const [errors, setErrors] = useState({});
  const [pesanServer, setPesanServer] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  const jenisTerpilih = jenisList.find((jenis) => jenis.id === Number(form.jenis_id));
  const pakaiWarna = Boolean(jenisTerpilih?.pakai_warna);

  function ubah(field, value) {
    setForm((sebelumnya) => ({ ...sebelumnya, [field]: value }));
    setErrors((sebelumnya) => ({ ...sebelumnya, [field]: undefined }));
  }

  function ubahJenis(value) {
    const jenisBaru = jenisList.find((jenis) => jenis.id === Number(value));
    setForm((sebelumnya) => ({
      ...sebelumnya,
      jenis_id: value,
      kode: jenisBaru?.pakai_warna ? '' : sebelumnya.kode,
    }));
    setErrors((sebelumnya) => ({ ...sebelumnya, jenis_id: undefined, kode: undefined }));
  }

  async function simpan(event) {
    event.preventDefault();
    const kesalahan = {};

    if (!form.tipe.trim()) kesalahan.tipe = 'Tipe printer wajib diisi.';
    if (form.tipe.trim().length > 100) kesalahan.tipe = 'Maksimal 100 karakter.';
    if (!form.jenis_id) kesalahan.jenis_id = 'Jenis printer wajib dipilih.';
    if (!form.merek.trim()) kesalahan.merek = 'Merek printer wajib diisi.';
    if (form.merek.trim().length > 100) kesalahan.merek = 'Maksimal 100 karakter.';
    if (form.jenis_id && !pakaiWarna && !form.kode.trim()) {
      kesalahan.kode = 'Kode bahan wajib diisi untuk jenis non-warna.';
    }
    if (form.kode.trim().length > 100) kesalahan.kode = 'Maksimal 100 karakter.';

    setErrors(kesalahan);
    if (Object.keys(kesalahan).length > 0) return;

    const payload = {
      tipe: form.tipe.trim(),
      jenis_id: Number(form.jenis_id),
      merek: form.merek.trim(),
      kode: pakaiWarna ? null : form.kode.trim(),
    };

    setMenyimpan(true);
    setPesanServer('');
    try {
      if (item) {
        await printerApi.update(item.tipe, payload);
        toast.success(`Printer "${payload.merek} ${payload.tipe}" berhasil diperbarui.`);
      } else {
        await printerApi.create(payload);
        toast.success(`Printer "${payload.merek} ${payload.tipe}" berhasil ditambahkan.`);
      }
      onSaved?.();
      onClose();
    } catch (err) {
      setPesanServer(err.message);
      setErrors(fieldErrors(err));
    } finally {
      setMenyimpan(false);
    }
  }

  return (
    <Modal
      open
      onClose={menyimpan ? () => {} : onClose}
      title={item ? 'Edit Printer' : 'Tambah Printer'}
      description="Kode bahan hanya diperlukan untuk jenis printer yang tidak memakai pilihan warna."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={menyimpan}>
            Batal
          </Button>
          <Button type="submit" form="form-printer" loading={menyimpan} disabled={jenisList.length === 0}>
            {item ? 'Simpan Perubahan' : 'Tambah Printer'}
          </Button>
        </>
      }
    >
      <form id="form-printer" onSubmit={simpan} className="space-y-4">
        {pesanServer && <InlineAlert tone="danger">{pesanServer}</InlineAlert>}

        {jenisList.length === 0 && (
          <InlineAlert tone="warning">
            Belum ada jenis printer. Tambahkan jenis terlebih dahulu.
          </InlineAlert>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tipe Printer"
            required
            maxLength={100}
            placeholder="Contoh: L3150"
            value={form.tipe}
            onChange={(event) => ubah('tipe', event.target.value)}
            error={errors.tipe}
            hint="Tipe menjadi primary key dan harus unik."
            autoFocus
          />

          <Select
            label="Jenis Printer"
            required
            value={form.jenis_id}
            onChange={(event) => ubahJenis(event.target.value)}
            error={errors.jenis_id}
            disabled={jenisList.length === 0}
          >
            <option value="">Pilih jenis</option>
            {jenisList.map((jenis) => (
              <option key={jenis.id} value={jenis.id}>
                {jenis.nama}
              </option>
            ))}
          </Select>
        </div>

        <Input
          label="Merek"
          required
          maxLength={100}
          placeholder="Contoh: Epson"
          value={form.merek}
          onChange={(event) => ubah('merek', event.target.value)}
          error={errors.merek}
        />

        {!form.jenis_id ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm text-slate-500">
            Pilih jenis printer terlebih dahulu. Jenis menentukan apakah printer memerlukan kode
            bahan atau menggunakan pilihan warna.
          </div>
        ) : pakaiWarna ? (
          <ReadOnlyValue
            label="Kode Bahan"
            value="Menggunakan pilihan warna"
            hint="Jenis ini memakai checkbox warna pada form permintaan, sehingga kode bahan tidak diperlukan."
          />
        ) : (
          <Input
            label="Kode Bahan"
            required
            maxLength={100}
            placeholder="Contoh: TN-001"
            value={form.kode}
            onChange={(event) => ubah('kode', event.target.value)}
            error={errors.kode}
            hint="Satu printer hanya memiliki satu kode bahan. Kode ini otomatis dipakai pada permintaan."
          />
        )}

        {item && (
          <p className="text-xs text-slate-500">
            Mengubah tipe hanya diizinkan jika printer belum pernah dipakai pada permintaan. Mengubah
            kode tidak mengubah bahan pada riwayat lama.
          </p>
        )}
      </form>
    </Modal>
  );
}
