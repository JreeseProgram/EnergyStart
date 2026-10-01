import { ContentLayout } from "@/components/layouts/content-layout"
import { Outlet } from "react-router"

const BuildingsRoute = () => {
  return (
    <ContentLayout title="Buildings">
      <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
        <Outlet />
      </div>
    </ContentLayout>
  )
}

export default BuildingsRoute
