import type {
  DeleteEnergyMeterInput,
  DeleteEnergyReadingInput,
} from "@/features/portfolio/services/energy-meter.service"
import type { DeleteBuildingUseInput } from "@/features/portfolio/services/building-use.service"
import type { DeletePropertyInput } from "@/features/portfolio/services/property.service"

export type PortfolioDeletion =
  | ({ kind: "meter" } & DeleteEnergyMeterInput)
  | ({ kind: "reading" } & DeleteEnergyReadingInput)
  | ({ kind: "building use" } & DeleteBuildingUseInput)
  | ({ kind: "property" } & DeletePropertyInput)
