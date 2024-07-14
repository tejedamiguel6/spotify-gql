import React from 'react'

export default function FilterButton({ handleTopItem }) {
  return (
    <div className='flex mb-4 justify-evenly md:px-3'>
      <button
        className='p-2 mx-2 text-teal-200 bg-pink-900 rounded-md opacity-80'
        onClick={() => handleTopItem('tracks')}
      >
        <span>Top Tracks</span>
      </button>

      <button
        className='p-2 mx-2 text-teal-200 bg-pink-900 rounded-md opacity-80'
        onClick={() => handleTopItem('artists')}
      >
        <span>Top Artists</span>
      </button>

      <button
        className='p-2 mx-2 text-teal-200 bg-pink-900 rounded-md opacity-80'
        onClick={() => handleTopItem('likedTracks')}
      >
        <span>Just liked Tracks</span>
      </button>
    </div>
  )
}
