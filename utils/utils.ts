export function formatCustomNumber(value: number): string {
  const stringValue = value.toString().padStart(3, "0"); // jaga-jaga agar selalu punya minimal 3 digit
  const intPart = stringValue.slice(0, -2); // ambil bagian ribuan
  const decimalPart = stringValue.slice(-2); // ambil 2 digit terakhir

  const formattedInt = Number(intPart).toLocaleString("id-ID"); // format ribuan pakai titik

  return `${formattedInt},${decimalPart}`;
}
