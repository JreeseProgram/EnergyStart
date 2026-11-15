import assert from "node:assert/strict"
import test from "node:test"
import { registerHooks } from "node:module"

registerHooks({
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
    if (specifier.startsWith("@/"))
      return nextResolve(
        new URL(`../src/${specifier.slice(2)}.ts`, import.meta.url).href,
        context
      )
    return nextResolve(specifier, context)
  },
})
const { api } = await import("@/lib/api-client")
const { EnergyMeterApiService } =
  await import("../src/features/portfolio/services/energy-meter-api.service.ts")
const { EnergyMeter, EnergyReading } =
  await import("../src/features/portfolio/models/energy-meter.models.ts")
const {
  CreateEnergyReadingInput,
  EnergyMeterCreateRefreshError,
  EnergyMeterUpdateRefreshError,
} = await import("../src/features/portfolio/services/energy-meter.service.ts")
const { latestReading, meterDate } =
  await import("../src/features/portfolio/utils/energy-meter-labels.ts")
const { createEnergyMeterMockService } =
  await import("../src/features/portfolio/testing/services/energy-meter.service.ts")

const reading = {
  id: "507f1f77bcf86cd799439012",
  date: "2025-01",
  usage: 12,
  cost: 0,
  createdAt: "2025-02-01T12:30:00.123456789",
}
const dto = {
  meterId: "507f1f77bcf86cd799439011",
  propertyId: "property-id",
  meterName: null,
  readings: [reading],
  meterType: "ELECTRIC_GRID",
  unitOfMeasure: "kWh",
  inUse: true,
  isDelivered: false,
}
const input = { propertyId: dto.propertyId, energyMeterId: dto.meterId }
const createInput = {
  propertyId: dto.propertyId,
  meterName: "Main meter",
  meterType: "ELECTRIC_GRID",
  unitOfMeasure: "kWh",
  inUse: false,
  isDelivered: true,
}

test("creates a meter with exactly the editable DTO fields as a detached callback", async () => {
  const created = { ...dto, ...createInput, readings: [] }
  let posts = 0
  api.get = () => assert.fail("Creation must not read back the meter")
  api.post = async (...args) => {
    posts++
    assert.deepEqual(args, ["/energy-meters/dto", createInput])
    return created
  }
  const { createEnergyMeter } = new EnergyMeterApiService()
  assert.deepEqual(
    await createEnergyMeter({
      ...createInput,
      meterName: "  Main meter  ",
      meterId: "client-id",
      energyMeterId: "client-id",
      id: "client-id",
      readings: [reading],
    }),
    created
  )
  assert.equal(posts, 1)
})

test("rejects invalid creation input before requesting", async () => {
  api.post = () => assert.fail("Invalid input must not call the backend")
  const service = new EnergyMeterApiService()
  for (const invalid of [
    {},
    ...[
      { propertyId: "" },
      { meterName: "   " },
      { meterName: "x".repeat(101) },
      { meterType: "invalid" },
      { unitOfMeasure: "invalid" },
      { inUse: "true" },
      { isDelivered: undefined },
    ].map((patch) => ({ ...createInput, ...patch })),
  ]) {
    await assert.rejects(service.createEnergyMeter(invalid), {
      name: "ZodError",
    })
  }
})

test("reports malformed creation responses without repeating the successful POST", async () => {
  const service = new EnergyMeterApiService()
  api.get = () => assert.fail("Invalid responses must not trigger a read")
  for (const response of [null, undefined, {}, { ...dto, readings: null }]) {
    let posts = 0
    api.post = async () => {
      posts++
      return response
    }
    await assert.rejects(service.createEnergyMeter(createInput), (error) => {
      assert.ok(error instanceof EnergyMeterCreateRefreshError)
      assert.equal(error.name, "EnergyMeterCreateRefreshError")
      assert.equal(error.propertyId, createInput.propertyId)
      assert.equal(error.cause.name, "ZodError")
      assert.match(error.message, /may have been created/)
      assert.match(
        error.message,
        /reload the meter list; do not create it again/
      )
      return true
    })
    assert.equal(posts, 1)
  }
})

