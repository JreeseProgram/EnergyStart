# EnergyStart — Backend API Reference Version 1

**Prototype documentation | October 2026**  
**Base URL (local):** `http://127.0.0.1:8080`  
**Suggested GitHub path:** `Backend/prod/API_ENDPOINTS.md`

## Overview

EnergyStart uses Spring Boot and MongoDB. All 15 CRUD routes across Users, Properties, and Energy Reports passed manual Postman smoke tests. These tests do **not** establish production authentication or full validation coverage.

For POST/PUT requests use `Content-Type: application/json`. In the local-only `local-test` Spring profile, Postman authorization is **No Auth**. Start locally with:

```powershell
.\mvnw.cmd spring-boot:run "-Dspring-boot.run.profiles=local-test" "-Dspring-boot.run.arguments=--server.address=127.0.0.1"
```

**Never enable `local-test` on a public server.** WorkOS integration is being handled separately. The current local property testing flow uses a temporary identity `user_localtest`; restore authenticated identity handling before deployment.

## Endpoint index

| Method | Endpoint | Description | Success status |
| --- | --- | --- | --- |
| POST | `/api/users` | Create user | `201` |
| GET | `/api/users` | List users | `200` |
| GET | `/api/users/{id}` | Retrieve user | `200` |
| PUT | `/api/users/{id}` | Update user | `200` |
| DELETE | `/api/users/{id}` | Delete user | Passed; exact status to confirm from controller |
| POST | `/api/properties` | Create property | `200` |
| GET | `/api/properties` | List accessible properties | `200` |
| GET | `/api/properties/{id}` | Retrieve property | `200` |
| PUT | `/api/properties/{id}` | Update property | `200` |
| DELETE | `/api/properties/{id}` | Delete property | Passed; exact status to confirm from controller |
| POST | `/api/energy-reports` | Create report | `201` |
| GET | `/api/energy-reports` | List reports | `200` |
| GET | `/api/energy-reports/{id}` | Retrieve report | `200` |
| PUT | `/api/energy-reports/{id}` | Update report | `200` |
| DELETE | `/api/energy-reports/{id}` | Delete report | `204` (empty body) |

`{id}` means substitute the real string ID from a server response, without braces. GET-all returns a JSON array, possibly `[]`.

## Users API

User fields tested: `id` (server-generated string), `username` (string), `email` (string), `role` (string). The example values `USER` and `ADMIN` were used in testing; this CRUD API is not necessarily WorkOS registration.

### POST `/api/users`

```json
{
  "username": "prototype_test_user",
  "email": "prototype_test@example.com",
  "role": "USER"
}
```

**Expected:** `201 Created`; save the returned `id`.

### GET `/api/users`

**Expected:** `200 OK`, JSON array of users.

### GET `/api/users/{id}`

**Expected:** `200 OK`, one user object for an existing ID.

### PUT `/api/users/{id}`

```json
{
  "username": "prototype_updated_user",
  "email": "prototype_updated@example.com",
  "role": "ADMIN"
}
```

**Expected:** `200 OK`; follow-up GET verified the update.

### DELETE `/api/users/{id}`

Successfully tested. Confirm the precise success HTTP status and response body from the latest Users controller before frontend code relies on them.

## Properties API

Fields from the `Property` model:

| Field | Type | Notes |
| --- | --- | --- |
| `id` | String | Server-generated |
| `humanReadablePropertyId` | Integer | Human-facing identifier |
| `streetAddress` | String | Street |
| `city` | String | City |
| `state` | String | State |
| `zipcode` | Integer | Does not preserve leading zeros |
| `notes` | String | Notes |
| `authorizedUserIds` | Array of strings | Backend-managed access list |

### POST `/api/properties`

```json
{
  "humanReadablePropertyId": 1001,
  "streetAddress": "123 Prototype Street",
  "city": "Orlando",
  "state": "FL",
  "zipcode": 32801,
  "notes": "Test property created during prototype API testing."
}
```

**Expected:** `200 OK`, property object with server-assigned `id`. During local testing the service added `authorizedUserIds: ["user_localtest"]`.

