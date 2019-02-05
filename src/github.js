/**
 * create http link
 * set context link
 * merge links
 * get introspective schema
 * make remote schema with link
 * transform Remove, Rename root and types
 * create resolvers with mergeInfo delegateToSchema
 */

import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import fetch from 'node-fetch'
import {
  introspectSchema,
  makeRemoteExecutableSchema,
  transformSchema,
  RenameTypes,
  FilterRootFields
} from 'graphql-tools'

export const createGithubSchema = async () => {
  const http = new HttpLink({ uri: 'https://api.github.com/graphql', fetch })
  const link = setContext(() => ({
    headers: {
      Authorization: 'bearer 38c74818553639de3d85b38df60dba7c4e4d6aa0'
    }
  })).concat(http)

  const schema = await introspectSchema(link)
  const githubSchema = makeRemoteExecutableSchema({
    schema,
    link
  })

  const transformedSchema = transformSchema(githubSchema, [
    new RenameTypes(name => {
      if (name === 'User') return 'Github_User'
      return name
    }),
    new FilterRootFields((op, fieldName) => {
      return fieldName === 'user'
    })
  ])

  return { transformed: transformedSchema, og: githubSchema }
}

export const createGithubResolvers = schema => {
  return {
    User: {
      profile(user, args, context, info) {
        return info.mergeInfo.delegateToSchema({
          schema,
          operation: 'query',
          fieldName: 'user',
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