test("reports a creation property mismatch without retrying the POST", async () => {
  let posts = 0
  api.get = () => assert.fail("Property mismatches must not trigger a read")
  api.post = async () => {
    posts++
    return { ...dto, propertyId: "other-property" }
  }
  await assert.rejects(
    new EnergyMeterApiService().createEnergyMeter(createInput),
    (error) => {
      assert.ok(error instanceof EnergyMeterCreateRefreshError)
      assert.equal(error.propertyId, createInput.propertyId)
      assert.equal(error.cause.message, "Meter not found for this property.")
      assert.match(error.message, /may have been created/)
      return true
    }
  )
  assert.equal(posts, 1)
})

test("propagates creation HTTP errors unchanged without retrying", async () => {
  for (const status of [400, 401, 403, 404, 500]) {
    const error = Object.assign(new Error("Request failed"), {
      response: { status },
    })
    let posts = 0
    api.post = async () => {
      posts++
      throw error
    }
    await assert.rejects(
      new EnergyMeterApiService().createEnergyMeter(createInput),
      (actual) => actual === error
    )
    assert.equal(posts, 1)
  }
})

const updateInput = { ...createInput, energyMeterId: dto.meterId }

test("updates a meter with exactly the editable DTO fields as a detached callback", async () => {
  const updated = { ...dto, ...createInput }
  let puts = 0
  api.get = () => assert.fail("Updates must not read back the meter")
  api.put = async (...args) => {
    puts++
    assert.deepEqual(args, [`/energy-meters/dto/${dto.meterId}`, createInput])
    return updated
  }
  const { updateEnergyMeter } = new EnergyMeterApiService()
  assert.deepEqual(
    await updateEnergyMeter({
      ...updateInput,
      meterName: "  Main meter  ",
      meterId: "client-id",
      id: "client-id",
      readings: [],
    }),
    updated
  )
  assert.equal(puts, 1)
})

test("encodes the meter ID when updating", async () => {
  const special = { ...dto, meterId: "meter/a b?#" }
  api.put = async (...args) => {
    assert.deepEqual(args, [
      "/energy-meters/dto/meter%2Fa%20b%3F%23",
      createInput,
    ])
    return special
  }
  assert.deepEqual(
    await new EnergyMeterApiService().updateEnergyMeter({
      ...updateInput,
      energyMeterId: special.meterId,
    }),
    special
  )
})

test("rejects invalid update input before requesting", async () => {
  api.put = () => assert.fail("Invalid input must not call the backend")
  const service = new EnergyMeterApiService()
  for (const invalid of [
    {},
    ...[
      { energyMeterId: "" },
      { energyMeterId: undefined },
      { energyMeterId: 123 },
      { propertyId: "" },
      { meterName: "   " },
      { meterName: "x".repeat(101) },
      { meterType: "invalid" },
      { unitOfMeasure: "invalid" },
      { inUse: "true" },
      { isDelivered: undefined },
    ].map((patch) => ({ ...updateInput, ...patch })),
  ]) {
    await assert.rejects(service.updateEnergyMeter(invalid), {
      name: "ZodError",
    })
  }
})

test("reports malformed update responses without repeating the successful PUT", async () => {
  const service = new EnergyMeterApiService()
  api.get = () => assert.fail("Invalid responses must not trigger a read")
  for (const response of [null, undefined, {}, { ...dto, readings: null }]) {
    let puts = 0
    api.put = async () => {
      puts++
      return response
    }
    await assert.rejects(service.updateEnergyMeter(updateInput), (error) => {
      assert.ok(error instanceof EnergyMeterUpdateRefreshError)
      assert.equal(error.name, "EnergyMeterUpdateRefreshError")
      assert.equal(error.propertyId, updateInput.propertyId)
      assert.equal(error.cause.name, "ZodError")
      assert.match(error.message, /may have been updated/)
      assert.match(error.message, /reload the meter list; do not save it again/)
      return true
    })
    assert.equal(puts, 1)
  }
})

