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
    buildings: {
      path: "buildings",
      getHref: () => "/app/buildings",
    },
    profile: {
      path: "profile",
      getHref: () => "/app/profile",
    },
  },
} as const
