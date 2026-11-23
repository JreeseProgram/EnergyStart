import assert from "node:assert/strict"
import test from "node:test"
import { registerHooks } from "node:module"
import { existsSync, readFileSync } from "node:fs"
import ts from "typescript"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".tsx")) {
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(new URL(url), "utf8"), {
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ESNext,
          },
        }).outputText,
      }
    }
    return nextLoad(url, context)
  },
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/api-client")
      return {
        url: "data:text/javascript,export const api = {}",
        shortCircuit: true,
      }
    if (specifier === "@/utils/delay")
      return {
        url: "data:text/javascript,export const delay = async () => {}",
        shortCircuit: true,
      }
    if (specifier.startsWith("@/")) {
      const base = new URL(`../src/${specifier.slice(2)}`, import.meta.url)
      const url = [".ts", ".tsx"]
        .map((extension) => new URL(base.href + extension))
        .find((candidate) => existsSync(candidate))
      if (url) return nextResolve(url.href, context)
    }
    return nextResolve(specifier, context)
  },
})
const { api } = await import("@/lib/api-client")
const { EnergyReportApiService } =
  await import("../src/features/portfolio/services/energy-report-api.service.ts")
const { EnergyReport } =
  await import("../src/features/portfolio/models/energy-report.models.ts")
const input = {
  propertyId: "property/with space",
  startMonth: "2025-01",
  endMonth: "2025-02",
}
const dto = {
  id: "23566ce5-0aba-4ddc-b90d-041053a60972",
  PropertyId: input.propertyId,
  startMonth: input.startMonth,
  endMonth: input.endMonth,
  generatedAt: "2025-03-01T12:30:00.123456789",
  aggregateSiteEUI: 12.5,
  aggregateSourceEUI: 20.25,
  energyScore: 0,
  disqualifiers: ["Insufficient history"],
  propertySnapshot: {
    name: null,
    streetAddress: null,
    city: null,
    state: null,
    zip: null,
  },
  snapshot: {
    version: "portfolio-prototype-v1",
    asOf: "2025-03-01T12:30:00",
    floorAreaSqFt: 0,
    monthlyPerformance: [
      { month: "2025-01", siteEnergyKbtu: 12.5, sourceEnergyKbtu: 20.25 },
    ],
  },
}
const { getEnergyReport } = new EnergyReportApiService()

test("fetches and preserves the backend DTO as a detached callback", async () => {
  let calls = 0
  api.get = async (...args) => {
    calls++
    assert.deepEqual(args, [
      "/energyStatisticReport/property%2Fwith%20space",
      { params: { startDate: "2025-01", endDate: "2025-02" } },
    ])
    return dto
  }
  assert.deepEqual(await getEnergyReport(input), dto)
  assert.equal(calls, 1)
})

test("Overview checks report eligibility for the property response period", async () => {
  const { PropertyApiService } =
    await import("../src/features/portfolio/services/property-api.service.ts")
  const service = new PropertyApiService()
  let propertyPeriod
  let disqualifiers = ["Insufficient history"]
  api.get = async (path, options) => {
    if (path.startsWith("/properties/")) return { id: input.propertyId }
    if (path.startsWith("/propertyDTO/")) {
      propertyPeriod = options.params
      return {
        id: input.propertyId,
        humanReadablePropertyId: null,
        city: null,
        energyStarScore: 100,
        name: null,
        notes: null,
        authUsers: [],
        propertyType: "None",
        state: null,
        streetAddress: null,
        zip: null,
        reportingYear: null,
        siteEui: 0,
        sourceEui: 0,
        energyUse: 0,
        grossFloorArea: 0,
      }
    }
    assert.equal(path, "/energyStatisticReport/property%2Fwith%20space")
    assert.deepEqual(options.params, propertyPeriod)
    return {
      ...dto,
      startMonth: propertyPeriod.startDate,
      endMonth: propertyPeriod.endDate,
      energyScore: disqualifiers.length ? 0 : 100,
      disqualifiers,
    }
  }

  const incomplete = await service.getProperty(input)
  assert.equal(incomplete.energyStarScore, 0)
  assert.deepEqual(incomplete.scoreUnavailableReasons, disqualifiers)

  disqualifiers = []
  const complete = await service.getProperty(input)
  assert.equal(complete.energyStarScore, 100)
  assert.deepEqual(complete.scoreUnavailableReasons, [])
})

test("rejects invalid input without requesting data", async () => {
  api.get = () => assert.fail("Invalid inputs must not reach the backend")
  for (const change of [
    { propertyId: "" },
    { startMonth: "2025-13" },
    { endMonth: "2025-00" },
    { startMonth: "2025-03" },
    { startMonth: "2025-01-01" },
    { endMonth: undefined },
  ])
    await assert.rejects(getEnergyReport({ ...input, ...change }))
})

