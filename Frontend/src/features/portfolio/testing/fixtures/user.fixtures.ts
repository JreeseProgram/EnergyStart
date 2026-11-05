import { User } from "@/features/portfolio/models/user.models"

export const testPortfolioUser = User.parse({
  id: "b0ed477e-df48-4e5a-9c79-2323c5df5302",
  createdAt: new Date().toISOString(),
  email: "luke-skywalker@jmail.com",
  firstName: "Luke",
  lastName: "Skywalker",
})

export const mockSharingUsers = [
  User.parse({
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5303",
    createdAt: "2026-09-01T12:00:00.000Z",
    email: "maya@example.com",
    firstName: "Maya",
    lastName: "Chen",
  }),
  User.parse({
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5304",
    createdAt: "2026-09-01T12:00:00.000Z",
    email: "alex@example.com",
    firstName: "Alex",
    lastName: "Rivera",
  }),
  User.parse({
    id: "b0ed477e-df48-4e5a-9c79-2323c5df5305",
    createdAt: "2026-09-01T12:00:00.000Z",
    email: "sam@example.com",
    firstName: "Sam",
    lastName: "Patel",
  }),
]
