import { Home } from "lucide-react"
import { useNavigate } from "react-router"

import { Head } from "@/components/seo"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import { useUser } from "@/features/auth/hooks/use-user"
import { useLogin } from "@/features/auth/hooks/use-login"

const LandingRoute = () => {
  const navigate = useNavigate()
  const user = useUser()
  const login = useLogin()

  const handleStart = () => {
    if (user.data) {
      navigate(paths.app.dashboard.getHref())
    } else {
      login.mutate()
    }
  }

  return (
    <>
      <Head description="Welcome to Energy Star Portfolio" />
      <div className="flex h-screen items-center">
        <div className="mx-auto max-w-7xl px-4 py-12 text-center sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            <span className="block">Energy Portfolio</span>
          </h2>
          <div className="mt-8 flex justify-center">
            <div className="inline-flex rounded-md shadow">
              <Button onClick={handleStart}>
                <Home className="size-4" />
                Get started
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default LandingRoute
