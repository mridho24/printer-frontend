import { AlertTriangle, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card.jsx';
import { formatTanggal } from '../../lib/format.js';

/**
 * Strip tindak lanjut untuk bahan yang diminta berulang pada printer yang sama
 * dalam 30 hari terakhir. Tampil hanya saat ada temuan; strip peringatan yang
 * selalu ada akan kehilangan makna.
 */
export default function PerluPerhatian({ perhatian }) {
  const items = perhatian?.items ?? [];
  if (items.length === 0) return null;

  return (
    <Card className="mb-4 border-warn-line bg-warn-soft/50">
      <div className="flex items-start gap-3 px-4 py-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn" aria-hidden="true" />
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-ink">Perlu perhatian</p>
          <p className="mt-0.5 text-xs text-muted">
            Bahan yang sama diminta minimal dua kali untuk printer yang sama dalam{' '}
            {perhatian.jendela_hari} hari terakhir.
          </p>

          <ul className="mt-2 divide-y divide-warn-line/60">
            {items.map((item) => {
              const parameter = new URLSearchParams({
                tipe: item.tipe,
                q: item.bahan,
                dari: perhatian.dari,
                sampai: perhatian.sampai,
              });

              return (
                <li key={`${item.tipe}-${item.bahan}`}>
                  <Link
                    to={`/permintaan?${parameter.toString()}`}
                    className="flex min-h-9 flex-wrap items-baseline gap-x-2 gap-y-0.5 py-1 text-xs text-ink transition-colors hover:text-accent-strong max-lg:min-h-11"
                  >
                    <span className="font-mono font-semibold">{item.tipe}</span>
                    <span className="text-muted">{item.bahan}</span>
                    <span className="text-muted">&middot; {item.total} permintaan</span>
                    <span className="text-faint">
                      terakhir {formatTanggal(item.terakhir)}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}
