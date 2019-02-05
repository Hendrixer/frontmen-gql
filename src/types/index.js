import gql from 'graphql-tag'
import { makeExecutableSchema, mergeSchemas } from 'graphql-tools'
import { user } from './user'
import { auth } from './auth'
import { github } from './github'
import merge from 'lodash.merge'

const rootTypes = gql`
  type Query
  type Mutation
  schema {
    query: Query
    mutation: Mutation
  }
`

export const createSchema = async () => {
  const { schema: githubSchema, resolvers } = await github.createSchema()
  const extraUserTypes = gql`
    extend type User {
      githubProfile: GithubUser
    }
  `

  const dbSchema = makeExecutableSchema({
    typeDefs: [rootTypes, user.types, auth.types],
    resolvers: merge({}, user.resolvers, auth.resolvers)
  })

  return mergeSchemas({
    schemas: [dbSchema, githubSchema, extraUserTypes],
    resolvers
  })
}
