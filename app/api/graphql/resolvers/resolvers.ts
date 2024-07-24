import { exchangeSpotifyCode } from '../../../auth/auth'
// import { getAccesstokenFromURL } from '../../../auth/spotify-auth'

import { fetchGraphQL } from '@/app/lib/contentfulAPI'
import {
  getAllContentfulComments,
  getComment,
} from '@/app/lib/contentful-api/queries/getComments'

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

    // CONTENTFUL RESOLVER
    commentCollection: async (_, __, { dataSources }, info) => {
      // console.log('COMMENT COLLECTION RESOLVER', dataSources)
      const comments = await fetchGraphQL({
        query: getAllContentfulComments,
      })

      // console.log(comments.data.commentCollection.items, '<--COMMENTS')
      return comments.data.commentCollection.items
    },
    singleComment: async (_, { id }, { dataSources }, info) => {
      const singleComment = await fetchGraphQL({
        query: getComment(id),
      })
      return singleComment.data.comment
    },

    getCommentsWithTracks: async (_, { id }, { dataSources }, info) => {
      const fetchComments = await fetchGraphQL({
        query: getAllContentfulComments,
      })

      const comments = fetchComments.data.commentCollection.items

      // console.log(comments, '<--FETCHED COMMENTS')

      // if the trackID matches the getCommentsWithTracks(id) then return me the body of the comment
      // Filter comments that match the given trackId
      const matchedComments = comments.filter(
        (comment: any) => comment.trackId === id
      )

      // todo: match the system ID with the comment that
      // has the same trackId as the id passed in the query

      // Extract the body of the matched comments
      const matchedCommentsBodies = matchedComments.map(
        (comment: any) => comment.body.json.content[0].content[0].value
      )

      // matching the titles
      const matchedTitles = matchedComments.map((comment: any) => comment.title)

      // Return the trackId and the matched comments
      return {
        trackId: id,
        comments: {
          sys: {
            // todo: get system id from comment
            id: id,
          },
          title: matchedTitles,
          trackId: id,
          body: matchedCommentsBodies,
        },
      }
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
      // console.log(code, '<--MUTATION-CODE')
      const tokenData = await exchangeSpotifyCode(code)

      // console.log(tokenData, '<--TOKEN DATA')

      return tokenData
    },

    createComment: async (_, { userId, trackId, body }) => {
      const response = await fetchGraphQL({
        query: `query createComment($userId: String!, $trackId: String!, $body: String!) {
          createComment(data: {
            userId: $userId
            trackId: $trackId
            body: $body
          }) {
            userId
            trackId
            body {
              json
            }
          }
        }`,
        variables: {
          userId,
          trackId,
          body,
        },
      })

      return response.data.createComment
    },
  },
}
