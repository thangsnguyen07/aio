// Root
const userRoot = 'users'

// Api Versions
const v1 = 'v1'

export const routesV1 = {
  version: v1,
  user: {
    root: userRoot,
    findById: `${userRoot}/:id`,
    create: userRoot,
  },
}
