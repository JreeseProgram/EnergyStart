import { paths } from "@/config/paths"
import { useUser } from "@/features/auth/hooks/use-user"
import { Navigate } from "react-router"

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useUser()

  if (!user.data) {
    return <Navigate to={paths.home.getHref()} replace />
  }

  return children
}
