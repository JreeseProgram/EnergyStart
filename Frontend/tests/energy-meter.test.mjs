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
  EnergyReadingCreateRefreshError,
  EnergyMeterCreateRefreshError,
  EnergyMeterUpdateRefreshError,
} = await import("../src/features/portfolio/services/energy-meter.service.ts")
const { latestReading, meterDate } =
  await import("../src/features/portfolio/utils/energy-meter-labels.ts")
const { createEnergyMeterMockService } =
  await import("../src/features/portfolio/testing/services/energy-meter.service.ts")
const { zodResolver } = await import("@hookform/resolvers/zod")

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

const readingInput = {
  ...input,
  date: reading.date,
  usage: reading.usage,
  cost: 0,
}
const createdReading = { ...reading, createdAt: null }

test("reading form uses the service input resolver for numeric fields and accepts corrections", async () => {
  const resolver = zodResolver(CreateEnergyReadingInput)
  const options = { fields: {}, shouldUseNativeValidation: false }
  const rejected = await resolver(
    { ...input, date: "2025-13", usage: NaN, cost: -1 },
    {},
    options
  )
  assert.deepEqual(rejected.values, {})
  assert.ok(rejected.errors.date)
  assert.ok(rejected.errors.usage)
  assert.ok(rejected.errors.cost)

  for (const cost of [0, 5, 5.25]) {
    const values = { ...input, date: "2025-01", usage: 12.5, cost }
    const accepted = await resolver(values, {}, options)
    assert.deepEqual(accepted.errors, {})
    assert.deepEqual(accepted.values, values)
  }
})

test("creates a reading with exact fields and reads the canonical meter as a detached callback", async () => {
  const calls = []
  api.post = async (...args) => {
    calls.push(["post", ...args])
    return createdReading
  }
  api.get = async (...args) => {
    calls.push(["get", ...args])
    return dto
  }
  const { createEnergyReading } = new EnergyMeterApiService()
  assert.deepEqual(
    await createEnergyReading({
      ...readingInput,
      id: "ignored",
      createdAt: "ignored",
      readings: [],
    }),
    dto
  )
  assert.deepEqual(calls, [
    [
      "post",
      `/energy-meter-readings/meter/${dto.meterId}`,
      { date: reading.date, usage: reading.usage, cost: 0 },
    ],
    ["get", `/energy-meters/dto/${dto.meterId}`],
  ])
})

test("encodes the reading meter identifier in both requests", async () => {
  const energyMeterId = "meter /?#%"
  const calls = []
  api.post = async (url) => {
    calls.push(url)
    return createdReading
  }
  api.get = async (url) => {
    calls.push(url)
    return { ...dto, meterId: energyMeterId }
  }
  await new EnergyMeterApiService().createEnergyReading({
    ...readingInput,
    energyMeterId,
  })
  assert.deepEqual(calls, [
    "/energy-meter-readings/meter/meter%20%2F%3F%23%25",
    "/energy-meters/dto/meter%20%2F%3F%23%25",
  ])
})

test("rejects invalid reading input before any request", async () => {
  api.post = api.get = () => assert.fail("Invalid input must not request")
  for (const invalid of [
    {},
    ...[
      { energyMeterId: "" },
      { propertyId: "" },
      { date: "2025-13" },
      { date: "9999-01" },
      { usage: -1 },
      { cost: -1 },
      { usage: NaN },
      { cost: Infinity },
      { usage: "12" },
      { cost: undefined },
    ].map((patch) => ({ ...readingInput, ...patch })),
  ]) {
    await assert.rejects(
      new EnergyMeterApiService().createEnergyReading(invalid),
      { name: "ZodError" }
    )
  }
})

function assertReadingRefreshError(error) {
  assert.ok(error instanceof EnergyReadingCreateRefreshError)
  assert.equal(error.name, "EnergyReadingCreateRefreshError")
  assert.equal(error.propertyId, input.propertyId)
  assert.equal(error.energyMeterId, input.energyMeterId)
  assert.match(error.message, /may have been created/)
  assert.match(
    error.message,
    /reload the meter; do not submit the reading again/
  )
}

test("malformed successful reading responses preserve validation failures without retrying", async () => {
  api.get = () => assert.fail("Malformed write response must not read back")
  for (const response of [
    null,
    undefined,
    {},
    { ...createdReading, id: "" },
    { ...createdReading, date: "2025-13" },
    { ...createdReading, usage: "12" },
    { ...createdReading, cost: null },
    { ...createdReading, createdAt: "invalid" },
  ]) {
    let posts = 0
    api.post = async () => {
      posts++
      return response
    }
    await assert.rejects(
      new EnergyMeterApiService().createEnergyReading(readingInput),
      (error) => {
        assertReadingRefreshError(error)
        assert.equal(error.cause.name, "ZodError")
        return true
      }
    )
    assert.equal(posts, 1)
  }
})

test("reading creation reports malformed canonical meters and identity mismatches without retrying", async () => {
  for (const response of [
    null,
    {},
    { ...dto, readings: [createdReading] },
    { ...dto, meterId: "other-meter" },
    { ...dto, propertyId: "other-property" },
  ]) {
    let posts = 0
    let gets = 0
    api.post = async () => {
      posts++
      return createdReading
    }
    api.get = async () => {
      gets++
      return response
    }
    await assert.rejects(
      new EnergyMeterApiService().createEnergyReading(readingInput),
      (error) => {
        assertReadingRefreshError(error)
        if (
          response?.meterId === "other-meter" ||
          response?.propertyId === "other-property"
        ) {
          assert.equal(
            error.cause.message,
            "Meter not found for this property."
          )
        } else {
          assert.equal(error.cause.name, "ZodError")
        }
        return true
      }
    )
    assert.equal(posts, 1)
    assert.equal(gets, 1)
  }
})

test("reading creation preserves failed read-back cause without retrying the successful write", async () => {
  const cause = new Error("Read-back failed")
  let posts = 0
  let gets = 0
  api.post = async () => {
    posts++
    return createdReading
  }
  api.get = async () => {
    gets++
    throw cause
  }
  await assert.rejects(
    new EnergyMeterApiService().createEnergyReading(readingInput),
    (error) => {
      assertReadingRefreshError(error)
      assert.equal(error.cause, cause)
      return true
    }
  )
  assert.equal(posts, 1)
  assert.equal(gets, 1)
})

test("reading write HTTP errors propagate unchanged without refresh or retry", async () => {
  api.get = () => assert.fail("Failed write must not read back")
  for (const status of [400, 401, 403, 404, 409, 500]) {
    const error = Object.assign(new Error("Write failed"), {
      response: { status },
    })
    let posts = 0
    api.post = async () => {
      posts++
      throw error
    }
    await assert.rejects(
      new EnergyMeterApiService().createEnergyReading(readingInput),
      (actual) => actual === error
    )
    assert.equal(posts, 1)
  }
})

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
