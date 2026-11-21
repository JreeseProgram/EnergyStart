import assert from "node:assert/strict"
import test from "node:test"
import { registerHooks } from "node:module"
import { QueryClient, QueryObserver } from "@tanstack/react-query"

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/api-client")
      return { url: "data:text/javascript,export const api = {}", shortCircuit: true }
    if (specifier === "@/utils/delay")
      return { url: "data:text/javascript,export const delay = async () => {}", shortCircuit: true }
    if (specifier.startsWith("@/"))
      return nextResolve(new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href, context)
    return nextResolve(specifier, context)
  },
})
const { portfolioKeys: keys } = await import("@/features/portfolio/api/query-keys")
const { deletePortfolioRecord } = await import("@/features/portfolio/api/portfolio/delete-portfolio-record")
const { api } = await import("@/lib/api-client")
const { EnergyMeterApiService } = await import("@/features/portfolio/services/energy-meter-api.service")
const { BuildingUseApiService } = await import("@/features/portfolio/services/building-use-api.service")
const { PropertyApiService } = await import("@/features/portfolio/services/property-api.service")
const { reconcileAfterDeletion } = await import("@/features/portfolio/api/portfolio/deletion-cache")
const { createPortfolioTestStore } = await import("@/features/portfolio/testing/portfolio-test-store")
const { createPropertyTestService } = await import("@/features/portfolio/testing/services/property.service")
const { createBuildingUseTestService } = await import("@/features/portfolio/testing/services/building-use.service")
const { createEnergyMeterMockService } = await import("@/features/portfolio/testing/services/energy-meter.service")
const { testPortfolioUser } = await import("@/features/portfolio/testing/fixtures/user.fixtures")
const metersApi = new EnergyMeterApiService()
for (const [fn, input, endpoint] of [
  [metersApi.deleteEnergyMeter, { propertyId: "p", energyMeterId: "m/a ?" }, "/energy-meters/dto/m%2Fa%20%3F"],
  [metersApi.deleteEnergyReading, { propertyId: "p", energyMeterId: "m", readingId: "r/a ?" }, "/energy-meter-readings/r%2Fa%20%3F"],
  [new BuildingUseApiService().deleteBuildingUse, { propertyId: "p", buildingUseId: "b/a ?" }, "/energy-reports/b%2Fa%20%3F"],
  [new PropertyApiService().deleteProperty, { propertyId: "p/a ?" }, "/properties/p%2Fa%20%3F"],
]) {
  test(`${fn.name}: validates input, encodes IDs, accepts empty success, preserves failures`, async () => {
    const calls = []
    api.delete = async (...args) => { calls.push(args) }
    assert.equal(await fn(input), undefined)
    assert.deepEqual(calls, [[endpoint]])
    await assert.rejects(fn({ ...input, propertyId: "" }))
    assert.equal(calls.length, 1)
    const error = new Error("Forbidden")
    api.delete = async () => { throw error }
    await assert.rejects(fn(input), (actual) => actual === error)
  })
}
function seededClient() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  const meter = { meterId: "m", propertyId: "p", readings: [{ id: "r" }, { id: "keep" }] }
  for (const [key, value] of [
    [keys.meters.list("p"), [meter]], [keys.meters.detail("p", "m"), meter],
    [keys.meters.list("other"), [{ meterId: "other" }]],
    [keys.buildingUses("p"), [{ id: "b" }]],
    [keys.properties.list(), [{ id: "p" }, { id: "other" }]],
    [keys.properties.list(1), [{ id: "p" }, { id: "other" }]],
    [keys.properties.detail("p"), { id: "p" }],
    [keys.properties.users("p"), []],
    [keys.properties.detail("other"), { id: "other" }],
    [keys.properties.performance({ propertyIds: ["p", "other"], asOf: "2026-04-01" }), {}],
    [keys.reports("p"), [{ id: "snapshot" }]],
  ]) client.setQueryData(key, value)
  return client
}
test("meter deletion empties list, evicts detail, refreshes metrics, preserves other properties and snapshots", async () => {
  const client = seededClient()
  await reconcileAfterDeletion(client, { kind: "meter", propertyId: "p", energyMeterId: "m" })
  assert.deepEqual(client.getQueryData(keys.meters.list("p")), [])
  assert.equal(client.getQueryData(keys.meters.detail("p", "m")), undefined)
  assert.equal(client.getQueryState(keys.properties.detail("p")).isInvalidated, true)
  assert.equal(client.getQueryState(keys.properties.performance({ propertyIds: ["p", "other"], asOf: "2026-04-01" })).isInvalidated, true)
  assert.deepEqual(client.getQueryData(keys.meters.list("other")), [{ meterId: "other" }])
  assert.deepEqual(client.getQueryData(keys.reports("p")), [{ id: "snapshot" }])
  client.clear()
})
test("reading deletion updates list and detail caches", async () => {
  const client = seededClient()
  await reconcileAfterDeletion(client, { kind: "reading", propertyId: "p", energyMeterId: "m", readingId: "r" })
  assert.deepEqual(client.getQueryData(keys.meters.list("p"))[0].readings, [{ id: "keep" }])
  assert.deepEqual(client.getQueryData(keys.meters.detail("p", "m")).readings, [{ id: "keep" }])
  client.clear()
})
test("building-use deletion empties list and invalidates summaries", async () => {
  const client = seededClient()
  await reconcileAfterDeletion(client, { kind: "building use", propertyId: "p", buildingUseId: "b" })
  assert.deepEqual(client.getQueryData(keys.buildingUses("p")), [])
  assert.equal(client.getQueryState(keys.properties.detail("p")).isInvalidated, true)
  client.clear()
})
test("property deletion clears dependencies and all list variants, preserving other properties", async () => {
  const client = seededClient()
  await reconcileAfterDeletion(client, { kind: "property", propertyId: "p" })
  for (const key of [
    keys.meters.list("p"), keys.meters.detail("p", "m"), keys.buildingUses("p"),
    keys.properties.detail("p"), keys.properties.users("p"),
    keys.reports("p"), keys.properties.performance({ propertyIds: ["p", "other"], asOf: "2026-04-01" }),
  ]) assert.equal(client.getQueryData(key), undefined)
  for (const key of [keys.properties.list(), keys.properties.list(1)])
    assert.deepEqual(client.getQueryData(key), [{ id: "other" }])
  assert.deepEqual(client.getQueryData(keys.properties.detail("other")), { id: "other" })
  client.clear()
})
test("in-flight responses cannot restore a deleted meter", async () => {
  const client = seededClient()
  let resolve
  const pending = client.fetchQuery({
    queryKey: keys.meters.list("p"),
    queryFn: () => new Promise((done) => { resolve = done }),
  }).catch(() => {})
  await reconcileAfterDeletion(client, { kind: "meter", propertyId: "p", energyMeterId: "m" })
  resolve([{ meterId: "m", readings: [] }])
  await pending
  assert.deepEqual(client.getQueryData(keys.meters.list("p")), [])
  client.clear()
})
test("refresh failure does not restore deleted data", async () => {
  const client = seededClient()
  const observer = new QueryObserver(client, {
    queryKey: keys.properties.list(), staleTime: Infinity,
    queryFn: async () => { throw new Error("Refresh unavailable") },
  })
  const unsubscribe = observer.subscribe(() => {})
  await assert.rejects(reconcileAfterDeletion(client, { kind: "meter", propertyId: "p", energyMeterId: "m" }), /Refresh unavailable/)
  assert.deepEqual(client.getQueryData(keys.meters.list("p")), [])
  unsubscribe()
  client.clear()
})
test("test services validate scope, delete readings, and cascade property and meter deletion", async () => {
  const store = createPortfolioTestStore()
  let actor = testPortfolioUser
  const properties = createPropertyTestService(store, async () => actor)
  const meters = createEnergyMeterMockService(properties, store)
  const uses = createBuildingUseTestService(store)
  const propertyId = store.properties[0].id
  const otherId = store.properties[1].id
  const initial = (await meters.getEnergyMeters({ propertyId }))[0]
  const meter = await meters.createEnergyReading({
    propertyId, energyMeterId: initial.meterId, date: "2025-01", usage: 10, cost: 2,
  })
  await meters.deleteEnergyReading({ propertyId, energyMeterId: meter.meterId, readingId: meter.readings[0].id })
  assert.equal((await meters.getEnergyMeter({ propertyId, energyMeterId: meter.meterId })).readings.length, meter.readings.length - 1)
  await assert.rejects(meters.deleteEnergyMeter({ propertyId: otherId, energyMeterId: meter.meterId }))
  await meters.deleteEnergyMeter({ propertyId, energyMeterId: meter.meterId })
  await assert.rejects(meters.getEnergyMeter({ propertyId, energyMeterId: meter.meterId }))
  const use = (await uses.getBuildingUses({ propertyId }))[0]
  await assert.rejects(uses.deleteBuildingUse({ propertyId: otherId, buildingUseId: use.id }))
  await uses.deleteBuildingUse({ propertyId, buildingUseId: use.id })
  await assert.rejects(uses.getBuildingUse({ buildingUseId: use.id }))
  actor = null
  await assert.rejects(properties.deleteProperty({ propertyId }))
  actor = testPortfolioUser
  const original = store.properties.find((item) => item.id === propertyId)
  await properties.deleteProperty({ propertyId })
  assert.ok(!store.properties.some((item) => item.id === propertyId))
  assert.ok([...store.buildingUses.values()].every((item) => item.propertyId !== propertyId))
  assert.ok(await properties.getProperty({ propertyId: otherId }))
  store.properties.push(original)
  assert.deepEqual(await meters.getEnergyMeters({ propertyId }), [])
})

