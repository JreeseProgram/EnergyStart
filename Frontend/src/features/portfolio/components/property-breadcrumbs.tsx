import { Link, useMatch } from "react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { paths } from "@/config/paths"

const sectionLabels: Record<string, string> = {
  [paths.app.property.overview.path]: "Overview",
  [paths.app.property.buildingUses.path]: "Building uses",
  [paths.app.property.energyMeters.path]: "Energy meters",
  [paths.app.property.reports.path]: "Reports",
  [paths.app.property.sharing.path]: "Sharing",
  [paths.app.property.settings.path]: "Settings",
}

export function PropertyBreadcrumbs() {
  const match = useMatch(
    `${paths.app.root.path}/${paths.app.property.root.path}/*`
  )
  const section =
    sectionLabels[(match?.params["*"] ?? "").replace(/\/$/, "")] ?? "Property"

  return (
    <Breadcrumb className="min-w-0" aria-label="Property navigation">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink render={<Link to={paths.app.properties.getHref()} />}>
            Properties
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="shrink-0" />
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage className="truncate">{section}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
