import { gql, useSuspenseQuery, useQuery, useLazyQuery } from '@apollo/client'
import Image from 'next/image'
export const revalidate = 120

const GET_CURRENTLY_PLAYING_TRACK = gql`
  query GetCurrentylPlayingTrack {
    currentlyPlayingTrack {
      is_playing
      currently_playing_type
      progress_ms
      repeat_state
      context {
        type
        href
        external_urls {
          spotify
        }
      }
      item {
        track_number
        name
        disc_number
        duration_ms
        popularity
        is_playable

        artists {
          name
          type
        }
        album {
          name
          images {
            url
            height
            width
          }
        }
      }
      device {
        id
        name
        type
        is_active
        volume_percent
      }
    }
  }
`

export default function CurrentTrack() {
  const { data, error, loading } = useQuery(GET_CURRENTLY_PLAYING_TRACK, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
    fetchOptions: {
      next: { revilidate: 120 },
    },
  })

  const getImage = data?.currentlyPlayingTrack?.item?.album.images[0].url
  const isPlaying = data?.currentlyPlayingTrack?.is_playing

  return (
    <div className='border-2'>
      <div className='flex p-2 '>
        <div className='pr-6 text-sm'>
          <h1>⚡️Currenly Spining:⚡️ </h1>
          <h1 className='mr-4'>
            Artist: {data?.currentlyPlayingTrack?.item?.artists[0].name}
          </h1>
          <p>Track Name: {data?.currentlyPlayingTrack?.item?.name}</p>
          <p>
            Listening on: {data?.currentlyPlayingTrack?.device[0]?.type}
            <span> || "{data?.currentlyPlayingTrack?.device[0]?.name}"</span>
          </p>
        </div>

        <div
          className={
            isPlaying &&
            'flex flex-col w-20 h-20 mx-auto animate-spin-slow rounded-[50%] outline-dotted outline-2 outline-gray-500'
          }
        >
          <Image
            className='rounded-full '
            src={getImage}
            width={80}
            height={80}
          />
        </div>
      </div>
    </div>
  )
}
