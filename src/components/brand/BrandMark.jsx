import { Link } from 'react-router-dom';
import logoZa from '../../logo/logo_za.jpg';
import { cn } from '../../lib/cn.js';

/**
 * Identitas aplikasi di header: logo resmi RSUD Zainal Abidin.
 *
 * Logo berukuran 600x300 dan berlatar putih, jadi tinggi 40px menjaga rasio
 * aslinya. `mix-blend-multiply` membuat latar putih menyatu dengan permukaan
 * header tanpa mengubah berkas aslinya. `alt` dikosongkan karena nama rumah
 * sakit sudah tertulis sebagai teks di sebelah logo.
 */
export default function BrandMark({ className }) {
  return (
    <Link to="/dashboard" className={cn('flex shrink-0 items-center gap-2.5', className)}>
      <img
        src={logoZa}
        alt=""
        width={80}
        height={40}
        className="h-10 w-auto mix-blend-multiply"
      />
      <span className="leading-tight">
        <span className="block text-[13px] font-semibold tracking-tight text-ink">
          Bahan Printer
        </span>
        <span className="block text-xs font-medium text-faint">RSUD Zainal Abidin</span>
      </span>
    </Link>
  );
}