### GET `/api/properties`

**Expected:** `200 OK`, JSON array of properties accessible to the active identity.

### GET `/api/properties/{id}`

**Expected:** `200 OK` for an accessible property; `404 Not Found` was verified after deletion.

### PUT `/api/properties/{id}`

```json
{
  "humanReadablePropertyId": 1001,
  "streetAddress": "456 Updated Prototype Avenue",
  "city": "Orlando",
  "state": "FL",
  "zipcode": 32801,
  "notes": "Property information updated successfully during API testing."
}
```

**Expected:** `200 OK`. A follow-up GET confirmed changes were persisted.

### DELETE `/api/properties/{id}`

Successfully tested; the controller returns the deleted property object. Follow-up GET returned `404` with message `Property not found.`. Verify the exact DELETE success status in the latest controller before relying on it.

**Security:** Property access currently uses `user_localtest` only in the prototype local-testing flow. Production must use the authenticated user's identity.

## Energy Reports API

Energy reports are polymorphic. **Include `reportType` in POST and PUT JSON**. The base `EnergyReport` model exposes:

| Field | Type | Notes |
| --- | --- | --- |
| `reportType` | String | Determines report subtype |
| `ID` | String | Server-generated; uppercase `ID` |
| `relatedPropertyID` | String | Property reference; uppercase `ID` suffix |
| `energyMeters` | Array or null | See `EnergyMeter.java` for meter schema |
| `energyScore` | Number | Score stored in report |
| `grossFloorArea` | Integer | Must be positive according to tested service validation |
| `parkingSize` | Integer | Must be nonnegative |
| `yearOfConstruction` | Integer | Year subject to service validation |

**Important:** User and Property objects use lowercase `id`; Energy Reports use uppercase `ID`. Preserve field casing when integrating the frontend.

### Supported `reportType` values

`BANK_BRANCH`, `CONVENIENCE_STORE`, `COURT_HOUSE`, `DATA_CENTER`, `DISTRIBUTION_CENTER`, `FINANCIAL_OFFICE`, `HOSPITAL`, `HOTEL`, `MEDICAL_OFFICE`, `MULTIFAMILY_HOUSING`, `OFFICE`, `RETAIL_STORE`, `SCHOOL`, `SENIOR_LIVING_COMMUNITY`, `SUPERMARKET`, `VEHICLE_DEALERSHIP`, `WAREHOUSE_REFRIGERATED`, `WAREHOUSE`, `WHOLESALE_CLUB`, `WORSHIP_FACILITY`.

Only the **`OFFICE`** subtype was CRUD-tested. Other subtypes have separate Java classes under `energy/report_types/` and may require other fields.

Additional OFFICE fields: `numOfComputers` (integer), `numOfWorkersMainShift` (integer), `percentCooled` (number), and `weeklyOperatingHours` (integer).

### POST `/api/energy-reports`

```json
{
  "reportType": "OFFICE",
  "relatedPropertyID": "1",
  "grossFloorArea": 25000,
  "parkingSize": 5000,
  "yearOfConstruction": 2010,
  "numOfComputers": 150,
  "numOfWorkersMainShift": 75,
  "percentCooled": 90.0,
  "weeklyOperatingHours": 40,
  "energyMeters": [],
  "energyScore": 0.0
}
```

**Expected:** `201 Created`; response contains server-generated `ID`. **Use an actual Property ID in place of `"1"` when available.** `"1"` was used successfully in a prototype report, but its existence as a Property document was not confirmed.

Illustrative response:

```json
{
  "reportType": "OFFICE",
  "numOfComputers": 150,
  "numOfWorkersMainShift": 75,
  "percentCooled": 90.0,
  "weeklyOperatingHours": 40,
  "ID": "SERVER_GENERATED_REPORT_ID",
  "relatedPropertyID": "1",
  "energyMeters": [],
  "energyScore": 0.0,
  "grossFloorArea": 25000,
  "parkingSize": 5000,
  "yearOfConstruction": 2010
}
```

### GET `/api/energy-reports`

**Expected:** `200 OK`, array of reports. Different report types may have different fields.

