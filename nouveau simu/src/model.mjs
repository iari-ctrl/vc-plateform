// Decimal separator: comma or dot. Optional thousands groups: spaces,
// non-breaking spaces or narrow non-breaking spaces, in groups of three.
// Units, exponents, mixed separators and partial strings are not accepted.
export function parseMemoNumber(raw) {
  if (typeof raw !== 'string') return null;
  const text = raw.trim();
  if (!/^[+-]?(?:\d+|\d{1,3}(?:[ \u00a0\u202f]\d{3})+)(?:[.,]\d+)?$/.test(text)) return null;
  const value = Number(text.replace(/[ \u00a0\u202f]/g, '').replace(',', '.'));
  return Number.isFinite(value) ? value : null;
}

export function calculateMemo(d, activeOverrides = {}) {
  const errors = {};
  const field = (key, min, max = Infinity, exclusive = false) => {
    const raw = d[key];
    const value = parseMemoNumber(raw);
    if (raw == null || (typeof raw === 'string' && !raw.trim())) errors[key] = 'missing';
    else if (value == null) errors[key] = 'number';
    else if (value < min || value > max || (exclusive && value === min)) {
      errors[key] = max === 100 ? 'percent' : exclusive ? 'positive' : 'nonnegative';
    }
    return errors[key] ? null : value;
  };
  const finite = value => Number.isFinite(value) ? value : null;
  const override = (key, expected, max = Infinity) => {
    if (!activeOverrides[key] && (d[key] == null || d[key] === '')) return expected;
    const value = field(key, 0, max);
    if (errors[key]) return null;
    if (expected == null) { errors[key] = 'dependency'; return null; }
    // Overrides are consistency checks, not a second scenario engine. Preserve
    // the unrounded model value so independently edited ratios cannot diverge.
    if (Math.abs(value - expected) > 1e-9 * Math.max(1, Math.abs(expected))) {
      errors[key] = 'inconsistent'; return null;
    }
    return expected;
  };
  const pre = field('preMoney', 0), amt = field('amount', 0, Infinity, true);
  let tick = field('ticket', 0, Infinity, true);
  const dil = field('dilution', 0, 100), exit = field('exitValue', 0);
  const fund = field('fundSize', 0, Infinity, true);
  if (tick != null && amt != null && tick > amt) { errors.ticket = 'ticket'; tick = null; }
  const post = pre != null && amt != null ? finite(pre + amt) : null;
  const own = tick != null && post != null && post > 0 ? finite(tick / post * 100) : null;
  const ownEff = override('ovOwnership', own, 100);
  const resid = ownEff != null && dil != null ? finite(ownEff * (1 - dil / 100)) : null;
  const residEff = override('ovResidual', resid, 100);
  const ret = exit != null && residEff != null ? finite(exit * (residEff / 100)) : null;
  const mult = ret != null && tick != null ? finite(ret / tick) : null;
  const multEff = override('ovMultiple', mult);
  const frac = ret != null && fund != null ? finite(ret / fund) : null;
  const fracEff = override('ovFraction', frac);
  return { pre, amt, tick, dil, exit, fund, post, own, ownEff, resid, residEff, ret, mult, multEff, frac, fracEff, errors };
}
