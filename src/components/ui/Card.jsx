import { cn } from '../../lib/cn.js';

/**
 * Permukaan dokumen. Dipisahkan dari halaman dengan garis 1px, tanpa bayangan:
 * di aplikasi ini hanya modal dan toast yang boleh terangkat (R-12).
 */
export default function Card({ children, className }) {
  return <div className={cn('rounded-lg border border-line bg-surface', className)}>{children}</div>;
}
