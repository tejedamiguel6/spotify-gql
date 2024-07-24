import { gql, useQuery } from '@apollo/client'
import { useState } from 'react'

const GET_USER_GENRES = gql`
  query GET_USER_GENRES($limit: Int, $offset: Int) {
    userSavedTracks(limit: $limit, offset: $offset) {
      total
      items {
        added_at
        track {
          artists {
            id
            genres
          }
        }
      }
    }
  }
`

export default function Genres() {
  const [displayCount, setDisplayCount] = useState(25)
  const { data, error, loading, fetchMore } = useQuery(GET_USER_GENRES, {
    variables: {
      offset: 0,
      limit: 25,
    },
  })

  if (loading) {
    return <div>Loading...</div>
  }

  const getGenres = data?.userSavedTracks.items.flatMap((item) =>
    item.track.artists.flatMap((artist) => artist.genres)
  )

  // filter out duplciates
  const uniqueGenres = [...new Set(getGenres)]

  // only show 10 genres
  const showGenres = uniqueGenres.slice(0, displayCount)

  const handleMore = () => {
    setDisplayCount(displayCount + 10)
  }

  return (
    <div className=''>
      <p>Your Top Genres</p>
      <div className='flex items-center border-2'>
        <div className='flex w-full overflow-x-auto space-x-2'>
          {showGenres?.map((genre, index) => (
            <div key={index} className='px-2 py-1 m-1 bg-gray-600 rounded-md '>
              <p className='text-white-600'>{genre}</p>
            </div>
          ))}
        </div>
        {/* <button
          className='ml-4 p-2 bg-blue-500 text-white rounded-md'
          onClick={handleMore}
        >
          Next
        </button> */}
      </div>
    </div>
  )
}