test("reports update meter and property mismatches without retrying the PUT", async () => {
  api.get = () => assert.fail("Identity mismatches must not trigger a read")
  for (const patch of [
    { meterId: "other-meter" },
    { propertyId: "other-property" },
  ]) {
    let puts = 0
    api.put = async () => {
      puts++
      return { ...dto, ...patch }
    }
    await assert.rejects(
      new EnergyMeterApiService().updateEnergyMeter(updateInput),
      (error) => {
        assert.ok(error instanceof EnergyMeterUpdateRefreshError)
        assert.equal(error.propertyId, updateInput.propertyId)
        assert.equal(error.cause.message, "Meter not found for this property.")
        assert.match(error.message, /may have been updated/)
        return true
      }
    )
    assert.equal(puts, 1)
  }
})

test("propagates update HTTP errors unchanged without retrying", async () => {
  for (const status of [400, 401, 403, 404, 500]) {
    const error = Object.assign(new Error("Request failed"), {
      response: { status },
    })
    let puts = 0
    api.put = async () => {
      puts++
      throw error
    }
    await assert.rejects(
      new EnergyMeterApiService().updateEnergyMeter(updateInput),
      (actual) => actual === error
    )
    assert.equal(puts, 1)
  }
})

test("DTO accepts backend IDs, nullable names, local timestamps, and empty readings", () => {
  assert.deepEqual(EnergyMeter.parse(dto), dto)
  assert.deepEqual(EnergyMeter.parse({ ...dto, readings: [] }).readings, [])
  assert.equal(
    EnergyReading.safeParse({ ...reading, createdAt: "2025-02-01T12:30:00" })
      .success,
    true
  )
  assert.equal(EnergyReading.safeParse({ ...reading, usage: -1 }).success, true)
  assert.equal(
    EnergyMeter.safeParse({ ...dto, readings: undefined }).success,
    false
  )
})

test("fetches the encoded single-meter DTO and works as a detached callback", async () => {
  const special = { ...dto, meterId: "meter/a b" }
  api.get = async (path) => {
    assert.equal(path, "/energy-meters/dto/meter%2Fa%20b")
    return special
  }
  const { getEnergyMeter } = new EnergyMeterApiService()
  assert.deepEqual(
    await getEnergyMeter({ ...input, energyMeterId: special.meterId }),
    special
  )
})

test("rejects invalid input before requesting, malformed DTOs, and mismatched IDs", async () => {
  const service = new EnergyMeterApiService()
  api.get = () => assert.fail("Invalid input must not call the backend")
  await assert.rejects(service.getEnergyMeter({ ...input, energyMeterId: "" }))
  for (const response of [
    { ...dto, readings: null },
    { ...dto, meterId: "other" },
    { ...dto, propertyId: "other" },
  ]) {
    api.get = async () => response
    await assert.rejects(service.getEnergyMeter(input))
  }
})

test("propagates HTTP errors unchanged", async () => {
  for (const status of [401, 403, 404, 500]) {
    const error = Object.assign(new Error("Request failed"), {
      response: { status },
    })
    api.get = async () => {
      throw error
    }
    await assert.rejects(
      new EnergyMeterApiService().getEnergyMeter(input),
      (actual) => actual === error
    )
  }
})

test("fetches meter lists without date filters as a detached callback", async () => {
  const meters = [dto, { ...dto, meterId: "second-meter", readings: [] }]
  api.get = async (...args) => {
    assert.deepEqual(args, ["/energy-meters/dto/asList/property-id"])
    return meters
  }
  const { getEnergyMeters } = new EnergyMeterApiService()
  assert.deepEqual(
    await getEnergyMeters({ propertyId: dto.propertyId }),
    meters
  )
})

test("returns an empty meter list", async () => {
  api.get = async () => []
  assert.deepEqual(
    await new EnergyMeterApiService().getEnergyMeters({
      propertyId: dto.propertyId,
    }),
    []
  )
})

test("encodes the property ID when fetching meter lists", async () => {
  const special = { ...dto, propertyId: "property/a b?#" }
  api.get = async (...args) => {
    assert.deepEqual(args, ["/energy-meters/dto/asList/property%2Fa%20b%3F%23"])
    return [special]
  }
  assert.deepEqual(
    await new EnergyMeterApiService().getEnergyMeters({
      propertyId: special.propertyId,
    }),
    [special]
  )
})

