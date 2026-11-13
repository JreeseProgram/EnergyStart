import z from "zod"
import { isAxiosError } from "axios"
import { api } from "@/lib/api-client"
import { UserId } from "@/features/portfolio/models/user.models"
import {
  PropertyId,
  Property,
} from "@/features/portfolio/models/property.models"
import {
  CreatePropertyInput,
  AddPropertyUserInput,
  PropertyShareRefreshError,
  PropertyCreateRefreshError,
  GetPropertyInput,
  UpdatePropertyInput,
  PropertyUpdateRefreshError,
  type PropertyService,
} from "@/features/portfolio/services/property.service"
import { defaultReportPeriod } from "@/features/portfolio/utils/energy-report-labels"

const PropertyIds = z.array(z.object({ id: PropertyId }))
const PropertyReference = z.object({ id: PropertyId })
const PropertyUserResponse = z.object({
  userId: z.string().min(1).pipe(UserId),
  email: z.email(),
  firstName: z.string().nullable(),
  lastName: z.string().nullable(),
})

const JavaInteger = z.number().int().min(-2147483648).max(2147483647)
const BasicProperty = z.object({
  id: PropertyId,
  propertyName: z.string().nullable(),
  streetAddress: z.string().nullable(),
  city: z.string().nullable(),
  state: z.string().nullable(),
  zipcode: JavaInteger.nullable(),
  humanReadablePropertyId: JavaInteger.nullable(),
  notes: z.string().nullable(),
  energyScore: JavaInteger,
  authorizedUserIds: z.array(z.string()),
})

function parseBasicProperty(response: unknown, propertyId: PropertyId) {
  return BasicProperty.refine((property) => property.id === propertyId, {
    message: "Property response ID does not match the requested property",
    path: ["id"],
  }).parse(response)
}

export class PropertyApiService implements PropertyService {
  constructor() {
    // Service methods are passed directly to query and mutation callbacks.
    this.addPropertyUser = this.addPropertyUser.bind(this)
    this.createProperty = this.createProperty.bind(this)
    this.updateProperty = this.updateProperty.bind(this)
    this.getProperty = this.getProperty.bind(this)
    this.getProperties = this.getProperties.bind(this)
  }

  async addPropertyUser(input: AddPropertyUserInput): Promise<void> {
    const { propertyId, email } = AddPropertyUserInput.parse(input)

    const response = await api.post<unknown, unknown>(
      `/properties/${encodeURIComponent(propertyId)}/users`,
      { email }
    )

    try {
      PropertyUserResponse.parse(response)
    } catch (error) {
      throw new PropertyShareRefreshError(propertyId, error)
    }
  }

  async createProperty(input: CreatePropertyInput): Promise<Property> {
    const fields = CreatePropertyInput.parse(input)

    const payload = BasicProperty.omit({
      id: true,
      energyScore: true,
      authorizedUserIds: true,
    }).parse({
      propertyName: fields.name,
      streetAddress: fields.streetAddress,
      city: fields.city,
      state: fields.state,
      zipcode: Number(fields.zip),
      humanReadablePropertyId:
        fields.humanReadablePropertyId === undefined ||
        fields.humanReadablePropertyId === ""
          ? null
          : Number(fields.humanReadablePropertyId),
      notes:
        fields.notes === undefined
          ? null
          : fields.notes.trim() === ""
            ? ""
            : fields.notes,
    })

    const response = await api.post<unknown, unknown>("/properties", payload)

    let propertyId: PropertyId | undefined

    try {
      // Keep a usable ID even when the rest of the response is malformed.
      propertyId = PropertyReference.parse(response).id

      BasicProperty.parse(response)

      const property = await this.getProperty({ propertyId })

      if (!property || property.id !== propertyId) {
        throw new Error("Created property could not be loaded")
      }

      return property
    } catch (error) {
      throw new PropertyCreateRefreshError(propertyId, error)
    }
  }

  async updateProperty(input: UpdatePropertyInput): Promise<Property> {
    const { propertyId, ...fields } = UpdatePropertyInput.parse(input)
    const path = `/properties/${encodeURIComponent(propertyId)}`

    // PUT replaces all metadata; the rich DTO's human-readable ID is unreliable.
    const existing = parseBasicProperty(
      await api.get<unknown, unknown>(path),
      propertyId
    )

    const payload = BasicProperty.omit({
      id: true,
      energyScore: true,
      authorizedUserIds: true,
    }).parse({
      propertyName: fields.name,
      streetAddress: fields.streetAddress,
      city: fields.city,
      state: fields.state,
      zipcode: Number(fields.zip),
      notes:
        fields.notes === undefined
          ? existing.notes
          : fields.notes.trim() === ""
            ? ""
            : fields.notes,
      humanReadablePropertyId:
        fields.humanReadablePropertyId === undefined
          ? existing.humanReadablePropertyId
          : fields.humanReadablePropertyId === ""
            ? null
            : Number(fields.humanReadablePropertyId),
    })

    const response = await api.put<unknown, unknown>(path, payload)

    try {
      parseBasicProperty(response, propertyId)
      const property = await this.getProperty({ propertyId })

      if (!property || property.id !== propertyId) {
        throw new Error("Saved property could not be loaded")
      }

      return property
    } catch (error) {
      throw new PropertyUpdateRefreshError(propertyId, error)
    }
  }

  async getProperty(input: GetPropertyInput) {
    const { propertyId } = GetPropertyInput.parse(input)
    const id = encodeURIComponent(propertyId)
    const { startMonth, endMonth } = defaultReportPeriod()

    // The basic endpoint distinguishes 404 from 403; the rich endpoint does not.
    try {
      PropertyReference.parse(
        await api.get<unknown, unknown>(`/properties/${id}`)
      )
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) return null
      throw error
    }

    const response = await api.get<unknown, unknown>(`/propertyDTO/${id}`, {
      params: { startDate: startMonth, endDate: endMonth },
    })

    return Property.parse(response)
  }

  async getProperties() {
    const { startMonth, endMonth } = defaultReportPeriod()

    const properties = PropertyIds.parse(
      await api.get<unknown, unknown>("/properties")
    )

    return Promise.all(
      properties.map(async ({ id }) => {
        const response = await api.get<unknown, unknown>(
          `/propertyDTO/${encodeURIComponent(id)}`,
          { params: { startDate: startMonth, endDate: endMonth } }
        )

        return Property.parse(response)
      })
    )
  }
}
