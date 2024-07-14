'use client'
import { HttpLink } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
  SSRMultipartLink,
  NextSSRInMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import { setContext } from '@apollo/client/link/context'

const makeClient = (authToken) => {
  const authLink = setContext((request, { headers }) => {
    // Ensure this runs only on the client-side
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    }
  })
  const httpLink = new HttpLink({ uri: 'http://localhost:3000/api/graphql' })
  return new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
    credentials: 'include',
  })
}

export function ApolloWrapper({ children, authToken }) {
  return (
    <ApolloNextAppProvider makeClient={() => makeClient(authToken)}>
      {children}
    </ApolloNextAppProvider>
  )
}
