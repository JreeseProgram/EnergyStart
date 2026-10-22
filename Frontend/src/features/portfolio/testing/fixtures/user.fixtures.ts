import { User } from "@/features/portfolio/models/user.models"

export const testPortfolioUser = User.parse({
  id: "b0ed477e-df48-4e5a-9c79-2323c5df5302",
  createdAt: new Date().toISOString(),
  email: "luke-skywalker@jmail.com",
  firstName: "Luke",
  lastName: "Skywalker",
})
