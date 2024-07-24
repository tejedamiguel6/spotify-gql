import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { track } from './Track.types'

type trackData = {
  added_at: string
  track: {
    album: {
      id: string
      images: {
        url: string
        width: number
        height: number
      }[]
      name: string
      release_date: string
      release_date_precision: string
      total_tracks: number
      __typename: string
    }
    artists: [
      {
        __typename: string
        id: string
        name: string
        genres: string[]
      }
    ]
    duration_ms: number
    id: string
    is_local: boolean
    name: string
    preview_url: string
    __typename: string
  }
}

type trackImageData = {
  album: {
    id: string
    images: {
      url: string
      width: number
      height: number
    }[]
  }
  name: string
  release_date: string
  release_date_precision: string
  total_tracks: number
  __typename: string
}

type RecentlyAddedTracksProps = {
  trackData: trackData
  trackImageData: trackImageData
  handleAlbumClick: (track: track) => void
}

export default function RecentlyAddedTracks({
  trackData,
  trackImageData,
  handleAlbumClick,
}: RecentlyAddedTracksProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState(new Audio(trackData.track.preview_url))
  console.log('trackData--->', trackData)
  useEffect(() => {
    return () => {
      audio.pause()
      audio.currentTime = 0
    }
  }, [audio])

  const handlePreviewClick = (e) => {
    e.preventDefault()
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <div>
      <button onClick={() => handleAlbumClick(trackData.track)}>
        <Image
          className='border-2'
          src={trackImageData?.album.images[0].url}
          alt={trackData.track.name}
          width={trackImageData.album.images[0].width}
          height={trackImageData.album.images[0].height}
        />
      </button>

      <p className='text-sm font-bold text-left '>{trackData.track.name}</p>

      <button
        onClick={handlePreviewClick}
        className='relative left-0 top-[-100px] '
      >
        <div>
          <h2>{isPlaying ? 'Pause Preview' : 'Play Preview'}</h2>
        </div>
      </button>
    </div>
  )
}
