export function calculateFundReturns(paidIn: number, distributed: number, nav: number) {
  const dpi = paidIn ? distributed / paidIn : 0;
  const rvpi = paidIn ? nav / paidIn : 0;
  const tvpi = dpi + rvpi;
  return { dpi, rvpi, tvpi };
}
