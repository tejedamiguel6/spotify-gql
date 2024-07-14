'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { gql, useSuspenseQuery, useQuery, useLazyQuery } from '@apollo/client'

const GET_TOP_ITEMS = gql`
  query TopItems($topArtistTopTrack: String) {
    topItems(TopArtistTopTrack: $topArtistTopTrack) {
      items {
        ... on Track {
          name
          id
          album {
            name
            id
            images {
              height
              width
              url
            }
          }
          disc_number
          artists {
            id
            name
          }
        }
        ... on Artist {
          name
          id
          popularity
          genres
          images {
            height
            width
            url
          }
        }
      }
    }
  }
`

export default function TopItem({ track, selectedItem }) {
  const [getTopItem, { loading, error, data }] = useLazyQuery(GET_TOP_ITEMS)

  useEffect(() => {
    if (selectedItem) {
      getTopItem({
        variables: { topArtistTopTrack: selectedItem },
      })
    }
  }, [selectedItem, getTopItem])

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div>
      <ul className='grid grid-cols-2 gap-3 text-center lg:grid-cols-3 sm:grid-cols-3'>
        {data?.topItems?.items.map((item) => {
          const imageUrl =
            item.__typename === 'Track'
              ? item?.album?.images?.[0]?.url
              : item?.images?.[0]?.url

          const imageDimension =
            item.__typename === 'Track'
              ? {
                  width: item?.album?.images?.[0]?.width,
                  height: item?.album?.images?.[0]?.height,
                }
              : {
                  width: item?.images?.[0]?.width,
                  height: item?.images?.[0]?.height,
                }

          return (
            <li key={item.id} className='p-2'>
              {imageUrl ? (
                <Image
                  className='object-contain border-2'
                  src={imageUrl}
                  alt={item.name}
                  width={imageDimension.width}
                  height={imageDimension.height}
                />
              ) : (
                <div className='flex items-center justify-center w-24 h-24 bg-gray-200 rounded-lg'>
                  No Image
                </div>
              )}
              <p>{item.name}</p>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