test("rejects mismatched properties and periods", async () => {
  for (const change of [
    { PropertyId: "different" },
    { startMonth: "2024-12" },
    { endMonth: "2025-03" },
  ]) {
    api.get = async () => ({ ...dto, ...change })
    await assert.rejects(getEnergyReport(input), { name: "ZodError" })
  }
})

test("rejects malformed responses", async () => {
  for (const response of [
    null,
    {},
    { ...dto, PropertyId: undefined, propertyId: input.propertyId },
    { ...dto, aggregateSiteEUI: "12.5" },
    { ...dto, generatedAt: "2025-03-01" },
    { ...dto, snapshot: { ...dto.snapshot, floorAreaSqFt: -1 } },
    {
      ...dto,
      snapshot: {
        ...dto.snapshot,
        monthlyPerformance: [
          { month: "2025-01-01", siteEnergyKbtu: 1, sourceEnergyKbtu: 2 },
        ],
      },
    },
  ]) {
    api.get = async () => response
    await assert.rejects(getEnergyReport(input), { name: "ZodError" })
  }
})

test("allows fresh report IDs, empty monthly data and backend score values", async () => {
  const response = {
    ...dto,
    id: "6ad5a764-0cce-4cd9-8b93-30a8108c4301",
    energyScore: -1,
    snapshot: { ...dto.snapshot, monthlyPerformance: [] },
  }
  api.get = async () => response
  assert.deepEqual(await getEnergyReport(input), response)
  assert.equal(EnergyReport.parse(response).energyScore, -1)
})

test("propagates request failures unchanged", async () => {
  for (const status of [400, 401, 403, 404, 500]) {
    const error = Object.assign(new Error("Request failed"), {
      response: { status },
    })
    api.get = async () => {
      throw error
    }
    await assert.rejects(getEnergyReport(input), (caught) => caught === error)
  }
})

test("retains isolated session history, newest first, without extra requests", async () => {
  const service = new EnergyReportApiService()
  const { getEnergyReport, getEnergyReports } = service
  assert.deepEqual(await getEnergyReports(input), [])
  api.get = async () => dto
  const first = await getEnergyReport(input)
  const newer = {
    ...dto,
    id: "6ad5a764-0cce-4cd9-8b93-30a8108c4301",
    generatedAt: "2025-03-02T12:30:00",
  }
  api.get = async () => newer
  await getEnergyReport(input)
  api.get = async () => ({
    ...dto,
    id: "7ad5a764-0cce-4cd9-8b93-30a8108c4301",
    PropertyId: "other",
  })
  await getEnergyReport({ ...input, propertyId: "other" })
  api.get = () => assert.fail("History must not make network requests")
  first.propertySnapshot.name = "Changed by consumer"
  const history = await getEnergyReports(input)
  assert.deepEqual(history, [newer, dto])
  history[0].snapshot.monthlyPerformance.length = 0
  assert.deepEqual(await getEnergyReports(input), [newer, dto])
  assert.equal((await getEnergyReports({ propertyId: "other" })).length, 1)
  assert.deepEqual(
    await new EnergyReportApiService().getEnergyReports(input),
    []
  )
})

test("failed and invalid responses do not change history", async () => {
  const service = new EnergyReportApiService()
  api.get = async () => dto
  await service.getEnergyReport(input)
  api.get = async () => {
    throw new Error("Network failure")
  }
  await assert.rejects(service.getEnergyReport(input))
  api.get = async () => ({ ...dto, PropertyId: "wrong-property" })
  await assert.rejects(service.getEnergyReport(input))
  assert.deepEqual(await service.getEnergyReports(input), [dto])
})

const { reportDateLabel, reportEuiLabel } =
  await import("../src/features/portfolio/utils/energy-report-labels.ts")
test("formats backend local timestamps and zero EUI without shifting dates", () => {
  assert.equal(reportDateLabel("2025-03-01T00:00:00.123456789"), "Mar 1, 2025")
  assert.equal(reportEuiLabel(0), "0 kBtu/ft²")
})

const { EnergyReportDetails } =
  await import("../src/features/portfolio/components/energy-report-details.tsx")
test("renders backend metrics, qualification reasons, nullable property fields and empty months", () => {
  const markup = renderToStaticMarkup(
    createElement(EnergyReportDetails, {
      report: { ...dto, snapshot: { ...dto.snapshot, monthlyPerformance: [] } },
    })
  )
  for (const text of [
    "Site EUI",
    "Source EUI",
    "Energy score",
    "12.5 kBtu/ft²",
    "20.3 kBtu/ft²",
    "Insufficient history",
    "Property name unavailable",
    "Address unavailable",
    "No monthly data available.",
  ]) {
    assert.ok(markup.includes(text), text)
  }
  assert.match(markup, />Not available<\/p>/)
  assert.ok(!markup.includes("Simulated"))
})
