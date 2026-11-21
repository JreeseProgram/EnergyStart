import type { PortfolioDeletion } from "@/features/portfolio/api/portfolio/deletion.types"

type DeletionSteps = {
  deleteRecord: (input: PortfolioDeletion) => Promise<void>
  navigateAway: () => void | Promise<void>
  reconcile: (input: PortfolioDeletion) => Promise<void>
}

export async function deletePortfolioRecord(
  input: PortfolioDeletion,
  steps: DeletionSteps
) {
  await steps.deleteRecord(input)

  // Navigation normally unmounts property observers before cache eviction.
  // Its failure must not prevent cleanup after the server has deleted the record.
  let refreshed = true
  if (input.kind === "property") {
    try {
      await steps.navigateAway()
    } catch {
      refreshed = false
    }
  }
  try {
    await steps.reconcile(input)
  } catch {
    refreshed = false
  }
  return { refreshed }
}
