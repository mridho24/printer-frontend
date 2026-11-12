import Card from '../../components/ui/Card.jsx';
import { InlineAlert } from '../../components/ui/Feedback.jsx';
import { Input, Select } from '../../components/ui/FormControls.jsx';
import { OPSI_PERIODE, labelRentang } from './periode.js';

/**
 * Filter periode global. Satu rentang dipakai oleh semua panel dan ekspor,
 * supaya angka antartab tidak pernah berasal dari cakupan waktu berbeda.
 */
export default function FilterPeriode({
  periode,
  dari,
  sampai,
  onChangePeriode,
  onChangeTanggal,
  invalid,
}) {
  return (
    <Card className="mb-4">
      <div className="flex flex-wrap items-end gap-x-4 gap-y-3 px-4 py-3">
        <Select
          label="Periode"
          value={periode}
          onChange={(event) => onChangePeriode(event.target.value)}
          className="w-full sm:w-56"
        >
          {OPSI_PERIODE.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </Select>

        {periode === 'kustom' && (
          <>
            <Input
              label="Dari tanggal"
              type="date"
              value={dari}
              max={sampai || undefined}
              onChange={(event) => onChangeTanggal('dari', event.target.value)}
              className="w-full sm:w-40"
            />
            <Input
              label="Sampai tanggal"
              type="date"
              value={sampai}
              min={dari || undefined}
              onChange={(event) => onChangeTanggal('sampai', event.target.value)}
              className="w-full sm:w-40"
            />
          </>
        )}

        <p className="w-full text-xs text-muted sm:ml-auto sm:w-auto sm:pb-3">
          {labelRentang(dari, sampai)}
        </p>
      </div>

      {invalid && (
        <div className="border-t border-line px-4 py-3">
          <InlineAlert tone="warning">
            Tanggal &quot;dari&quot; tidak boleh setelah tanggal &quot;sampai&quot;. Perbaiki
            rentang untuk menampilkan data.
          </InlineAlert>
        </div>
      )}
    </Card>
  );
}
