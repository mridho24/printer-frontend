import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const JARAK_MENU = 6;
const TEPI_LAYAR = 8;
const TINGGI_MAKS = 320;

function nilaiSama(a, b) {
  return String(a ?? '') === String(b ?? '');
}

function pilihAktif(daftar, mulai, arah) {
  if (daftar.length === 0) return -1;
  let indeks = mulai;
  for (let langkah = 0; langkah < daftar.length; langkah += 1) {
    indeks = (indeks + arah + daftar.length) % daftar.length;
    if (!daftar[indeks].disabled) return indeks;
  }
  return -1;
}

/**
 * Dropdown kustom dengan tombol pemicu dan menu melayang.
 *
 * Menu dirender lewat portal supaya tidak terpotong oleh kartu atau modal yang
 * punya overflow. Fokus tetap di tombol pemicu dan pilihan aktif ditandai lewat
 * aria-activedescendant, sehingga navigasi keyboard tidak berpindah fokus ke
 * setiap opsi.
 */
const SelectMenu = forwardRef(function SelectMenu(
  {
    options,
    value,
    onChange,
    name,
    id,
    labelledBy,
    ariaLabel,
    disabled = false,
    invalid = false,
    required = false,
    size = 'md',
    className,
  },
  ref,
) {
  const autoId = useId();
  const menuId = useId();
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const ketikan = useRef({ teks: '', timer: null });
  const [terbuka, setTerbuka] = useState(false);
  const [aktif, setAktif] = useState(-1);
  const [posisi, setPosisi] = useState({ top: 0, left: 0, width: 0, maxHeight: TINGGI_MAKS });

  useImperativeHandle(ref, () => triggerRef.current, []);

  const terpilih = useMemo(
    () => options.find((opsi) => nilaiSama(opsi.value, value)) ?? null,
    [options, value],
  );
  const tampil = terpilih ?? options[0] ?? null;
  const adaNilai = Boolean(terpilih && String(terpilih.value ?? '') !== '');
  const triggerId = id || autoId;

  const tutup = useCallback(() => {
    setTerbuka(false);
    setAktif(-1);
  }, []);

  const buka = useCallback(() => {
    if (disabled) return;
    const indeksTerpilih = options.findIndex((opsi) => nilaiSama(opsi.value, value));
    const indeksAwal = indeksTerpilih >= 0 ? indeksTerpilih : pilihAktif(options, -1, 1);
    setAktif(indeksAwal);
    setTerbuka(true);
  }, [disabled, options, value]);

  const pilih = useCallback(
    (opsi) => {
      if (!opsi || opsi.disabled) return;
      tutup();
      triggerRef.current?.focus();
      if (nilaiSama(opsi.value, value)) return;
      onChange?.({ target: { value: String(opsi.value ?? ''), name } });
    },
    [name, onChange, tutup, value],
  );

  function geser(arah) {
    setAktif((sekarang) => pilihAktif(options, sekarang, arah));
  }

  function cariKetikan(teks) {
    if (!teks) return -1;
    return options.findIndex(
      (opsi) => !opsi.disabled && opsi.label.toLowerCase().startsWith(teks),
    );
  }

  function onKeyDown(event) {
    if (disabled) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!terbuka) {
        buka();
        return;
      }
      geser(event.key === 'ArrowDown' ? 1 : -1);
      return;
    }

    if (!terbuka) {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        buka();
        return;
      }
      if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
        ketikan.current.teks += event.key.toLowerCase();
        clearTimeout(ketikan.current.timer);
        ketikan.current.timer = setTimeout(() => {
          ketikan.current.teks = '';
        }, 500);
        const indeks = cariKetikan(ketikan.current.teks);
        if (indeks >= 0) {
          event.preventDefault();
          setAktif(indeks);
          setTerbuka(true);
        }
      }
      return;
    }

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setAktif(pilihAktif(options, event.key === 'Home' ? options.length : -1, event.key === 'Home' ? 1 : -1));
      return;
    }

    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      pilih(options[aktif]);
      return;
    }

    if (event.key === 'Escape') {
      // Hentikan di sini supaya Escape hanya menutup menu, bukan juga modal
      // yang sedang membungkusnya.
      event.preventDefault();
      event.stopPropagation();
      tutup();
      triggerRef.current?.focus();
      return;
    }

    if (event.key === 'Tab') {
      tutup();
    }
  }

  useEffect(
    () => () => {
      clearTimeout(ketikan.current.timer);
    },
    [],
  );

  useEffect(() => {
    if (!terbuka) return undefined;

    function onPointerDown(event) {
      if (triggerRef.current?.contains(event.target)) return;
      if (menuRef.current?.contains(event.target)) return;
      tutup();
    }

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [terbuka, tutup]);

  useLayoutEffect(() => {
    if (!terbuka) return undefined;

    function aturPosisi() {
      const pemicu = triggerRef.current;
      if (!pemicu) return;

      const kotak = pemicu.getBoundingClientRect();
      const lebar = Math.min(
        Math.max(kotak.width, 200),
        window.innerWidth - TEPI_LAYAR * 2,
      );
      const kiri = Math.min(
        Math.max(kotak.left, TEPI_LAYAR),
        window.innerWidth - lebar - TEPI_LAYAR,
      );
      const ruangBawah = window.innerHeight - kotak.bottom - JARAK_MENU - TEPI_LAYAR;
      const ruangAtas = kotak.top - JARAK_MENU - TEPI_LAYAR;
      const bukaKeAtas = ruangBawah < 180 && ruangAtas > ruangBawah;
      const tinggi = Math.min(
        TINGGI_MAKS,
        Math.max(96, bukaKeAtas ? ruangAtas : ruangBawah),
      );

      // Saat dibuka ke atas, menu ditambatkan lewat `bottom` supaya tepi
      // bawahnya selalu menempel pada pemicu, berapa pun tinggi isinya.
      // Menambatkan lewat `top` membuat menu pendek melayang jauh di atas
      // pemicu karena ruang yang disisihkan lebih besar dari isinya.
      setPosisi({
        top: bukaKeAtas ? undefined : kotak.bottom + JARAK_MENU,
        bottom: bukaKeAtas
          ? window.innerHeight - kotak.top + JARAK_MENU
          : undefined,
        left: kiri,
        width: lebar,
        maxHeight: tinggi,
      });
    }

    aturPosisi();
    window.addEventListener('resize', aturPosisi);
    // Gulir di luar menu memindahkan menu agar tetap menempel pada pemicu.
    // Gulir di dalam daftar opsi diabaikan.
    const onScroll = (event) => {
      if (menuRef.current?.contains(event.target)) return;
      aturPosisi();
    };
    window.addEventListener('scroll', onScroll, true);

    return () => {
      window.removeEventListener('resize', aturPosisi);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [terbuka, tutup]);

  useEffect(() => {
    if (!terbuka || aktif < 0) return;
    const node = document.getElementById(`${menuId}-opsi-${aktif}`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [aktif, menuId, terbuka]);

  const tinggiKontrol =
    size === 'sm' ? 'h-9 max-lg:h-11' : 'h-10 max-lg:h-11';
  const teksKontrol = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={terbuka}
        aria-controls={terbuka ? menuId : undefined}
        aria-labelledby={labelledBy}
        aria-label={labelledBy ? undefined : ariaLabel}
        aria-activedescendant={terbuka && aktif >= 0 ? `${menuId}-opsi-${aktif}` : undefined}
        aria-invalid={invalid ? 'true' : undefined}
        aria-required={required ? 'true' : undefined}
        disabled={disabled}
        onClick={() => (terbuka ? tutup() : buka())}
        onKeyDown={onKeyDown}
        className={cn(
          'flex w-full items-center justify-between gap-2 rounded-md border bg-surface px-3 text-left text-ink transition-colors focus-visible:border-accent focus-visible:ring-2 focus-visible:ring-accent/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:bg-paper disabled:text-faint',
          tinggiKontrol,
          teksKontrol,
          invalid
            ? 'border-danger'
            : terbuka
              ? 'border-accent ring-2 ring-accent/20'
              : adaNilai
                ? 'border-accent/60'
                : 'border-line-strong',
          className,
        )}
      >
        <span className={cn('truncate', !adaNilai && !terpilih && 'text-faint')}>
          {tampil?.label ?? 'Tidak ada pilihan'}
        </span>
        <span className="flex shrink-0 items-center text-muted" aria-hidden="true">
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform motion-reduce:transition-none',
              terbuka && 'rotate-180',
            )}
          />
        </span>
      </button>

      {terbuka &&
        createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="listbox"
            aria-labelledby={labelledBy}
            aria-label={labelledBy ? undefined : ariaLabel}
            style={{
              position: 'fixed',
              top: posisi.top,
              bottom: posisi.bottom,
              left: posisi.left,
              width: posisi.width,
              maxHeight: posisi.maxHeight,
            }}
            className="z-[60] overflow-y-auto rounded-md border border-line-strong bg-surface p-1 shadow-dropdown"
          >
            {options.length === 0 ? (
              <p className="px-3 py-2 text-sm text-faint">Tidak ada pilihan.</p>
            ) : (
              options.map((opsi, indeks) => {
                const dipilih = nilaiSama(opsi.value, value);
                const disorot = indeks === aktif;

                return (
                  <div
                    key={opsi.key}
                    id={`${menuId}-opsi-${indeks}`}
                    role="option"
                    aria-selected={dipilih}
                    aria-disabled={opsi.disabled || undefined}
                    data-value={String(opsi.value ?? '')}
                    onMouseDown={(event) => event.preventDefault()}
                    onMouseEnter={() => {
                      if (!opsi.disabled) setAktif(indeks);
                    }}
                    onClick={() => pilih(opsi)}
                    className={cn(
                      'flex min-h-10 cursor-pointer items-center rounded-sm px-3 text-sm text-ink transition-colors max-lg:min-h-11',
                      opsi.disabled && 'cursor-not-allowed text-faint',
                      disorot && !opsi.disabled && 'bg-accent-soft text-accent-strong',
                      dipilih && !disorot && 'bg-accent-soft/60',
                      !disorot && !dipilih && !opsi.disabled && 'hover:bg-paper',
                    )}
                  >
                    <span className="min-w-0 truncate">{opsi.label}</span>
                  </div>
                );
              })
            )}
          </div>,
          document.body,
        )}
    </>
  );
});

export default SelectMenu;
