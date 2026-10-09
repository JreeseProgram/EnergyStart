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
    <div className="flex gap-1">
      <Button
        render={<Link to={paths.app.dashboard.getHref()} />}
        variant={"ghost"}
      >
        <LayoutGrid />
        <span>{"Dashbaord"}</span>
      </Button>
      <ButtonGroup>
        <Button
          render={<Link to={paths.app.properties.getHref()} />}
          variant={"outline"}
        >
          <MapPinned />
          <span>Properties</span>
        </Button>
        <PropertyModal
          render={
            <Button variant="outline" size="icon">
              <PlusIcon />
            </Button>
          }
        />
      </ButtonGroup>
    </div>
  )
}
