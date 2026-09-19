import * as React from "react"
import { use } from "react"
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { Button } from "@/components/ui/button"
import { Services } from "@/context/services.context"
import { type AuthenticatedUser } from "@/features/auth/models/user.models"

type RegisterFormProps = {
  chooseTeam: boolean
  onSuccess: (data: AuthenticatedUser) => void
  setChooseTeam: () => void
  teams?: Array<{ id: string; name: string }>
}

export function RegisterForm({
  chooseTeam,
  onSuccess,
  setChooseTeam,
  teams = [],
}: RegisterFormProps) {
  const { authService } = use(Services)
  const queryClient = useQueryClient()
  const [email, setEmail] = React.useState("new-user@example.com")
  const [firstName, setFirstName] = React.useState("New")
  const [lastName, setLastName] = React.useState("User")
  const [password, setPassword] = React.useState("password")

  const register = useMutation({
    mutationFn: () =>
      authService.register({ email, firstName, lastName, password }),
    onSuccess: (data) => {
      queryClient.setQueryData(["User"], data.user)
      onSuccess(data)
    },
  })

  return (
    <form
      className="space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        register.mutate()
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm font-medium text-gray-700">
          First name
          <input
            className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={firstName}
            onChange={(event) => setFirstName(event.target.value)}
          />
        </label>
        <label className="block text-sm font-medium text-gray-700">
          Last name
          <input
            className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            value={lastName}
            onChange={(event) => setLastName(event.target.value)}
          />
        </label>
      </div>
      <label className="block text-sm font-medium text-gray-700">
        Email
        <input
          className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          autoComplete="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
      </label>
      <label className="block text-sm font-medium text-gray-700">
        Password
        <input
          className="mt-1 block h-10 w-full rounded-md border border-input bg-background px-3 text-foreground shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-gray-700">
        <input
          checked={chooseTeam}
          className="size-4 accent-primary"
          type="checkbox"
          onChange={setChooseTeam}
        />
        Join an existing team
      </label>
      {chooseTeam && teams.length > 0 && (
        <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-foreground">
          {teams.map((team) => (
            <option key={team.id}>{team.name}</option>
          ))}
        </select>
      )}
      {register.error && (
        <p className="text-sm text-destructive">{register.error.message}</p>
      )}
      <Button className="w-full" type="submit" disabled={register.isPending}>
        {register.isPending ? "Creating account..." : "Register"}
      </Button>
    </form>
  )
}
