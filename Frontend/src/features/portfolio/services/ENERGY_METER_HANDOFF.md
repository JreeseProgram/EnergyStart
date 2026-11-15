# Energy meter API handoff

Updated November 14, 2026.

## Current state

- `EnergyMeterApiService` implements `Pick<EnergyMeterService, "getEnergyMeter" | "getEnergyMeters" | "createEnergyMeter" | "updateEnergyMeter">`. Both read methods directly import `api`, validate input, and encode path identifiers. Single-meter fetching parses `EnergyMeter` and checks meter/property identity. List fetching uses `/energy-meters/dto/asList/{propertyId}` without date filters, parses `EnergyMeter.array()`, and rejects the entire response if any meter belongs to another property. Empty lists return `[]`; HTTP and validation errors propagate unchanged.
- `createEnergyMeter` is complete. It validates with `CreateEnergyMeterInput` and directly posts the six editable DTO metadata fields to `/energy-meters/dto`, omitting IDs and readings. The response is parsed with `EnergyMeter` and checked against the requested property. HTTP errors propagate unchanged. Invalid successful responses throw `EnergyMeterCreateRefreshError` with the requested `propertyId` and original `cause`, warning that the meter may have been created and must not be submitted again. There is no retry or read-back request. The controller, DTO, mapper, and backend service contract were confirmed before implementation.
- `updateEnergyMeter` is complete. It validates with `UpdateEnergyMeterInput`, encodes the path ID, and sends only the six editable metadata fields to `PUT /energy-meters/dto/{id}`. It parses `EnergyMeter` and checks both meter and property identity. HTTP errors propagate unchanged; invalid successful responses throw `EnergyMeterUpdateRefreshError` with the requested `propertyId` and original `cause`, warning that the meter may have been updated and must not be saved again. There is no retry or read-back request. The backend controller, DTO, mapper, and service contract were reconfirmed.
- The API service remains partial: `createEnergyReading` is unimplemented. A separate workspace change currently wires it into `use-services.ts`, causing the typecheck failure recorded below. This task preserved that wiring change; complete the remaining capability before using the API service as the full application service.
- The user requested a clean, simple implementation using existing backend controllers, with frontend models aligned to backend DTOs. Avoid backend changes and compatibility adapters unless newly required.

## Remaining methods

Paths below are relative to the shared API client's base URL (the controller prefix includes `/api`). Encode path identifiers and use the existing input schemas.

| Method                | Existing endpoint                                      | Implementation notes                                                                                                                                                                                                                                                 |
| --------------------- | ------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createEnergyReading` | No reading write endpoint found in current controllers | Reinspect controllers before implementing. Do not invent a route or assume the meter DTO write endpoints save readings: `EnergyMeterMapper.toEnergyMeter` ignores `readings`. A backend capability or explicit scope decision is needed if this remains unavailable. |

For meter writes, inspect `EnergyMeterController`, `EnergyMeterDTO`, `EnergyMeterMapper`, and backend `EnergyMeterService` before finalizing payloads. The mapper consumes `meterId`, `propertyId`, `meterName`, `meterType`, `unitOfMeasure`, `inUse`, and `isDelivered`. Creation clears the incoming ID; update preserves the path ID. Reading records are stored separately.

If a write succeeds but response validation/read-back fails, distinguish that from a failed write so retrying does not accidentally create duplicates. Existing property/building-use services demonstrate save/refresh errors. Bind methods only if they call other instance methods and are used as detached callbacks.

## DTO and UI decisions already made

- `meterId` is the identifier (a branded nonempty string, not UUID-only); `meterName` is the nullable display name. Write inputs require a nonblank name. `energyMeterId` remains the service input identifier.
- Meter responses have no `id`, creation/update timestamp, or calculated energy totals. The UI's unsupported Updated column was removed.
- Readings contain `id`, `date` (`YYYY-MM`), `usage`, `cost`, and `createdAt`. Reading IDs accept nonempty strings. `createdAt` accepts timezone-free Java `LocalDateTime`; the mapper currently generates it during reads, so it is not reliable historical creation metadata.
- Forms and mocks now use monthly readings. Writes reject negative usage/cost and future months, allow the current month, and turn blank cost into zero. Response validation is separate from write constraints.
- Mocks reject duplicate months, readings on inactive meters, and type/unit changes after readings exist. These are frontend/mock rules; do not assume the backend enforces them.
- `meterDate` also formats timestamps for energy reports. Preserve that behavior when changing month formatting.

## Verification and completion

- Extend `Frontend/tests/energy-meter.test.mjs` using the existing mocked API client pattern. Cover DTO payloads/results, identity checks, HTTP errors, and successful-write/failed-response behavior where applicable.
- Existing coverage includes single-meter and list fetching, empty lists, encoded IDs, invalid inputs, malformed responses, property mismatches, unchanged HTTP errors, backend-shaped IDs/timestamps, monthly validation/formatting, and mock CRUD restrictions.
- From `Frontend`, run `node --test tests/*.test.mjs` and `npm run typecheck`; lint changed files and check formatting.
- Both read methods, meter creation, and meter updates are complete. Creation tests cover the exact payload, trimmed names, stripped IDs/readings, detached invocation, invalid input before requests, malformed responses, property mismatches, unchanged HTTP errors, and no repeated POST or read-back after invalid successful responses.
- Previous creation verification on November 14, 2026: `node --test tests/*.test.mjs` passed all 33 tests; `npm run typecheck` passed. ESLint passed for `energy-meter-api.service.ts` and `energy-meter.service.ts`. Prettier checks passed for both services, `tests/energy-meter.test.mjs`, and this handoff. This was not verified against a live backend or browser.
- Once all required capabilities exist, implement the full `EnergyMeterService` and explicitly update application wiring. Keep unrelated existing backend build-output changes untouched.

- Update verification on November 14, 2026: `node --test tests/*.test.mjs` passed all 39 tests. Update coverage includes exact payloads, trimmed names, excluded IDs/readings, detached invocation, encoded IDs, invalid input before requests, malformed responses, both identity mismatches, unchanged HTTP errors, and no repeated PUT or read-back after invalid successful responses. ESLint passed for both energy-meter services. Prettier checks passed for both services, the test file, and this handoff. `npm run typecheck` failed with TS2741 at `src/hooks/use-services.ts:32`: the separately wired `EnergyMeterApiService` lacks `createEnergyReading`, which remains outside this task. No live backend or browser verification was performed.
