import {
  introspectSchema,
  makeRemoteExecutableSchema,
  transformSchema,
  RenameTypes,
  FilterRootFields,
  RenameRootFields
} from 'graphql-tools'
import { setContext } from 'apollo-link-context'
import { HttpLink } from 'apollo-link-http'
import fetch from 'node-fetch'

const createResolvers = (githubSchema, transformedSchema) => {
  return {
    User: {
      githubProfile(user, args, context, info) {
        return info.mergeInfo.delegateToSchema({
          schema: transformedSchema,
          operation: 'query',
          fieldName: 'Github_user',
          args: {
            login: 'hendrixer'
          },
          context,
          info
        })
      }
    }
  }
}

const createSchema = async () => {
  const http = new HttpLink({ uri: 'https://api.github.com/graphql', fetch })

  const link = setContext((request, previousContext) => ({
    headers: {
      Authorization: 'Bearer 12442257c2ee1c5e98146af0f246dff719eacd5e'
    }
  })).concat(http)

  const schema = await introspectSchema(link)
  const githubSchema = makeRemoteExecutableSchema({
    schema,
    link
  })

  const transformedSchema = transformSchema(githubSchema, [
    new FilterRootFields((operation, rootField) => {
      return rootField === 'user'
    }),
    new RenameTypes(name => {
      if (name === 'User') return 'GithubUser'
      return name
    }),
    new RenameRootFields((operation, name) => `Github_${name}`)
  ])

  const resolvers = createResolvers(githubSchema, transformedSchema)

  return { schema: transformedSchema, resolvers }
}

export const github = { createSchema }
