import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { Outlet } from "react-router"

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>
}

const AppRoot = () => {
  return (
    <DashboardLayout topbar={<></>}>
      <Outlet />
    </DashboardLayout>
  )
}

export default AppRoot