test("rejects invalid list input before requesting", async () => {
  api.get = () => assert.fail("Invalid input must not call the backend")
  const service = new EnergyMeterApiService()
  for (const invalid of [{}, { propertyId: "" }, { propertyId: 123 }]) {
    await assert.rejects(service.getEnergyMeters(invalid), { name: "ZodError" })
  }
})

test("rejects malformed meter lists", async () => {
  const service = new EnergyMeterApiService()
  for (const response of [
    null,
    undefined,
    dto,
    [dto, { ...dto, readings: null }],
  ]) {
    api.get = async () => response
    await assert.rejects(
      service.getEnergyMeters({ propertyId: dto.propertyId }),
      { name: "ZodError" }
    )
  }
})

test("rejects an entire list containing a meter from another property", async () => {
  api.get = async () => [dto, { ...dto, meterId: "other", propertyId: "other" }]
  await assert.rejects(
    new EnergyMeterApiService().getEnergyMeters({ propertyId: dto.propertyId }),
    { message: "Meter not found for this property." }
  )
})

test("propagates list HTTP errors unchanged", async () => {
  for (const status of [401, 403, 404, 500]) {
    const error = Object.assign(new Error("Request failed"), {
      response: { status },
    })
    api.get = async () => {
      throw error
    }
    await assert.rejects(
      new EnergyMeterApiService().getEnergyMeters({
        propertyId: dto.propertyId,
      }),
      (actual) => actual === error
    )
  }
})

test("monthly input validates writes separately from responses", () => {
  const fields = { ...input, date: "2025-01", usage: 0, cost: 0 }
  assert.equal(CreateEnergyReadingInput.safeParse(fields).success, true)
  assert.equal(
    CreateEnergyReadingInput.safeParse({
      ...fields,
      date: new Date().toISOString().slice(0, 7),
    }).success,
    true
  )
  for (const date of ["2025-00", "2025-13", "2025-1", "2025-01-01", "9999-01"])
    assert.equal(
      CreateEnergyReadingInput.safeParse({ ...fields, date }).success,
      false
    )
  for (const patch of [{ usage: -1 }, { cost: -1 }])
    assert.equal(
      CreateEnergyReadingInput.safeParse({ ...fields, ...patch }).success,
      false
    )
})

test("sorts and formats months without changing the readings array", () => {
  const meter = {
    ...dto,
    readings: [reading, { ...reading, id: "second", date: "2025-12" }],
  }
  assert.equal(latestReading(meter).id, "second")
  assert.equal(meter.readings[0].id, reading.id)
  assert.equal(meterDate("2025-01"), "Jan 2025")
  assert.equal(meterDate("2025-01-15T12:00:00.000Z"), "Jan 15, 2025")
  assert.equal(latestReading({ ...dto, readings: [] }), undefined)
})

test("mock CRUD preserves identity, monthly readings, and write restrictions", async () => {
  const service = createEnergyMeterMockService({
    getProperty: async () => ({ id: input.propertyId }),
  })
  const fields = {
    propertyId: input.propertyId,
    meterName: "Main meter",
    meterType: "ELECTRIC_GRID",
    unitOfMeasure: "kWh",
    inUse: true,
    isDelivered: false,
  }
  const meter = await service.createEnergyMeter(fields)
  const target = { propertyId: meter.propertyId, energyMeterId: meter.meterId }
  const readingInput = { ...target, date: "2025-01", usage: 10, cost: 0 }
  const updated = await service.createEnergyReading(readingInput)
  assert.equal(updated.readings[0].date, "2025-01")
  assert.equal(updated.readings[0].cost, 0)
  await assert.rejects(
    service.createEnergyReading(readingInput),
    /already exists/
  )
  await assert.rejects(
    service.updateEnergyMeter({ ...fields, ...target, unitOfMeasure: "MWh" }),
    /Type and units/
  )
  await service.updateEnergyMeter({
    ...fields,
    ...target,
    meterName: "Renamed",
    inUse: false,
  })
  await assert.rejects(
    service.createEnergyReading({ ...readingInput, date: "2025-02" }),
    /Activate/
  )
  const loaded = await service.getEnergyMeter(target)
  assert.equal(loaded.meterName, "Renamed")
  assert.equal(loaded.meterId, meter.meterId)
  assert.equal(loaded.readings.length, 1)
})
