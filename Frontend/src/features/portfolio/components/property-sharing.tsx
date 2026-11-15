import { useState } from "react"
import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { usePortfolioUser } from "@/features/portfolio/api/get-user.api"
import { usePropertyUsers } from "@/features/portfolio/api/property-sharing.api"
import { PropertySharingTable } from "@/features/portfolio/components/property-sharing-table"
import {
  AddPropertyUserModal,
  RemovePropertyUserModal,
} from "@/features/portfolio/modals/property-sharing.modal"
import type { Property } from "@/features/portfolio/models/property.models"
import type { PropertyUser } from "@/features/portfolio/services/property.service"
import { PORTFOLIO_POLICIES } from "@/features/portfolio/utils/portfolio-policies"

export function PropertySharing({ property }: { property: Property }) {
  const currentUser = usePortfolioUser()
  const currentUserId: string | undefined = currentUser.data?.id
  const query = usePropertyUsers(property.id)
  const [removing, setRemoving] = useState<PropertyUser | null>(null)
  const canManage = PORTFOLIO_POLICIES["property:manage-sharing"](
    currentUser.data,
    property
  )
  return (
    <>
      <ContentHeader
        title="Property sharing"
        description="Manage registered users who can access this property"
        action={
          canManage ? <AddPropertyUserModal property={property} /> : undefined
        }
      />
      {query.isPending ? (
        <Skeleton className="h-48 w-full" />
      ) : query.isError ? (
        <div role="alert" className="space-y-3">
          <p>Unable to load property sharing. Please try again.</p>
          <Button variant="outline" onClick={() => void query.refetch()}>
            Retry
          </Button>
        </div>
      ) : (
        <PropertySharingTable
          users={query.data}
          propertyName={property.name ?? "this property"}
          currentUserId={currentUserId}
          canManage={canManage}
          onRemove={setRemoving}
        />
      )}
      {canManage && removing && (
        <RemovePropertyUserModal
          property={property}
          user={removing}
          isSelf={removing.userId === currentUserId}
          onClose={() => setRemoving(null)}
        />
      )}
    </>
  )
}
