import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn.js';

/**
 * Placeholder identitas, bukan logo resmi (lihat DESIGN.md bagian Aset).
 *
 * TODO: ganti isi komponen ini dengan logo resmi RSUD Zainal Abidin:
 *   1. taruh file logo di `public/logo-rsud.svg`
 *   2. ganti monogram di bawah dengan
 *      <img src="/logo-rsud.svg" alt="RSUD Zainal Abidin" width="36" height="36" />
 * Ukuran, jarak, dan perataan header tidak perlu diubah.
 */
export default function BrandMark({ className }) {
  return (
    <Link to="/permintaan" className={cn('flex shrink-0 items-center gap-2.5', className)}>
      <span
        aria-hidden="true"
        className="flex h-9 w-9 items-center justify-center rounded-md bg-ink font-mono text-[13px] font-semibold text-surface"
      >
        ZA
      </span>
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold tracking-tight text-ink">
          Bahan Printer
        </span>
        <span className="block text-[11px] font-medium text-faint">RSUD Zainal Abidin</span>
      </span>
    </Link>
  );
}
