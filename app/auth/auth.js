// this file is for when implement the spotify login
// thrugh a Graphql Mutation

import fetch from 'node-fetch'

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET

const redirect_uri = 'http://localhost:3000/music/'
export const exchangeSpotifyCode = async (code) => {
  const authOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(`${client_id}:${client_secret}`).toString('base64'),
    },
    body: new URLSearchParams({
      code: code,
      redirect_uri: redirect_uri,
      grant_type: 'authorization_code',
    }),
  }

  const tokenResponse = await fetch(
    'https://accounts.spotify.com/api/token',
    authOptions
  )

  if (!tokenResponse.ok) {
    const errorData = await tokenResponse.json()
    throw new Error(
      errorData.error_description || 'Error fetching access token'
    )
  }

  return tokenResponse.json()
}
