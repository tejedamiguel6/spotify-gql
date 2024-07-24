import Image from 'next/image'

export default function Albums({ selectedAlbum }) {
  return (
    <div>
      {selectedAlbum ? (
        <div className='pt-[4.5rem]'>
          <Image
            className='sm:h-[16rem] sm:w-[16rem] sm: md:h-[15rem] md:w-[17rem] md:ml-8 lg:h-[21rem] lg:w-[29rem] xl:ml-12 xlg:ml-8 xl:w-[23rem] xl:h-[23rem] mx-auto  border-2 2xl:w-[40rem] 2xl:h-[30rem] '
            src={selectedAlbum?.album?.images[0].url}
            alt={selectedAlbum?.name}
            width={selectedAlbum?.album?.images[0].width}
            height={selectedAlbum?.album?.images[0].height}
          />
          <div className='mt-2 text-center'>
            <h1>Album Name: {selectedAlbum?.album?.name}</h1>
            <p>Release Date: {selectedAlbum?.album?.release_date}</p>
            <p>Tracks: {selectedAlbum?.album?.total_tracks}</p>
            <p>Added on: {selectedAlbum?.album?.added_at}</p>
          </div>
        </div>
      ) : null}
    </div>
  )
}
