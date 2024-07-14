'use client'
import { useState } from 'react'
import Link from 'next/link'
import { getAuthorizationCode } from '../../auth/spotify-auth'

// login function for spotify
export default function Nav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const getCodefromAuth = async () => {
    await getAuthorizationCode()
  }
  return (
    <nav className='mt-10'>
      <ul className='flex justify-evenly'>
        <li>
          <a href='/'>Home</a>
        </li>
        <li>
          <a href='/blog'>Blog</a>
        </li>
        <li>
          <Link href='/music' onClick={getCodefromAuth}>
            Music
          </Link>
        </li>

        <li>
          <Link href='/gaming'>Gaming</Link>
        </li>
      </ul>
    </nav>
  )
}