test("server deletion failure skips navigation and cache reconciliation", async () => {
  const error = new Error("Forbidden")
  const calls = []
  await assert.rejects(deletePortfolioRecord({ kind: "property", propertyId: "p" }, {
    deleteRecord: async () => { throw error },
    navigateAway: () => { calls.push("navigate") },
    reconcile: async () => { calls.push("reconcile") },
  }), (actual) => actual === error)
  assert.deepEqual(calls, [])
})

for (const failure of [undefined, "navigate", "reconcile"]) {
  test(`post-delete orchestration preserves success when ${failure ?? "nothing"} fails`, async () => {
    const calls = []
    const step = (name) => async () => {
      calls.push(name)
      if (failure === name) throw new Error(name)
    }
    const result = await deletePortfolioRecord({ kind: "property", propertyId: "p" }, {
      deleteRecord: step("delete"),
      navigateAway: step("navigate"),
      reconcile: step("reconcile"),
    })
    assert.deepEqual(calls, ["delete", "navigate", "reconcile"])
    assert.deepEqual(result, { refreshed: failure === undefined })
  })
}

test("reading deletion leaves unrelated building-use requests running", async () => {
  const client = seededClient()
  let resolve
  const pending = client.fetchQuery({
    queryKey: keys.buildingUses("p"),
    queryFn: () => new Promise((done) => { resolve = done }),
  })
  await reconcileAfterDeletion(client, { kind: "reading", propertyId: "p", energyMeterId: "m", readingId: "r" })
  resolve([{ id: "new" }])
  await pending
  assert.deepEqual(client.getQueryData(keys.buildingUses("p")), [{ id: "new" }])
  client.clear()
})

test("property root invalidation still includes lists, details, and performance", async () => {
  const client = seededClient()
  await client.invalidateQueries({ queryKey: keys.properties.all })
  for (const key of [
    keys.properties.list(), keys.properties.list(1), keys.properties.detail("p"),
    keys.properties.performance({ propertyIds: ["p", "other"], asOf: "2026-04-01" }),
  ]) assert.equal(client.getQueryState(key).isInvalidated, true)
  client.clear()
})
