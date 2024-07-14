'use client'
import Image from 'next/image'
import { gql, useSuspenseQuery, useQuery } from '@apollo/client'

const GET_USER_PROFILE = gql`
  query GetUserProfile {
    profile {
      id
      display_name
      href
      followers {
        href
        total
      }
      images {
        height
        url
        width
      }
    }
  }
`

// const GET_USER_TRACKS = gql``
const UserProfile = () => {
  const { data, error, loading } = useQuery(GET_USER_PROFILE, {
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  })

  if (error) {
    console.log('error ', error)
    return <div>Error: {error.message}</div>
  }

  const display_name = data?.profile?.display_name
  const followers = data?.profile?.followers?.total

  return (
    <div className='flex justify-center p-3 mb-2 text-center'>
      <div className='profile-items'>
        <Image
          className='rounded-full'
          src={data?.profile?.images[1]?.url}
          alt='profile image'
          width={250}
          height={250}
        />
        <div className='pt-4'>
          {display_name && <h1>Name: {display_name}</h1>}
          {followers && <h1>Followers: {followers}</h1>}
        </div>
      </div>
    </div>
  )
}

export default UserProfile
