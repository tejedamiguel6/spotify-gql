'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import {
  gql,
  useSuspenseQuery,
  useQuery,
  useLazyQuery,
  useMutation,
} from '@apollo/client'

const GET_TOP_ITEMS = gql`
  query TopItems($topArtistTopTrack: String) {
    topItems(TopArtistTopTrack: $topArtistTopTrack) {
      items {
        ... on Track {
          name
          id
          album {
            name
            id
            images {
              height
              width
              url
            }
          }
          disc_number
          artists {
            id
            name
          }
        }
        ... on Artist {
          name
          id
          popularity
          genres
          images {
            height
            width
            url
          }
        }
      }
    }
  }
`

// this query is from a custom resolver
// where we are getting comments with tracks
// connected to contentful
const GQL_SERVER_COMMENT_WITH_TRACKS = gql`
  query GET_COMMENTS_WITH_TRACKS($getCommentsWithTracksId: ID!) {
    getCommentsWithTracks(id: $getCommentsWithTracksId) {
      trackId
      comments {
        title
        body
        trackId
      }
    }
  }
`

export default function TopItem({ selectedItem, setTopTrackNote }) {
  const [
    getTopItem,
    { loading: topItemsLoading, error: topItemsError, data: topItemsData },
  ] = useLazyQuery(GET_TOP_ITEMS)
  // this is the sys id from contentful
  const [filteredTrack, setFilteredTrack] = useState({})

  const [
    getComments,
    { data: contenfulData, loading: contentfulLoading, error: contentfulError },
  ] = useLazyQuery(GQL_SERVER_COMMENT_WITH_TRACKS)

  useEffect(() => {
    if (filteredTrack) {
      getComments({
        variables: {
          getCommentsWithTracksId: filteredTrack,
        },
      })
    }
  }, [filteredTrack, getComments])

  useEffect(() => {
    if (selectedItem) {
      getTopItem({
        variables: {
          topArtistTopTrack: selectedItem,
        },
      })
    }
  }, [selectedItem, getTopItem])

  if (topItemsLoading) return <p>Loading...</p>
  if (topItemsError) return <p>Error: {error.message}</p>

  // handles track click
  const handleTrackClick = async (track) => {
    const trackId = track?.id || null
    // setFilteredTrack(track?.id || null)

    if (trackId) {
      const { data: contentfulDataResult } = await getComments({
        variables: {
          getCommentsWithTracksId: trackId,
        },
      })

      const contentfulDataAndTracData = {
        track,
        contentfulData: contentfulDataResult,
      }

      setTopTrackNote(contentfulDataAndTracData)
    }
  }

  return (
    <div>
      <ul className='grid grid-cols-2 text-center lg:grid-cols-4 sm:grid-cols-3 '>
        {topItemsData?.topItems?.items.map((item) => {
          {
            /* console.log(item, 'get ID') */
          }
          const imageUrl =
            item.__typename === 'Track'
              ? item?.album?.images?.[0]?.url
              : item?.images?.[0]?.url

          const imageDimension =
            item.__typename === 'Track'
              ? {
                  width: item?.album?.images?.[0]?.width,
                  height: item?.album?.images?.[0]?.height,
                }
              : {
                  width: item?.images?.[0]?.width,
                  height: item?.images?.[0]?.height,
                }

          return (
            <li key={item.id} className='p-2'>
              {imageUrl ? (
                <button onClick={() => handleTrackClick(item)}>
                  <Image
                    className='object-contain border-2'
                    src={imageUrl}
                    alt={item.name}
                    width={imageDimension.width}
                    height={imageDimension.height}
                  />
                </button>
              ) : (
                <div className='flex items-center justify-center w-24 h-24 bg-gray-200 rounded-lg'>
                  No Image
                </div>
              )}
              <p>{item.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
