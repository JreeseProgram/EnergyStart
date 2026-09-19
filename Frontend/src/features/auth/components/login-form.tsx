import * as React from "react"

import { Button } from "@/components/ui/button"
import { useLogin } from "@/features/auth/hooks/use-login"
import { type AuthenticatedUser } from "@/features/auth/models/user.models"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type LoginFormProps = {
  onSuccess: (data: AuthenticatedUser) => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = React.useState("luke.skywalker@jmail.com")
  const [password, setPassword] = React.useState("password")

  const login = useLogin({
    onSuccess,
  })

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault()
        login.mutate({ email, password })
      }}
    >
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>
        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="#"
              className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        {login.error && (
          <p className="text-sm text-destructive">{login.error.message}</p>
        )}
        <Field>
          <Button type="submit" disabled={login.isPending}>
            {login.isPending ? "Logging in..." : "Login"}
          </Button>
          <FieldDescription className="text-center">
            Don&apos;t have an account? <a href="#">Sign up</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}
