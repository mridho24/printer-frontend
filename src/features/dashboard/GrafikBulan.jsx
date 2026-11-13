import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { formatBulanPanjang } from '../../lib/format.js';

const LEBAR_KOLOM = 24;
const TEPI_LAYAR = 8;
const JARAK_BATANG = 6;
const JARAK_KURSOR = 12;
const AMBANG_GESER = 2;

/**
 * Grafik kolom vertikal untuk jumlah permintaan per bulan.
 *
 * Dipisahkan dari `BarChart` karena bentuknya lain: sumbu waktunya mendatar,
 * batangnya tumbuh ke atas, dan angkanya dibaca lewat label di atas kolom serta
 * tooltip. `BarChart` tetap dipakai untuk peringkat yang bentuknya daftar.
 *
 * Tiap kolom adalah tautan ke daftar permintaan bulan itu, sehingga angka yang
 * tampak bisa langsung ditelusuri. Bulan tanpa permintaan tidak punya kolom dan
 * tidak menjadi tautan, karena tidak ada daftar yang bisa dibuka.
 *
 * Tooltip punya dua sumber posisi. Saat memakai mouse, tooltip mengikuti kursor
 * dengan jarak 12px di kanan atas dan membalik sisi di tepi layar, jadi kolom
 * yang sedang ditunjuk tidak tertutup. Saat kolom difokuskan dengan keyboard
 * tidak ada kursor, sehingga tooltip ditambatkan di atas kolom.
 */
