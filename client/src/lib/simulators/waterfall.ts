/**
 * Waterfall simplifiée à un bloc préférentiel unique.
 *
 * `ownershipPct` est la détention fully diluted de l'investisseur après conversion de sa
 * préférence, actions ordinaires éventuellement détenues comprises.
 *
 * `commonOwnershipPct` est sa part dans les seules actions ordinaires. Ces actions ne portent
 * aucune préférence : lorsque l'investisseur exerce la sienne, elles ne participent qu'au
 * résidu. La valeur par défaut 0 décrit un investisseur ne détenant que des préférentielles et
 * reproduit exactement le comportement antérieur. Le paramètre n'a d'effet que sur la branche
 * non-participating, la branche participating faisant déjà participer le bloc préférentiel au
 * résidu à hauteur de `ownershipPct`.
 *
 * `investorMultiple` rapporte les produits au seul `investment`. Il ne décrit le multiple réel
 * de l'investisseur que si celui-ci n'a déboursé aucun autre capital ; en présence de secondaire,
 * le multiple doit être recalculé sur le capital total déployé.
 */
export function calculateWaterfall(investment: number, multiple: number, ownershipPct: number, exit: number, participating: boolean, commonOwnershipPct = 0) {
  const pref = multiple * investment;
  const own = ownershipPct / 100;
  const commonOwn = commonOwnershipPct / 100;
  const converted = own * exit;
  let investor: number;
  let takePreference: number;

  if (participating) {
    takePreference = Math.min(exit, pref + own * Math.max(exit - pref, 0));
    investor = takePreference;
  } else {
    const paidPreference = Math.min(pref, exit);
    takePreference = paidPreference + commonOwn * Math.max(exit - paidPreference, 0);
    investor = Math.max(takePreference, converted);
  }

  investor = Math.min(investor, exit);
  const common = Math.max(exit - investor, 0);
  const choseConvert = !participating && converted > takePreference;

  return { investor, common, pref, choseConvert, investorMultiple: investment > 0 ? investor / investment : null };
}
