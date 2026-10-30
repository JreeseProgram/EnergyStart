import { useState } from "react"
import { Plus } from "lucide-react"
import { ContentHeader } from "@/components/layouts/content-header"
import { Button } from "@/components/ui/button"
import type { BuildingUse } from "@/features/portfolio/models/building-use.models"
import type { PropertyId } from "@/features/portfolio/models/property.models"
import { BuildingUseModal } from "@/features/portfolio/modals/building-use.modal"
import { BuildingUsesTable } from "@/features/portfolio/components/building-uses-table"

export function BuildingUses({
  propertyId,
  buildingUses,
}: {
  propertyId: PropertyId
  buildingUses: BuildingUse[]
}) {
  const [buildingUse, setBuildingUse] = useState<BuildingUse | "new" | null>(
    null
  )
  const uses = buildingUses.filter((use) => use.propertyId === propertyId)
  const floorArea = uses.reduce((sum, use) => sum + use.grossFloorArea, 0)

  return (
    <>
      <ContentHeader
        title="Building uses"
        description={`${uses.length} ${uses.length === 1 ? "use defines" : "uses define"} the ${floorArea.toLocaleString("en-US")} ft² of floor area`}
        action={
          <Button onClick={() => setBuildingUse("new")}>
            Add building use <Plus />
          </Button>
        }
      />

      <BuildingUsesTable buildingUses={uses} onEdit={setBuildingUse} />

      {buildingUse && (
        <BuildingUseModal
          propertyId={propertyId}
          buildingUse={buildingUse === "new" ? undefined : buildingUse}
          onClose={() => setBuildingUse(null)}
        />
      )}
    </>
  )
}
