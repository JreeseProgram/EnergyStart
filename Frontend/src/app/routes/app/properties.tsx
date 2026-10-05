import { ContentLayout } from "@/components/layouts/content-layout"
import { Button } from "@/components/ui/button"
import { PropertiesListCell } from "@/features/portfolio/cells/properties-list.cell"
import { PropertyModal } from "@/features/portfolio/modals/property.modal"
import { Plus } from "lucide-react"

const PropertiesRoute = () => {
  return (
    <ContentLayout
      title="Properties"
      description="Manage portfolio properties, performance, and associated records."
      action={
        <PropertyModal
          render={
            <Button>
              Add Proprerty <Plus />
            </Button>
          }
        />
      }
    >
      <PropertiesListCell />
    </ContentLayout>
  )
}

export default PropertiesRoute
