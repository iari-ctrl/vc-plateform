export function calculateFundReturns(paidIn: number, distributed: number, nav: number) {
  if (!(paidIn > 0)) return { dpi: null, rvpi: null, tvpi: null };
  const dpi = distributed / paidIn;
  const rvpi = nav / paidIn;
  const tvpi = dpi + rvpi;
  return { dpi, rvpi, tvpi };
}
