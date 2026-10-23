import { use } from "react"
import { queryOptions, useQuery } from "@tanstack/react-query"
import { Services } from "@/context/services.context"
import type { BuildingUseService } from "@/features/portfolio/services/building-use.service"
import { GetBuildingUsesInput } from "@/features/portfolio/services/building-use.service"
import type { QueryConfig } from "@/lib/react-query"

export const getBuildingUsesQueryOptions = ({
  input,
  buildingUseService,
}: {
  input: GetBuildingUsesInput
  buildingUseService: BuildingUseService
}) => {
  const parsedInput = GetBuildingUsesInput.parse(input)
  return queryOptions({
    queryKey: ["BuildingUses", parsedInput],
    queryFn: () => buildingUseService.getBuildingUses(parsedInput),
  })
}

export function useBuildingUses({
  input,
  queryConfig,
}: {
  input: GetBuildingUsesInput
  queryConfig?: QueryConfig<typeof getBuildingUsesQueryOptions>
}) {
  const { buildingUseService } = use(Services)
  return useQuery({
    ...getBuildingUsesQueryOptions({ input, buildingUseService }),
    ...queryConfig,
  })
}
