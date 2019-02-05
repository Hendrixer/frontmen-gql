import { createServer } from './server'

createServer()
  .then(server => {
    return server.listen()
  })
  .then(({ url }) => console.log(`server ready on ${url}`))
  .catch(e => console.error(e))
