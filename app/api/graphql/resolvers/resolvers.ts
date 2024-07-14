import { exchangeSpotifyCode } from '../../../auth/auth'
// import { getAccesstokenFromURL } from '../../../auth/spotify-auth'

export const resolvers = {
  Query: {
    profile: async (parent, _args, { dataSources }) => {
      const data = await dataSources.spotifyAPI.getUserProfile()

      return data
    },
    user: async (parent, _args, { dataSources }) => {
      const data = await dataSources.spotifyAPI.getUserProfile()

      return data
    },
    artist: async (_, { id }, { dataSources }, info) => {
      const artist = await dataSources.spotifyAPI.getArtist(id)

      return artist
    },
    userSavedTracks: async (_, { limit, offset }, { dataSources }, info) => {
      const data = await dataSources.spotifyAPI.getUserSavedTracks(
        limit,
        offset
      )
      info.cacheControl.setCacheHint({ maxAge: 60 })

      // Extract unique artist IDs
      const artistIDs = [
        ...new Set(
          data.items.flatMap((item) =>
            item.track.artists.map((artist) => artist.id)
          )
        ),
      ]

      // Fetch all artist data in parallel
      const artistsData = await Promise.all(
        artistIDs.map((id) => dataSources.spotifyAPI.getArtist(id))
      )

      // Create a mapping of artist ID to artist data (including genres)
      const artistGenresMap = artistsData.reduce((acc, artist) => {
        acc[artist.id] = artist.genres
        return acc
      }, {})

      // Return the modified data structure, including genres for each artist
      return {
        ...data, // Retain all original data properties
        items: data.items.map((item) => ({
          ...item, // Retain all original item properties
          track: {
            ...item.track, // Retain all original track properties
            artists: item.track.artists.map((artist) => ({
              ...artist, // Retain all original artist properties
              genres: artistGenresMap[artist.id], // Add the genres fetched for this artist
            })),
          },
        })),
      }
    },
    topItems: async (_, { TopArtistTopTrack }, { dataSources }, info) => {
      if (TopArtistTopTrack === 'tracks') {
        const data = await dataSources.spotifyAPI.getUserTopTrack()

        return data
      } else if (TopArtistTopTrack === 'artists') {
        const data = await dataSources.spotifyAPI.getUserTopArtists()

        return data
      }
    },
    currentlyPlayingTrack: async (_, __, { dataSources }, info) => {
      const data = await dataSources.spotifyAPI.getCurrentlyPlayingTrack()

      return data
    },
  },

  CurrentlyPlayingTrack: {
    device: async (parent, _, { dataSources }) => {
      const data = await dataSources.spotifyAPI.getCurrentDevice()
      return data.devices
    },
  },

  Genres: {
    tracks: async (parent, _, { dataSources }) => {
      console.log(parent, '<---PARENT')
      const data = await dataSources.spotifyAPI.getUserTopArtists(parent.id)
      return data.genres
    },
  },

  // resolving for
  TopArtistTopTrack: {
    __resolveType(obj) {
      if (obj.album) {
        return 'Track'
      }
      if (obj.genres) {
        return 'Artist'
      }
      return null
    },
  },

  Mutation: {
    authenticateSpotify: async (_, { code }, { res }) => {
      console.log(code, '<--MUTATION-CODE')
      const tokenData = await exchangeSpotifyCode(code)

      console.log(tokenData, '<--TOKEN DATA')

      return tokenData
    },
  },
}
