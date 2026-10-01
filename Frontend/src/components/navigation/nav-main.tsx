import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"

import { paths } from "@/config/paths"
import { LayoutGrid, MapPinned, PlusIcon } from "lucide-react"
import type { ReactNode } from "react"
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
      <AddPropertyButton action={() => {}}>
        <Button
          render={<Link to={paths.app.properties.getHref()} />}
          variant={"outline"}
        >
          <MapPinned />
          <span>{"Properties"}</span>
        </Button>
      </AddPropertyButton>
    </div>
  )
}

// TODO: Eventually this will move to Portfolio feature folder once api service is ready
function AddPropertyButton({
  action,
  children,
}: {
  children: ReactNode
  action: () => void
}) {
  return (
    <ButtonGroup>
      {children}
      <Button variant="outline" size="icon" onClick={action}>
        <PlusIcon />
      </Button>
    </ButtonGroup>
  )
}
