import Image from 'next/image'

export default function Albums({ selectedAlbum }) {
  return (
    <div>
      {selectedAlbum ? (
        <div>
          <Image
            className='h-[17rem] mx-auto  w-[17rem] border-2'
            src={selectedAlbum.album.images[0].url}
            alt={selectedAlbum.name}
            width={selectedAlbum.album.images[0].width}
            height={selectedAlbum.album.images[0].height}
          />
          <div className='mt-2 text-center'>
            <h1>Album Name: {selectedAlbum.album.name}</h1>
            <p>Release Date: {selectedAlbum.album.release_date}</p>
            <p>Tracks: {selectedAlbum.album.total_tracks}</p>
            <p>Added on: {selectedAlbum.album.added_at}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
