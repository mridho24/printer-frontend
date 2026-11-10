import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../lib/cn.js';
import Button from './Button.jsx';

const UKURAN = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-xl',
  lg: 'sm:max-w-3xl',
};

const SELECTOR_FOKUS = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

export default function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
  closeOnBackdrop = true,
}) {
  const panelRef = useRef(null);
  const bodyRef = useRef(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const pemicu = document.activeElement;
    const panel = panelRef.current;
    const daftarFokus = (root) =>
      Array.from(root?.querySelectorAll(SELECTOR_FOKUS) ?? []).filter(
        (el) => el.offsetParent !== null,
      );

    // Fokus masuk ke field pertama di isi modal, bukan ke tombol tutup atau
    // tombol footer. Isi modal bisa datang belakangan (data referensi), jadi
    // field pertama dicari lagi setiap kali isi berubah.
    const fokusAwal = () => {
      const isi = bodyRef.current;
      const kandidat = daftarFokus(isi).filter((el) => !el.hasAttribute('data-modal-close'));
      return kandidat[0] ?? null;
    };

    panel?.focus({ preventScroll: true });

    const pindahKeField = () => {
      const target = fokusAwal();
      if (!target) return false;
      const aktif = document.activeElement;
      const masihDiPanel = aktif === panel || aktif === document.body || aktif === null;
      if (!masihDiPanel) return false;
      target.focus({ preventScroll: true });
      return true;
    };

    // Isi modal yang sudah siap saat dibuka langsung difokuskan; isi yang
    // datang belakangan (data referensi) ditangkap pengamat di bawah.
    const langsung = pindahKeField();

    const pengamat = new MutationObserver(() => {
      if (pindahKeField()) pengamat.disconnect();
    });

    if (panel && !langsung) pengamat.observe(panel, { childList: true, subtree: true });

    const handleKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') return;

      const elemen = daftarFokus(panel);
      if (elemen.length === 0) return;

      const pertama = elemen[0];
      const terakhir = elemen[elemen.length - 1];

      if (event.shiftKey && document.activeElement === pertama) {
        event.preventDefault();
        terakhir.focus();
      } else if (!event.shiftKey && document.activeElement === terakhir) {
        event.preventDefault();
        pertama.focus();
      }
    };

    const overflowSebelumnya = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKey);

    return () => {
      document.body.style.overflow = overflowSebelumnya;
      document.removeEventListener('keydown', handleKey);
      pengamat.disconnect();
      if (pemicu instanceof HTMLElement) pemicu.focus();
    };
  }, [open]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <div
        className="absolute inset-0 bg-ink/45"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'animate-modal-in relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-lg border border-line bg-surface shadow-[0_24px_60px_-24px_rgba(27,26,23,0.45)] sm:rounded-lg',
          UKURAN[size],
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold tracking-tight text-ink">{title}</h2>
            {description && <p className="mt-0.5 text-sm text-muted">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            data-modal-close
            className="-mr-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-faint transition-colors hover:bg-paper hover:text-ink max-lg:h-11 max-lg:w-11"
            aria-label="Tutup"
          >
            <X className="h-4.5 w-4.5" aria-hidden="true" />
          </button>
        </div>

        <div ref={bodyRef} className="min-h-0 flex-1 overflow-y-auto px-5 py-4">{children}</div>

        {footer && (
          <div className="flex flex-wrap items-center justify-end gap-2 border-t border-line bg-paper px-5 py-3">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = 'Konfirmasi',
  description,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  loading = false,
  tone = 'danger',
}) {
  return (
    <Modal
      open={open}
      onClose={loading ? () => {} : onClose}
      title={title}
      size="sm"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant={tone} onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <p className="text-sm leading-6 text-muted">{description}</p>
    </Modal>
  );
}
