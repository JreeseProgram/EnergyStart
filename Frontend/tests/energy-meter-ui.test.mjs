import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { MemoryRouter } from "react-router"
import assert from "node:assert/strict"
import test from "node:test"
import { registerHooks } from "node:module"
import { existsSync, readFileSync } from "node:fs"
import ts from "typescript"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"

const stateUrl = "data:text/javascript,export const state = { calls: 0 }"
const { state } = await import(stateUrl)
registerHooks({
  load(url, context, nextLoad) {
    if (url.endsWith(".tsx"))
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
    return nextLoad(url, context)
  },
  resolve(specifier, context, nextResolve) {
    // Closed dialogs must not invoke service hooks; isolate app bootstrapping.
    if (specifier === "@/hooks/use-services")
      return {
        url: "data:text/javascript,export const useServices = () => { throw new Error('Unexpected services bootstrap') }",
        shortCircuit: true,
      }
    if (specifier === "@/components/layouts/dashboard-layout")
      return {
        url: "data:text/javascript,export const DashboardLayout = () => null",
        shortCircuit: true,
      }
    if (specifier === "@/features/portfolio/api/energy-meter/get-energy-meter.api")
      return {
        url: `data:text/javascript,${encodeURIComponent(
          `import { state } from ${JSON.stringify(stateUrl)};
           export function useEnergyMeter(input) {
             state.calls++;
             state.input = input;
             return state.query;
           }`
        )}`,
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

const { PropertyMeters } =
  await import("../src/features/portfolio/components/property-meters.tsx")
const { EnergyMeterDetailsCell } =
  await import("../src/features/portfolio/cells/energy-meter-details.cell.tsx")
const { EnergyMeterTable } =
  await import("../src/features/portfolio/components/energy-meter-table.tsx")
const meter = {
  meterId: "meter-1",
  propertyId: "property-1",
  meterName: "Main meter",
  meterType: "ELECTRIC_GRID",
  unitOfMeasure: "kWh",
  inUse: true,
  isDelivered: false,
  readings: [],
}

test("closed meter dialogs do not load meter data", () => {
  state.calls = 0
  const html = renderToStaticMarkup(
    createElement(QueryClientProvider, { client: new QueryClient() },
      createElement(MemoryRouter, null,
        createElement(PropertyMeters, {
          property: { id: meter.propertyId, name: "Test property" },
          meters: [meter, { ...meter, meterId: "meter-2", inUse: false }],
        })
      )
    )
  )
  assert.equal(state.calls, 0)
  assert.match(html, /Add reading for Main meter/)
  assert.match(html, /Activate this meter to add readings/)
  assert.doesNotMatch(html, /role="dialog"/)
})

test("meter data boundary composes content only after successful loading", () => {
  let rendered = 0
  const render = () =>
    renderToStaticMarkup(
      createElement(EnergyMeterDetailsCell, {
        propertyId: meter.propertyId,
        energyMeterId: meter.meterId,
        children: (loaded) => {
          rendered++
          assert.equal(loaded, meter)
          return createElement("p", null, loaded.meterName)
        },
      })
    )
  state.query = { isPending: true }
  assert.match(render(), /Loading meter readings/)
  state.query = { isError: true, refetch() {} }
  assert.match(render(), /Unable to load this meter/)
  assert.equal(rendered, 0)
  state.query = { data: meter }
  assert.match(render(), /Main meter/)
  assert.equal(rendered, 1)
  assert.deepEqual(state.input, {
    propertyId: meter.propertyId,
    energyMeterId: meter.meterId,
  })
})

test("history renders one composed reading action in empty and populated states", () => {
  for (const readings of [
    [],
    [{ id: "reading-1", date: "2025-01", usage: 12, cost: 0 }],
  ]) {
    const html = renderToStaticMarkup(
      createElement(EnergyMeterTable, {
        meter: { ...meter, readings },
        addReadingAction: createElement("button", null, "Composed action"),
      })
    )
    assert.equal(html.match(/Composed action/g)?.length, 1)
  }
})
