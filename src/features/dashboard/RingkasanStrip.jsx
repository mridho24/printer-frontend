import Card from '../../components/ui/Card.jsx';
import { formatBulan } from '../../lib/format.js';

/**
 * Tiga angka pokok dashboard. Ditulis sebagai deretan angka mono dengan garis
 * pemisah, bukan kartu ikon, karena yang dibaca adalah nilainya.
 */
export default function RingkasanStrip({ ringkasan }) {
  const bulan = ringkasan.bulan_terbanyak;

  const butir = [
    {
      label: 'Total permintaan',
      nilai: ringkasan.total_permintaan,
      satuan: 'catatan',
    },
    {
      label: 'Tipe printer diminta',
      nilai: ringkasan.total_printer_diminta,
      satuan: 'tipe',
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
        {butir.map((item) => (
          <div key={item.label} className="px-4 py-3.5">
            <dt className="text-[11px] font-medium text-muted">{item.label}</dt>
            <dd className="mt-1 flex flex-wrap items-baseline gap-x-2">
              <span className="font-mono text-xl font-semibold tabular-nums text-ink">
                {item.nilai}
              </span>
              <span className="text-[11px] text-faint">{item.satuan}</span>
            </dd>
          </div>
        ))}
      </dl>
    </Card>
  );
}
