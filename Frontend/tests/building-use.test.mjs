import assert from "node:assert/strict"
import test from "node:test"
import { registerHooks } from "node:module"
import { readFileSync, readdirSync } from "node:fs"

// Resolve app aliases and replace the browser-only HTTP client with a test double.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "@/lib/api-client")
      return {
        url: "data:text/javascript,export const api = {}",
        shortCircuit: true,
      }
    if (specifier.startsWith("@/"))
      return nextResolve(
        new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href,
        context
      )
    return nextResolve(specifier, context)
  },
})
const { BuildingUse, BuildingUseFormDetails } =
  await import("../src/features/portfolio/models/building-use.models.ts")
const { BuildingUseApiService } =
  await import("../src/features/portfolio/services/building-use-api.service.ts")
const { BuildingUseSaveRefreshError } =
  await import("../src/features/portfolio/services/building-use.service.ts")
const { getBuildingUseFields } =
  await import("../src/features/portfolio/utils/building-use-fields.ts")
const { api } = await import("@/lib/api-client")

// Check frontend schemas against the Java DTO records, independently of their definitions.
const directory = new URL(
  "../../Backend/prod/src/main/java/com/energystart/prod/dto/buildinguse/types/",
  import.meta.url
)
const dtos = new Map()
for (const file of readdirSync(directory)) {
  const source = readFileSync(new URL(file, directory), "utf8")
  const type = file
    .replace("BuildingUseDTO.java", "")
    .replace(/([a-z])([A-Z])/g, "$1_$2")
    .toUpperCase()
  const dto = Object.fromEntries(
    [
      ...source.matchAll(
        /\b(String|Double|Integer|Boolean|BuildingUseType)\s+(\w+)\s*[,)]/g
      ),
    ].map(([, kind, field]) => [
      field,
      kind === "BuildingUseType"
        ? type
        : kind === "Boolean"
          ? false
          : kind === "String"
            ? "record-id"
            : 1,
    ])
  )
  Object.assign(dto, {
    id: "mongo-id",
    createdAt: null,
    propertyId: "property-id",
    yearOfConstruction: 2000,
  })
  dtos.set(type, dto)
}

