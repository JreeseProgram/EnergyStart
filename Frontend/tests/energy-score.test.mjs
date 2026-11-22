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
const { availableEnergyScore, energyScoreLabel } =
  await import("../src/features/portfolio/utils/energy-score.ts")
const { PropertyOverview } =
  await import("../src/features/portfolio/components/property-overview.tsx")
const { Property } =
  await import("../src/features/portfolio/models/property.models.ts")

test("missing, sentinel and disqualified scores are unavailable without hiding a valid 100", () => {
  for (const score of [null, undefined, 0, -1, 101]) {
    assert.equal(energyScoreLabel(score), "Not available")
  }
  assert.equal(energyScoreLabel(100, ["Missing months"]), "Not available")
  assert.equal(availableEnergyScore(86), 86)
  assert.equal(energyScoreLabel(100), "100")
})

test("Overview explains unavailable scores and preserves zero energy metrics", () => {
  const property = Property.parse({
    id: "property",
    humanReadablePropertyId: null,
    city: null,
    energyStarScore: null,
    name: "Test",
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
    grossFloorArea: 10000,
    scoreUnavailableReasons: ["Missing meter history"],
  })
  const html = renderToStaticMarkup(
    createElement(PropertyOverview, { property })
  )
  assert.match(html, /Not available/)
  assert.match(html, /Missing meter history/)
  assert.doesNotMatch(html, /No data/)
  const qualified = renderToStaticMarkup(
    createElement(PropertyOverview, {
      property: {
        ...property,
        energyStarScore: 100,
        scoreUnavailableReasons: [],
      },
    })
  )
  assert.match(qualified, />100/)
  assert.doesNotMatch(qualified, /Not available/)
})
