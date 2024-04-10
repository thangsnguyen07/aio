// Root
const todosRoot = 'todos'

// Api Versions
const v1 = 'v1'

export const routesV1 = {
  version: v1,
  todo: {
    root: todosRoot,
    findById: `${todosRoot}/:id`,
    create: todosRoot,
  },
}
