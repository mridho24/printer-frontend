import { useState } from 'react';
import { jenisApi } from '../../api/index.js';
import { fieldErrors } from '../../api/client.js';
import { useToast } from '../../hooks/useToast.js';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import { Field, Input, Toggle } from '../../components/ui/FormControls.jsx';
import { InlineAlert } from '../../components/ui/Feedback.jsx';

const FORM_KOSONG = {
  nama: '',
  label_kode: '',
  pakai_warna: false,
};

export default function JenisFormModal({ item, onClose, onSaved }) {
  const toast = useToast();
  const [form, setForm] = useState(() =>
    item
      ? {
          nama: item.nama ?? '',
          label_kode: item.label_kode ?? '',
          pakai_warna: Boolean(item.pakai_warna),
        }
      : FORM_KOSONG,
  );
  const [errors, setErrors] = useState({});
  const [pesanServer, setPesanServer] = useState('');
  const [menyimpan, setMenyimpan] = useState(false);

  function ubah(field, value) {
    setForm((sebelumnya) => ({ ...sebelumnya, [field]: value }));
    setErrors((sebelumnya) => ({ ...sebelumnya, [field]: undefined }));
  }

  async function simpan(event) {
    event.preventDefault();
    const kesalahan = {};
    if (!form.nama.trim()) kesalahan.nama = 'Nama jenis wajib diisi.';
    if (form.nama.trim().length > 100) kesalahan.nama = 'Maksimal 100 karakter.';
    if (form.label_kode.trim().length > 100) kesalahan.label_kode = 'Maksimal 100 karakter.';

    setErrors(kesalahan);
    if (Object.keys(kesalahan).length > 0) return;

    const payload = {
      nama: form.nama.trim(),
      label_kode: form.label_kode.trim() || null,
      pakai_warna: form.pakai_warna,
    };

    setMenyimpan(true);
    setPesanServer('');
    try {
      if (item) {
        await jenisApi.update(item.id, payload);
        toast.success(`Jenis "${payload.nama}" berhasil diperbarui.`);
      } else {
        await jenisApi.create(payload);
        toast.success(`Jenis "${payload.nama}" berhasil ditambahkan.`);
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
      title={item ? 'Edit Jenis Printer' : 'Tambah Jenis Printer'}
      description="Perilaku form permintaan ditentukan oleh pengaturan warna pada jenis ini."
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={menyimpan}>
            Batal
          </Button>
          <Button type="submit" form="form-jenis" loading={menyimpan}>
            {item ? 'Simpan Perubahan' : 'Tambah Jenis'}
          </Button>
        </>
      }
    >
      <form id="form-jenis" onSubmit={simpan} className="space-y-4">
        {pesanServer && <InlineAlert tone="danger">{pesanServer}</InlineAlert>}

        <Input
          label="Nama Jenis"
          required
          maxLength={100}
          placeholder="Contoh: Laser (HP)"
          value={form.nama}
          onChange={(event) => ubah('nama', event.target.value)}
          error={errors.nama}
          autoFocus
        />

        <Input
          label="Label Kode Bahan"
          maxLength={100}
          placeholder="Contoh: Kode Toner"
          value={form.label_kode}
          onChange={(event) => ubah('label_kode', event.target.value)}
          error={errors.label_kode}
          hint="Dipakai sebagai label pada form permintaan, misalnya Kode Toner atau Kode Ribbon."
        />

        <Field label="Perilaku Bahan">
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Toggle
              checked={form.pakai_warna}
              onChange={(value) => ubah('pakai_warna', value)}
              label="Gunakan pilihan warna"
              description={
                form.pakai_warna
                  ? 'Admin memilih warna black, blue, yellow, dan magenta pada form permintaan.'
                  : 'Admin menggunakan satu kode bahan dari data printer (read-only).'
              }
            />
          </div>
        </Field>
      </form>
    </Modal>
  );
}
