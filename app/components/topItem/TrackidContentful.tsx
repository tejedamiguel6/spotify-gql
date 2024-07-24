import Image from 'next/image'

export default function TrackidContentful({ topTrackNote }) {
  return (
    <div className='text-center w-[12rem] h-[12rem] border-2 mx-auto'>
      <div>
        <Image
          src={topTrackNote.track?.album?.images[0].url}
          alt='track image'
          width={topTrackNote.track?.album?.images[0].width}
          height={topTrackNote.track?.album?.images[0].height}
        />
      </div>
      <h1>
        {topTrackNote.contentfulData?.getCommentsWithTracks?.comments?.title}
      </h1>
      <p>{topTrackNote.getCommentsWithTracks?.comments?.body}</p>
    </div>
  )
}
