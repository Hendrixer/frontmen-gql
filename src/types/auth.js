import gql from 'graphql-tag'

const types = gql`
  extend type Query {
    isAuth: Boolean!
  }

  type Session {
    user: User!
    token: String!
  }

  input AuthInpunt {
    username: String!
    password: String!
  }

  extend type Mutation {
    signup(input: AuthInpunt!): Session!
    signin(input: AuthInpunt!): Session!
  }
`
const resolvers = {
  Query: {
    isAuth() {}
  },
  Mutation: {
    signup() {},
    signin() {}
  },
  Session: {
    user() {}
  }
}

export const auth = { types, resolvers }