test("all 20 Java DTO variants parse without dropping fields", () => {
  assert.equal(dtos.size, 20)
  for (const [type, dto] of dtos) {
    assert.deepEqual(BuildingUse.parse(dto), dto, type)
    assert.equal(BuildingUseFormDetails.safeParse(dto).success, true, type)
  }
})
test("optional rise counts require a positive total on write", () => {
  const dto = {
    ...dtos.get("MULTIFAMILY_HOUSING"),
    lowRiseUnits: undefined,
    midRiseUnits: null,
    highRiseUnits: 1,
  }
  assert.equal(BuildingUseFormDetails.safeParse(dto).success, true)
  dto.highRiseUnits = 0
  assert.equal(BuildingUse.safeParse(dto).success, true)
  assert.equal(BuildingUseFormDetails.safeParse(dto).success, false)
  dto.highRiseUnits = 0.5
  assert.equal(BuildingUseFormDetails.safeParse(dto).success, false)
  const fields = getBuildingUseFields("MULTIFAMILY_HOUSING").filter((f) =>
    f.name.endsWith("RiseUnits")
  )
  assert.equal(fields.length, 3)
  for (const field of fields) {
    assert.equal(field.required, false)
    assert.equal(field.step, 1)
  }
})
test("senior capacity constraints apply only to writes", () => {
  const dto = {
    ...dtos.get("SENIOR_LIVING"),
    maxResidentCapacity: 0,
    avgNumResidents: 0,
  }
  assert.equal(BuildingUse.safeParse(dto).success, true)
  assert.equal(BuildingUseFormDetails.safeParse(dto).success, false)
  assert.equal(
    BuildingUseFormDetails.safeParse({
      ...dto,
      maxResidentCapacity: 2,
      avgNumResidents: 3,
    }).success,
    false
  )
  assert.equal(
    BuildingUseFormDetails.safeParse({
      ...dto,
      maxResidentCapacity: 2,
      avgNumResidents: 2,
    }).success,
    true
  )
})
const office = dtos.get("OFFICE")
test("write validation respects backend numeric limits", () => {
  for (const changes of [
    { grossFloorArea: 1.5 },
    { grossFloorArea: 0 },
    { parkingSize: -1 },
    { numOfComputers: 2147483648 },
    { percentCooled: 101 },
    { weeklyOperatingHours: 169 },
    { weeklyOperatingHours: 1.5 },
    { yearOfConstruction: 1799 },
    { yearOfConstruction: new Date().getFullYear() + 1 },
  ]) {
    assert.equal(
      BuildingUseFormDetails.safeParse({ ...office, ...changes }).success,
      false
    )
  }
  assert.equal(
    BuildingUseFormDetails.safeParse({
      ...office,
      numOfComputers: 2147483647,
      percentCooled: 50.5,
    }).success,
    true
  )
  assert.equal(
    BuildingUseFormDetails.safeParse({
      ...dtos.get("DATA_CENTER"),
      annualITEnergy: 3.5e38,
    }).success,
    false
  )
  assert.equal(
    BuildingUseFormDetails.safeParse({
      ...dtos.get("DATA_CENTER"),
      annualITEnergy: 1.5,
    }).success,
    true
  )
})
const service = new BuildingUseApiService()
const input = { ...office, userId: "user-id" }
const officeResponse = { ...office, percentCooled: 0.01 }
test("create posts DTO details and reads back the DTO by legacy ID", async () => {
  const calls = []
  api.post = async (url, body) => {
    calls.push([url, body])
    return { ID: "saved/id" }
  }
  api.get = async (url) => {
    calls.push([url])
    return officeResponse
  }
  const create = service.createBuildingUse // React Query does not bind this.
  assert.deepEqual(await create(input), office)
  assert.equal(calls[0][0], "/energy-reports/building-uses")
  assert.deepEqual(calls[0][1], {
    ...BuildingUseFormDetails.parse(office),
    percentCooled: 0.01,
  })
  assert.equal(calls[1][0], "/energy-reports/building-uses/saved%2Fid")
})
test("successful create with invalid response or failed refresh never repeats the write", async () => {
  for (const response of [{}, { ID: "saved-id" }]) {
    let writes = 0
    api.post = async () => {
      writes++
      return response
    }
    api.get = async () => {
      throw new Error("refresh unavailable")
    }
    await assert.rejects(
      service.createBuildingUse(input),
      (error) =>
        error instanceof BuildingUseSaveRefreshError &&
        error.propertyId === office.propertyId
    )
    assert.equal(writes, 1)
  }
})
test("update strips metadata and identity, and reports unreadable saved responses", async () => {
  api.put = async (url, body) => {
    assert.equal(url, "/energy-reports/building-uses/mongo-id")
    assert.deepEqual(body, {
      ...BuildingUseFormDetails.parse(office),
      percentCooled: 0.01,
    })
    return officeResponse
  }
  assert.deepEqual(await service.updateBuildingUse(input), office)
  api.put = async () => ({})
  await assert.rejects(
    service.updateBuildingUse(input),
    BuildingUseSaveRefreshError
  )
})
test("all variants round-trip percentages across create, reads, and update without mutating inputs", async () => {
  for (const [type, dto] of dtos) {
    for (const [percentage, fraction] of [
      [0, 0],
      [100, 1],
      [87, 0.87],
      [50.5, 0.505],
    ]) {
      const details = BuildingUseFormDetails.parse(dto)
      const expected = { ...details }
      for (const field of [
        "percentCooled",
        "percentHeated",
        "percentColdStorage",
      ]) {
        if (field in details) {
          details[field] = percentage
          expected[field] = fraction
        }
      }
      const submission = Object.freeze({
        ...details,
        id: dto.id,
        userId: "user-id",
      })
      const original = { ...submission }
      const response = Object.freeze({ ...dto, ...expected })
      const originalResponse = { ...response }
      const expectedUse = { ...dto, ...details }
      let posts = 0
      let puts = 0
      api.post = async (_url, body) => {
        posts++
        assert.deepEqual(body, expected, type)
        return { ID: dto.id }
      }
      api.get = async () => response
      api.put = async (_url, body) => {
        puts++
        assert.deepEqual(body, expected, type)
        return response
      }
      assert.deepEqual(await service.createBuildingUse(submission), expectedUse)
      const saved = await service.getBuildingUse({ buildingUseId: dto.id })
      assert.deepEqual(saved, expectedUse)
      assert.deepEqual(
        await service.updateBuildingUse({ ...saved, userId: "user-id" }),
        expectedUse
      )
      api.get = async () => [response]
      assert.deepEqual(
        await service.getBuildingUses({ propertyId: dto.propertyId }),
        [expectedUse]
      )
      assert.equal(posts, 1)
      assert.equal(puts, 1)
      assert.deepEqual(submission, original)
      assert.deepEqual(response, originalResponse)
    }
  }
})
test("reads use DTO routes and filter by property", async () => {
  api.get = async (url) => {
    assert.equal(url, "/energy-reports/building-uses")
    return [
      officeResponse,
      { ...officeResponse, id: "other", propertyId: "other-property" },
    ]
  }
  assert.deepEqual(
    await service.getBuildingUses({ propertyId: office.propertyId }),
    [office]
  )
  api.get = async (url) => {
    assert.equal(url, "/energy-reports/building-uses/mongo-id")
    return officeResponse
  }
  assert.deepEqual(
    await service.getBuildingUse({ buildingUseId: office.id }),
    office
  )
})
