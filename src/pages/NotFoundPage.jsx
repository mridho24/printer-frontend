import { Link } from 'react-router-dom';
import { FileQuestion } from 'lucide-react';
import Card from '../components/ui/Card.jsx';

export default function NotFoundPage() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-line bg-paper text-muted">
          <FileQuestion className="h-5 w-5" aria-hidden="true" />
        </div>
        <p className="font-mono text-3xl font-medium tracking-tight text-ink">404</p>
        <h1 className="mt-2 text-lg font-semibold text-ink">Halaman tidak ditemukan</h1>
        <p className="mt-1 max-w-sm text-sm text-muted">
          Alamat yang Anda buka tidak tersedia di aplikasi ini.
        </p>
        <Link
          to="/permintaan"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-accent px-4 text-sm font-medium text-surface transition-colors hover:bg-accent-strong"
        >
          Kembali ke Permintaan
        </Link>
      </div>
    </Card>
  );
}
