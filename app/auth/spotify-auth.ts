import dotenv from 'dotenv'
dotenv.config()

const client_id = process.env.NEXT_PUBLIC_CLIENT_ID
const client_secret = process.env.NEXT_PUBLIC_CLIENT_SECRET
const redirect_uri = process.env.NEXT_PUBLIC_REDIRECT_URI

function generateRandomString(length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// ------------------- 1. Get Authorization Code -------------------
export async function getAuthorizationCode() {
  var state = generateRandomString(16)
  var scope =
    'user-read-private user-read-email user-library-read user-top-read user-read-currently-playing user-read-playback-state'

  const params = new URLSearchParams({
    response_type: 'code',
    client_id: client_id,
    client_secret: client_secret,
    scope: scope,
    redirect_uri: redirect_uri,
    state: state,
  })

  const url = 'https://accounts.spotify.com/authorize?' + params.toString()

  //   const urlResponse = (window.location.href = url)

  return (window.location.href = url)
}

export async function getAccesstokenFromURL() {
  try {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    const state = params.get('state')

    if (!code) {
      throw new Error('Authorization code not found in URL')
    }
    if (!state) {
      throw new Error('State not found in URL')
    }

    const authOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization:
          'Basic ' +
          Buffer.from(client_id + ':' + client_secret).toString('base64'),
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

    const tokenData = await tokenResponse.json()

    // save to loca storage
    // localStorage.setItem('spotify_auth_token', tokenData.access_token)
    return tokenData
  } catch (error) {
    console.error('Error in getAccesstokenFromURL:', error)
    throw error
  }
}
