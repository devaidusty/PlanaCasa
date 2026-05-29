/**
 * Format a number as Philippine Peso — no decimals for amounts ≥ 1000
 * e.g. 1234567 → "₱1,234,567"
 */
export function formatPHP(amount: number): string {
  if (amount >= 1000) {
    return '₱' + Math.round(amount).toLocaleString('en-PH')
  }
  return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

/**
 * Format a number as compact Philippine Peso
 * e.g. 1200000 → "₱1.2M", 850000 → "₱850K"
 */
export function formatPHPCompact(amount: number): string {
  if (amount >= 1_000_000) {
    const millions = amount / 1_000_000
    const formatted = millions % 1 === 0 ? millions.toString() : millions.toFixed(1)
    return `₱${formatted}M`
  }
  if (amount >= 1_000) {
    const thousands = amount / 1_000
    const formatted = thousands % 1 === 0 ? thousands.toString() : thousands.toFixed(0)
    return `₱${formatted}K`
  }
  return `₱${amount}`
}

/**
 * Format a min/max range as compact PHP
 * e.g. 1200000, 1800000 → "₱1.2M - ₱1.8M"
 */
export function formatRange(min: number, max: number): string {
  return `${formatPHPCompact(min)} – ${formatPHPCompact(max)}`
}
