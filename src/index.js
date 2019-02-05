import { ApolloServer } from 'apollo-server'
import gql from 'graphql-tag'
import fetch from 'node-fetch'

const typeDefs = gql`
  type Post {
    link: String
    title: String!
    field: Int!
  }

  type Query {
    posts(limit: Int): [Post]!
  }
`

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query: {
      async posts(_, { limit }) {
        const posts = await fetch('https://www.reddit.com/.json').then(d =>
          d.json()
        )

        return posts.data.children.map(p => p.data)
      }
    }
  }
})

server
  .listen()
  .then(({ url }) => console.log(`server on ${url}`))
  .catch(console.error.bind(console))
