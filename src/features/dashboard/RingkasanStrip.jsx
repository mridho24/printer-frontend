import { useId, useState } from 'react';
import { Info } from 'lucide-react';
import Card from '../../components/ui/Card.jsx';
import { formatBulan, formatTanggal } from '../../lib/format.js';

function labelDelta(nilai) {
  if (nilai > 0) return `+${nilai}`;
  return String(nilai);
}

/**
 * Tiga angka pokok dashboard. Ditulis sebagai deretan angka mono dengan garis
 * pemisah, bukan kartu ikon, karena yang dibaca adalah nilainya.
 *
 * Kartu "Tipe printer diminta" menghitung model, sedangkan tab jenis menghitung
 * kelompok teknologi. Subteks dan penjelasan istilah dipakai supaya kedua angka
 * tidak terbaca sebagai selisih data.
 *
 * Ketiga sel memakai tinggi dan susunan yang sama: label, angka, keterangan,
 * lalu baris tambahan. Delta hanya muncul bila periode pembanding punya data,
 * jadi angka nol tidak menyamar sebagai perbandingan yang bermakna.
 */
export default function RingkasanStrip({ ringkasan, pembanding, periodeAktif = false }) {
  const [istilahTerbuka, setIstilahTerbuka] = useState(false);
  const idIstilah = useId();
  const bulan = ringkasan.bulan_terbanyak;
  const jumlahJenis = ringkasan.total_jenis_diminta ?? 0;
  const adaPembanding = Boolean(pembanding && pembanding.total_permintaan > 0);
  const judulPembanding = pembanding
    ? `${formatTanggal(pembanding.dari)} – ${formatTanggal(pembanding.sampai)}`
    : undefined;

  const butir = [
    {
      label: 'Total permintaan',
      nilai: ringkasan.total_permintaan,
      satuan: 'catatan',
      subteks: periodeAktif ? 'pada periode terpilih' : 'seluruh data tercatat',
      kunciDelta: 'total_permintaan',
    },
    {
      label: 'Tipe printer diminta',
      nilai: ringkasan.total_printer_diminta,
      satuan: 'model',
      subteks:
        jumlahJenis > 0
          ? `dari ${jumlahJenis} jenis`
          : 'jenis printer belum tercatat',
      kunciDelta: 'total_printer_diminta',
      istilah: true,
    },
    {
      label: 'Bulan tersibuk',
      nilai: bulan ? formatBulan(bulan.bulan) : '-',
      satuan: bulan ? `${bulan.total} permintaan` : 'belum ada data',
    },
  ];

  return (
    <Card className="mb-4">
      <dl className="grid grid-cols-1 divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        {butir.map((item) => {
          const delta =
            item.kunciDelta && adaPembanding
              ? ringkasan[item.kunciDelta] - pembanding[item.kunciDelta]
              : null;

          return (
            <div key={item.label} className="flex flex-col px-4 py-3.5">
              <dt className="text-xs font-medium text-muted">{item.label}</dt>
              <dd className="mt-1 flex flex-1 flex-col">
                <span className="flex flex-wrap items-baseline gap-x-2">
                  <span className="font-mono text-xl font-semibold tabular-nums text-ink">
                    {item.nilai}
                  </span>
                  <span className="text-xs text-faint">{item.satuan}</span>
                </span>

                {item.subteks && (
                  <span className="mt-0.5 block text-xs text-muted">{item.subteks}</span>
                )}

                {adaPembanding && item.kunciDelta && (
                  <span className="mt-0.5 block text-xs text-muted" title={judulPembanding}>
                    <span className="font-mono font-medium tabular-nums text-ink">
                      {labelDelta(delta)}
                    </span>{' '}
                    dibanding periode sebelumnya
                  </span>
                )}

                {item.istilah && (
                  <button
                    type="button"
                    aria-expanded={istilahTerbuka}
                    aria-controls={idIstilah}
                    onClick={() => setIstilahTerbuka((nilai) => !nilai)}
                    className="mt-auto inline-flex min-h-8 items-center gap-1.5 self-start rounded-md pt-1.5 text-xs font-medium text-accent-strong transition-colors hover:bg-accent-soft max-lg:min-h-11"
                  >
                    <Info className="h-3.5 w-3.5" aria-hidden="true" />
                    Apa bedanya jenis dan tipe?
                  </button>
                )}
              </dd>
            </div>
          );
        })}
      </dl>

      {istilahTerbuka && (
        <div
          id={idIstilah}
          className="space-y-1.5 border-t border-line px-4 py-3 text-sm text-muted"
        >
          <p>
            <span className="font-semibold text-ink">Jenis</span> adalah kelompok teknologi
            printer, misalnya Dot Matrix, Inkjet, Laser, atau Thermal. Jenis menentukan bahan
            yang dicatat.
          </p>
          <p>
            <span className="font-semibold text-ink">Tipe atau model</span> adalah seri printer
            yang dipakai, misalnya L135 atau PO231. Satu jenis bisa berisi beberapa model,
            sehingga jumlah model biasanya lebih besar daripada jumlah jenis.
          </p>
        </div>
      )}
    </Card>
  );
}
