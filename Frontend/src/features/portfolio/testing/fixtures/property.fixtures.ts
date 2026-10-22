import { PropertyType } from "@/features/portfolio/models/property.models"

export const defaultProperties = [
  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5301",
    createdAt: new Date().toISOString(),
    name: "Lake Eola Offices",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.OFFICE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 86,
  },

  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5302",
    createdAt: new Date().toISOString(),
    name: "Mills 50 Market",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.RETAIL_STORE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 50,
  },

  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5303",
    createdAt: new Date().toISOString(),
    name: "Sunrail Commons",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.MULTIFAMILY_HOUSING,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 91,
  },

  {
    id: "a0ed477e-df48-4e5a-9c79-2323c5df5304",
    createdAt: new Date().toISOString(),
    name: "Cypress Logistics",
    notes: "",
    city: "Orlando",
    propertyType: PropertyType.enum.WAREHOUSE,
    state: "FL",
    streetAddress: "123 Address",
    zip: "12345",
    energyStarScore: 24,
  },
]
