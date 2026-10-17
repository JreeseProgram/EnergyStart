import type { PropsWithChildren, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Link } from "@/components/ui/link"
import { paths } from "@/config/paths"
import { Authorization } from "@/features/auth/components/authorization"
import { useUser } from "@/features/auth/hooks/use-user"
import { useProperty } from "@/features/portfolio/api/get-property.api"
import { usePropertyId } from "@/features/portfolio/hooks/use-property-id"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { PROPERTY_POLICIES } from "@/features/portfolio/utils/portfolio-policies"

function PropertyFallback({
  title,
  children,
}: PropsWithChildren<{ title: string }>) {
  return (
    <div role="alert" className="flex flex-col items-start gap-4 p-6">
      <h1 className="text-2xl font-bold">{title}</h1>
      {children}
      <Link to={paths.app.properties.getHref()}>Back to properties</Link>
    </div>
  )
}

function PropertyAccess({
  propertyId,
  children,
  fallback,
}: PropsWithChildren<{ propertyId: PropertyId; fallback: ReactNode }>) {
  const property = useProperty({ propertyId })
  const user = useUser()

  if (property.isPending || user.isPending) {
    return <div role="status">{fallback}</div>
  }

  if (property.isError) {
    return (
      <PropertyFallback title="Unable to load property">
        <Button variant="outline" onClick={() => void property.refetch()}>
          Retry
        </Button>
      </PropertyFallback>
    )
  }

  if (property.data === null) {
    return <PropertyFallback title="404 — Property not found" />
  }

  if (user.isError) {
    return (
      <PropertyFallback title="Unable to check property access">
        <Button variant="outline" onClick={() => void user.refetch()}>
          Retry
        </Button>
      </PropertyFallback>
    )
  }

  return (
    <Authorization
      policyCheck={PROPERTY_POLICIES["property:view"](user.data, property.data)}
      forbiddenFallback={
        <PropertyFallback title="401 — You don’t have access to this property" />
      }
    >
      {children}
    </Authorization>
  )
}

export function ProtectedPropertyRoute({
  children,
  fallback,
}: PropsWithChildren<{ fallback: ReactNode }>) {
  const propertyId = usePropertyId()

  if (!propertyId) {
    return <PropertyFallback title="404 — Property not found" />
  }

  return (
    <PropertyAccess propertyId={propertyId} fallback={fallback}>
      {children}
    </PropertyAccess>
  )
}
