import gql from 'graphql-tag'

const wait = time => new Promise(resolve => setTimeout(() => resolve(), time))

const types = gql`
  type User {
    id: ID!
    username: String!
    ## githubOrgs: [Organization]!
  }

  extend type Query {
    me: User!
  }

  input UserUpdateInput {
    username: String
  }

  extend type Mutation {
    updateMe(input: UserUpdateInput): User!
  }
`

const resolvers = {
  Query: {
    async me() {
      await wait(200)
      return {}
    }
  },
  Mutation: {
    updateMe() {}
  },
  User: {
    async id() {
      await wait(300)
      return '1234'
    }
  }
}

export const user = { types, resolvers }
