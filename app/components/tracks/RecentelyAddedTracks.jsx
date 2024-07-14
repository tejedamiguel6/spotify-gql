import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'

export default function RecentlyAddedTracks({
  trackData,
  trackImageData,
  handleAlbumClick,
}) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [audio, setAudio] = useState(new Audio(trackData.track.preview_url))

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