export default function GrafikBulan({ items = [], kosong = 'Belum ada data' }) {
  const [tip, setTip] = useState(null);
  const tipRef = useRef(null);
  const wadahRef = useRef(null);

  const puncak = Math.max(...items.map((item) => item.total), 0);

  // Kotak batang dipakai kedua sumber posisi. Batang yang sudah keluar layar
  // menghasilkan null supaya tidak ada tooltip yang menunjuk ruang kosong.
  const kotakBatang = useCallback((kunci) => {
    const batang = wadahRef.current?.querySelector(`[data-bulan="${kunci}"] [data-batang]`);
    if (!batang) return null;

    const kotak = batang.getBoundingClientRect();
    if (kotak.bottom < 0 || kotak.top > window.innerHeight) return null;
    if (kotak.right < 0 || kotak.left > window.innerWidth) return null;

    return kotak;
  }, []);

  const posisiBatang = useCallback(
    (kunci) => {
      const item = items.find((baris) => baris.kunci === kunci);
      const kotak = kotakBatang(kunci);
      if (!item || !kotak) return null;

      return {
        kunci,
        nama: formatBulanPanjang(kunci),
        jumlah: item.total,
        sumber: 'batang',
        kiri: kotak.left + kotak.width / 2,
        atas: kotak.top - JARAK_BATANG,
      };
    },
    [items, kotakBatang],
  );

  function tampilkanBatang(item) {
    setTip(posisiBatang(item.kunci));
  }

  function tampilkanKursor(item, event) {
    const { clientX, clientY } = event;

    // Geseran di bawah 2px tidak mengubah apa pun selain memicu render ulang.
    if (
      tip?.kunci === item.kunci &&
      tip.sumber === 'kursor' &&
      Math.abs(clientX - tip.x) < AMBANG_GESER &&
      Math.abs(clientY - tip.y) < AMBANG_GESER
    ) {
      return;
    }

    const dasar = posisiBatang(item.kunci);
    if (!dasar) return;
    setTip({
      ...dasar,
      sumber: 'kursor',
      x: clientX,
      y: clientY,
      kiri: clientX + JARAK_KURSOR,
      atas: clientY - JARAK_KURSOR,
    });
  }

  // Tooltip dijepit setelah lebarnya diketahui. Mode kursor membalik ke kiri
  // kursor bila tidak muat di kanan, lalu turun ke bawah kursor bila tidak ada
  // ruang di atas. Mode batang kembali ke penjepitan tepi layar yang lama.
  useLayoutEffect(() => {
    if (!tip || !tipRef.current) return;

    const kotak = tipRef.current.getBoundingClientRect();
    let kiri = tip.kiri;
    let atas = tip.atas;

    if (tip.sumber === 'kursor') {
      kiri = tip.x + JARAK_KURSOR;
      atas = tip.y - JARAK_KURSOR - kotak.height;

      if (kiri + kotak.width > window.innerWidth - TEPI_LAYAR) {
        kiri = tip.x - JARAK_KURSOR - kotak.width;
      }
      if (atas < TEPI_LAYAR) atas = tip.y + JARAK_KURSOR;

      kiri = Math.max(TEPI_LAYAR, Math.min(kiri, window.innerWidth - TEPI_LAYAR - kotak.width));
      atas = Math.max(TEPI_LAYAR, Math.min(atas, window.innerHeight - TEPI_LAYAR - kotak.height));
    } else {
      if (kotak.left < TEPI_LAYAR) kiri += TEPI_LAYAR - kotak.left;
      if (kotak.right > window.innerWidth - TEPI_LAYAR) {
        kiri -= kotak.right - (window.innerWidth - TEPI_LAYAR);
      }
      if (kotak.top < TEPI_LAYAR) atas += TEPI_LAYAR - kotak.top;
    }

    if (Math.abs(kiri - tip.kiri) > 0.5 || Math.abs(atas - tip.atas) > 0.5) {
      setTip({ ...tip, kiri, atas });
    }
  }, [tip]);

  // Saat halaman digulir, tooltip batang dihitung ulang karena menempel pada
  // batangnya. Tooltip kursor tetap di posisi pointer dan hanya menutup bila
  // kolom yang ditunjuk ikut keluar layar. `resize` menutup keduanya karena
  // tepi layar berubah dan hasil jepitan tidak lagi berlaku.
  useEffect(() => {
    if (!tip) return undefined;

    const geser = () => {
      setTip((lama) => {
        if (!lama) return null;

        const kolom = wadahRef.current?.querySelector(`[data-bulan="${lama.kunci}"] a`);
        if (!kolom) return null;

        if (lama.sumber === 'kursor') {
          const kotak = kolom.getBoundingClientRect();
          const didalam =
            lama.x >= kotak.left &&
            lama.x <= kotak.right &&
            lama.y >= kotak.top &&
            lama.y <= kotak.bottom;
          return didalam ? lama : null;
        }

        const berikut = posisiBatang(lama.kunci);
        if (!berikut) return null;
        if (
          Math.abs(berikut.kiri - lama.kiri) < 0.5 &&
          Math.abs(berikut.atas - lama.atas) < 0.5
        ) {
          return lama;
        }
        return berikut;
      });
    };

    const tutup = () => setTip(null);
    window.addEventListener('scroll', geser, true);
    window.addEventListener('resize', tutup);

    return () => {
      window.removeEventListener('scroll', geser, true);
      window.removeEventListener('resize', tutup);
    };
  }, [tip, posisiBatang]);

  if (items.length === 0) {
    return <p className="px-4 py-8 text-xs text-muted">{kosong}</p>;
  }

  return (
    <div className="relative" ref={wadahRef}>
      <div className="-mx-1 overflow-x-auto px-1">
        <div style={{ minWidth: items.length * LEBAR_KOLOM }}>
          <div
            data-chart
            className="flex h-[160px] items-end justify-center gap-0.5 border-b border-line pt-5 sm:h-[200px] sm:gap-1.5"
          >
            {items.map((item) => {
              const persen = puncak > 0 ? (item.total / puncak) * 100 : 0;
              const tinggi = item.total > 0 ? Math.max(persen, 1.5) : 0;

              return (
                <div
                  key={item.kunci}
                  data-bulan={item.kunci}
                  className="relative flex h-full min-w-[22px] max-w-16 flex-1 items-end justify-center sm:min-w-[26px]"
                >
                  {item.total > 0 ? (
                    <Link
                      to={item.href}
                      aria-label={`${formatBulanPanjang(item.kunci)}: ${item.total} permintaan`}
                      onMouseEnter={(event) => tampilkanKursor(item, event)}
                      onMouseMove={(event) => tampilkanKursor(item, event)}
                      onFocus={() => tampilkanBatang(item)}
                      onMouseLeave={() => setTip(null)}
                      onBlur={() => setTip(null)}
                      className="group flex h-full w-full items-end justify-center focus-visible:outline-none"
                    >
                      <span
                        data-batang
                        className="relative block w-full max-w-9 rounded-t-sm bg-accent transition-colors group-hover:bg-accent-strong group-focus-visible:outline group-focus-visible:outline-2 group-focus-visible:outline-offset-2 group-focus-visible:outline-accent"
                        style={{ height: `${tinggi}%` }}
                      >
                        <span
                          data-nilai
                          className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 pb-1 font-mono text-[13px] font-semibold tabular-nums text-ink"
                        >
                          {item.total}
                        </span>
                      </span>
                    </Link>
                  ) : (
                    <div className="relative flex h-full w-full items-end justify-center">
                      <span className="sr-only">
                        {formatBulanPanjang(item.kunci)}: 0 permintaan
                      </span>
                      <span
                        data-nilai
                        className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 pb-1 font-mono text-[13px] font-semibold tabular-nums text-ink"
                      >
                        0
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div aria-hidden="true" className="mt-1.5 flex justify-center gap-0.5 sm:gap-1.5">
            {items.map((item, indeks) => {
              const tahun = item.kunci.slice(0, 4);
              const sebelumnya = indeks > 0 ? items[indeks - 1].kunci.slice(0, 4) : null;
              const tampilTahun = indeks === 0 || tahun !== sebelumnya;

              return (
                <div
                  key={item.kunci}
                  className="min-w-[22px] max-w-16 flex-1 text-center sm:min-w-[26px]"
                >
                  <span className="block whitespace-nowrap text-xs text-muted">
                    {String(item.nama ?? '').split(' ')[0]}
                  </span>
                  {tampilTahun && (
                    <span className="block whitespace-nowrap font-mono text-xs text-faint">
                      {tahun}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {tip &&
        createPortal(
          <div
            ref={tipRef}
            role="tooltip"
            style={{
              position: 'fixed',
              left: tip.kiri,
              top: tip.atas,
              transform: tip.sumber === 'kursor' ? 'none' : 'translate(-50%, -100%)',
            }}
            className="pointer-events-none z-[60] whitespace-nowrap rounded-sm border border-line-strong bg-surface px-2.5 py-1.5 text-xs"
          >
            <p className="font-medium text-ink">{tip.nama}</p>
            <p className="mt-0.5 text-muted">{tip.jumlah} permintaan</p>
          </div>,
          document.body,
        )}
    </div>
  );
}
