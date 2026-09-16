import { paths } from "@/config/paths"
import { useUser } from "@/hooks/use-user"
import { Navigate, useLocation } from "react-router"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser()
  const location = useLocation()

  if (!user.data) {
    return <Navigate to={paths.auth.login.getHref(location.pathname)} replace />
  }

  return children
}
