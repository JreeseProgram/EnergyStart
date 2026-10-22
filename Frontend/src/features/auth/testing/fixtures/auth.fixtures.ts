import { AuthenticatedUser } from "@/features/auth/models/auth.models"

export const SESSION_KEY = "energy-start:test-auth:authenticated"

export const testUser = AuthenticatedUser.parse({
  id: "b0ed477e-df48-4e5a-9c79-2323c5df5302",
  createdAt: new Date().toISOString(),
  email: "luke-skywalker@jmail.com",
  firstName: "Luke",
  lastName: "Skywalker",
})
