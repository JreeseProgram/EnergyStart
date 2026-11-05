import { useState } from "react"
import { ContentHeader } from "@/components/layouts/content-header"
import { PropertySharingTable } from "@/features/portfolio/components/property-sharing-table"
import type {
  Property,
  PropertyAssignment,
} from "@/features/portfolio/models/property.models"
import {
  AddPropertyUserModal,
  RemovePropertyUserModal,
} from "@/features/portfolio/modals/property-sharing.modal"

export function PropertySharing({
  property,
  canManage,
}: {
  property: Property
  canManage: boolean
}) {
  const [removing, setRemoving] = useState<PropertyAssignment | null>(null)

  return (
    <>
      <ContentHeader
        title="Property sharing"
        description="Manage registered users who can access this property"
        action={
          canManage ? <AddPropertyUserModal property={property} /> : undefined
        }
      />

      <PropertySharingTable
        property={property}
        canManage={canManage}
        onRemove={setRemoving}
      />

      {canManage && removing && (
        <RemovePropertyUserModal
          property={property}
          assignment={removing}
          onClose={() => setRemoving(null)}
        />
      )}
    </>
  )
}
