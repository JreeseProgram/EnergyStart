import assert from "node:assert/strict"
import test from "node:test"
import { registerHooks } from "node:module"
import { existsSync, readFileSync } from "node:fs"
import ts from "typescript"
import { createElement } from "react"
import { renderToStaticMarkup } from "react-dom/server"
import {
  QueryClient,
  QueryObserver,
  MutationObserver,
} from "@tanstack/react-query"

// Supply hook dependencies while exercising real query/mutation cache behavior.
const stateUrl = "data:text/javascript,export const state = {}"
const { state } = await import(stateUrl)
const stub = (source) => ({
  url: `data:text/javascript,${encodeURIComponent(source)}`,
  shortCircuit: true,
})
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
    const harness = `import { state } from ${JSON.stringify(stateUrl)};`
    if (specifier === "@/context/services.context")
      return stub("export const Services = {}")
    if (specifier === "@/features/portfolio/api/get-user.api")
      return stub(
        harness +
          "export const usePortfolioUser = () => ({ data: { id: state.currentUserId } })"
      )
    if (context.parentURL?.endsWith("property-sharing.api.ts")) {
      if (specifier === "react")
        return stub(
          harness +
            "export const use = () => ({ propertyService: state.service })"
        )
      if (specifier === "react-router")
        return stub(harness + "export const useNavigate = () => state.navigate")
      if (specifier === "@tanstack/react-query")
        return stub(
          harness +
            "export const useQueryClient = () => state.client; export const useMutation = options => options; export const queryOptions = options => options; export const useQuery = options => options"
        )
    }
    if (
      specifier === "react" &&
      context.parentURL?.endsWith("property-sharing-table.tsx")
    )
      return stub(
        harness + "export const useState = () => [state.page ?? 0, () => {}]"
      )
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
const {
  useAddPropertyUser,
  useRemovePropertyUser,
  getPropertyUsersQueryOptions,
} = await import("../src/features/portfolio/api/property-sharing.api.ts")
const { PropertyShareRefreshError } =
  await import("../src/features/portfolio/services/property.service.ts")
const { PropertySharingTable } =
  await import("../src/features/portfolio/components/property-sharing-table.tsx")

function setup() {
  state.client = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
      mutations: { retry: false },
    },
  })
  state.currentUserId = "me"
  state.service = {
    removePropertyUser: async () => {},
    addPropertyUser: async () => {},
    getPropertyUsers: async () => [],
  }
  state.navigate = async () =>
    assert.fail("Removing another user must not navigate")
  return state.client
}

function observe(client, key, fetch) {
  const observer = new QueryObserver(client, {
    queryKey: key,
    queryFn: fetch,
    initialData: [],
  })
  return observer.subscribe(() => {})
}

test("add and remove refresh the active users query; refresh failures do not fail removal", async () => {
  const client = setup()
  let reads = 0
  let failRefresh = false
  state.service.getPropertyUsers = async () => {
    reads++
    if (failRefresh) throw new Error("Refresh failed")
    return []
  }
  const options = getPropertyUsersQueryOptions({
    propertyId: "one",
    propertyService: state.service,
  })
  const unsubscribe = observe(client, options.queryKey, options.queryFn)
  await new MutationObserver(client, useAddPropertyUser()).mutate({
    propertyId: "one",
    email: "user@example.com",
  })
  assert.equal(reads, 1)
  const removal = useRemovePropertyUser()
  assert.equal(removal.retry, false)
  await new MutationObserver(client, removal).mutate({
    propertyId: "one",
    userId: "other",
  })
  assert.equal(reads, 2)
  failRefresh = true
  const mutation = new MutationObserver(client, useRemovePropertyUser())
  await mutation.mutate({ propertyId: "one", userId: "other" })
  assert.equal(mutation.getCurrentResult().status, "success")
  unsubscribe()
  client.clear()
})

test("invalid add response still invalidates sharing users", async () => {
  const client = setup()
  let reads = 0
  const unsubscribe = observe(
    client,
    ["Properties", { propertyId: "one" }, "Users"],
    async () => {
      reads++
      return []
    }
  )
  state.service.addPropertyUser = async () => {
    throw new PropertyShareRefreshError("one", new Error("bad response"))
  }
  await assert.rejects(
    new MutationObserver(client, useAddPropertyUser()).mutate({
      propertyId: "one",
      email: "user@example.com",
    }),
    PropertyShareRefreshError
  )
  assert.equal(reads, 1)
  unsubscribe()
  client.clear()
})

test("self-removal waits for navigation, removes detail/users caches, and refreshes the list", async () => {
  const client = setup()
  const propertyKey = ["Properties", { propertyId: "one" }]
  const usersKey = [...propertyKey, "Users"]
  const unsubscribers = [propertyKey, usersKey].map((key) =>
    observe(client, key, async () =>
      assert.fail("Do not refetch revoked access")
    )
  )
  let listReads = 0
  const unsubscribeList = observe(client, ["Properties"], async () => {
    listReads++
    return []
  })
  client.setQueryData(["Properties", { propertyId: "other" }], { id: "other" })
  state.navigate = async (path, options) => {
    assert.equal(path, "/app/properties")
    assert.equal(options.replace, true)
    await new Promise((resolve) => setImmediate(resolve))
    assert.ok(
      client.getQueryData(propertyKey),
      "Keep queries until navigation unmounts observers"
    )
    unsubscribers.forEach((unsubscribe) => unsubscribe())
  }
  await new MutationObserver(client, useRemovePropertyUser()).mutate({
    propertyId: "one",
    userId: "me",
  })
  assert.equal(client.getQueryData(propertyKey), undefined)
  assert.equal(client.getQueryData(usersKey), undefined)
  assert.deepEqual(
    client.getQueryData(["Properties", { propertyId: "other" }]),
    { id: "other" }
  )
  assert.equal(listReads, 1)
  unsubscribeList()
  client.clear()
})

const user = {
  userId: "me",
  email: "me@example.com",
  firstName: null,
  lastName: null,
}
function table(users, page = 0) {
  state.page = page
  return renderToStaticMarkup(
    createElement(PropertySharingTable, {
      users,
      currentUserId: "me",
      propertyName: "Office",
      canManage: true,
      onRemove: () => {},
    })
  )
}
test("table shows email fallback and self identity, protects final user, and handles empty lists", () => {
  const markup = table([user])
  assert.ok(markup.includes("me@example.com (you)"))
  assert.match(markup, /<button[^>]*disabled[^>]*aria-label="Leave property"/)
  assert.ok(markup.includes("The last authorized user cannot be removed."))
  assert.ok(!markup.includes("Assigned"))
  assert.ok(table([]).includes("No users found."))
})

test("table pages ten users and clamps the selected page after removal", () => {
  const users = Array.from({ length: 11 }, (_, i) => ({
    ...user,
    userId: `user${i}`,
    email: `user${i}@example.com`,
  }))
  assert.ok(!table(users).includes("user10@example.com"))
  assert.ok(table(users, 1).includes("user10@example.com"))
  const afterRemoval = table(users.slice(0, 10), 1)
  assert.ok(afterRemoval.includes("user0@example.com"))
  assert.ok(afterRemoval.includes("Page 1 of 1"))
})
