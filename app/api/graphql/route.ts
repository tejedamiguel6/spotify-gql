import { startServerAndCreateNextHandler } from '@as-integrations/next'
import { ApolloServer } from '@apollo/server'
import { NextRequest } from 'next/server'
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl'
import { typeDefs } from '../graphql/schema'
import { resolvers } from './resolvers/resolvers'
import { SpotifyAPI } from './datasources/datasources'

const server = new ApolloServer({
  typeDefs,
  resolvers,
  plugins: [ApolloServerPluginCacheControl({ defaultMaxAge: 5 })],
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
})

const handler = startServerAndCreateNextHandler<NextRequest>(server, {
  context: async (req, res) => {
    const { cache } = server

    const authorization = req.headers.get('authorization')
    const token = authorization ? authorization.split(' ')[1] : null

    const options = {
      cache,
      token,
    }
    return {
      token: token,
      dataSources: {
        spotifyAPI: new SpotifyAPI(options),
      },
    }
  },
})

export { handler as GET, handler as POST }
