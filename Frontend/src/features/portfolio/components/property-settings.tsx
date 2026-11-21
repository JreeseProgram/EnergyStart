import { usePortfolioDeletion } from "@/features/portfolio/hooks/use-portfolio-deletion"
import { Button } from "@/components/ui/button"
import { usePortfolioUser } from "@/features/portfolio/api/user/get-user.api"
import { PORTFOLIO_POLICIES } from "@/features/portfolio/utils/portfolio-policies"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Property } from "@/features/portfolio/models/property.models"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"

export function PropertySettings({ property }: { property: Property }) {
  const { requestDelete, confirmation } = usePortfolioDeletion()
  const user = usePortfolioUser()
  const canDelete = PORTFOLIO_POLICIES["property:delete"](user.data, property)
  const propertyType =
    PROPERTY_TYPES.find((type) => type.value === property.propertyType)
      ?.label ?? "Not specified"

  const details = [
    ["Property name", property.name ?? "Not specified"],
    ["Primary property type", propertyType],
    [
      "Address",
      [property.streetAddress, property.city, property.state, property.zip]
        .filter(Boolean)
        .join(", ") || "Address unavailable",
    ],
    ["Property notes", property.notes || "No notes added."],
  ]

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)]">
      {confirmation}
      <Card className="min-h-80 rounded-2xl">
        <CardHeader>
          <CardTitle>General information</CardTitle>
          <CardDescription>
            These details are used throughout calculations and reports.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {details.map(([label, value]) => (
              <div key={label} className="min-w-0">
                <dt className="text-sm text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-base font-medium wrap-break-word whitespace-pre-wrap">
                  {value}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Property ID</CardTitle>
          <CardDescription>The identifier for this property.</CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-base font-medium break-all">
            {property.humanReadablePropertyId || property.id}
          </p>
        </CardContent>
      </Card>
      {canDelete && <Card className="rounded-2xl border-destructive/30">
        <CardHeader>
          <CardTitle>Delete property</CardTitle>
          <CardDescription>Permanently remove this property and its associated data for everyone with access.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={(event) => requestDelete(
            { kind: "property", propertyId: property.id }, property.name || "Unnamed property", event.currentTarget
          )}>Delete property</Button>
        </CardContent>
      </Card>}
    </div>
  )
}
