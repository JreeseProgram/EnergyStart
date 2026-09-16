import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router"

import { AuthLayout } from "@/components/layouts/auth-layout"
import { paths } from "@/config/paths"
import { RegisterForm } from "@/components/forms/register-form"

const RegisterRoute = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTo = searchParams.get("redirectTo")
  const [chooseTeam, setChooseTeam] = useState(false)

  return (
    <AuthLayout title="Register your account">
      <RegisterForm
        onSuccess={() => {
          navigate(
            `${redirectTo ? `${redirectTo}` : paths.app.dashboard.getHref()}`,
            {
              replace: true,
            }
          )
        }}
        chooseTeam={chooseTeam}
        setChooseTeam={() => setChooseTeam(!chooseTeam)}
      />
    </AuthLayout>
  )
}

export default RegisterRoute
