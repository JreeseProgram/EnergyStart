import { ContentLayout } from "@/components/layouts/content-layout"
import { Button } from "@/components/ui/button"
import { paths } from "@/config/paths"
import { PortfolioDashboardCell } from "@/features/portfolio/cells/portfolio-dashboard.cell"
import { ArrowRight } from "lucide-react"
import { Link } from "react-router"

const DashboardRoute = () => (
  <ContentLayout
    title="Portfolio performance"
    description="Track efficiency, resolve data gaps, and prepare ENERGY STAR submissions."
    action={
      <Button render={<Link to={paths.app.properties.getHref()} />}>
        View properties <ArrowRight />
      </Button>
    }
  >
    <PortfolioDashboardCell />
  </ContentLayout>
)

export default DashboardRoute
