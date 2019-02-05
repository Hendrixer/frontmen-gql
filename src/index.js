import { ApolloServer, makeExecutableSchema } from 'apollo-server'
import gql from 'graphql-tag'
import { createGithubSchema, createGithubResolvers } from './github'
import { mergeSchemas } from 'graphql-tools'

const typeDefs = gql`
  type User {
    username: String
  }

  type Query {
    me: User
  }
`

const localSchema = makeExecutableSchema({
  typeDefs,
  resolvers: {
    Query: {
      me() {
        console.log('yest')
        return {}
      }
    }
  }
})

const createServer = async () => {
  const extendedUser = gql`
    extend type User {
      profile: Github_User
    }
  `
  const { transformed, og } = await createGithubSchema()

  const finalSchema = mergeSchemas({
    schemas: [localSchema, transformed, extendedUser],
    resolvers: createGithubResolvers(og)
  })

  const server = new ApolloServer({
    schema: finalSchema
  })

  server
    .listen()
    .then(({ url }) => console.log(`server on ${url}`))
    .catch(console.error.bind(console))
}

createServer()