### GET `/api/energy-reports/{id}`

**Expected:** `200 OK` with a report; `404 Not Found` with an empty body if missing.

### PUT `/api/energy-reports/{id}`

```json
{
  "reportType": "OFFICE",
  "relatedPropertyID": "1",
  "grossFloorArea": 30000,
  "parkingSize": 6000,
  "yearOfConstruction": 2010,
  "numOfComputers": 200,
  "numOfWorkersMainShift": 100,
  "percentCooled": 95.0,
  "weeklyOperatingHours": 45,
  "energyMeters": [],
  "energyScore": 0.0
}
```

**Expected:** `200 OK`, updated report; `404` if not found. Keep `reportType` unchanged when updating an existing report. The report `ID` is preserved. Follow-up GET verified persistence. Use the actual associated property ID in place of the example `"1"`.

### DELETE `/api/energy-reports/{id}`

**Expected:** `204 No Content` with **no JSON response body**. A follow-up GET returned `404 Not Found`.

### Energy report errors

`EnergyReportController` handles invalid report data with `400 Bad Request` and a **plain-text** exception message. Invalid JSON or an unsupported subtype returns `400` with text `Invalid JSON or unsupported reportType.`. Do not assume all API errors share a JSON schema.

## HTTP response codes

| Status | Meaning |
| --- | --- |
| `200 OK` | Successful retrieval or update; also property creation in current prototype |
| `201 Created` | User or report created |
| `204 No Content` | Energy report deleted; do not parse response as JSON |
| `400 Bad Request` | Invalid report data or unsupported subtype |
| `404 Not Found` | Record missing or not accessible |

A missing property returned a Spring Boot error JSON with `timestamp`, `status`, `error`, `trace`, `message`, and `path`. The `trace` should be disabled for production; frontend code should not depend on it.

## Frontend integration notes

1. Use IDs returned by the API; do not hard-code example IDs.
2. Respect `id` versus `ID` casing.
3. Select or create a Property before submitting a report's `relatedPropertyID`. Referential integrity between these MongoDB documents was **not** verified.
4. Include `reportType` for report POST/PUT, and use subtype-specific forms.
5. Treat GET-all responses as arrays, including `[]`.
6. Do not call `response.json()` after a successful `204 No Content`.
7. Local `No Auth` behavior is **not** the production WorkOS contract.
8. The base `EnergyReport.calcEnergyScore()` currently returns a placeholder `-1f`; the OFFICE subtype has a separate regression calculation method. Automatic scoring was **not** tested by these CRUD tests.

Example local-only fetch:

```javascript
const baseUrl = 'http://127.0.0.1:8080';

async function getProperties() {
  const res = await fetch(`${baseUrl}/api/properties`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function deleteReport(id) {
  const res = await fetch(`${baseUrl}/api/energy-reports/${encodeURIComponent(id)}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  // 204 No Content: no response JSON.
}
```

## Known prototype limitations / before deployment

- Replace the temporary property `user_localtest` identity with the authenticated WorkOS identity; never expose the `local-test` profile publicly.
- Confirm production authentication, roles, cross-user access rules, and CORS behavior.
- Standardize errors and disable stack traces in HTTP responses.
- Confirm exact DELETE response contracts for Users and Properties from their current controllers.
- Validate report-property relationships, invalid input, and all other report subtypes.
- Test Energy Meter behavior and ENERGY STAR score calculations separately.
- Add automated integration tests; manual CRUD success is not a substitute for security or regression testing.

## Manual verification record

| API group | POST | GET all | GET by ID | PUT + GET | DELETE + GET |
| --- | --- | --- | --- | --- | --- |
| Users | Passed | Passed | Passed | Passed | Passed* |
| Properties | Passed | Passed | Passed | Passed | Passed; GET `404` |
| Energy Reports (`OFFICE`) | `201` | `200` | `200` | `200` | `204`; GET `404` |

\* Users DELETE succeeded, but the exact DELETE status and follow-up response were not captured in the available notes.

---

*Keep this document updated as WorkOS integration and backend behavior evolve.*