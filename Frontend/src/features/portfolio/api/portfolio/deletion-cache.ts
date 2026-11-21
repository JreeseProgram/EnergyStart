import type { QueryClient } from "@tanstack/react-query"
import type { EnergyMeter } from "@/features/portfolio/models/energy-meter.models"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"
import type { Property } from "@/features/portfolio/models/property.models"
import { portfolioKeys as keys } from "@/features/portfolio/api/query-keys"
import type { PortfolioDeletion } from "@/features/portfolio/api/portfolio/deletion.types"

type DeletionOf<K extends PortfolioDeletion["kind"]> = Extract<
  PortfolioDeletion,
  { kind: K }
>

function reconcilePropertyDeletion(
  client: QueryClient,
  { propertyId }: DeletionOf<"property">
) {
  client.removeQueries({ queryKey: keys.properties.detail(propertyId) })
  client.removeQueries({ queryKey: keys.meters.list(propertyId) })
  client.removeQueries({ queryKey: keys.buildingUses(propertyId) })
  client.removeQueries({ queryKey: keys.reports(propertyId) })
  // These inputs still contain the deleted ID. The updated list creates new queries.
  client.removeQueries({ queryKey: keys.properties.performances })
  client.setQueriesData<Property[]>(
    { queryKey: keys.properties.lists },
    (items) => items?.filter((item) => item.id !== propertyId)
  )
}

function reconcileMeterDeletion(
  client: QueryClient,
  input: DeletionOf<"meter">
) {
  client.setQueryData<EnergyMeter[]>(
    keys.meters.list(input.propertyId),
    (items) => items?.filter((item) => item.meterId !== input.energyMeterId)
  )
  client.removeQueries({
    queryKey: keys.meters.detail(input.propertyId, input.energyMeterId),
  })
}

function reconcileReadingDeletion(
  client: QueryClient,
  input: DeletionOf<"reading">
) {
  const removeReading = (meter: EnergyMeter): EnergyMeter =>
    meter.meterId === input.energyMeterId
      ? {
          ...meter,
          readings: meter.readings.filter(
            (reading) => reading.id !== input.readingId
          ),
        }
      : meter
  client.setQueryData<EnergyMeter[]>(
    keys.meters.list(input.propertyId),
    (items) => items?.map(removeReading)
  )
  client.setQueryData<EnergyMeter>(
    keys.meters.detail(input.propertyId, input.energyMeterId),
    (meter) => meter && removeReading(meter)
  )
}

function reconcileBuildingUseDeletion(
  client: QueryClient,
  input: DeletionOf<"building use">
) {
  client.setQueryData<BuildingUse[]>(
    keys.buildingUses(input.propertyId),
    (items) => items?.filter((item) => item.id !== input.buildingUseId)
  )
}

// Called only after server confirmation. Local removal survives a failed refresh;
// callers must not report that refresh failure as a failed destructive request.
export async function reconcileAfterDeletion(
  client: QueryClient,
  input: PortfolioDeletion
) {
  const metersKey = keys.meters.list(input.propertyId)
  const usesKey = keys.buildingUses(input.propertyId)
  const cancellations = [
    client.cancelQueries({ queryKey: keys.properties.all }),
  ]
  if (
    input.kind === "property" ||
    input.kind === "meter" ||
    input.kind === "reading"
  ) {
    cancellations.push(client.cancelQueries({ queryKey: metersKey }))
  }
  if (input.kind === "property" || input.kind === "building use") {
    cancellations.push(client.cancelQueries({ queryKey: usesKey }))
  }
  await Promise.all(cancellations)

  switch (input.kind) {
    case "property":
      reconcilePropertyDeletion(client, input)
      break
    case "meter":
      reconcileMeterDeletion(client, input)
      break
    case "reading":
      reconcileReadingDeletion(client, input)
      break
    case "building use":
      reconcileBuildingUseDeletion(client, input)
      break
  }

  const refreshes = [
    client.invalidateQueries(
      { queryKey: keys.properties.all },
      { throwOnError: true }
    ),
  ]
  if (input.kind === "meter" || input.kind === "reading") {
    refreshes.push(
      client.invalidateQueries({ queryKey: metersKey }, { throwOnError: true })
    )
  }
  if (input.kind === "building use") {
    refreshes.push(
      client.invalidateQueries({ queryKey: usesKey }, { throwOnError: true })
    )
  }
  // Wait for every refresh even when one fails, preserving the pending UI.
  const results = await Promise.allSettled(refreshes)
  const failure = results.find((result) => result.status === "rejected")
  if (failure?.status === "rejected") throw failure.reason
}
