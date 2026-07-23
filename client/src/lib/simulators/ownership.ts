export interface OwnershipHolderInput {
  name: string;
  shares: number;
}

export interface OwnershipInput {
  valuation: number;
  holders: OwnershipHolderInput[];
}

export interface OwnershipRow extends OwnershipHolderInput {
  ownershipPct: number;
  value: number;
}

export interface OwnershipResult {
  valuation: number;
  totalShares: number;
  rows: OwnershipRow[];
}

const nonNegativeFinite = (value: number): number => (
  Number.isFinite(value) && value > 0 ? value : 0
);

export function calculateOwnership(input: OwnershipInput): OwnershipResult {
  const valuation = nonNegativeFinite(input.valuation);
  const sanitizedHolders = input.holders.map((holder) => ({
    name: holder.name,
    shares: nonNegativeFinite(holder.shares),
  }));
  const totalShares = sanitizedHolders.reduce((sum, holder) => sum + holder.shares, 0);
  const rows = sanitizedHolders.map((holder) => {
    const ownershipPct = totalShares > 0 ? (holder.shares / totalShares) * 100 : 0;
    return {
      ...holder,
      ownershipPct,
      value: (ownershipPct / 100) * valuation * 1_000_000,
    };
  });

  return { valuation, totalShares, rows };
}
