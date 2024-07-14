'use client'
import { useState, useEffect } from 'react'
import { getAccesstokenFromURL } from '../auth/spotify-auth'
import Tracks from '../components/tracks/Tracks'
import UserProfile from '../components/UserProfile'
import CurrentlyPlayingTrack from '../components/currentTrack/CurrentTrack'
import { ApolloWrapper } from '../ApolloWrapper'
import Album from '../components/albums/Albums'
import Genres from '../components/genres/Genres'

export default function Music() {
  const [authToken, setAuthToken] = useState('')
  const [selectedAlbum, setSelectedAlbum] = useState(null)
  const [genres, setGenres] = useState([])

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenData = await getAccesstokenFromURL()
        if (tokenData && tokenData.access_token) {
          setAuthToken(tokenData.access_token)
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
  return (
    <ApolloWrapper authToken={authToken}>
      <div className='mt-14 min-w-11'>
        <div className='flex gap-6 '>
          <Genres />
          <CurrentlyPlayingTrack />
        </div>
      </div>
      <div className='container'>
        <div className='item2'>
          <UserProfile />
        </div>

        <div className='item1'>
          <Tracks setSelectedAlbum={setSelectedAlbum} setGenres={setGenres} />
        </div>

        <div className='item3'>
          <Album selectedAlbum={selectedAlbum} />
        </div>
      </div>
    </ApolloWrapper>
  )
}
