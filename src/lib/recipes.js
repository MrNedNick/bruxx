// Scales an ingredient quantity to a different number of servings and rounds
// it the way a cook would write it down.
export function scaleQty(qty, factor, unit = '') {
  const v = qty * factor
  if (!unit) {
    // Eggs, slices…: halves at most, never less than one.
    return Math.max(0.5, Math.round(v * 2) / 2)
  }
  if (v >= 100) return Math.round(v / 5) * 5
  if (v >= 10) return Math.round(v)
  return Math.round(v * 10) / 10
}

export function formatQty(n, locale) {
  const whole = Math.floor(n)
  if (n - whole === 0.5 && n < 10) return whole ? `${whole}½` : '½'
  return new Intl.NumberFormat(locale, { maximumFractionDigits: 1 }).format(n)
}
