export function availableEnergyScore(
  score: number | null | undefined,
  reasons: readonly string[] = []
): number | undefined {
  return reasons.length === 0 && score != null && score >= 1 && score <= 100
    ? score
    : undefined
}

export function energyScoreLabel(
  score: number | null | undefined,
  reasons: readonly string[] = []
) {
  return (
    availableEnergyScore(score, reasons)?.toLocaleString("en-US") ??
    "Not available"
  )
}
