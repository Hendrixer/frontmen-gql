import { createSchema } from './types'
import { ApolloServer } from 'apollo-server'

export const createServer = async () => {
  const schema = await createSchema()
  const server = new ApolloServer({
    schema,
    tracing: true,
    formatError(error) {
      console.error(error)
      return error
    },
    context() {
      return {
        githubkey: '12442257c2ee1c5e98146af0f246dff719eacd5e'
      }
    },
    introspection: true
  })

  return server
}
