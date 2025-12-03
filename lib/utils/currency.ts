export function formatRupiah(value: number | string): string {
  if (!value) return "";
  
  const numberString = value.toString().replace(/[^,\d]/g, "");
  const split = numberString.split(",");
  const sisa = split[0].length % 3;
  let rupiah = split[0].substr(0, sisa);
  const ribuan = split[0].substr(sisa).match(/\d{3}/gi);

  if (ribuan) {
    const separator = sisa ? "." : "";
    rupiah += separator + ribuan.join(".");
  }

  rupiah = split[1] !== undefined ? rupiah + "," + split[1] : rupiah;
  return "Rp " + rupiah;
}

export function parseRupiah(value: string): number {
  return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
}

export function formatCompactNumber(number: number): string {
  if (number >= 1000000000) {
    return (number / 1000000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (number >= 1000000) {
    return (number / 1000000).toFixed(1).replace(/\.0$/, '') + 'jt';
  }
  if (number >= 1000) {
    return (number / 1000).toFixed(0) + 'rb';
  }
  return number.toString();
}
