type fetchGraphQLParams = {
  query: string | (() => string)
  variables?: object
  preview?: boolean
}

export async function fetchGraphQL({
  query,
  variables = {},
  preview = false,
}: fetchGraphQLParams): Promise<any> {
  const spaceId = process.env.CONTENTFUL_SPACE_ID
  const accessToken = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN

  const response = await fetch(
    `https://graphql.contentful.com/content/v1/spaces/${spaceId}/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ query, variables }),
    }
  )
  const responseBody = await response.json()

  if (responseBody.errors) {
    console.error('Errors:', responseBody.errors)
  }

  return responseBody
}

function extractComments(fetchResponse) {
  // console.log(fetchResponse, ',,,,,,,<---||--fetchResponse')
  return fetchResponse?.data?.commentCollection?.items
}

// export async function getAllComments(limit = 3, isDraftMode = false) {
//   const comments = await fetchGraphQL(
//     `query testingQ {
//       commentCollection(limit: ${limit}) {
//         total
//         items {
//           userId
//           trackId
//           body {
//             json
//           }
//         }
//       }
//     }`,
//     {},
//     isDraftMode
//   )
//   return extractComments(comments)
// }

export async function getComment(userId, isDraftMode = false) {
  const comments = await fetchGraphQL(
    `query getComments($userId: String!) {
      commentCollection(where: { userId: $userId }, preview: ${
        isDraftMode ? 'true' : 'false'
      }) {
        items {
          userId
          trackId
          body {
            json
          }
        }
      }
    }`,
    { userId },
    isDraftMode
  )
  return extractComments(comments)
}
