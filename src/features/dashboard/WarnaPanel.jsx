import { useState } from 'react';
import BarList from './BarList.jsx';
import Button from '../../components/ui/Button.jsx';
import Card from '../../components/ui/Card.jsx';
import SectionHeader from '../../components/ui/SectionHeader.jsx';
import { WARNA_META } from '../../lib/constants.js';

const MAKS_AWAL = 4;

/**
 * Agregat warna per jenis warna (misalnya seluruh printer Inkjet). Angka tiap
 * warna adalah jumlah permintaan yang memuat warna tersebut, jadi totalnya
 * bisa melewati 100% dari total permintaan.
 */
export default function WarnaPanel({ warna }) {
  const [semua, setSemua] = useState(false);
  const tampil = semua ? warna : warna.slice(0, MAKS_AWAL);

  return (
    <Card>
      <SectionHeader
        title="Warna per jenis warna"
        description="Jumlah permintaan yang memuat tiap warna. Satu permintaan bisa berisi beberapa warna."
      />

      <div className="divide-y divide-line">
        {tampil.map((item) => (
          <section key={item.jenis_id} className="p-4">
            <div className="mb-3 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h3 className="text-sm font-semibold text-ink">Warna pada {item.nama}</h3>
              <p className="text-xs text-muted">{item.total} permintaan warna</p>
            </div>
            <BarList
              items={item.warna.map((warnaItem) => ({
                nama: WARNA_META[warnaItem.nama]?.label ?? warnaItem.nama,
                total: warnaItem.total,
              }))}
              tandaiTeratas
              bernomor
            />
          </section>
        ))}
      </div>

      {warna.length > MAKS_AWAL && (
        <div className="flex justify-end border-t border-line px-4 py-3">
          <Button variant="secondary" size="sm" onClick={() => setSemua((nilai) => !nilai)}>
            {semua ? 'Ringkas' : `Tampilkan semua (${warna.length})`}
          </Button>
        </div>
      )}
    </Card>
  );
}
