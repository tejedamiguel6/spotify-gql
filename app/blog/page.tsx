'use client'

// import { getAllComments } from '../lib/contentfulAPI'
import { fetchGraphQL } from '../lib/contentfulAPI'
import { ApolloCache, gql, useQuery } from '@apollo/client'
import { ApolloWrapper } from '../ApolloWrapper'

import ContentfulTest from './contentfulComponent'

// const TEST_QUERY = `
//   query testingQ {
//       commentCollection {
//         total
//         items {
//           userId
//           trackId
//           body {
//             json
//           }
//         }
//       }
//     }
// `

export default function BlogPage() {
  // const { data } = await fetchGraphQL({ query: TEST_QUERY })

  return (
    <div>
      <h1>BLOG</h1>
    </div>
  )
}
