import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

import { paths } from "@/config/paths"
import { PropertyModal } from "@/features/portfolio/modals/property.modal"
import { LayoutGrid, MapPinned, PlusIcon } from "lucide-react"
import { Link } from "react-router"

export type NavMainItem = {
  title: string
  url: string
  icon?: React.ReactNode
  variant: "ghost"
}

export function NavMain() {
  return (
    <div className="hidden gap-1 md:flex">
      <Button
        render={<Link to={paths.app.dashboard.getHref()} />}
        variant={"ghost"}
        nativeButton={false}
      >
        <LayoutGrid />
        <span>Dashboard</span>
      </Button>
      <ButtonGroup>
        <Button
          render={<Link to={paths.app.properties.getHref()} />}
          variant={"outline"}
          nativeButton={false}
        >
          <MapPinned />
          <span>Properties</span>
        </Button>
        <PropertyModal
          render={
            <Button variant="outline" size="icon" aria-label="Add property">
              <PlusIcon />
            </Button>
          }
        />
      </ButtonGroup>
    </div>
  )
}
