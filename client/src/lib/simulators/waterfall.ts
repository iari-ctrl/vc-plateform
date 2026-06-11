export function calculateWaterfall(investment: number, multiple: number, ownershipPct: number, exit: number, participating: boolean) {
  const pref = multiple * investment;
  const own = ownershipPct / 100;
  let investor: number;
  
  if (participating) {
    investor = Math.min(exit, pref + own * Math.max(exit - pref, 0));
  } else {
    investor = Math.max(pref, own * exit);
  }
  
  investor = Math.min(investor, exit);
  const common = Math.max(exit - investor, 0);
  const converted = own * exit;
  const choseConvert = !participating && converted > pref;

  return { investor, common, pref, choseConvert, investorMultiple: investor / Math.max(investment, 0.01) };
}
