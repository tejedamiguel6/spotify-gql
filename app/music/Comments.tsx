import { gql, useQuery } from '@apollo/client'

const GET_COMMENTS = gql`
  query getComments {
    commentCollection {
      items {
        sys {
          id
        }
        userId
        trackId
        body {
          json
        }
      }
    }
  }
`

export default function Comments() {
  const { data, loading, error } = useQuery(GET_COMMENTS, {
    context: {
      clientName: 'contentful',
    },
  })

  // console.log(data, '<----COMMENTS DATA')

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <h1>Comments</h1>
      {/* {data?.commentCollection?.items.map((comment) => (
        <div key={comment.trackId}>
          <h2>{comment.trackId}</h2>
          <p>{comment.body.json}</p>
        </div>
      ))} */}
    </div>
  )
}
