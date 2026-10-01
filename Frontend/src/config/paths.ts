export const paths = {
  home: {
    path: "/",
    getHref: () => "/",
  },

  app: {
    root: {
      path: "/app",
      getHref: () => "/app",
    },
    dashboard: {
      path: "",
      getHref: () => "/app",
    },
    properties: {
      path: "properties",
      getHref: () => "/app/properties",
    },
    property: {
      root: {
        path: "properties/:propertyId",
        getHref: (id: string) => `/app/properties/${id}`,
      },
      buildings: {
        path: "buildings",
        getHref: (id: string) => `/app/properties/${id}/buildings`,
      },
      energyMeters: {
        path: "energy-meters",
        getHref: (id: string) => `/app/properties/${id}/energy-meters`,
      },
      reports: {
        path: "reports",
        getHref: (id: string) => `/app/properties/${id}/reports`,
      },
      sharing: {
        path: "sharing",
        getHref: (id: string) => `/app/properties/${id}/sharing`,
      },
      settings: {
        path: "settings",
        getHref: (id: string) => `/app/properties/${id}/settings`,
      },
    },
    profile: {
      path: "profile",
      getHref: () => "/app/profile",
    },
  },
} as const
