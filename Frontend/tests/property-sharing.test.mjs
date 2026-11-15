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
const { PropertyApiService } =
  await import("../src/features/portfolio/services/property-api.service.ts")
const { createPropertyTestService } =
  await import("../src/features/portfolio/testing/services/property.service.ts")
const { createPortfolioTestStore } =
  await import("../src/features/portfolio/testing/portfolio-test-store.ts")
const { PropertyShareRefreshError } =
  await import("../src/features/portfolio/services/property.service.ts")
const { api } = await import("@/lib/api-client")
const sharedUser = {
  userId: "user/one",
  email: "one@example.com",
  firstName: null,
  lastName: null,
}

test("list validates nullable names and encodes ID with detached callbacks", async () => {
  const { getPropertyUsers } = new PropertyApiService()
  api.get = async (path) => {
    assert.equal(path, "/properties/property%2Fone/users")
    return [sharedUser]
  }
  assert.deepEqual(await getPropertyUsers({ propertyId: "property/one" }), [
    sharedUser,
  ])
  for (const response of [
    null,
    {},
    [{ ...sharedUser, userId: "" }],
    [{ ...sharedUser, email: "invalid" }],
  ]) {
    api.get = async () => response
    await assert.rejects(getPropertyUsers({ propertyId: "one" }))
  }
})

test("remove encodes IDs and accepts empty 204 without requesting details", async () => {
  const { removePropertyUser } = new PropertyApiService()
  let deletes = 0
  api.delete = async (path) => {
    deletes++
    assert.equal(path, "/properties/property%2Fone/users/user%2Fone")
    return undefined
  }
  api.get = async () =>
    assert.fail("Removal must not refresh inaccessible details")
  assert.equal(
    await removePropertyUser({
      propertyId: "property/one",
      userId: "user/one",
    }),
    undefined
  )
  for (const input of [
    { propertyId: "", userId: "one" },
    { propertyId: "one", userId: "" },
  ])
    await assert.rejects(removePropertyUser(input))
  assert.equal(deletes, 1)
})

test("sharing HTTP failures propagate without retries", async () => {
  const service = new PropertyApiService()
  for (const status of [403, 404, 409, 500]) {
    const error = Object.assign(new Error(`HTTP ${status}`), { status })
    let calls = 0
    api.delete = api.get = async () => {
      calls++
      throw error
    }
    await assert.rejects(
      service.removePropertyUser({ propertyId: "one", userId: "two" }),
      (result) => result === error
    )
    await assert.rejects(
      service.getPropertyUsers({ propertyId: "one" }),
      (result) => result === error
    )
    assert.equal(calls, 2)
  }
})

test("adding normalizes email and preserves successful-write response errors", async () => {
  const { addPropertyUser } = new PropertyApiService()
  api.post = async (path, payload) => {
    assert.equal(path, "/properties/one/users")
    assert.deepEqual(payload, { email: "one@example.com" })
    return sharedUser
  }
  await addPropertyUser({ propertyId: "one", email: " ONE@example.com " })
  api.post = async () => ({})
  await assert.rejects(
    addPropertyUser({ propertyId: "one", email: "one@example.com" }),
    PropertyShareRefreshError
  )
})

test("authorized non-owner can share, remove the creator, and revoke access", async () => {
  const store = createPortfolioTestStore()
  const propertyId = store.properties[0].id
  const owner = store.properties[0].owner
  let actor = store.properties[0].assignments[0].user
  const service = createPropertyTestService(store, async () => actor)
  const users = await service.getPropertyUsers({ propertyId })
  assert.equal(users.length, 2)
  const third = store.users.find(
    (user) => !users.some((entry) => entry.userId === user.id)
  )
  assert.ok(third)
  await service.addPropertyUser({ propertyId, email: third.email })
  await assert.rejects(
    service.addPropertyUser({ propertyId, email: third.email }),
    /already has access/
  )
  await assert.rejects(
    service.addPropertyUser({ propertyId, email: "unknown@example.com" }),
    /No registered user/
  )
  await assert.rejects(
    service.removePropertyUser({ propertyId, userId: "missing" }),
    /not assigned/
  )
  await service.removePropertyUser({ propertyId, userId: owner.id })
  actor = owner
  await assert.rejects(
    service.getPropertyUsers({ propertyId }),
    /do not have access/
  )
  await assert.rejects(
    service.getProperty({ propertyId }),
    /do not have access/
  )
  await assert.rejects(
    service.addPropertyUser({ propertyId, email: owner.email }),
    /do not have access/
  )
  await assert.rejects(
    service.removePropertyUser({ propertyId, userId: third.id }),
    /do not have access/
  )
  assert.ok(
    !(await service.getProperties()).some(
      (property) => property.id === propertyId
    )
  )
})

test("self-removal revokes access, protects final user, and persists across service instances", async () => {
  const store = createPortfolioTestStore()
  const propertyId = store.properties[0].id
  let actor = store.properties[0].owner
  const removed = actor
  const remaining = store.properties[0].assignments[0].user
  const service = createPropertyTestService(store, async () => actor)
  await service.removePropertyUser({ propertyId, userId: actor.id })
  await assert.rejects(
    service.getProperty({ propertyId }),
    /do not have access/
  )
  actor = remaining
  assert.equal((await service.getPropertyUsers({ propertyId })).length, 1)
  await assert.rejects(
    service.removePropertyUser({ propertyId, userId: actor.id }),
    /last authorized user/
  )
  assert.deepEqual((await service.getProperty({ propertyId })).authUsers, [
    actor.id,
  ])
  const reopened = createPropertyTestService(store, async () => removed)
  await assert.rejects(
    reopened.getProperty({ propertyId }),
    /do not have access/
  )
  actor = null
  await assert.rejects(service.getPropertyUsers({ propertyId }), /Sign in/)
})
