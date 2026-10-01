import { ContentLayout } from "@/components/layouts/content-layout"
import { Link } from "@/components/ui/link"
import { paths } from "@/config/paths"

const PropertiesRoute = () => {
  return (
    <ContentLayout title="Properties">
      <div className="flex flex-col items-center justify-center gap-4 py-4 md:gap-6 md:py-6">
        <Link to={paths.app.property.root.getHref("TEST")}>
          To property details
        </Link>
      </div>
    </ContentLayout>
  )
}

export default PropertiesRoute
