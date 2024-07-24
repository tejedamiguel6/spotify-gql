'use client'
import { useState, useEffect } from 'react'
import { getAccesstokenFromURL } from '../auth/spotify-auth'
import Tracks from '../components/tracks/Tracks'
import UserProfile from '../components/UserProfile'
import CurrentlyPlayingTrack from '../components/currentTrack/CurrentTrack'
import { ApolloWrapper } from '../ApolloWrapper'
import Album from '../components/albums/Albums'
import Genres from '../components/genres/Genres'
import { useRouter } from 'next/navigation'
import Comments from './Comments'

import TrackidContentful from '../components/topItem/TrackidContentful'

export default function Music() {
  const router = useRouter()
  const [authToken, setAuthToken] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [genres, setGenres] = useState([])
  const [topTrackNote, setTopTrackNote] = useState(null)

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenData = await getAccesstokenFromURL()
        if (tokenData && tokenData.access_token) {
          setAuthToken(tokenData.access_token)
          router.replace('/music', undefined, { shallow: true })
        } else {
          throw new Error('Failed to get access token')
        }
      } catch (error) {
        console.error('Error fetching access token:', error)
      }
    }

    fetchToken()
  }, [])

  if (!authToken) {
    return (
      <div>
        <div className='flex justify-center'>Loading...</div>
      </div>
    )
  }
  // console.log('topTrackNote--===>', topTrackNote)
  return (
    <ApolloWrapper authToken={authToken}>
      <div className='flex '>
        <div className='ml-auto'>
          {/* <Genres /> */}
          <CurrentlyPlayingTrack />
        </div>
      </div>
      <div className='container'>
        <div className='item2'>
          <UserProfile />
        </div>

        <div className='item1'>
          <Tracks
            setSelectedAlbum={setSelectedAlbum}
            setGenres={setGenres}
            setTopTrackNote={setTopTrackNote}
          />

          <Comments />
        </div>

        <div className='item3'>
          {selectedAlbum ? (
            <>
              <Album selectedAlbum={selectedAlbum} />
            </>
          ) : (
            <>
              {/* todo: fix this way of conditionally rendering this coponent. */}
              {topTrackNote?.track?.__typename === 'Track' ? (
                <>
                  <TrackidContentful topTrackNote={topTrackNote} />
                </>
              ) : null}
            </>
          )}
        </div>
      </div>
    </ApolloWrapper>
  )
}
