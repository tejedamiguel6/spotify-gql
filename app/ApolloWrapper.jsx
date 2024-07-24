'use client'
import { HttpLink, ApolloLink, from } from '@apollo/client'
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from '@apollo/experimental-nextjs-app-support'
import { setContext } from '@apollo/client/link/context'

const makeClient = (authToken) => {
  // Auth Link for local GraphQL
  const authLink = setContext((request, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authToken ? `Bearer ${authToken}` : '',
      },
    }
  })

  const spaceId = process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID
  const accessToken = process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN
  const environment = 'master' // Adjust if you have different environments

  // Contentful Link
  const contentfulLink = new HttpLink({
    uri: `https://graphql.contentful.com/content/v1/spaces/${spaceId}/environments/${environment}?access_token=${accessToken}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  })
  // Local GraphQL Link
  const httpLink = new HttpLink({ uri: 'http://localhost:3000/api/graphql' })

  const link = from([
    authLink,
    ApolloLink.split(
      (operation) => operation.getContext().clientName === 'contentful',
      contentfulLink,
      httpLink
    ),
  ])

  return new ApolloClient({
    link,
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
