import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { Property } from "@/features/portfolio/models/property.models"
import { PropertyModal } from "@/features/portfolio/modals/property.modal"
import { PROPERTY_TYPES } from "@/features/portfolio/utils/form-constants"
import { Pencil } from "lucide-react"

export function PropertySettings({ property }: { property: Property }) {
  const propertyType = PROPERTY_TYPES.find(
    (type) => type.value === property.propertyType
  )?.label
  const details = [
    ["Property name", property.name],
    ["Primary property type", propertyType],
    [
      "Address",
      `${property.streetAddress}, ${property.city}, ${property.state}, ${property.zip}`,
    ],
    ["Property notes", property.notes || "No notes added."],
  ]

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Property settings</h2>
          <p className="text-sm text-muted-foreground">
            Review property information and open the modal to make changes.
          </p>
        </div>
        <PropertyModal property={property} render={<Button />}>
          Edit property <Pencil className="size-4" />
        </PropertyModal>
      </div>
      <div className="grid grid-cols-[minmax(0,1.85fr)_minmax(0,1fr)] items-start gap-6">
        <Card className="min-h-80 rounded-2xl">
          <CardHeader>
            <CardTitle>General information</CardTitle>
            <CardDescription>
              These details are used throughout calculations and reports.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="grid grid-cols-2 gap-6">
              {details.map(([label, value]) => (
                <div key={label} className="min-w-0">
                  <dt className="text-sm text-muted-foreground">{label}</dt>
                  <dd className="mt-1 text-base font-medium break-words whitespace-pre-wrap">
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
      </div>
    </>
  )
}
