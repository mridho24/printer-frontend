import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import Card from '../components/ui/Card.jsx';

export default function NotFoundPage() {
  return (
    <Card>
      <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Compass className="h-7 w-7" />
        </div>
        <p className="text-4xl font-black tracking-tight text-slate-900">404</p>
        <h1 className="mt-2 text-lg font-semibold text-slate-800">Halaman tidak ditemukan</h1>
        <p className="mt-1 text-sm text-slate-500">
          Alamat yang Anda buka tidak tersedia di aplikasi ini.
        </p>
        <Link
          to="/permintaan"
          className="mt-6 inline-flex h-10 items-center rounded-lg bg-blue-600 px-4 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
        >
          Kembali ke Permintaan
        </Link>
      </div>
    </Card>
  );
}
