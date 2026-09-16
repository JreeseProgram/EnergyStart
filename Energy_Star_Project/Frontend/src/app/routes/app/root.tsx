import { DashboardLayout } from "@/components/layouts/dashboard-layout"
import { AppSidebar } from "@/components/sidebars/app-sidbar"
import { Outlet } from "react-router"

export const ErrorBoundary = () => {
  return <div>Something went wrong!</div>
}

const AppRoot = () => {
  return (
    <DashboardLayout sidebar={<AppSidebar variant="inset" />}>
      <Outlet />
    </DashboardLayout>
  )
}

export default AppRoot
