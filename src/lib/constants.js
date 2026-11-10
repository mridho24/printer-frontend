export const WARNA = ['black', 'blue', 'yellow', 'magenta'];

/*
 * Warna di sini adalah data, bukan dekorasi: tiap swatch menunjukkan warna
 * toner/ribbon yang diminta. Label ditulis sebagai teks supaya tidak
 * bergantung pada warna saja (R-39).
 */
export const WARNA_META = {
  black: {
    label: 'Black',
    chip: 'border-line bg-paper text-ink',
    dot: 'bg-ink',
    swatch: 'bg-ink',
  },
  blue: {
    label: 'Blue',
    chip: 'border-line bg-paper text-ink',
    dot: 'bg-[#1d4ed8]',
    swatch: 'bg-[#1d4ed8]',
  },
  yellow: {
    label: 'Yellow',
    chip: 'border-line bg-paper text-ink',
    dot: 'bg-[#b8860b]',
    swatch: 'bg-[#b8860b]',
  },
  magenta: {
    label: 'Magenta',
    chip: 'border-line bg-paper text-ink',
    dot: 'bg-[#a21caf]',
    swatch: 'bg-[#a21caf]',
  },
};
