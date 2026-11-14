import assert from "node:assert/strict"
import test from "node:test"
import { getPortfolioPerformance } from "../src/features/portfolio/utils/get-portfolio-performance.ts"

const point = (month, energy = 100) => ({
  month: `${month}-01`,
  siteEnergyKbtu: energy,
  sourceEnergyKbtu: energy,
  energyStarScore: null,
})
const current = ["2026-01", "2026-02", "2026-03"]
const previous = ["2025-01", "2025-02", "2025-03"]
const summary = (points) => getPortfolioPerformance({
  asOf: "2026-04-01",
  properties: [{
    propertyId: "property",
    floorAreaSqFt: 100,
    meterCount: null,
    currentMeterCount: null,
    reportReady: null,
    monthlyPerformance: points,
  }],
}, 3)

test("missing months are excluded from EUI and annual comparisons", () => {
  const result = summary([...previous.map((month) => point(month)), point("2026-01"), point("2026-03")])
  assert.equal(result.period.siteEui, null)
  assert.equal(result.propertiesWithHistory, 0)
  assert.equal(result.points[1].siteEui, null)
  assert.equal(result.energyChangePercent, null)
})

test("missing prior-year months prevent a misleading annual comparison", () => {
  const result = summary([...current.map((month) => point(month)), point("2025-01")])
  assert.equal(result.period.siteEui, 3)
  assert.equal(result.energyChangePercent, null)
})

test("explicit zero consumption remains complete and comparable", () => {
  const result = summary([...previous.map((month) => point(month)), ...current.map((month) => point(month, 0))])
  assert.equal(result.period.siteEui, 0)
  assert.equal(result.propertiesWithHistory, 1)
  assert.equal(result.energyChangePercent, -100)
})

test("no observed history does not become zero consumption", () => {
  const result = summary([])
  assert.equal(result.period.siteEui, null)
  assert.equal(result.period.sourceEui, null)
  assert.equal(result.energyChangePercent, null)
  assert.equal(result.propertiesWithHistory, 0)
})

test("portfolio site EUI weights complete properties by floor area", () => {
  const property = (propertyId, floorAreaSqFt, monthlyPerformance) => ({
    propertyId,
    floorAreaSqFt,
    meterCount: null,
    currentMeterCount: null,
    reportReady: null,
    monthlyPerformance,
  })
  const result = getPortfolioPerformance({
    asOf: "2026-04-01",
    properties: [
      property("small", 100, current.map((month) => point(month, 100))),
      property("large", 300, current.map((month) => point(month, 600))),
      property("incomplete", 1000, [point("2026-01", 10000)]),
      property("unknown-area", null, current.map((month) => point(month, 10000))),
    ],
  }, 3)

  // (300 + 1800) kBtu / (100 + 300) ft²; not the mean of property EUIs.
  assert.equal(result.period.siteEui, 5.25)
  assert.equal(result.propertiesWithHistory, 2)
  assert.equal(result.propertyMetrics.incomplete.siteEui, null)
})

test("portfolio site EUI follows the selected period without annualizing", () => {
  const monthlyPerformance = Array.from({ length: 12 }, (_, index) =>
    point(new Date(Date.UTC(2025, 3 + index, 1)).toISOString().slice(0, 7))
  )
  const data = {
    asOf: "2026-04-01",
    properties: [{
      propertyId: "property",
      floorAreaSqFt: 100,
      meterCount: null,
      currentMeterCount: null,
      reportReady: null,
      monthlyPerformance,
    }],
  }

  for (const months of [3, 6, 12]) {
    assert.equal(getPortfolioPerformance(data, months).period.siteEui, months)
  }
})
