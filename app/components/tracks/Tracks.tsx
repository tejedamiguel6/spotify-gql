import { useState, useCallback } from 'react'
import { gql, useSuspenseQuery, useQuery } from '@apollo/client'
import Link from 'next/link'
import TopItem from '../topItem/TopItem'
import RecentlyAddedTracks from './RecentelyAddedTracks'
import FilterButton from '../FilterButton'
import Loading from '../loading/Loading'
import { ItemType, TrackProps, track } from './Track.types'

const GET_USER_TRACKS = gql`
  query userSavedTracks($limit: Int, $offset: Int) {
    userSavedTracks(limit: $limit, offset: $offset) {
      total
      items {
        added_at
        track {
          id
          preview_url
          artists {
            id
            name
            genres
          }
          name
          duration_ms
          album {
            id
            total_tracks
            release_date
            release_date_precision
            name
            images {
              url
              width
              height
            }
          }
          is_local
          preview_url
        }
      }
    }
  }
`

export default function Tracks({
  setSelectedAlbum,
  setTopTrackNote,
}: TrackProps) {
  // switch to useSuspense later
  const [selectedItem, setSelectedItem] = useState('likedTracks')

  const { data, error, loading } = useQuery(GET_USER_TRACKS, {
    variables: {
      limit: 26,
      offset: 0,
    },
  })

  const handleAlbumClick = useCallback(
    (track: track) => {
      setSelectedAlbum(track)
    },
    [setSelectedAlbum]
  )

  const handleTopItem = useCallback((type: ItemType) => {
    setSelectedItem(type)
    setSelectedAlbum(null)
  }, [])

  if (error) {
    console.log('error ', error)
    return <div>Error: {error.message}</div>
  }
  if (loading) {
    return (
      <div>
        <Loading />
      </div>
    )
  }

  return (
    <div>
      <div className='pt-3 '>
        <FilterButton handleTopItem={handleTopItem} />
        <TopItem
          selectedItem={selectedItem}
          setTopTrackNote={setTopTrackNote}
        />
      </div>

      <ul className='grid grid-cols-2 gap-3 text-center lg:grid-cols-4 md:grid-cols-3'>
        {data.userSavedTracks.items.map((track: track) => {
          return (
            <li key={track.track.id}>
              {selectedItem === 'likedTracks' && (
                <RecentlyAddedTracks
                  trackData={track}
                  trackImageData={track.track}
                  handleAlbumClick={handleAlbumClick}
                />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
